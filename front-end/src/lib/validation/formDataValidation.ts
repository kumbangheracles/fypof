import { FormDataTypes } from "@/types/formData.type";
import * as z from "zod";

export const FormDataSchema: z.ZodType<FormDataTypes> = z.object({
  opening_sentence: z.string().min(10, "Opening sentence too short"),

  genre_and_world: z
    .string()
    .min(5, "Input atleast 3 genre/world building style"),

  protagonist_feel: z.string(),

  antagonist_feel: z.string(),

  color_palette: z.array(z.string()).min(1, "Choose atleast 1 color palette"),

  atmosphere: z.array(z.string()).min(2, "Choose atleast 2 atmosphere"),

  one_secret_story_holds: z.string(),

  language: z.string(),
});
