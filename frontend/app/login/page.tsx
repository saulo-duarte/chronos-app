"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useLoginWithGoogle } from "@/hooks/use-auth";
import { Chrome } from "lucide-react";

export default function LoginPage() {
  const { login } = useLoginWithGoogle();

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-zinc-50 dark:bg-zinc-950">
      <Card className="w-[400px] border-zinc-200 shadow-xl dark:border-zinc-800">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-3xl font-bold tracking-tight">Chronos</CardTitle>
          <CardDescription>
            Entre com sua conta para gerenciar seus projetos
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <Button 
            className="w-full h-12 text-lg font-medium transition-all hover:scale-[1.02]" 
            onClick={login}
          >
            <Chrome className="mr-2 h-5 w-5" />
            Continuar com Google
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
