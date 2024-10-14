import { z } from 'zod';

export const authSchema = z.object({
    email: z.string().email('Invalid email address').refine(val => val !== undefined, {message: "Email is required"}),
})