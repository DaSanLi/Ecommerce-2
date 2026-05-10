import * as bcrypt from 'bcrypt';
import { ResponseWithCookie } from './auth.types';


const SALT_ROUNDS = 10;

async function hashPassword(password: string): Promise<string> {
    const hash = await bcrypt.hash(password, SALT_ROUNDS);
    return hash;
}

async function verifyHashPassword(passwordUser: string, passwordDB: string): Promise<boolean> {
    const isMatch = await bcrypt.compare(passwordUser, passwordDB);
    return isMatch;
}

function setTokenCookie(res: ResponseWithCookie, token: string): void {
    const maxAge = parseInt(process.env.COOKIE_MAX_AGE || '3600000');
    
    res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: maxAge, // configurable por variable de entorno
    });
}


export { hashPassword, verifyHashPassword, setTokenCookie }
