import express from 'express';
import { getToken } from './authentication/auth-controller';
import cookieParser from 'cookie-parser';
import { justify } from './justify/justify-controller';
import { authMiddleware } from './middleware/auth-middleware';


const app = express();

app.use(express.json());
app.use(express.text());
app.use(cookieParser());

const PORT = process.env.PORT || 3000;

app.post('/api/token', (req, res) => {
    getToken(req, res);
});

app.post('/api/justify', authMiddleware, (req, res) => {
    justify(req, res);
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});