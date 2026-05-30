import dotenv from "dotenv";
dotenv.config();
export const DATABASE_URL: string = process.env.DATABASE_URL || "";
export const SECRET: string = process.env.SECRET || "";
export const CORS_ORIGIN_URL: string = process.env.CORS_ORIGIN_URL || "";
