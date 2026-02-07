"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useLoginWithGoogle } from "@/hooks/use-auth";
import { Clock } from "lucide-react";

export default function LoginPage() {
  const { login } = useLoginWithGoogle();

  return (
    <div className="relative flex h-screen w-screen items-center justify-center overflow-hidden bg-background">
      <div className="absolute top-[-10%] left-[-10%] h-[40%] w-[40%] rounded-full bg-primary/15 blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] h-[40%] w-[40%] rounded-full bg-blue-500/10 blur-[120px]" />
      
      <div className="relative z-10 w-full max-w-[400px] px-4">
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary shadow-lg shadow-primary/20">
            <Clock className="h-7 w-7 text-primary-foreground" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-foreground">Chronos</h1>
          <p className="mt-2 text-muted-foreground font-medium">
            Sua produtividade em outro nível
          </p>
        </div>

        <Card className="border-border/50 bg-card/80 backdrop-blur-xl shadow-2xl">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl font-bold">Bem-vindo</CardTitle>
            <CardDescription>
              Acesse sua conta para começar
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6 pt-4 pb-8">
            <Button 
              size="lg"
              className="w-full h-12 text-lg font-bold transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-primary/25 flex items-center justify-center gap-3" 
              onClick={login}
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              Continuar com Google
            </Button>
            
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border/50" />
              </div>
              <div className="relative flex justify-center text-[10px] uppercase tracking-[0.1em]">
                <span className="bg-card px-2 text-muted-foreground/80 font-bold">
                  Autenticação Segura
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <p className="mt-8 text-center text-xs text-muted-foreground/40 font-medium">
          © 2024 Chronos. Todos os direitos reservados.
        </p>
      </div>
    </div>
  );
}

