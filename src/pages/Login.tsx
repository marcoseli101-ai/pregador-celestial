import { useState } from "react";
import { Mail, Lock, User, LogIn, Eye, EyeOff } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const friendlyError = (msg: string): string => {
  const m = (msg || "").toLowerCase();
  if (m.includes("invalid login")) return "E-mail ou senha incorretos.";
  if (m.includes("email not confirmed")) return "Confirme seu e-mail antes de entrar.";
  if (m.includes("user already registered")) return "Este e-mail já está cadastrado. Tente entrar.";
  if (m.includes("password should be")) return "A senha deve ter pelo menos 6 caracteres.";
  if (m.includes("rate limit") || m.includes("too many")) return "Muitas tentativas. Aguarde alguns minutos.";
  if (m.includes("network")) return "Falha de conexão. Verifique sua internet.";
  return msg || "Algo deu errado. Tente novamente.";
};

const Login = () => {
  const [tab, setTab] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [forgotOpen, setForgotOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);
  const { signIn, signUp, user, resetPassword } = useAuth();
  const navigate = useNavigate();

  if (user) {
    navigate("/");
    return null;
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signIn(email, password);
      navigate("/");
    } catch (err: any) {
      toast.error(friendlyError(err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) { toast.error("A senha deve ter pelo menos 6 caracteres"); return; }
    setLoading(true);
    try {
      await signUp(email, password, name);
      setTab("login");
    } catch (err: any) {
      toast.error(friendlyError(err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleForgot = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotLoading(true);
    try {
      await resetPassword(forgotEmail);
      setForgotOpen(false);
      setForgotEmail("");
    } catch (err: any) {
      toast.error(friendlyError(err.message));
    } finally {
      setForgotLoading(false);
    }
  };

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

              <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-4 mt-4">
                  <div>
                    <Label>E-mail</Label>
                    <div className="relative mt-1">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="seu@email.com" className="w-full rounded-lg border border-input bg-background px-10 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between">
                      <Label>Senha</Label>
                      <button type="button" onClick={() => setForgotOpen(true)} className="text-xs text-primary hover:underline">
                        Esqueci minha senha
                      </button>
                    </div>
                    <div className="relative mt-1">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <input type={showPassword ? "text" : "password"} required value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" className="w-full rounded-lg border border-input bg-background px-10 py-2.5 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
                      <button type="button" onClick={() => setShowPassword(s => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground" aria-label="Mostrar senha">
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                  <Button type="submit" disabled={loading} className="w-full bg-gradient-gold text-background hover:opacity-90 gap-2">
                    <LogIn className="h-4 w-4" /> {loading ? "Entrando..." : "Entrar"}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="cadastro">
                <form onSubmit={handleSignUp} className="space-y-4 mt-4">
                  <div>
                    <Label>Nome Completo</Label>
                    <div className="relative mt-1">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <input type="text" required value={name} onChange={e => setName(e.target.value)} placeholder="Seu nome" className="w-full rounded-lg border border-input bg-background px-10 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
                    </div>
                  </div>
                  <div>
                    <Label>E-mail</Label>
                    <div className="relative mt-1">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="seu@email.com" className="w-full rounded-lg border border-input bg-background px-10 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
                    </div>
                  </div>
                  <div>
                    <Label>Senha</Label>
                    <div className="relative mt-1">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <input type={showPassword ? "text" : "password"} required value={password} onChange={e => setPassword(e.target.value)} placeholder="Mínimo 6 caracteres" className="w-full rounded-lg border border-input bg-background px-10 py-2.5 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
                      <button type="button" onClick={() => setShowPassword(s => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground" aria-label="Mostrar senha">
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                  <Button type="submit" disabled={loading} className="w-full bg-gradient-gold text-background hover:opacity-90 gap-2">
                    <User className="h-4 w-4" /> {loading ? "Criando..." : "Criar Conta"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <Dialog open={forgotOpen} onOpenChange={setForgotOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Redefinir senha</DialogTitle>
              <DialogDescription>
                Informe seu e-mail e enviaremos um link para você criar uma nova senha.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleForgot} className="space-y-4">
              <div>
                <Label>E-mail</Label>
                <div className="relative mt-1">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input type="email" required value={forgotEmail} onChange={e => setForgotEmail(e.target.value)} placeholder="seu@email.com" className="w-full rounded-lg border border-input bg-background px-10 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" disabled={forgotLoading} className="w-full bg-gradient-gold text-background hover:opacity-90">
                  {forgotLoading ? "Enviando..." : "Enviar link de redefinição"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Login;
