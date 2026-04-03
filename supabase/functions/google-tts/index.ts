import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const GOOGLE_TTS_URL = "https://texttospeech.googleapis.com/v1/text:synthesize";

const VOICES: Record<string, { name: string; ssmlGender: string }> = {
  "feminina-1": { name: "pt-BR-Wavenet-A", ssmlGender: "FEMALE" },
  "masculina-1": { name: "pt-BR-Wavenet-B", ssmlGender: "MALE" },
  "feminina-2": { name: "pt-BR-Neural2-A", ssmlGender: "FEMALE" },
  "masculina-2": { name: "pt-BR-Neural2-B", ssmlGender: "MALE" },
  "feminina-3": { name: "pt-BR-Neural2-C", ssmlGender: "FEMALE" },
  "feminina-studio": { name: "pt-BR-Studio-B", ssmlGender: "FEMALE" },
  "masculina-studio": { name: "pt-BR-Studio-C", ssmlGender: "MALE" },
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const apiKey = Deno.env.get("GOOGLE_CLOUD_TTS_API_KEY");
    if (!apiKey) {
      return new Response(JSON.stringify({ error: "Google Cloud TTS API key not configured" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { text, voice = "feminina-1", speed = 1.0 } = await req.json();

    if (!text || typeof text !== "string" || text.trim().length === 0) {
      return new Response(JSON.stringify({ error: "Text is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Limit text to 5000 chars (Google TTS limit)
    const cleanText = text.replace(/[#*_]/g, "").trim().slice(0, 5000);

    const voiceConfig = VOICES[voice] || VOICES["feminina-1"];
    const speakingRate = Math.max(0.25, Math.min(4.0, Number(speed) || 1.0));

    const response = await fetch(`${GOOGLE_TTS_URL}?key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        input: { text: cleanText },
        voice: {
          languageCode: "pt-BR",
          name: voiceConfig.name,
          ssmlGender: voiceConfig.ssmlGender,
        },
        audioConfig: {
          audioEncoding: "MP3",
          speakingRate,
          pitch: 0,
          volumeGainDb: 0,
        },
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error("Google TTS error:", response.status, errorData);
      return new Response(JSON.stringify({ error: "Failed to generate audio", details: response.status }), {
        status: 502,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await response.json();

    return new Response(JSON.stringify({ audioContent: data.audioContent }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("TTS error:", error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
