import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { useTheme } from "@/contexts/ThemeContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Music, Moon, Sun, LogOut } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { useLocation } from "wouter";

export default function Profile() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [, setLocation] = useLocation();

  const [vocalRange, setVocalRange] = useState<"soprano" | "contralto" | "tenor" | "baixo">(user?.vocalRange || "soprano");
  const [fontSize, setFontSize] = useState(user?.fontSize || 16);

  // Update preferences mutation
  const updatePreferences = trpc.user.updatePreferences.useMutation({
    onSuccess: () => {
      toast.success("Preferências atualizadas com sucesso");
    },
    onError: () => {
      toast.error("Erro ao atualizar preferências");
    },
  });

  const handleUpdatePreferences = () => {
    updatePreferences.mutate({
      vocalRange: vocalRange as any,
      fontSize,
      theme: theme as any,
    });
  };

  const handleLogout = async () => {
    await logout();
    setLocation("/");
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
      <div className="container max-w-2xl">
        <div className="mb-8">
          <h1 className="text-4xl font-display font-bold text-foreground mb-2">
            Meu Perfil
          </h1>
          <p className="text-foreground/70">
            Gerencie suas preferências e configurações
          </p>
        </div>

        <div className="space-y-6">
          {/* User Info Card */}
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle>Informações Pessoais</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground/70">Nome</label>
                <p className="text-lg font-semibold text-foreground mt-1">{user?.name}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-foreground/70">Email</label>
                <p className="text-lg font-semibold text-foreground mt-1">{user?.email}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-foreground/70">Membro desde</label>
                <p className="text-lg font-semibold text-foreground mt-1">
                  {user?.createdAt ? new Date(user.createdAt).toLocaleDateString("pt-BR") : "-"}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Vocal Range Card */}
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Music className="w-5 h-5 text-accent" />
                Naipe Vocal
              </CardTitle>
              <CardDescription>
                Selecione seu naipe vocal para personalizar a experiência
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Sua Voz
                </label>
                <Select value={vocalRange} onValueChange={(val: any) => setVocalRange(val)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="soprano">Soprano</SelectItem>
                    <SelectItem value="contralto">Contralto</SelectItem>
                    <SelectItem value="tenor">Tenor</SelectItem>
                    <SelectItem value="baixo">Baixo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="p-3 bg-accent/5 rounded-lg border border-accent/20">
                <p className="text-sm text-foreground/70">
                  Você está configurado como <Badge className="ml-1">{getVocalRangeLabel(vocalRange)}</Badge>
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Display Preferences Card */}
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle>Preferências de Exibição</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Theme Toggle */}
              <div>
                <label className="text-sm font-medium text-foreground mb-3 block">
                  Tema
                </label>
                <div className="flex gap-3">
                  <Button
                    variant={theme === "light" ? "default" : "outline"}
                    className="flex-1 gap-2"
                    onClick={() => theme === "dark" && toggleTheme?.()}
                  >
                    <Sun className="w-4 h-4" />
                    Claro
                  </Button>
                  <Button
                    variant={theme === "dark" ? "default" : "outline"}
                    className="flex-1 gap-2"
                    onClick={() => theme === "light" && toggleTheme?.()}
                  >
                    <Moon className="w-4 h-4" />
                    Escuro
                  </Button>
                </div>
              </div>

              {/* Font Size Slider */}
              <div>
                <label className="text-sm font-medium text-foreground mb-3 block">
                  Tamanho da Fonte: {fontSize}px
                </label>
                <Slider
                  value={[fontSize]}
                  onValueChange={(value) => setFontSize(value[0])}
                  min={12}
                  max={32}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-2">
                  <span>Pequeno (12px)</span>
                  <span>Grande (32px)</span>
                </div>
              </div>

              {/* Preview */}
              <div className="p-4 bg-card/50 rounded-lg border border-border/50">
                <p className="text-sm font-medium text-foreground/70 mb-2">Prévia:</p>
                <p style={{ fontSize: `${fontSize}px` }} className="font-serif text-foreground">
                  Assim é como o texto dos hinos aparecerá para você.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Save Button */}
          <Button
            onClick={handleUpdatePreferences}
            disabled={updatePreferences.isPending}
            className="w-full"
            size="lg"
          >
            {updatePreferences.isPending ? "Salvando..." : "Salvar Preferências"}
          </Button>

          {/* Logout Button */}
          <Button
            onClick={handleLogout}
            variant="outline"
            className="w-full gap-2"
          >
            <LogOut className="w-4 h-4" />
            Sair
          </Button>
        </div>
      </div>
    </div>
  );
}
