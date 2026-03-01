import { useState } from "react";
import { Copy, Share2, FileDown, Volume2, Save, Presentation } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import jsPDF from "jspdf";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { SlideGeneratorModal } from "./SlideGeneratorModal";
import { AudioPlayerModal } from "./AudioPlayerModal";

interface ContentActionsProps {
  content: string;
  title?: string;
  contentType?: string;
  compact?: boolean;
  className?: string;
  hideSave?: boolean;
}

export function ContentActions({ content, title = "Pregador Pro", contentType = "geral", compact = false, className = "", hideSave = false }: ContentActionsProps) {
  const { user } = useAuth();
  const [isSaving, setIsSaving] = useState(false);
  const [slidesOpen, setSlidesOpen] = useState(false);
  const [audioOpen, setAudioOpen] = useState(false);

  const cleanText = (text: string) => text.replace(/[#*_]/g, "").trim();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(cleanText(content));
      toast.success("Texto copiado!");
    } catch {
      toast.error("Erro ao copiar texto.");
    }
  };

  const handleWhatsApp = () => {
    const text = cleanText(content).slice(0, 2000);
    const message = title ? `*${title}*\n\n${text}` : text;
    const url = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
  };

  const handlePDF = () => {
    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      const margin = 20;
      const maxWidth = pageWidth - margin * 2;
      let y = 20;

      doc.setFont("helvetica", "bold");
      doc.setFontSize(18);
      const titleLines = doc.splitTextToSize(title, maxWidth);
      doc.text(titleLines, margin, y);
      y += titleLines.length * 8 + 5;

      doc.setDrawColor(200, 170, 80);
      doc.setLineWidth(0.5);
      doc.line(margin, y, pageWidth - margin, y);
      y += 10;

      doc.setFont("helvetica", "normal");
      doc.setFontSize(11);
      const clean = cleanText(content);
      const lines = doc.splitTextToSize(clean, maxWidth);

      for (const line of lines) {
        if (y > doc.internal.pageSize.getHeight() - 20) {
          doc.addPage();
          y = 20;
        }
        doc.text(line, margin, y);
        y += 6;
      }

      const pageCount = doc.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(150);
        doc.text("Pregador Pro · pregadorpro.com", margin, doc.internal.pageSize.getHeight() - 10);
        doc.text(`Página ${i}/${pageCount}`, pageWidth - margin - 20, doc.internal.pageSize.getHeight() - 10);
      }

      const filename = `${title.replace(/[^a-zA-Z0-9À-ú ]/g, "").trim().replace(/\s+/g, "_")}.pdf`;
      doc.save(filename);
      toast.success("PDF gerado com sucesso!");
    } catch {
      toast.error("Erro ao gerar PDF.");
    }
  };

  const handleSave = async () => {
    if (!user) {
      toast.error("Faça login para salvar conteúdos.");
      return;
    }
    setIsSaving(true);
    const { error } = await supabase.from("saved_content").insert({
      user_id: user.id,
      title,
      content,
      content_type: contentType,
    });
    if (error) {
      console.error(error);
      toast.error("Erro ao salvar conteúdo.");
    } else {
      toast.success("Salvo na Área do Pregador!");
    }
    setIsSaving(false);
  };

  if (!content) return null;

  if (compact) {
    return (
      <div className={`flex gap-1 ${className}`}>
        <Button variant="ghost" size="icon" onClick={handleCopy} title="Copiar">
          <Copy className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" onClick={handleWhatsApp} title="WhatsApp">
          <Share2 className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" onClick={handlePDF} title="Gerar PDF">
          <FileDown className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" onClick={() => setAudioOpen(true)} title="Ouvir">
          <Volume2 className="h-4 w-4" />
        </Button>
        {!hideSave && (
          <Button variant="ghost" size="icon" onClick={handleSave} disabled={isSaving} title="Salvar na Área do Pregador">
            <Save className="h-4 w-4" />
          </Button>
        )}
        <Button variant="ghost" size="icon" onClick={() => setSlidesOpen(true)} title="Gerar Slides">
          <Presentation className="h-4 w-4" />
        </Button>
        <SlideGeneratorModal content={content} open={slidesOpen} onClose={() => setSlidesOpen(false)} />
        <AudioPlayerModal content={content} open={audioOpen} onClose={() => setAudioOpen(false)} />
      </div>
    );
  }

  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      <Button variant="outline" size="sm" onClick={handleCopy} className="gap-1.5">
        <Copy className="h-4 w-4" /> Copiar
      </Button>
      <Button variant="outline" size="sm" onClick={handleWhatsApp} className="gap-1.5">
        <Share2 className="h-4 w-4" /> WhatsApp
      </Button>
      <Button variant="outline" size="sm" onClick={handlePDF} className="gap-1.5">
        <FileDown className="h-4 w-4" /> Gerar PDF
      </Button>
      <Button variant="outline" size="sm" onClick={() => setAudioOpen(true)} className="gap-1.5">
        <Volume2 className="h-4 w-4" /> Ouvir
      </Button>
      {!hideSave && (
        <Button variant="outline" size="sm" onClick={handleSave} disabled={isSaving} className="gap-1.5">
          <Save className="h-4 w-4" /> Salvar
        </Button>
      )}
      <Button variant="outline" size="sm" onClick={() => setSlidesOpen(true)} className="gap-1.5">
        <Presentation className="h-4 w-4" /> Slides
      </Button>
      <SlideGeneratorModal content={content} open={slidesOpen} onClose={() => setSlidesOpen(false)} />
      <AudioPlayerModal content={content} open={audioOpen} onClose={() => setAudioOpen(false)} />
    </div>
  );
}
