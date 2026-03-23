import { Body, Controller, Get, HttpCode, HttpStatus, Post, Request, UseGuards, UnauthorizedException } from "@nestjs/common";
import { AuthService } from "../auth.service";
import { LoginDto } from "../dto/login.dto";
import { RefreshTokenDto } from "../dto/refresh-token.dto";
import { AuthGuard } from "./auth.guard";
import { UtilService } from "../../../common/services/util.service";


@Controller('auth')
export class AuthController {

  constructor(private authService: AuthService, private utilSvc: UtilService) {}


  @HttpCode(HttpStatus.OK)
  @Post('login')
  public async login(@Body() loginDto: LoginDto): Promise<any> {
    const { username, password } = loginDto;
    
    // Verify user and password
    const user = await this.authService.validateUser(username, password);
    if (!user) {
      throw new UnauthorizedException('El usuario y/o contraseña es incorrecta');
    }
    
    // Obtener la información del usuario (payload)
    const { password: userPassword, username: userUsername, ...payload } = user;
    
    // Generar el JWT
    const access_token = await this.utilSvc.generateJWT(payload);
    
    // Generar el refresh token
    const refresh_token = await this.utilSvc.generateJWT(payload, '7d');
    
    // Devolver el JWT encriptado
    return {
      access_token,
      refresh_token,
      user: {
        id: user.id,
        username: user.username,
        name: user.name,
        lastname: user.lastname
      }
    };
  }


  @Post('refresh')
  public async refreshToken(@Body() refreshTokenDto: RefreshTokenDto): Promise<any> {
    return this.authService.refreshToken(refreshTokenDto);
  }


  @Post('logout')
  public async logout(@Body() body: { refreshToken: string }): Promise<any> {
    await this.authService.logout(body.refreshToken);
    return { message: 'Logout successful' };
  }


  @UseGuards(AuthGuard)
  @Get('profile')
  public getProfile(@Request() req): Promise<any> {
    return this.authService.getProfile(req.user.sub);
  }
}
