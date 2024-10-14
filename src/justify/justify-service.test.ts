import { justifyText } from './justify-service';
import { getUserByEmail } from '../user/user-repository';
import { getWordsNumber, saveWordsUsed } from './justify-repository';

jest.mock('../user/user-repository', () => ({
    getUserByEmail: jest.fn(),
}));

jest.mock('./justify-repository', () => ({
    getWordsNumber: jest.fn(),
    saveWordsUsed: jest.fn(),
}));

describe('justifyText', () => {
    const validEmail = 'test@example.com';
    const validText = 'This is a test text to justify.';
    const mockUser = { id: 1, email: validEmail };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should throw an error if no user is found', async () => {
        (getUserByEmail as jest.Mock).mockResolvedValue(null); 

        await expect(justifyText(validEmail, validText)).rejects.toThrow('No user found');
    });

    it('should justify text and save words used when under the limit', async () => {
        (getUserByEmail as jest.Mock).mockResolvedValue(mockUser);
        (getWordsNumber as jest.Mock).mockResolvedValue(0);
        (saveWordsUsed as jest.Mock).mockResolvedValue(undefined);

        const result = await justifyText(validEmail, validText);

        expect(result).toStrictEqual({success: true, text: validText});
        expect(saveWordsUsed).toHaveBeenCalledWith(mockUser.id, 7);
    });

    it('should return "Need Payment" when exceeding the limit', async () => {
        (getUserByEmail as jest.Mock).mockResolvedValue(mockUser);
        (getWordsNumber as jest.Mock).mockResolvedValue(80000);

        const result = await justifyText(validEmail, validText);

        expect(result).toStrictEqual({success: false, reason: 'needs_payment'});
    });
});
