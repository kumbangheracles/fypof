import { FormDataTypes } from "@/types/formData.type";
import * as z from "zod";

export const FormDataSchema: z.ZodType<FormDataTypes> = z.object({
  opening_sentence: z.string().min(10, "Opening sentence terlalu pendek"),

  genre_and_world: z.string().min(1),

  protagonist_feel: z.string(),

  antagonist_feel: z.string(),

  color_palette: z.array(z.string()).min(1, "Pilih minimal 1 warna"),

  atmosphere: z.array(z.string()).min(2, "Pilih minimal 2 atmosphere"),

  one_secret_story_holds: z.string(),
});
