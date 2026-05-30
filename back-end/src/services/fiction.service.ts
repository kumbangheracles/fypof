import { GoogleGenerativeAI } from "@google/generative-ai";
import { AppError } from "../middlewares/errorhandler.middleware";
// import { GoogleGenAI } from "@google/genai";
import { HfInference } from "@huggingface/inference";
import { FormDataTypes } from "../types/fiction.type";
const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey as string);
// const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY as string });
const hf = new HfInference(process.env.HUGGINGFACE_API_KEY);
// function buildIntensityDesc(level: number): string {
//   if (level <= 3)
//     return "sparse, minimal — every word chosen like a stone. Short sentences. Negative space.";
//   if (level <= 6)
//     return "balanced and lyrical — flowing prose with deliberate imagery and rhythm.";
//   return "baroque and ornate — maximalist sentences that spiral and bloom, stacked metaphors, breathless subordinate clauses.";
// }

function buildPrompt(input: FormDataTypes): string {
  const {
    opening_sentence,
    genre_and_world = "literary fiction",
    protagonist_feel = "an unnamed wanderer",
    antagonist_feel = "the weight of memory",
    color_palette,
    atmosphere = ["melancholic"],
    one_secret_story_holds = "nothing is as it seems",
    language,
  } = input;

  const moodStr = atmosphere.join(", ");
  const colorStr = color_palette?.join(", ") ?? "muted gold and deep violet";

  return `You are a master literary author. Write a PEAK FICTION passage in ${language}.

BRIEF:
- Premise: "${opening_sentence}"
- Genre: ${genre_and_world}
- Protagonist: ${protagonist_feel}
- Tension: ${antagonist_feel}
- Color palette: ${colorStr} — weave these as poetic metaphor and atmosphere, not literal description
- Mood: ${moodStr}
- Secret: ${one_secret_story_holds}

OUTPUT FORMAT:
- Exactly 3 paragraphs
- Each paragraph 120–150 words
- Total: ~400 words
- Begin directly with the fiction, no preamble
- No fourth wall breaks`;
}

function hexToColorName(hex: string): string {
  const h = hex.toLowerCase().replace("#", "");
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);

  if (r > 200 && g < 100 && b < 100) return "vivid crimson red";
  if (r > 200 && g > 150 && b < 100) return "warm golden amber";
  if (r > 200 && g > 200 && b < 100) return "bright sulfur yellow";
  if (r < 100 && g > 150 && b < 100) return "deep forest green";
  if (r < 100 && g > 200 && b > 150) return "vivid teal cyan";
  if (r < 100 && g < 100 && b > 200) return "deep royal blue";
  if (r > 150 && g < 100 && b > 200) return "rich violet purple";
  if (r > 200 && g < 100 && b > 150) return "vivid magenta pink";
  if (r > 180 && g > 180 && b > 180) return "bright silver white";
  if (r < 80 && g < 80 && b < 80) return "deep charcoal black";
  if (r > 150 && g > 100 && b < 80) return "warm burnt sienna";
  if (r < 100 && g > 150 && b > 200) return "sky blue cerulean";
  if (r > 200 && g > 150 && b > 100) return "soft peach cream";
  if (r > 100 && g < 80 && b < 80) return "dark maroon";
  if (r < 80 && g > 100 && b > 150) return "deep ocean blue";
  if (r > 180 && g > 120 && b < 60) return "golden ochre";
  if (r > 150 && g > 150 && b > 200) return "soft lavender";
  if (r < 60 && g < 80 && b > 120) return "midnight navy";

  const brightness = (r + g + b) / 3;
  if (brightness > 200) return "pale ivory white";
  if (brightness > 150) return "soft muted gray";
  if (brightness > 80) return "medium dusty tone";
  return "deep dark shadow";
}

function buildImagePrompt(input: FormDataTypes): string {
  const {
    opening_sentence,
    genre_and_world = "literary fiction",
    protagonist_feel = "an unnamed wanderer",
    antagonist_feel = "the weight of memory",
    color_palette,
    atmosphere = ["melancholic"],
    one_secret_story_holds = "nothing is as it seems",
  } = input;

  const moodStr = atmosphere.join(", ");

  const colorNames = (color_palette ?? ["#c9a96e", "#4a2c6e"])
    .map((hex) => hexToColorName(hex))
    .join(" and ");

  const sceneDescription = [
    opening_sentence ? `scene inspired by: "${opening_sentence}"` : null,
    `a ${genre_and_world} story`,
    `main character: ${protagonist_feel}`,
    `central conflict: ${antagonist_feel}`,
    `hidden undertone: ${one_secret_story_holds}`,
  ]
    .filter(Boolean)
    .join(", ");

  return [
    "2D anime illustration",
    "anime key visual",
    "light novel cover art",
    "Studio Ghibli painterly style",
    "Makoto Shinkai cinematic",
    "cel shaded, sharp lineart",
    "no text, no words, no letters, no watermark",

    sceneDescription,

    `emotional tone: ${moodStr}`,

    `dominant color: ${colorNames}`,
    `entire scene bathed in ${colorNames}`,
    `lighting and shadows in shades of ${colorNames}`,
    `color scheme: ${colorNames}, saturated and emotionally charged`,
    `background and foreground unified by ${colorNames} tones`,

    "portrait 3:4",
    "single central subject",
    "dramatic atmospheric background",
    "rule of thirds",
    "bokeh depth of field",

    "highly detailed",
    "professional anime studio quality",
    "sharp focus",

    "no text, no typhography, no letters, no numbers, no watermark, no signature, no 3D, no photorealistic, remember this is IMPORTANT!!",
  ]
    .filter(Boolean)
    .join(", ");
}

function buildImagePromptFromText(
  storyText: string,
  input: FormDataTypes,
): string {
  const {
    genre_and_world = "literary fiction",
    atmosphere = ["melancholic"],
    color_palette,
  } = input;
  console.log("Story get ===========: ", storyText);
  const moodStr = atmosphere.join(", ");
  const colorNames = (color_palette ?? ["#c9a96e", "#4a2c6e"])
    .map((hex) => hexToColorName(hex))
    .join(" and ");

  const storySummary = storyText
    .split(/[.!?]/)
    .map((s) => s.trim())
    .filter((s) => s.length > 20)
    .slice(0, 3)
    .join(". ");

  return [
    "2D anime illustration",
    "anime key visual",
    "light novel cover art",
    "Studio Ghibli painterly style",
    "Makoto Shinkai cinematic",
    "cel shaded, sharp lineart",
    "no text, no words, no letters, no watermark",

    `visualize this story scene: "${storySummary}"`,
    `genre: ${genre_and_world}`,

    `emotional tone: ${moodStr}`,

    `dominant color: ${colorNames}`,
    `entire scene bathed in ${colorNames}`,
    `lighting and shadows in shades of ${colorNames}`,
    `color scheme: ${colorNames}, saturated and emotionally charged`,

    "portrait 3:4",
    "single central subject",
    "dramatic atmospheric background",
    "rule of thirds",
    "bokeh depth of field",
    "highly detailed",
    "professional anime studio quality",
    "sharp focus",

    "no text, no typhography, no letters, no numbers, no watermark, no signature, no 3D, no photorealistic, remember this is IMPORTANT!!",
  ]
    .filter(Boolean)
    .join(", ");
}

const HF_MODELS = [
  "Tongyi-MAI/Z-Image-Turbo",
  "black-forest-labs/FLUX.1-schnell",
  "stabilityai/stable-diffusion-xl-base-1.0",
];

async function generateWithHuggingFace(prompt: string): Promise<string> {
  for (const model of HF_MODELS) {
    try {
      console.log(`Trying HF model: ${model}`);
      const result = await hf.textToImage({
        model,
        inputs: prompt,
        parameters: {
          negative_prompt:
            "text, letters, typography, watermark, blurry, low quality, low resolution, amateur, signature, words, numbers",
          width: 768,
          height: 1024,
          num_inference_steps: 25,
          guidance_scale: 7.5,
        },
      });

      let base64: string;
      if (typeof result === "string") {
        base64 = result;
      } else {
        const buffer = await (result as Blob).arrayBuffer();
        base64 = Buffer.from(buffer).toString("base64");
      }

      return `data:image/jpeg;base64,${base64}`;
    } catch (err: any) {
      const isQuota =
        err?.message?.includes("402") ||
        err?.message?.includes("credits") ||
        err?.message?.includes("depleted") ||
        err?.message?.includes("quota") ||
        err?.httpResponse?.status === 402;

      if (isQuota) {
        console.warn(`HF model ${model} quota habis, coba berikutnya...`);
        continue;
      }

      throw err;
    }
  }

  throw new Error("ALL_HF_QUOTA_EXCEEDED");
}

async function generateWithPollinations(prompt: string): Promise<string> {
  const encoded = encodeURIComponent(prompt);
  const imageUrl = `https://image.pollinations.ai/prompt/${encoded}?width=768&height=768&nologo=true&model=flux&enhance=true&seed=${Math.floor(Math.random() * 999999)}`;

  const res = await fetch(imageUrl);
  if (!res.ok) throw new AppError(502, "Pollinations gagal generate image.");

  const buffer = await res.arrayBuffer();
  const base64 = Buffer.from(buffer).toString("base64");
  return `data:image/jpeg;base64,${base64}`;
}

export async function generateFictionCover(
  input: FormDataTypes,
): Promise<string> {
  const prompt = buildImagePrompt(input);

  try {
    return await generateWithHuggingFace(prompt);
  } catch (err: any) {
    if (err?.message === "ALL_HF_QUOTA_EXCEEDED") {
      console.warn("Semua HF model habis quota, fallback ke Pollinations...");
      return await generateWithPollinations(prompt);
    }
    console.error("Image generation error:", err);
    throw new AppError(502, "Gagal generate cover image.");
  }
}

export async function generateFictionCoverWithText(
  input: FormDataTypes,
  storyText: string = "",
): Promise<string> {
  const prompt = storyText
    ? buildImagePromptFromText(storyText, input)
    : buildImagePrompt(input);

  try {
    return await generateWithHuggingFace(prompt);
  } catch (err: any) {
    if (err?.message === "ALL_HF_QUOTA_EXCEEDED") {
      console.warn("Fallback ke Pollinations...");
      return await generateWithPollinations(prompt);
    }
    throw new AppError(502, "Gagal generate cover image.");
  }
}

export async function streamFiction(
  input: FormDataTypes,
  onChunk: (text: string) => void,
): Promise<void> {
  if (!process.env.GEMINI_API_KEY) {
    throw new AppError(500, "GEMINI_API_KEY is not configured.");
  }

  const prompt = buildPrompt(input);

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

    const result = await model.generateContentStream(prompt);

    for await (const chunk of result.stream) {
      const chunkText = chunk.text();
      if (chunkText) {
        onChunk(chunkText);
      }
    }
  } catch (err: any) {
    console.error("Gemini stream error:", err);

    if (
      err.status === 429 ||
      err.message?.includes("429") ||
      err.message?.includes("quota")
    ) {
      throw new AppError(
        429,
        "Batas limit kuota Gemini tercapai. Silakan tunggu beberapa saat.",
      );
    }

    throw new AppError(502, "Failed to reach AI service.");
  }
}
