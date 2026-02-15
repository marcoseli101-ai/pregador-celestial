import { useState } from "react";
import { Mail, Lock, User, LogIn } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Login = () => {
  const [tab, setTab] = useState("login");

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12">
      <div className="container max-w-md">
        <Card className="shadow-celestial border-celestial/20">
          <CardHeader className="text-center">
            <CardTitle className="font-serif text-2xl">Área do <span className="text-gradient-gold">Pregador</span></CardTitle>
            <CardDescription>Acesse sua conta para salvar sermões e acessar recursos exclusivos.</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={tab} onValueChange={setTab}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Entrar</TabsTrigger>
                <TabsTrigger value="cadastro">Cadastrar</TabsTrigger>
              </TabsList>

              <TabsContent value="login" className="space-y-4 mt-4">
                <div>
                  <Label>E-mail</Label>
                  <div className="relative mt-1">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input type="email" placeholder="seu@email.com" className="w-full rounded-lg border border-input bg-background px-10 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
                  </div>
                </div>
                <div>
                  <Label>Senha</Label>
                  <div className="relative mt-1">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input type="password" placeholder="••••••••" className="w-full rounded-lg border border-input bg-background px-10 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
                  </div>
                </div>
                <Button className="w-full bg-gradient-gold text-background hover:opacity-90 gap-2">
                  <LogIn className="h-4 w-4" /> Entrar
                </Button>
              </TabsContent>

              <TabsContent value="cadastro" className="space-y-4 mt-4">
                <div>
                  <Label>Nome Completo</Label>
                  <div className="relative mt-1">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input type="text" placeholder="Seu nome" className="w-full rounded-lg border border-input bg-background px-10 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
                  </div>
                </div>
                <div>
                  <Label>E-mail</Label>
                  <div className="relative mt-1">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input type="email" placeholder="seu@email.com" className="w-full rounded-lg border border-input bg-background px-10 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
                  </div>
                </div>
                <div>
                  <Label>Senha</Label>
                  <div className="relative mt-1">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input type="password" placeholder="Mínimo 6 caracteres" className="w-full rounded-lg border border-input bg-background px-10 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
                  </div>
                </div>
                <Button className="w-full bg-gradient-gold text-background hover:opacity-90 gap-2">
                  <User className="h-4 w-4" /> Criar Conta
                </Button>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;
