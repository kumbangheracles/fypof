import * as z from "zod";
import { FormDataTypes } from "../types/fiction.type";
import * as Yup from "yup";
export const FormDataSchema: z.ZodType<FormDataTypes> = z.object({
  opening_sentence: z.string().min(10, "Opening sentence terlalu pendek"),

  genre_and_world: z.string().min(1),

  protagonist_feel: z.string(),

  antagonist_feel: z.string(),

  color_palette: z.array(z.string()).min(1, "Pilih minimal 1 warna"),

  atmosphere: z.array(z.string()).min(2, "Pilih minimal 2 atmosphere"),

  one_secret_story_holds: z.string(),

  language: z.string(),
});

export const FictionValidation = Yup.object<FormDataTypes>({
  opening_sentence: Yup.string()
    .required()
    .min(10, "Opening sentence terlalu pendek"),

  genre_and_world: Yup.string().required(),
  protagonist_feel: Yup.string().required(),
  antagonist_feel: Yup.string().required(),
  color_palette: Yup.array().required().min(1, "Pilih minimal 1 warna"),
  one_secret_story_holds: Yup.string().required(),
  language: Yup.string().required(),
});
