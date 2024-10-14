import { Request, Response, NextFunction } from 'express';

export const authMiddleware = (req: Request, res: Response, next: NextFunction): void => {
    const cookie = req.cookies['token'];
    
    if (cookie) {
        return next();
    }

    const authHeader = req.headers['authorization'];

    if (authHeader) {
        const splitedAuthHeader = authHeader.split(' ');
        if (splitedAuthHeader.length === 2 && splitedAuthHeader[0] === 'Bearer') {
            return next();
        }
    }
    res.status(401).json({ message: 'Not authorized' });
}