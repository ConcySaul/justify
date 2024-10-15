import { Request, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import dotenv from 'dotenv';
import { validateRequest } from '../utils/validate-request';
import { plainTextSchema } from './justify-schema';
import { justifyText } from './justify-service';

dotenv.config();

export const justify = async (req: Request, res: Response): Promise<void> => {
    try {
        const { body } = req;
        if (!await validateRequest(plainTextSchema, body)) {
            res.status(400).json({'message': 'Bad Request'});
            return;
        }
        const secretKey = process.env.JWT_SECRET_KEY;
        if (!secretKey) {
            res.status(500).json({'message': 'Internal Server Error'});
            return;
        }

        let token = req.cookies['token'];
        if (!token) {
            token = req.headers['authorization'];
            if (token) {
                const splitedAuthHeader = token.split(' ');
                if (splitedAuthHeader.length !== 2 || splitedAuthHeader[0] !== 'Bearer') {
                    res.status(401).json({ 'message': 'Unauthorized' });
                    return;
                }
            }
        }
        if (!token) {
            res.status(401).json({ 'message': 'Unauthorized' });
            return;
        }

        const decodedToken =  jwt.verify(token, secretKey);
        if (typeof decodedToken === 'string') {
            res.status(401).json({ 'message': 'Unauthorized'});
            return;
        }
        const result = await justifyText(decodedToken.email, body);
        if (!result.success) {
            res.status(402).json({ 'message': 'Need Payment' });
            return;
        }
        res.status(200).send(result.text);
    } catch (error) {
        res.status(500).json({'message': 'Internal Server Error'});
    }
}