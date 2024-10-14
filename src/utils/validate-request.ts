import { ZodSchema } from "zod";
import { Auth } from "../authentication/auth-type";

type Data = Auth | string;

export const validateRequest = async (schema: ZodSchema, data: Data): Promise<Boolean> => {
    let parseResult;
    try {
        parseResult = schema.safeParse(data);
        if (!parseResult?.success) {
            return false;
        }
        return true;
    } catch (error) {
        return false;
    }
}