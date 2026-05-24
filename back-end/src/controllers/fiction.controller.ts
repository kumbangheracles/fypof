import { NextFunction, Request, Response } from "express";
import {
  FictionValidation,
  FormDataSchema,
} from "../validation/fiction.validation";
import { z } from "zod";
import { AppError } from "../middlewares/errorhandler.middleware";
import { streamFiction } from "../services/fiction.service";
type FictionRequest = z.infer<typeof FormDataSchema>;
const generateFiction = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const parsed = FormDataSchema.safeParse(req.body);
  if (!parsed.success) {
    const message = parsed?.error?.message;
    return next(new AppError(400, message));
  }

  const input: FictionRequest = parsed.data;

  res.setHeader("Content-Type", "text/event-stream; charset=utf-8");
  res.setHeader("Cache-Control", "no-cache");
  res.flushHeaders();

  const keepAlive = setInterval(() => res.write(": ping\n\n"), 15_000);

  try {
    await streamFiction(input, (chunk) => {
      res.write(`data: ${JSON.stringify({ text: chunk })}\n\n`);
    });

    res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
  } catch (err) {
    clearInterval(keepAlive);

    if (err instanceof AppError) {
      res.write(`data: ${JSON.stringify({ error: err.message })}\n\n`);
      res.end();
      return;
    }

    res.write(`data: ${JSON.stringify({ error: "Unexpected error." })}\n\n`);
    res.end();
    next(err);
    return;
  }

  clearInterval(keepAlive);
  res.end();
};

export default {
  async createFiction(req: Request, res: Response) {
    const {
      opening_sentence,
      genre_and_world,
      protagonist_feel,
      antagonist_feel,
      color_palette,
      atmosphere,
      one_secret_story_holds,
      language,
    } = req.body;
    try {
      await FictionValidation.validate({
        opening_sentence,
        genre_and_world,
        protagonist_feel,
        antagonist_feel,
        color_palette,
        atmosphere,
        one_secret_story_holds,
        language,
      });

      console.log("Data Created: ", {
        opening_sentence,
        genre_and_world,
        protagonist_feel,
        antagonist_feel,
        color_palette,
        atmosphere,
        one_secret_story_holds,
        language,
      });

      res.status(200).json({
        message: "Success",
        result: "Data berhasil dibuat",
      });
    } catch (error) {
      const err = error as Error;
      console.log("error: ", err);
      res.status(400).json({
        message: err.message,
        data: null,
      });
    }
  },

  generateFiction,
};
