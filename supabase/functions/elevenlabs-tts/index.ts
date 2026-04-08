import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const apiKey = Deno.env.get("POLLINATIONS_API_KEY");
    if (!apiKey) {
      return new Response(JSON.stringify({ error: "POLLINATIONS_API_KEY not configured" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { text, voice = "daniel", speed = 0.95 } = await req.json();

    if (!text || typeof text !== "string" || text.trim().length === 0) {
      return new Response(JSON.stringify({ error: "Text is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const cleanText = text.replace(/[#*_]/g, "").trim().slice(0, 5000);
    const speakingRate = Math.max(0.5, Math.min(2.0, Number(speed) || 0.95));

    console.log(`Generating audio: voice=${voice}, speed=${speakingRate}, textLen=${cleanText.length}`);

    const response = await fetch("https://gen.pollinations.ai/v1/audio/speech", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "elevenlabs",
        input: cleanText,
        voice: voice,
        response_format: "mp3",
        speed: speakingRate,
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error("Pollinations TTS error:", response.status, errorData);
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
