import request from 'supertest';
import express from 'express';
import { justify } from './justify-controller';
import cookieParser from 'cookie-parser';

const app = express();
app.use(express.text());
app.use(cookieParser());
app.post('/api/justify', justify);

describe('POST /api/justify', () => {
    it('should return 401 if no token is provided', async () => {
        const response = await request(app)
            .post('/api/justify')
            .set('Content-Type', 'text/plain')
            .send('Valid text to justify');
        expect(response.status).toBe(401);
        expect(response.body.message).toBe('Unauthorized');
    });
    
    it('should return 400 if request validation fails', async () => {
        const response = await request(app)
            .post('/api/justify')
            .set('Content-Type', 'text/plain')
            .send('');
        expect(response.status).toBe(400);
        expect(response.body.message).toBe('Bad Request');
    });

    it('should return 500 if JWT_SECRET_KEY is not defined', async () => {
        process.env.JWT_SECRET_KEY = '';
        const response = await request(app)
            .post('/api/justify')
            .set('Content-Type', 'text/plain')
            .send('A valid text to justify');
        expect(response.status).toBe(500);
        expect(response.body.message).toBe('Internal Server Error');
    });
});
