import express from 'express';
import { getToken } from './authentication/auth-controller';

const app = express();

app.use(express.json());
app.use(express.text());

const PORT = process.env.PORT || 3000;

app.post('/api/token', (req, res) => {
    getToken(req, res);
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});