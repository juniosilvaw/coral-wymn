import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Music, Plus, Trash2 } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

export default function Lists() {
  const [newListName, setNewListName] = useState("");
  const [newListType, setNewListType] = useState<"service" | "rehearsal" | "custom">("custom");
  const [newListDescription, setNewListDescription] = useState("");
  const [selectedListId, setSelectedListId] = useState<number | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Get user lists
  const { data: lists, refetch: refetchLists } = trpc.lists.list.useQuery();

  // Get list with items
  const { data: listWithItems } = trpc.lists.getWithItems.useQuery(selectedListId || 0, {
    enabled: selectedListId !== null,
  });

  // Create list mutation
  const createList = trpc.lists.create.useMutation({
    onSuccess: () => {
      refetchLists();
      setNewListName("");
      setNewListDescription("");
      setNewListType("custom");
      setIsDialogOpen(false);
      toast.success("Lista criada com sucesso");
    },
    onError: () => {
      toast.error("Erro ao criar lista");
    },
  });

  const handleCreateList = () => {
    if (!newListName.trim()) {
      toast.error("Nome da lista é obrigatório");
      return;
    }

    createList.mutate({
      name: newListName,
      description: newListDescription,
      type: newListType,
    });
  };

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      service: "Culto",
      rehearsal: "Ensaio",
      custom: "Personalizada",
    };
    return labels[type] || type;
  };

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      service: "bg-accent/10 text-accent",
      rehearsal: "bg-secondary/10 text-secondary",
      custom: "bg-muted text-muted-foreground",
    };
    return colors[type] || "bg-muted text-muted-foreground";
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-display font-bold text-foreground mb-2">
              Minhas Listas
            </h1>
            <p className="text-foreground/70">
              {lists?.length || 0} lista{lists && lists.length !== 1 ? "s" : ""}
            </p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                Nova Lista
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Criar Nova Lista</DialogTitle>
                <DialogDescription>
                  Crie uma lista personalizada para organizar seus hinos
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Nome da Lista
                  </label>
                  <Input
                    placeholder="Ex: Culto de Domingo"
                    value={newListName}
                    onChange={(e) => setNewListName(e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Tipo
                  </label>
                  <Select value={newListType} onValueChange={(val: any) => setNewListType(val)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="service">Culto</SelectItem>
                      <SelectItem value="rehearsal">Ensaio</SelectItem>
                      <SelectItem value="custom">Personalizada</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Descrição (opcional)
                  </label>
                  <Input
                    placeholder="Descrição da lista..."
                    value={newListDescription}
                    onChange={(e) => setNewListDescription(e.target.value)}
                  />
                </div>
                <Button
                  onClick={handleCreateList}
                  disabled={createList.isPending}
                  className="w-full"
                >
                  {createList.isPending ? "Criando..." : "Criar Lista"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Lists Sidebar */}
          <div className="lg:col-span-1">
            <Card className="border-border/50 sticky top-20">
              <CardHeader>
                <CardTitle>Listas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {lists && lists.length === 0 ? (
                    <div className="text-sm text-muted-foreground text-center py-8">
                      Nenhuma lista criada
                    </div>
                  ) : (
                    lists?.map((list) => (
                      <Button
                        key={list.id}
                        variant={selectedListId === list.id ? "default" : "outline"}
                        className="w-full justify-start text-left h-auto py-2"
                        onClick={() => setSelectedListId(list.id)}
                      >
                        <div className="flex flex-col w-full">
                          <span className="font-semibold text-sm">{list.name}</span>
                          <span className="text-xs text-muted-foreground">
                            {getTypeLabel(list.type)}
                          </span>
                        </div>
                      </Button>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* List Details */}
          <div className="lg:col-span-2">
            {selectedListId && listWithItems ? (
              <Card className="border-border/50">
                <CardHeader className="border-b border-border/50">
                  <div className="flex items-start justify-between">
                    <div>
                      <Badge className={`mb-2 ${getTypeColor(listWithItems.list.type)}`}>
                        {getTypeLabel(listWithItems.list.type)}
                      </Badge>
                      <CardTitle className="text-3xl font-display">
                        {listWithItems.list.name}
                      </CardTitle>
                      {listWithItems.list.description && (
                        <CardDescription className="mt-2">
                          {listWithItems.list.description}
                        </CardDescription>
                      )}
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="pt-6">
                  {/* Hinos na Lista */}
                  <div>
                    <h3 className="text-sm font-semibold text-foreground/70 mb-3">
                      Hinos na Lista ({listWithItems.items.length})
                    </h3>
                    {listWithItems.items.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        Nenhum hino nesta lista
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {listWithItems.items.map((item, index) => (
                          <div
                            key={item.item.id}
                            className="flex items-center justify-between p-3 bg-card/50 rounded-lg border border-border/50 hover:border-accent/50 transition-colors"
                          >
                            <div className="flex items-center gap-3">
                              <span className="text-sm font-semibold text-muted-foreground w-6 text-center">
                                {index + 1}
                              </span>
                              <div>
                                <p className="font-semibold text-foreground">
                                  {item.hymn.number}. {item.hymn.title}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {item.item.notes}
                                </p>
                              </div>
                            </div>
                            <Button variant="ghost" size="icon">
                              <Trash2 className="w-4 h-4 text-muted-foreground" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="border-border/50 h-96 flex items-center justify-center">
                <div className="text-center">
                  <Music className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                  <p className="text-foreground/60">
                    Selecione uma lista para visualizar os detalhes
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
