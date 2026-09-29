import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { HymnAudioPlayer } from "@/components/HymnAudioPlayer";
import { Heart, Share2, ArrowLeft, Music } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

export default function HymnDetail() {
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const [hymnId, setHymnId] = useState<number | null>(null);

  // Extract hymn ID from URL
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get("id");
    if (id) {
      setHymnId(parseInt(id));
    }
  }, []);

  // Fetch hymn details
  const { data: hymnData, isLoading } = trpc.hymns.getById.useQuery(
    hymnId!,
    { enabled: !!hymnId }
  );

  const hymn = hymnData?.hymn;
  const vocalParts = hymnData?.vocalParts || [];
  const audios = hymnData?.audios || [];

  // Toggle favorite mutation
  const toggleFavorite = trpc.favorites.toggle.useMutation({
    onSuccess: (result) => {
      toast.success(result.isFavorite ? "Adicionado aos favoritos" : "Removido dos favoritos");
    },
    onError: () => {
      toast.error("Erro ao atualizar favoritos");
    },
  });

  const handleToggleFavorite = () => {
    if (hymnId) {
      toggleFavorite.mutate(hymnId);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: hymn?.title,
          text: `Confira este hino: ${hymn?.title}`,
          url: window.location.href,
        });
      } catch (error) {
        console.log("Compartilhamento cancelado");
      }
    } else {
      toast.success("Link copiado para a área de transferência");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background py-8">
        <div className="container max-w-3xl">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-muted rounded w-1/3"></div>
            <div className="h-64 bg-muted rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!hymn) {
    return (
      <div className="min-h-screen bg-background py-8">
        <div className="container max-w-3xl">
          <Button variant="ghost" onClick={() => setLocation("/library")} className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
          <div className="text-center py-12">
            <p className="text-muted-foreground">Hino não encontrado</p>
          </div>
        </div>
      </div>
    );
  }

  const sourceLabel = {
    harpa_crista: "Harpa Cristã",
    cantor_cristao: "Cantor Cristão",
    salmos: "Salmos",
  }[hymn.source] || hymn.source;

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container max-w-3xl">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => setLocation("/library")}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar para Biblioteca
        </Button>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-start justify-between mb-4">
            <div>
              <Badge className="mb-3">{sourceLabel}</Badge>
              <h1 className="text-4xl font-display font-bold text-foreground mb-2">
                {hymn.title}
              </h1>
              <p className="text-lg text-foreground/70">
                Hino nº {hymn.number}
              </p>
            </div>
            <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={handleToggleFavorite}
              disabled={toggleFavorite.isPending}
            >
              <Heart className="w-5 h-5" />
            </Button>
              <Button variant="outline" size="icon" onClick={handleShare}>
                <Share2 className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <Card className="border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-foreground/70">
                Compositor
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="font-semibold text-foreground">{hymn.composer || "Desconhecido"}</p>
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-foreground/70">
                Tonalidade
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="font-semibold text-foreground text-lg">{hymn.tonality || "-"}</p>
            </CardContent>
          </Card>
        </div>

        {/* Audio Player */}
        {audios && audios.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
              <Music className="w-5 h-5 text-accent" />
              Áudio
            </h2>
            <HymnAudioPlayer
              hymnTitle={hymn.title}
              audioUrl={audios.find(a => a.vocalRange === 'full')?.audioUrl}
              vocalParts={Object.fromEntries(
                audios
                  .filter(a => a.vocalRange !== 'full')
                  .map((a) => [a.vocalRange, a.audioUrl])
              )}
            />
          </div>
        )}

        {/* Lyrics */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle>Letra</CardTitle>
            <CardDescription>
              {hymn.lyrics ? "Letra completa do hino" : "Letra não disponível"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {hymn?.lyrics ? (
              <div
                className="prose prose-sm dark:prose-invert max-w-none font-serif text-foreground whitespace-pre-wrap leading-relaxed"
                style={{ fontSize: `${user?.fontSize || 16}px` }}
              >
                {hymn.lyrics}
              </div>
            ) : (
              <p className="text-muted-foreground italic">
                A letra deste hino será adicionada em breve.
              </p>
            )}
          </CardContent>
        </Card>

        {/* Add to List Button */}
        <div className="mt-8">
          <Button className="w-full" size="lg">
            Adicionar à Lista
          </Button>
        </div>
      </div>
    </div>
  );
}
