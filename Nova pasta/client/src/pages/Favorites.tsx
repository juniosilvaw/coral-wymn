import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Heart, Trash2, Plus, Music } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

export default function Favorites() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedHymn, setSelectedHymn] = useState<number | null>(null);

  // Get user favorites
  const { data: favorites, refetch: refetchFavorites } = trpc.favorites.list.useQuery();

  // Get hymn details
  const { data: hymnDetails } = trpc.hymns.getById.useQuery(selectedHymn || 0, {
    enabled: selectedHymn !== null,
  });

  // Toggle favorite mutation
  const toggleFavorite = trpc.favorites.toggle.useMutation({
    onSuccess: () => {
      refetchFavorites();
      toast.success("Favorito removido");
    },
  });

  const handleRemoveFavorite = (hymnId: number) => {
    toggleFavorite.mutate(hymnId);
  };

  // Filter favorites based on search
  const filteredFavorites = favorites?.filter((fav) => {
    const hymn = fav.hymn;
    const query = searchQuery.toLowerCase();
    return (
      hymn.title.toLowerCase().includes(query) ||
      hymn.number.toString().includes(query) ||
      hymn.lyrics.toLowerCase().includes(query)
    );
  }) || [];

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
            Meus Favoritos
          </h1>
          <p className="text-foreground/70">
            {filteredFavorites.length} hino{filteredFavorites.length !== 1 ? "s" : ""} marcado{filteredFavorites.length !== 1 ? "s" : ""}
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="border-border/50 sticky top-20">
              <CardHeader>
                <CardTitle>Filtrar</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Buscar
                  </label>
                  <Input
                    placeholder="Título ou número..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Favoritos
                  </label>
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {filteredFavorites.length === 0 ? (
                      <div className="text-sm text-muted-foreground text-center py-8">
                        Nenhum favorito encontrado
                      </div>
                    ) : (
                      filteredFavorites.map((fav) => (
                        <Button
                          key={fav.hymn.id}
                          variant={selectedHymn === fav.hymn.id ? "default" : "outline"}
                          className="w-full justify-start text-left h-auto py-2"
                          onClick={() => setSelectedHymn(fav.hymn.id)}
                        >
                          <div className="flex flex-col">
                            <span className="font-semibold text-sm">
                              {fav.hymn.number}. {fav.hymn.title}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {getSourceLabel(fav.hymn.source)}
                            </span>
                          </div>
                        </Button>
                      ))
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
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
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveFavorite(hymnDetails.hymn.id)}
                        disabled={toggleFavorite.isPending}
                      >
                        <Trash2 className="w-5 h-5 text-destructive" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="pt-6">
                  {/* Tonality */}
                  {hymnDetails.hymn.tonality && (
                    <div className="mb-6 pb-6 border-b border-border/50">
                      <h3 className="text-sm font-semibold text-foreground/70 mb-2">
                        Tonalidade
                      </h3>
                      <Badge variant="secondary" className="text-base py-1 px-3">
                        {hymnDetails.hymn.tonality}
                      </Badge>
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
                </CardContent>
              </Card>
            ) : filteredFavorites.length === 0 ? (
              <Card className="border-border/50 h-96 flex items-center justify-center">
                <div className="text-center">
                  <Heart className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                  <p className="text-foreground/60">
                    Você ainda não tem favoritos
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Visite a biblioteca e marque seus hinos favoritos
                  </p>
                </div>
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
