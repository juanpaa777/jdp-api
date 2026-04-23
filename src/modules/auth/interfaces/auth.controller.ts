import { Body, Controller, Get, HttpCode, HttpStatus, Post, Request, UseGuards, UnauthorizedException } from "@nestjs/common";
import { AuthService } from "../auth.service";
import { LoginDto } from "../dto/login.dto";
import { RefreshTokenDto } from "../dto/refresh-token.dto";
import { AuthGuard } from "./auth.guard";
import { UtilService } from "../../../common/services/util.service";
import { JwtService } from "@nestjs/jwt";
import { jwtConstants } from "../constants";


@Controller('auth')
export class AuthController {

  constructor(private authService: AuthService, private utilSvc: UtilService, private jwtService: JwtService) {}


  @HttpCode(HttpStatus.OK)
  @Post('login')
  public async login(@Body() loginDto: LoginDto): Promise<any> {
    // Usar el método login del AuthService que maneja todo correctamente
    return await this.authService.login(loginDto);
  }

 @Get("/me")
 @UseGuards(AuthGuard)
  public async getProfile(@Request() requesr: any){
    const user = requesr['user'];
    return user;
  }

  @Post('refresh')
  public async refreshToken(@Body() refreshTokenDto: RefreshTokenDto): Promise<any> {
    return this.authService.refreshToken(refreshTokenDto);
  }


  @Post('logout')
  @HttpCode(HttpStatus.OK)
  public async logout(@Body() body: { refreshToken: string }) {
    try {
      //obtener el usuario en sesion desde el refresh token
      const payload = this.jwtService.verify(body.refreshToken, {
        secret: jwtConstants.refreshSecret
      });
      
      const userId = payload.sub || payload.id;
      
      //eliminar el refresh token y limpiar hash
      await this.authService.updateHash(userId, null);
      await this.authService.logout(body.refreshToken, userId, payload.username);
      
      return { message: 'Logout successful' };
    } catch (error) {
      throw new UnauthorizedException('Logout failed');
    }
  }


}
