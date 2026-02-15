import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useAdminCheck } from "@/hooks/useAdminCheck";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  BarChart3, Users, FileText, BookOpen, Mic2, Trash2, Shield, ShieldCheck,
  Plus, Loader2, UserCheck, ScrollText, Calendar, Church
} from "lucide-react";

interface Profile {
  id: string;
  name: string | null;
  email: string | null;
  created_at: string;
}

interface UserRole {
  user_id: string;
  role: "admin" | "user";
}

interface Sermon {
  id: string;
  title: string;
  tema: string | null;
  created_at: string;
  user_id: string;
}

interface Devotional {
  id: string;
  date_label: string;
  content: string;
  created_at: string;
  user_id: string;
}

interface Preacher {
  id: string;
  name: string;
  bio: string | null;
  church: string | null;
  city: string | null;
  active: boolean;
  created_at: string;
}

export default function Admin() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isAdmin, loading: adminLoading } = useAdminCheck();

  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [roles, setRoles] = useState<UserRole[]>([]);
  const [sermons, setSermons] = useState<Sermon[]>([]);
  const [devotionals, setDevotionals] = useState<Devotional[]>([]);
  const [preachers, setPreachers] = useState<Preacher[]>([]);
  const [loading, setLoading] = useState(true);

  // Preacher form
  const [newPreacher, setNewPreacher] = useState({ name: "", bio: "", church: "", city: "" });
  const [addingPreacher, setAddingPreacher] = useState(false);

  useEffect(() => {
    if (!adminLoading && !isAdmin) {
      navigate("/");
      toast.error("Acesso restrito a administradores.");
    }
  }, [adminLoading, isAdmin, navigate]);

  useEffect(() => {
    if (isAdmin) fetchAll();
  }, [isAdmin]);

  const fetchAll = async () => {
    setLoading(true);
    const [profilesRes, rolesRes, sermonsRes, devotionalsRes, preachersRes] = await Promise.all([
      supabase.from("profiles").select("id, name, email, created_at").order("created_at", { ascending: false }),
      supabase.from("user_roles").select("user_id, role"),
      supabase.from("saved_sermons").select("id, title, tema, created_at, user_id").order("created_at", { ascending: false }),
      supabase.from("saved_devotionals").select("id, date_label, content, created_at, user_id").order("created_at", { ascending: false }),
      supabase.from("preachers").select("*").order("created_at", { ascending: false }),
    ]);
    setProfiles(profilesRes.data || []);
    setRoles(rolesRes.data || []);
    setSermons(sermonsRes.data || []);
    setDevotionals(devotionalsRes.data || []);
    setPreachers(preachersRes.data || []);
    setLoading(false);
  };

  const getUserRole = (userId: string) => roles.find((r) => r.user_id === userId)?.role || "user";

  const toggleRole = async (userId: string) => {
    const current = getUserRole(userId);
    const newRole = current === "admin" ? "user" : "admin";
    const { error } = await supabase
      .from("user_roles")
      .update({ role: newRole })
      .eq("user_id", userId);
    if (error) {
      toast.error("Erro ao alterar role.");
    } else {
      toast.success(`Role alterado para ${newRole}.`);
      setRoles((prev) => prev.map((r) => (r.user_id === userId ? { ...r, role: newRole } : r)));
    }
  };

  const deleteSermon = async (id: string) => {
    const { error } = await supabase.from("saved_sermons").delete().eq("id", id);
    if (!error) {
      setSermons((prev) => prev.filter((s) => s.id !== id));
      toast.success("Pregação removida.");
    }
  };

  const deleteDevotional = async (id: string) => {
    const { error } = await supabase.from("saved_devotionals").delete().eq("id", id);
    if (!error) {
      setDevotionals((prev) => prev.filter((d) => d.id !== id));
      toast.success("Devocional removido.");
    }
  };

  const addPreacher = async () => {
    if (!newPreacher.name.trim()) return toast.error("Nome é obrigatório.");
    setAddingPreacher(true);
    const { error } = await supabase.from("preachers").insert({
      name: newPreacher.name,
      bio: newPreacher.bio || null,
      church: newPreacher.church || null,
      city: newPreacher.city || null,
    });
    if (error) {
      toast.error("Erro ao adicionar pregador.");
    } else {
      toast.success("Pregador adicionado!");
      setNewPreacher({ name: "", bio: "", church: "", city: "" });
      fetchAll();
    }
    setAddingPreacher(false);
  };

  const togglePreacher = async (id: string, active: boolean) => {
    const { error } = await supabase.from("preachers").update({ active: !active }).eq("id", id);
    if (!error) {
      setPreachers((prev) => prev.map((p) => (p.id === id ? { ...p, active: !active } : p)));
      toast.success(active ? "Pregador desativado." : "Pregador ativado.");
    }
  };

  const deletePreacher = async (id: string) => {
    const { error } = await supabase.from("preachers").delete().eq("id", id);
    if (!error) {
      setPreachers((prev) => prev.filter((p) => p.id !== id));
      toast.success("Pregador removido.");
    }
  };

  if (adminLoading || loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-accent" />
      </div>
    );
  }

  if (!isAdmin) return null;

  const stats = [
    { label: "Usuários", value: profiles.length, icon: Users, color: "text-celestial" },
    { label: "Pregações Salvas", value: sermons.length, icon: ScrollText, color: "text-accent" },
    { label: "Devocionais Salvos", value: devotionals.length, icon: Calendar, color: "text-gold-dark" },
    { label: "Pregadores", value: preachers.length, icon: Mic2, color: "text-primary" },
  ];

  return (
    <div className="container py-10">
      <div className="mb-8">
        <h1 className="font-serif text-3xl font-bold">
          Painel <span className="text-gradient-gold">Administrativo</span>
        </h1>
        <p className="text-muted-foreground mt-1">Gerencie usuários, conteúdos e pregadores.</p>
      </div>

      <Tabs defaultValue="dashboard" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-grid">
          <TabsTrigger value="dashboard" className="gap-1.5">
            <BarChart3 className="h-4 w-4" /> Dashboard
          </TabsTrigger>
          <TabsTrigger value="users" className="gap-1.5">
            <Users className="h-4 w-4" /> Usuários
          </TabsTrigger>
          <TabsTrigger value="content" className="gap-1.5">
            <FileText className="h-4 w-4" /> Conteúdos
          </TabsTrigger>
          <TabsTrigger value="preachers" className="gap-1.5">
            <Mic2 className="h-4 w-4" /> Pregadores
          </TabsTrigger>
        </TabsList>

        {/* Dashboard */}
        <TabsContent value="dashboard">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((s) => (
              <Card key={s.label}>
                <CardContent className="flex items-center gap-4 p-6">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-muted ${s.color}`}>
                    <s.icon className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{s.value}</p>
                    <p className="text-sm text-muted-foreground">{s.label}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Últimas Pregações</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {sermons.slice(0, 5).map((s) => (
                  <div key={s.id} className="flex items-center justify-between rounded-lg border border-border p-3">
                    <div>
                      <p className="font-medium text-sm">{s.title}</p>
                      <p className="text-xs text-muted-foreground">{s.tema} • {new Date(s.created_at).toLocaleDateString("pt-BR")}</p>
                    </div>
                  </div>
                ))}
                {sermons.length === 0 && <p className="text-sm text-muted-foreground">Nenhuma pregação salva.</p>}
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Últimos Devocionais</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {devotionals.slice(0, 5).map((d) => (
                  <div key={d.id} className="flex items-center justify-between rounded-lg border border-border p-3">
                    <div>
                      <p className="font-medium text-sm">{d.date_label}</p>
                      <p className="text-xs text-muted-foreground">{new Date(d.created_at).toLocaleDateString("pt-BR")}</p>
                    </div>
                  </div>
                ))}
                {devotionals.length === 0 && <p className="text-sm text-muted-foreground">Nenhum devocional salvo.</p>}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Users */}
        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle>Gestão de Usuários</CardTitle>
              <CardDescription>Visualize e gerencie os papéis dos usuários cadastrados.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {profiles.map((p) => {
                  const role = getUserRole(p.id);
                  const isSelf = p.id === user?.id;
                  return (
                    <div key={p.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-lg border border-border p-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-sm font-bold">
                          {(p.name?.[0] || p.email?.[0] || "U").toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium">{p.name || "Sem nome"}</p>
                          <p className="text-xs text-muted-foreground">{p.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={role === "admin" ? "default" : "secondary"} className="gap-1">
                          {role === "admin" ? <ShieldCheck className="h-3 w-3" /> : <UserCheck className="h-3 w-3" />}
                          {role}
                        </Badge>
                        {!isSelf && (
                          <Button size="sm" variant="outline" onClick={() => toggleRole(p.id)} className="gap-1">
                            <Shield className="h-3 w-3" />
                            {role === "admin" ? "Remover Admin" : "Tornar Admin"}
                          </Button>
                        )}
                        <span className="text-xs text-muted-foreground hidden sm:inline">
                          {new Date(p.created_at).toLocaleDateString("pt-BR")}
                        </span>
                      </div>
                    </div>
                  );
                })}
                {profiles.length === 0 && <p className="text-sm text-muted-foreground">Nenhum usuário encontrado.</p>}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Content */}
        <TabsContent value="content">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ScrollText className="h-5 w-5" /> Pregações Salvas ({sermons.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {sermons.map((s) => (
                  <div key={s.id} className="flex items-center justify-between rounded-lg border border-border p-3">
                    <div>
                      <p className="font-medium text-sm">{s.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {s.tema} • {new Date(s.created_at).toLocaleDateString("pt-BR")}
                      </p>
                    </div>
                    <Button size="icon" variant="ghost" className="text-destructive" onClick={() => deleteSermon(s.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                {sermons.length === 0 && <p className="text-sm text-muted-foreground">Nenhuma pregação.</p>}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" /> Devocionais Salvos ({devotionals.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {devotionals.map((d) => (
                  <div key={d.id} className="flex items-center justify-between rounded-lg border border-border p-3">
                    <div>
                      <p className="font-medium text-sm">{d.date_label}</p>
                      <p className="text-xs text-muted-foreground line-clamp-1">
                        {d.content.substring(0, 80)}...
                      </p>
                    </div>
                    <Button size="icon" variant="ghost" className="text-destructive" onClick={() => deleteDevotional(d.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                {devotionals.length === 0 && <p className="text-sm text-muted-foreground">Nenhum devocional.</p>}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Preachers */}
        <TabsContent value="preachers">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Cadastrar Pregador</CardTitle>
                <CardDescription>Adicione perfis de pregadores à plataforma.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Input
                    placeholder="Nome *"
                    value={newPreacher.name}
                    onChange={(e) => setNewPreacher((p) => ({ ...p, name: e.target.value }))}
                  />
                  <Input
                    placeholder="Igreja"
                    value={newPreacher.church}
                    onChange={(e) => setNewPreacher((p) => ({ ...p, church: e.target.value }))}
                  />
                  <Input
                    placeholder="Cidade"
                    value={newPreacher.city}
                    onChange={(e) => setNewPreacher((p) => ({ ...p, city: e.target.value }))}
                  />
                  <div />
                  <Textarea
                    placeholder="Biografia"
                    className="sm:col-span-2"
                    value={newPreacher.bio}
                    onChange={(e) => setNewPreacher((p) => ({ ...p, bio: e.target.value }))}
                  />
                </div>
                <Button className="mt-4 bg-gradient-gold text-background hover:opacity-90 gap-1" onClick={addPreacher} disabled={addingPreacher}>
                  {addingPreacher ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                  Adicionar Pregador
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Church className="h-5 w-5" /> Pregadores Cadastrados ({preachers.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {preachers.map((p) => (
                  <div key={p.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-lg border border-border p-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{p.name}</p>
                        <Badge variant={p.active ? "default" : "secondary"}>
                          {p.active ? "Ativo" : "Inativo"}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {[p.church, p.city].filter(Boolean).join(" • ") || "Sem informações adicionais"}
                      </p>
                      {p.bio && <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{p.bio}</p>}
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => togglePreacher(p.id, p.active)}>
                        {p.active ? "Desativar" : "Ativar"}
                      </Button>
                      <Button size="icon" variant="ghost" className="text-destructive" onClick={() => deletePreacher(p.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
                {preachers.length === 0 && <p className="text-sm text-muted-foreground">Nenhum pregador cadastrado.</p>}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
