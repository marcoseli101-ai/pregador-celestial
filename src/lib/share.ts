import { toast } from "sonner";

const cleanText = (t: string) => t.replace(/[#*_]/g, "").trim();

/**
 * Shares full content using the device native share sheet when available,
 * otherwise falls back to WhatsApp. For long content that exceeds WhatsApp's
 * URL limit, copies the full text to the clipboard so nothing is truncated.
 */
export async function shareContent(rawContent: string, title?: string) {
  const text = cleanText(rawContent);
  const message = title ? `*${title}*\n\n${text}` : text;

  const nav = navigator as Navigator & { share?: (data: ShareData) => Promise<void> };
  if (nav.share) {
    try {
      await nav.share({ title: title ?? "Pregador Pro", text: message });
      return;
    } catch {
      // user cancelled or share failed → fall through to WhatsApp
    }
  }

  await openWhatsApp(message);
}

async function openWhatsApp(message: string) {
  const MAX = 1800;
  if (message.length <= MAX) {
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, "_blank");
    return;
  }
  try {
    await navigator.clipboard.writeText(message);
    toast.success("Texto completo copiado! Cole no WhatsApp para enviar.");
    const preview = `${message.slice(0, 300)}...\n\n(Conteúdo completo copiado — cole aqui no WhatsApp)`;
    window.open(`https://wa.me/?text=${encodeURIComponent(preview)}`, "_blank");
  } catch {
    window.open(`https://wa.me/?text=${encodeURIComponent(message.slice(0, MAX))}`, "_blank");
  }
}