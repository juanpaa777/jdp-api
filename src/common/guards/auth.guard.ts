import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { UtilService } from "../services/util.service";

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private readonly utilService: UtilService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const token = this.extractTokenFromHeader(request);
        
        if (!token) {
            throw new UnauthorizedException();
        }

        try {
            const payload = await this.utilService.verifyToken(token);
            request['user'] = payload;
            return true;
        } catch {
            throw new UnauthorizedException();
        }
    }

    private extractTokenFromHeader(request: Request): string | null {
        const [type, token] = request.headers.get('authorization')?.split(' ') ?? [];
        return type === 'Bearer' ? token : null;
    }
}

