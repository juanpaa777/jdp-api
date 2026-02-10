import { Controller, Get, Param } from "@nestjs/common";
import { AuthService } from "../auth.service";

@Controller('auth')
export class AuthController {
    constructor(private authSvc: AuthService) {}

    @Get()
    public index(): string {
        return 'Auth module is working';
    }

    @Get('login')
    public login(): string {
        return this.authSvc.login();
    }

    @Get(':id')
    public getById(@Param('id') id: string): string {
        return `Obteniendo auth con ID: ${id}`;
    }
}