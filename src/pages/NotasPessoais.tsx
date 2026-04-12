import { useState } from "react";
import { PenLine, Plus, Trash2, Edit3, Search, BookOpen, Filter, Loader2, Save, X, StickyNote } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { usePersonalNotes, NOTE_CATEGORIES, type PersonalNote } from "@/hooks/usePersonalNotes";

const NotasPessoais = () => {
  const { notes, loading, createNote, updateNote, deleteNote } = usePersonalNotes();
  const [search, setSearch] = useState("");
  const [filterCat, setFilterCat] = useState("todos");
  const [showForm, setShowForm] = useState(false);
  const [editingNote, setEditingNote] = useState<PersonalNote | null>(null);

  // Form state
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("geral");
  const [bibleRef, setBibleRef] = useState("");
  const [saving, setSaving] = useState(false);

  const openNew = () => {
    setEditingNote(null);
    setTitle("");
    setContent("");
    setCategory("geral");
    setBibleRef("");
    setShowForm(true);
  };

  const openEdit = (note: PersonalNote) => {
    setEditingNote(note);
    setTitle(note.title);
    setContent(note.content);
    setCategory(note.category);
    setBibleRef(note.bible_reference || "");
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!title.trim()) return;
    setSaving(true);
    if (editingNote) {
      await updateNote(editingNote.id, { title, content, category, bible_reference: bibleRef || null });
    } else {
      await createNote(title, content, category, bibleRef);
    }
    setSaving(false);
    setShowForm(false);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Tem certeza que deseja excluir esta nota?")) {
      await deleteNote(id);
    }
  };

  const filtered = notes.filter((n) => {
    const matchCat = filterCat === "todos" || n.category === filterCat;
    const q = search.toLowerCase();
    const matchSearch = !q || n.title.toLowerCase().includes(q) || n.content.toLowerCase().includes(q) || (n.bible_reference?.toLowerCase().includes(q) ?? false);
    return matchCat && matchSearch;
  });

  const catLabel = (val: string) => NOTE_CATEGORIES.find((c) => c.value === val)?.label ?? val;

  return (
    <div className="container py-8">
      <div className="mb-8 text-center">
        <h1 className="font-serif text-4xl font-bold mb-2">
          Notas <span className="text-gradient-gold">Pessoais</span>
        </h1>
        <p className="text-muted-foreground">Organize suas anotações, reflexões e estudos bíblicos.</p>
      </div>

      {/* Toolbar */}
      <div className="flex flex-wrap gap-3 mb-6 justify-between items-center">
        <div className="flex gap-2 flex-wrap">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar notas..."
              className="rounded-lg border border-input bg-background pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring w-64"
            />
          </div>
          <select
            value={filterCat}
            onChange={(e) => setFilterCat(e.target.value)}
            className="rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="todos">Todas categorias</option>
            {NOTE_CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </select>
        </div>
        <Button onClick={openNew} className="bg-gradient-gold text-background gap-1.5">
          <Plus className="h-4 w-4" /> Nova Nota
        </Button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <Card className="mb-6 border-accent/30 shadow-celestial">
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-serif text-lg font-semibold">
                {editingNote ? "Editar Nota" : "Nova Nota"}
              </h3>
              <Button variant="ghost" size="icon" onClick={() => setShowForm(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Título da nota..."
              className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              >
                {NOTE_CATEGORIES.map((c) => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
              <input
                type="text"
                value={bibleRef}
                onChange={(e) => setBibleRef(e.target.value)}
                placeholder="Referência bíblica (ex: João 3:16)"
                className="rounded-lg border border-input bg-background px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Escreva sua nota aqui..."
              rows={8}
              className="w-full rounded-lg border border-input bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-y"
            />
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowForm(false)}>Cancelar</Button>
              <Button onClick={handleSave} disabled={saving || !title.trim()} className="bg-gradient-gold text-background gap-1.5">
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                {editingNote ? "Salvar Alterações" : "Criar Nota"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Notes List */}
      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-accent" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20">
          <StickyNote className="h-16 w-16 mx-auto text-muted-foreground/30 mb-4" />
          <p className="text-muted-foreground font-medium">
            {notes.length === 0 ? "Nenhuma nota ainda" : "Nenhuma nota encontrada"}
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            {notes.length === 0 ? "Crie sua primeira nota clicando no botão acima." : "Tente outro termo de busca."}
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((note) => (
            <Card key={note.id} className="hover:shadow-celestial transition-all group">
              <CardContent className="p-5 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-serif font-semibold text-base leading-tight line-clamp-2">{note.title}</h3>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openEdit(note)}>
                      <Edit3 className="h-3.5 w-3.5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => handleDelete(note.id)}>
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
                <div className="flex gap-2 flex-wrap">
                  <Badge variant="secondary" className="text-xs">{catLabel(note.category)}</Badge>
                  {note.bible_reference && (
                    <Badge variant="outline" className="text-xs gap-1">
                      <BookOpen className="h-3 w-3" />
                      {note.bible_reference}
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground line-clamp-4 whitespace-pre-wrap">{note.content}</p>
                <p className="text-xs text-muted-foreground/60">
                  {new Date(note.updated_at).toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default NotasPessoais;
