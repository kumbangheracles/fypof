import { GoogleGenerativeAI } from "@google/generative-ai";
import { AppError } from "../middlewares/errorhandler.middleware";
import { GoogleGenAI } from "@google/genai";
import { FormDataTypes } from "../types/fiction.type";
const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey as string);
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY as string });
function buildIntensityDesc(level: number): string {
  if (level <= 3)
    return "sparse, minimal — every word chosen like a stone. Short sentences. Negative space.";
  if (level <= 6)
    return "balanced and lyrical — flowing prose with deliberate imagery and rhythm.";
  return "baroque and ornate — maximalist sentences that spiral and bloom, stacked metaphors, breathless subordinate clauses.";
}

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
  const intensityDesc = buildIntensityDesc(5);

  return `You are a master literary author. Write a PEAK FICTION passage — the single most beautiful, emotionally resonant paragraph this story could contain.

AUTHOR'S BRIEF:
- Opening / premise: "${opening_sentence}"
- Genre & world: ${genre_and_world}
- Protagonist feels like: ${protagonist_feel}
- Central tension / antagonist: ${antagonist_feel}
- Color palette: ${color_palette?.join(", ")} — weave these as poetic metaphor and atmosphere, not literal description
- Mood: ${moodStr}
- Prose style: ${intensityDesc}
- The secret this story holds: ${one_secret_story_holds}

Write 200–280 words. This is the passage that defines the whole novel — the one a reader underlines and returns to. The colors should bleed into the metaphors. The mood should saturate every sentence.

Rules:
- Begin directly with the fiction. No preamble, no titles, no labels, make atleast 5 paragraph, with every paragraph contains atleast 400-500 characters.
- Do not break the fourth wall.
- You may weave in Indonesian phrases if they add poetry.
- Make it extraordinary.
- Use Only ${language}'s language`;
}

export async function generateFictionCover(
  promptGambar: string,
): Promise<string> {
  try {
    const response = await ai.models.generateImages({
      model: "imagen-4.0-generate-001",
      prompt: promptGambar,
      config: {
        numberOfImages: 1,
        outputMimeType: "image/jpeg",
        aspectRatio: "3:4",
      },
    });

    if (response.generatedImages && response.generatedImages.length > 0) {
      const base64Image = response?.generatedImages[0]?.image?.imageBytes;
      return `data:image/jpeg;base64,${base64Image}`;
    }

    throw new Error("Tidak ada gambar yang berhasil dibuat oleh model.");
  } catch (err) {
    console.error("Gagal membuat gambar:", err);
    throw err;
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
