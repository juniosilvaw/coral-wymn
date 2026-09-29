import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Music, Heart, Users, BookOpen, Search, Settings } from "lucide-react";
import { getLoginUrl } from "@/const";
import { useState } from "react";
import { useLocation } from "wouter";

export default function Home() {
  const { user, loading, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse">
          <Music className="w-12 h-12 text-accent mx-auto mb-4" />
          <p className="text-foreground/60">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="border-b border-border bg-card">
          <div className="container py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Music className="w-8 h-8 text-accent" />
                <h1 className="text-2xl font-display font-bold text-foreground">
                  Coral Hymn
                </h1>
              </div>
              <Button asChild>
                <a href={getLoginUrl()}>Entrar</a>
              </Button>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-br from-accent/5 to-secondary/5">
          <div className="container">
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-6">
                Organize seus Hinos com Elegância
              </h2>
              <p className="text-lg text-foreground/70 mb-8">
                A plataforma completa para corais evangélicos. Biblioteca de hinos, busca avançada, 
                favoritos, listas personalizadas e muito mais.
              </p>
              <Button size="lg" asChild>
                <a href={getLoginUrl()}>Começar Agora</a>
              </Button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16">
          <div className="container">
            <h3 className="text-3xl font-display font-bold text-center mb-12 text-foreground">
              Funcionalidades Principais
            </h3>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="border-border/50 hover:border-accent/50 transition-colors">
                <CardHeader>
                  <BookOpen className="w-8 h-8 text-accent mb-2" />
                  <CardTitle>Biblioteca Completa</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-foreground/70">
                    Harpa Cristã, Cantor Cristão e Salmos selecionados com letras completas.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-border/50 hover:border-accent/50 transition-colors">
                <CardHeader>
                  <Search className="w-8 h-8 text-accent mb-2" />
                  <CardTitle>Busca Avançada</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-foreground/70">
                    Encontre hinos por número, título ou trecho da letra em tempo real.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-border/50 hover:border-accent/50 transition-colors">
                <CardHeader>
                  <Users className="w-8 h-8 text-accent mb-2" />
                  <CardTitle>Separação por Vozes</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-foreground/70">
                    Classificação por naipe vocal com exibição de partes específicas.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-border/50 hover:border-accent/50 transition-colors">
                <CardHeader>
                  <Heart className="w-8 h-8 text-accent mb-2" />
                  <CardTitle>Favoritos e Listas</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-foreground/70">
                    Marque seus hinos favoritos e crie listas personalizadas para cultos.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-border/50 hover:border-accent/50 transition-colors">
                <CardHeader>
                  <Music className="w-8 h-8 text-accent mb-2" />
                  <CardTitle>Áudio e Playback</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-foreground/70">
                    Reprodução de áudio com playback separado por voz para ensaios.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-border/50 hover:border-accent/50 transition-colors">
                <CardHeader>
                  <Settings className="w-8 h-8 text-accent mb-2" />
                  <CardTitle>Modo Noturno</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-foreground/70">
                    Tema escuro para uso durante cultos noturnos e ajuste de fontes.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-accent/10">
          <div className="container text-center">
            <h3 className="text-3xl font-display font-bold mb-4 text-foreground">
              Pronto para começar?
            </h3>
            <p className="text-lg text-foreground/70 mb-8">
              Acesse agora e organize seus hinos com elegância.
            </p>
            <Button size="lg" asChild>
              <a href={getLoginUrl()}>Entrar Agora</a>
            </Button>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-border bg-card py-8">
          <div className="container text-center text-foreground/60 text-sm">
            <p>&copy; 2026 Coral Hymn. Todos os direitos reservados.</p>
          </div>
        </footer>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card sticky top-0 z-50">
        <div className="container py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Music className="w-8 h-8 text-accent" />
              <h1 className="text-2xl font-display font-bold text-foreground">
                Coral Hymn
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={() => setLocation("/profile")} title="Perfil">
                <Settings className="w-5 h-5" />
              </Button>
              <div className="text-sm text-foreground/70">
                {user?.name}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-8">
        <div className="grid md:grid-cols-4 gap-6">
          {/* Sidebar Navigation */}
          <aside className="md:col-span-1">
            <nav className="space-y-2">
              <Button 
                variant="ghost" 
                className="w-full justify-start gap-2"
                onClick={() => setLocation("/library")}
              >
                <BookOpen className="w-5 h-5" />
                Biblioteca
              </Button>
              <Button 
                variant="ghost" 
                className="w-full justify-start gap-2"
                onClick={() => setLocation("/favorites")}
              >
                <Heart className="w-5 h-5" />
                Favoritos
              </Button>
              <Button 
                variant="ghost" 
                className="w-full justify-start gap-2"
                onClick={() => setLocation("/lists")}
              >
                <Music className="w-5 h-5" />
                Minhas Listas
              </Button>
            </nav>
          </aside>

          {/* Main Content Area */}
          <div className="md:col-span-3">
            {/* Search Bar */}
            <div className="mb-8">
              <div className="relative">
                <Search className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                <Input
                  placeholder="Buscar hino por número, título ou letra..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {/* Welcome Card */}
            <Card className="mb-8 border-border/50">
              <CardHeader>
                <CardTitle>Bem-vindo, {user?.name}!</CardTitle>
                <CardDescription>
                  Explore nossa biblioteca completa de hinos e organize seus cultos com elegância.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-foreground/70">
                  Comece navegando pela biblioteca, marcando seus hinos favoritos ou criando listas personalizadas para seus cultos e ensaios.
                </p>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <div className="grid md:grid-cols-3 gap-4">
              <Card className="border-border/50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-foreground/70">
                    Hinos Favoritos
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-accent">0</div>
                </CardContent>
              </Card>

              <Card className="border-border/50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-foreground/70">
                    Minhas Listas
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-accent">0</div>
                </CardContent>
              </Card>

              <Card className="border-border/50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-foreground/70">
                    Hinos Totais
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-accent">1.280+</div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
