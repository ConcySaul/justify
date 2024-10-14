import request from 'supertest';
import express from 'express';
import cookieParser from 'cookie-parser';
import { getToken } from './auth-controller';
import { generateToken } from './auth-service';

const app = express();
app.use(express.json());
app.use(cookieParser());
app.post('/api/token', getToken);

jest.mock('./auth-service', () => ({
    generateToken: jest.fn(),
}));

describe('POST /api/token', () => {
    it('should return 400 if request validation fails', async () => {
        const response = await request(app)
            .post('/api/token')
            .set('Content-Type', 'application/json')
            .send({});
        expect(response.status).toBe(400);
        expect(response.body.message).toBe('Bad Request');
    });

    it('should return 200 and a json with Ok message and a token if everything is fine', async () => {
        (generateToken as jest.Mock).mockResolvedValue('mockToken');
        
        const response = await request(app)
        .post('/api/token')
        .set('Content-Type', 'application/json')
        .send({'email': 'foo@bar.com'});

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
        message: 'OK',
        token: 'mockToken',
    });
    })

    it('should return 500 if an error occurs', async () => {
        (generateToken as jest.Mock).mockImplementation(() => {
            throw new Error('Some error');
        });        

        const response = await request(app)
            .post('/api/token')
            .send({ email: 'test@example.com' });

        expect(response.status).toBe(500);
        expect(response.body).toEqual({ message: 'Internal Server Error' });
    })
});