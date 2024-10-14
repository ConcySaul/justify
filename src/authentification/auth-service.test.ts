import { generateToken } from './auth-service';
import { saveUser, getUserByEmail } from '../user/user-repository';
import jwt from 'jsonwebtoken';

jest.mock('../user/user-repository', () => ({
    saveUser: jest.fn(),
    getUserByEmail: jest.fn(),
}));

jest.mock('jsonwebtoken', () => ({
    sign: jest.fn(),
}));

describe('generateToken', () => {
    const email = 'test@example.com';

    beforeEach(() => {
        jest.clearAllMocks();
        process.env.JWT_SECRET_KEY = 'mockSecretKey';
    });

    it('should generate a token for an existing user', async () => {
        const mockUser = { id: 1, email: 'foo@bar.com' };
        (getUserByEmail as jest.Mock).mockResolvedValue(mockUser);
        (jwt.sign as jest.Mock).mockResolvedValue('mockToken');

        const token = await generateToken(email);

        expect(getUserByEmail).toHaveBeenCalledWith(email);
        expect(jwt.sign).toHaveBeenCalledWith(
            { id: mockUser.id, email: mockUser.email },
            process.env.JWT_SECRET_KEY,
            { expiresIn: '6h' }
        );
        expect(token).toBe('mockToken');
    });

    it('should create a new user and generate a token if user does not exist', async () => {
        (getUserByEmail as jest.Mock).mockResolvedValue(null);
        const newUser = { id: 2, email: 'foo@bar.com' };
        (saveUser as jest.Mock).mockResolvedValue(newUser);
        (jwt.sign as jest.Mock).mockResolvedValue('mockToken');

        const token = await generateToken(email);

        expect(getUserByEmail).toHaveBeenCalledWith(email);
        expect(saveUser).toHaveBeenCalledWith(email);
        expect(jwt.sign).toHaveBeenCalledWith(
            { id: newUser.id, email: newUser.email },
            process.env.JWT_SECRET_KEY,
            { expiresIn: '6h' }
        );
        expect(token).toBe('mockToken');
    });

    it('should throw an error if no JWT secret key is found', async () => {
        delete process.env.JWT_SECRET_KEY; // Supprime la clé secrète

        await expect(generateToken(email)).rejects.toThrow('No jwt secret found');
    });
});
