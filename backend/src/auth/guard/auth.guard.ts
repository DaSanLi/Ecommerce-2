import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthCookiesService } from '../scripts/auth-cookies.service'
import { RequestWithUser } from '../scripts/auth.types'


@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private readonly authCookiesService: AuthCookiesService) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const ctx = GqlExecutionContext.create(context);
        const request = ctx.getContext<{ req: RequestWithUser }>().req;

        const payload = await this.authCookiesService.verifyTokenFromCookie(request);
        this.authCookiesService.attachUserToRequest(request, payload);

        return true;
    }
}
