import jwt from 'jsonwebtoken';
import {saveUser, getUserByEmail} from "../user/user-repository";

export const generateToken = async (email: string): Promise<string> => {
        let user = await getUserByEmail(email);
        if (!user) {
            user = await saveUser(email);
        }
    
        if (!process.env.JWT_SECRET_KEY) {
            throw new Error('No jwt secret found');
        }
    
        const token: string = await jwt.sign({
            id: user.id,
            email: user.email
        }, process.env.JWT_SECRET_KEY, {expiresIn: "6h"});
        return token;
}