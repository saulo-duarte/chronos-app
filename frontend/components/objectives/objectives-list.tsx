"use client";

import { useObjectives, useUpdateObjective, useDeleteObjective, useCreateObjective } from "@/hooks/use-objectives";
import { ObjectiveSchema } from "@/schemas/objectives";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Target, Calendar, Trash2, CheckCircle2, Circle, Plus, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export function ObjectivesList() {
  const { data: objectives = [], isLoading } = useObjectives();
  const updateMutation = useUpdateObjective();
  const deleteMutation = useDeleteObjective();
  const createMutation = useCreateObjective();

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newObjective, setNewObjective] = useState({
    title: "",
    description: "",
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
  });

  const handleToggleStatus = (objective: ObjectiveSchema) => {
    updateMutation.mutate({
      id: objective.id,
      dto: { status: objective.status === "DONE" ? "PENDING" : "DONE" },
    });
  };

  const handleCreate = () => {
    if (!newObjective.title) return;
    createMutation.mutate({
      title: newObjective.title,
      description: newObjective.description || undefined,
      target_month: newObjective.month,
      target_year: newObjective.year,
    });
    setIsAddOpen(false);
    setNewObjective({
      title: "",
      description: "",
      month: new Date().getMonth() + 1,
      year: new Date().getFullYear(),
    });
  };

  if (isLoading) {
    return (
      <div className="p-8 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8 space-y-8 animate-in fade-in duration-700">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground">Objetivos</h2>
          <p className="text-muted-foreground">Planeje suas metas a longo prazo.</p>
        </div>
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button className="rounded-full gap-2 shadow-lg shadow-primary/20 transition-all hover:shadow-primary/30">
              <Plus className="size-4" />
              Novo Objetivo
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Novo Objetivo</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Título</label>
                <Input 
                  placeholder="Ex: Ler 12 livros" 
                  value={newObjective.title}
                  onChange={e => setNewObjective(prev => ({ ...prev, title: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Descrição (opcional)</label>
                <Textarea 
                  placeholder="Detalhes sobre sua meta..." 
                  value={newObjective.description}
                  onChange={e => setNewObjective(prev => ({ ...prev, description: e.target.value }))}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Mês</label>
                  <Input 
                    type="number" 
                    min={1} 
                    max={12} 
                    value={newObjective.month}
                    onChange={e => setNewObjective(prev => ({ ...prev, month: parseInt(e.target.value) }))}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Ano</label>
                  <Input 
                    type="number" 
                    min={2024} 
                    value={newObjective.year}
                    onChange={e => setNewObjective(prev => ({ ...prev, year: parseInt(e.target.value) }))}
                  />
                </div>
              </div>
              <Button onClick={handleCreate} className="mt-4">Criar Objetivo</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {objectives.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-muted/20 border border-dashed rounded-3xl text-center">
            <Target className="size-12 text-muted-foreground/30 mb-4" />
            <p className="text-muted-foreground font-medium">Nenhum objetivo definido ainda.</p>
            <Button variant="link" onClick={() => setIsAddOpen(true)}>Comece agora</Button>
          </div>
        ) : (
          objectives.map((obj) => (
            <div 
              key={obj.id}
              className={cn(
                "group relative overflow-hidden flex items-center gap-4 p-6 rounded-3xl border bg-card/40 backdrop-blur-sm transition-all duration-300 hover:shadow-xl hover:border-primary/20",
                obj.status === "DONE" && "opacity-60"
              )}
            >
              <button 
                onClick={() => handleToggleStatus(obj)}
                className="shrink-0 transition-transform active:scale-90"
              >
                {obj.status === "DONE" ? (
                  <CheckCircle2 className="size-8 text-primary fill-primary/10" />
                ) : (
                  <Circle className="size-8 text-muted-foreground/30 group-hover:text-primary/50" />
                )}
              </button>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className={cn(
                    "text-lg font-bold truncate transition-all",
                    obj.status === "DONE" && "line-through decoration-primary/40 text-muted-foreground"
                  )}>
                    {obj.title}
                  </h3>
                  <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-primary/10 text-[10px] font-black uppercase text-primary">
                    <Calendar className="size-3" />
                    {new Date(obj.target_year, obj.target_month - 1).toLocaleDateString("pt-BR", { month: 'short', year: 'numeric' })}
                  </div>
                </div>
                {obj.description && (
                  <p className="text-sm text-muted-foreground line-clamp-1">{obj.description}</p>
                )}
              </div>

              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                  onClick={() => deleteMutation.mutate(obj.id)}
                >
                  <Trash2 className="size-4" />
                </Button>
                <ChevronRight className="size-4 text-muted-foreground/50" />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
