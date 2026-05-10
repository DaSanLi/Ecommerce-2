import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { jwtConstants } from '../JWT/constants'
import { payloadType, RequestWithUser, ResponseWithCookie } from '../scripts/auth.types'

@Injectable()
export class AuthCookiesService {
    constructor(private readonly jwtService: JwtService) { }

    extractTokenFromCookie(request: RequestWithUser): string | undefined {
        return request.cookies?.token;
    }

    async verifyTokenFromCookie(request: RequestWithUser): Promise<payloadType> {
        const token = this.extractTokenFromCookie(request);

        if (!token) {
            throw new UnauthorizedException("No se ha proporcionado el token en las cookies");
        }

        try {
            const payload: payloadType = await this.jwtService.verifyAsync(token, {
                secret: jwtConstants.secret,
            });
            return payload;
        } catch {
            throw new UnauthorizedException("Token no válido o expirado");
        }
    }

    attachUserToRequest(request: RequestWithUser, payload: payloadType): void {
        request.user = payload;
    }

    setTokenCookie(res: ResponseWithCookie, token: string) {
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 3600 * 1000,
        });
    }
}
