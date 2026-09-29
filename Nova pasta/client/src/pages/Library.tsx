import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Search, Music, Heart } from "lucide-react";
import { trpc } from "@/lib/trpc";

export default function Library() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSource, setSelectedSource] = useState<"harpa_crista" | "cantor_cristao" | "salmos">("harpa_crista");
  const [selectedHymn, setSelectedHymn] = useState<number | null>(null);

  // Search hymns
  const { data: searchResults, isLoading: isSearching } = trpc.hymns.search.useQuery(
    { query: searchQuery, source: selectedSource },
    { enabled: searchQuery.length > 0 }
  );

  // Get hymn details
  const { data: hymnDetails } = trpc.hymns.getById.useQuery(selectedHymn || 0, {
    enabled: selectedHymn !== null,
  });

  // List hymns by source
  const { data: hymnsList } = trpc.hymns.list.useQuery({
    source: selectedSource,
    limit: 50,
  });

  const getSourceLabel = (source: string) => {
    const labels: Record<string, string> = {
      harpa_crista: "Harpa Cristã",
      cantor_cristao: "Cantor Cristão",
      salmos: "Salmos",
    };
    return labels[source] || source;
  };

  const getVocalRangeLabel = (range: string) => {
    const labels: Record<string, string> = {
      soprano: "Soprano",
      contralto: "Contralto",
      tenor: "Tenor",
      baixo: "Baixo",
    };
    return labels[range] || range;
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container">
        <div className="mb-8">
          <h1 className="text-4xl font-display font-bold text-foreground mb-2">
            Biblioteca de Hinos
          </h1>
          <p className="text-foreground/70">
            Explore nossa coleção completa de hinos evangélicos
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Search and List Sidebar */}
          <div className="lg:col-span-1">
            <Card className="border-border/50 sticky top-20">
              <CardHeader>
                <CardTitle>Buscar Hinos</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Search Input */}
                <div className="relative">
                  <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Número, título ou letra..."
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                {/* Source Tabs */}
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Coleção
                  </label>
                  <Tabs value={selectedSource} onValueChange={(val: any) => setSelectedSource(val)}>
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="harpa_crista" className="text-xs">
                        Harpa
                      </TabsTrigger>
                      <TabsTrigger value="cantor_cristao" className="text-xs">
                        Cantor
                      </TabsTrigger>
                      <TabsTrigger value="salmos" className="text-xs">
                        Salmos
                      </TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>

                {/* Results List */}
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Resultados
                  </label>
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {isSearching && (
                      <div className="text-sm text-muted-foreground">Buscando...</div>
                    )}
                    {searchQuery.length === 0 && hymnsList && (
                      hymnsList.map((hymn) => (
                        <Button
                          key={hymn.id}
                          variant={selectedHymn === hymn.id ? "default" : "outline"}
                          className="w-full justify-start text-left h-auto py-2"
                          onClick={() => setSelectedHymn(hymn.id)}
                        >
                          <div className="flex flex-col">
                            <span className="font-semibold text-sm">{hymn.number}. {hymn.title}</span>
                            <span className="text-xs text-muted-foreground">{getSourceLabel(hymn.source)}</span>
                          </div>
                        </Button>
                      ))
                    )}
                    {searchQuery.length > 0 && searchResults && (
                      searchResults.map((hymn) => (
                        <Button
                          key={hymn.id}
                          variant={selectedHymn === hymn.id ? "default" : "outline"}
                          className="w-full justify-start text-left h-auto py-2"
                          onClick={() => setSelectedHymn(hymn.id)}
                        >
                          <div className="flex flex-col">
                            <span className="font-semibold text-sm">{hymn.number}. {hymn.title}</span>
                            <span className="text-xs text-muted-foreground">{getSourceLabel(hymn.source)}</span>
                          </div>
                        </Button>
                      ))
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Hymn Details */}
          <div className="lg:col-span-2">
            {selectedHymn && hymnDetails ? (
              <Card className="border-border/50">
                <CardHeader className="border-b border-border/50">
                  <div className="flex items-start justify-between">
                    <div>
                      <Badge className="mb-2" variant="outline">
                        {getSourceLabel(hymnDetails.hymn.source)}
                      </Badge>
                      <CardTitle className="text-3xl font-display">
                        {hymnDetails.hymn.number}. {hymnDetails.hymn.title}
                      </CardTitle>
                      {hymnDetails.hymn.composer && (
                        <CardDescription className="mt-2">
                          Compositor: {hymnDetails.hymn.composer}
                        </CardDescription>
                      )}
                      {hymnDetails.hymn.author && (
                        <CardDescription>
                          Autor: {hymnDetails.hymn.author}
                        </CardDescription>
                      )}
                    </div>
                    <Button variant="ghost" size="icon">
                      <Heart className="w-6 h-6 text-muted-foreground hover:text-accent" />
                    </Button>
                  </div>
                </CardHeader>

                <CardContent className="pt-6">
                  {/* Tonality */}
                  {hymnDetails.hymn.tonality && (
                    <div className="mb-6 pb-6 border-b border-border/50">
                      <h3 className="text-sm font-semibold text-foreground/70 mb-2">Tonalidade</h3>
                      <Badge variant="secondary" className="text-base py-1 px-3">
                        {hymnDetails.hymn.tonality}
                      </Badge>
                    </div>
                  )}

                  {/* Vocal Parts Tabs */}
                  {hymnDetails.vocalParts.length > 0 && (
                    <div className="mb-6">
                      <h3 className="text-sm font-semibold text-foreground/70 mb-3">
                        Partes Vocais
                      </h3>
                      <Tabs defaultValue={hymnDetails.vocalParts[0]?.vocalRange || "soprano"}>
                        <TabsList className="grid w-full grid-cols-4">
                          {["soprano", "contralto", "tenor", "baixo"].map((range) => (
                            <TabsTrigger key={range} value={range}>
                              {getVocalRangeLabel(range)}
                            </TabsTrigger>
                          ))}
                        </TabsList>
                        {["soprano", "contralto", "tenor", "baixo"].map((range) => {
                          const part = hymnDetails.vocalParts.find(p => p.vocalRange === range);
                          return (
                            <TabsContent key={range} value={range} className="mt-4">
                              {part ? (
                                <div className="bg-card/50 p-4 rounded-lg border border-border/50">
                                  <p className="hymn-lyrics text-sm leading-relaxed">
                                    {part.lyrics}
                                  </p>
                                </div>
                              ) : (
                                <div className="text-center py-8 text-muted-foreground">
                                  Parte vocal não disponível
                                </div>
                              )}
                            </TabsContent>
                          );
                        })}
                      </Tabs>
                    </div>
                  )}

                  {/* Full Lyrics */}
                  <div>
                    <h3 className="text-sm font-semibold text-foreground/70 mb-3">
                      Letra Completa
                    </h3>
                    <div className="bg-card/50 p-6 rounded-lg border border-border/50">
                      <p className="hymn-lyrics text-base leading-relaxed">
                        {hymnDetails.hymn.lyrics}
                      </p>
                    </div>
                  </div>

                  {/* Audio Section */}
                  {hymnDetails.audios.length > 0 && (
                    <div className="mt-6 pt-6 border-t border-border/50">
                      <h3 className="text-sm font-semibold text-foreground/70 mb-3">
                        Áudio
                      </h3>
                      <div className="space-y-2">
                        {hymnDetails.audios.map((audio) => (
                          <div key={audio.id} className="flex items-center gap-3 p-3 bg-card/50 rounded-lg border border-border/50">
                            <Music className="w-5 h-5 text-accent flex-shrink-0" />
                            <div className="flex-1">
                              <p className="text-sm font-medium text-foreground">
                                {audio.vocalRange === "full" ? "Completo" : getVocalRangeLabel(audio.vocalRange)}
                              </p>
                              {audio.duration && (
                                <p className="text-xs text-muted-foreground">
                                  {Math.floor(audio.duration / 60)}:{(audio.duration % 60).toString().padStart(2, "0")}
                                </p>
                              )}
                            </div>
                            <Button size="sm" variant="ghost">
                              <Music className="w-4 h-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ) : (
              <Card className="border-border/50 h-96 flex items-center justify-center">
                <div className="text-center">
                  <Music className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                  <p className="text-foreground/60">
                    Selecione um hino para visualizar os detalhes
                  </p>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
