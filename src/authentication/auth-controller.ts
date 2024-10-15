import { Request, Response } from 'express';

import { generateToken } from "./auth-service";
import { validateRequest } from '../utils/validate-request';
import { authSchema } from './auth-schema';

export const getToken = async (req: Request, res: Response): Promise<void> => {
    try {
        const { body } = req;
        if (!await validateRequest(authSchema, body)) {
            res.status(400).json({'message': 'Bad Request'});
            return ;
        }
        const token =  await generateToken(body.email);
        res.cookie('token', token, {
            httpOnly: true,
            secure: false,
            maxAge: 6 * 60 * 60 * 1000,
        });
        res.status(200).json({
            'message': 'OK',
            token
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({'message': 'Internal Server Error'});
    }
}

