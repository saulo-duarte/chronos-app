"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { useUpdateResource } from "@/hooks/use-resources";
import { Resource } from "@/types";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Save, Loader2, Home } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

import "@excalidraw/excalidraw/index.css";
import { ExcalidrawElement } from "@excalidraw/excalidraw/element/types";
import { AppState } from "@excalidraw/excalidraw/types";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

// Dynamically import Excalidraw, disabling server-side rendering
const Excalidraw = dynamic(
  () => import("@excalidraw/excalidraw").then((mod) => mod.Excalidraw),
  {
    ssr: false,
    loading: () => (
      <div className="flex w-full h-full items-center justify-center bg-background">
        <Loader2 className="size-8 animate-spin text-primary" />
      </div>
    ),
  },
);

interface DrawingEditorProps {
  resource: Resource;
  onClose: () => void;
  onGoHome?: () => void;
}

export function DrawingEditor({
  resource,
  onClose,
  onGoHome,
}: DrawingEditorProps) {
  const { toast } = useToast();
  const updateResourceMutation = useUpdateResource();
  const [isSaving, setIsSaving] = useState(false);
  const isSavingRef = useRef(false);
  const [isDirty, setIsDirty] = useState(false);
  const [showExitDialog, setShowExitDialog] = useState(false);
  const [pendingAction, setPendingAction] = useState<"close" | "home" | null>(
    null,
  );
  const [initialData, setInitialData] = useState<any>(null);
  const excalidrawAPI = useRef<any>(null);
  const lastSavedElementsRef = useRef<string>("");

  // Load initial data from the resource path (which stores the JSON content)
  useEffect(() => {
    if (initialData) return; // Only set initial data once to avoid resetting the canvas

    try {
      if (resource.path && resource.path.trim() !== "") {
        const parsed = JSON.parse(resource.path);
        const elements = parsed.elements || [];
        lastSavedElementsRef.current = JSON.stringify(elements);

        // Sanitize appState
        const sanitizedAppState = { ...parsed.appState, theme: "dark" };
        if (sanitizedAppState.collaborators) {
          delete sanitizedAppState.collaborators;
        }

        setInitialData({
          elements,
          appState: sanitizedAppState,
        });
      } else {
        lastSavedElementsRef.current = JSON.stringify([]);
        setInitialData({ elements: [], appState: { theme: "dark" } });
      }
    } catch (e) {
      console.error("Failed to parse drawing data:", e);
      lastSavedElementsRef.current = JSON.stringify([]);
      setInitialData({ elements: [], appState: { theme: "dark" } });
    }
  }, [resource.path, initialData]);

  const handleSave = useCallback(
    async (elements: readonly ExcalidrawElement[], appState: AppState) => {
      setIsSaving(true);
      isSavingRef.current = true;
      try {
        // Only save essential UI states to avoid serialization issues
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { collaborators, ...persistentState } = appState as any;

        const dataToSave = JSON.stringify({
          elements,
          appState: persistentState,
        });

        await updateResourceMutation.mutateAsync({
          id: resource.id,
          dto: { path: dataToSave } as any,
        });
        lastSavedElementsRef.current = JSON.stringify(elements);
        setIsDirty(false);
        toast({
          title: "Quadro salvo",
          description: "As alterações foram persistidas com sucesso.",
        });
      } catch (error) {
        console.error("Failed to save drawing:", error);
        toast({
          title: "Erro ao salvar",
          description: "Não foi possível salvar o desenho.",
          variant: "destructive",
        });
      } finally {
        setTimeout(() => {
          setIsSaving(false);
          isSavingRef.current = false;
        }, 500); // Debounce to allow Excalidraw to settle
      }
    },

    [resource.id, updateResourceMutation, toast],
  );

  const onChange = (elements: readonly ExcalidrawElement[]) => {
    if (isSavingRef.current) return;

    const currentElementsJson = JSON.stringify(elements);
    if (currentElementsJson !== lastSavedElementsRef.current) {
      setIsDirty(true);
    }
  };

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isDirty]);

  const handleClose = () => {
    if (isDirty) {
      setPendingAction("close");
      setShowExitDialog(true);
    } else {
      onClose();
    }
  };

  const handleHome = () => {
    if (isDirty) {
      setPendingAction("home");
      setShowExitDialog(true);
    } else {
      if (onGoHome) {
        onGoHome();
      } else {
        // Fallback or ensure we go to root
        window.location.href = "/";
      }
    }
  };

  if (!initialData) {
    return (
      <div className="flex w-full h-full items-center justify-center bg-background">
        <Loader2 className="size-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] flex flex-col bg-background animate-in fade-in duration-300">
      <div className="flex items-center justify-between p-4 border-b border-border/50 shrink-0">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleClose}
            className="rounded-full"
          >
            <ArrowLeft className="size-5" />
          </Button>
          <div className="flex flex-col">
            <span className="text-sm font-semibold truncate max-w-[200px] md:max-w-md">
              {resource.title}
              {isDirty && <span className="text-primary ml-1">*</span>}
            </span>
            <span className="text-[10px] text-muted-foreground uppercase tracking-widest flex items-center gap-2">
              Drawing
              {isSaving && (
                <span className="flex items-center gap-1 text-primary">
                  <Loader2 className="size-3 animate-spin" /> Saving
                </span>
              )}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleHome}
            className="gap-2"
          >
            <Home className="size-4" />
            <span className="hidden md:inline">Início</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              if (excalidrawAPI.current) {
                const elements = excalidrawAPI.current.getSceneElements();
                const appState = excalidrawAPI.current.getAppState();
                handleSave(elements, appState);
              }
            }}
            disabled={isSaving}
            className="gap-2"
          >
            {isSaving ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Save className="size-4" />
            )}
            <span className="hidden md:inline">Salvar</span>
          </Button>
        </div>
      </div>

      <div className="flex-1 w-full h-full relative">
        <Excalidraw
          initialData={initialData}
          onChange={onChange}
          excalidrawAPI={(api) => (excalidrawAPI.current = api)}
          theme="dark" // You can sync this with the app's theme
        />
      </div>

      <AlertDialog open={showExitDialog} onOpenChange={setShowExitDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Sair sem salvar?</AlertDialogTitle>
            <AlertDialogDescription>
              Você tem alterações não salvas neste quadro. Se você sair agora,
              perderá essas alterações. Deseja realmente sair?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Voltar e Salvar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                setShowExitDialog(false);
                if (pendingAction === "home") {
                  if (onGoHome) {
                    onGoHome();
                  } else {
                    window.location.href = "/";
                  }
                } else {
                  onClose();
                }
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Sair e Descartar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
