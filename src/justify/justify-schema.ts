import { z } from 'zod';

export const plainTextSchema = z.string().min(1, "Text can't be empty").refine(val => val !== undefined, {message: "Text is required"});