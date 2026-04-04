import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const VOICES: Record<string, { id: string; label: string }> = {
  "sarah": { id: "EXAVITQu4vr4xnSDxMaL", label: "Sarah (Feminina)" },
  "laura": { id: "FGY2WhTYpPnrIDTdsKH5", label: "Laura (Feminina)" },
  "alice": { id: "Xb7hH8MSUJpSbSDYk0k2", label: "Alice (Feminina)" },
  "jessica": { id: "cgSgspJ2msm6clMCkdW9", label: "Jessica (Feminina)" },
  "lily": { id: "pFZP5JQG7iQjIQuC4Bku", label: "Lily (Feminina)" },
  "matilda": { id: "XrExE9yKIg1WjnnlVkGX", label: "Matilda (Feminina)" },
  "roger": { id: "CwhRBWXzGAHq8TQ4Fs17", label: "Roger (Masculina)" },
  "george": { id: "JBFqnCBsd6RMkjVDRZzb", label: "George (Masculina)" },
  "charlie": { id: "IKne3meq5aSn9XLyUdCD", label: "Charlie (Masculina)" },
  "daniel": { id: "onwK4e9ZLuTAKqWW03F9", label: "Daniel (Masculina)" },
  "liam": { id: "TX3LPaxmHKxFdv7VOQHJ", label: "Liam (Masculina)" },
  "brian": { id: "nPczCjzI2devNBz1zQrb", label: "Brian (Masculina)" },
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const apiKey = Deno.env.get("ELEVENLABS_API_KEY");
    if (!apiKey) {
      return new Response(JSON.stringify({ error: "ElevenLabs API key not configured" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { text, voice = "sarah", speed = 1.0 } = await req.json();

    if (!text || typeof text !== "string" || text.trim().length === 0) {
      return new Response(JSON.stringify({ error: "Text is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const cleanText = text.replace(/[#*_]/g, "").trim().slice(0, 5000);
    const voiceConfig = VOICES[voice] || VOICES["sarah"];
    const speakingRate = Math.max(0.7, Math.min(1.2, Number(speed) || 1.0));

    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${voiceConfig.id}?output_format=mp3_44100_128`,
      {
        method: "POST",
        headers: {
          "xi-api-key": apiKey,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: cleanText,
          model_id: "eleven_multilingual_v2",
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.75,
            style: 0.5,
            use_speaker_boost: true,
            speed: speakingRate,
          },
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.text();
      console.error("ElevenLabs TTS error:", response.status, errorData);
      return new Response(JSON.stringify({ error: "Failed to generate audio", details: response.status }), {
        status: 502,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const audioBuffer = await response.arrayBuffer();

    return new Response(audioBuffer, {
      headers: {
        ...corsHeaders,
        "Content-Type": "audio/mpeg",
      },
    });
  } catch (error) {
    console.error("TTS error:", error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
