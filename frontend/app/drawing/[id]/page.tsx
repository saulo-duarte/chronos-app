"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { useResource } from "@/hooks/use-resources";
import { DrawingEditor } from "@/components/resources/drawing-editor";
import { Loader2 } from "lucide-react";

interface DrawingPageProps {
  params: Promise<{ id: string }>;
}

export default function DrawingPage({ params }: DrawingPageProps) {
  const { id } = use(params);
  const router = useRouter();
  const { data: resource, isLoading, isError } = useResource(id);

  if (isLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-background">
        <Loader2 className="size-8 animate-spin text-primary" />
      </div>
    );
  }

  if (isError || !resource) {
    return (
      <div className="flex h-screen w-screen flex-col items-center justify-center bg-background gap-4">
        <p className="text-muted-foreground text-sm">Quadro não encontrado.</p>
      </div>
    );
  }

  return (
    <DrawingEditor
      resource={resource}
      onClose={() => router.back()}
      onGoHome={() => router.push("/")}
    />
  );
}
