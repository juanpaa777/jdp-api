import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../common/prisma/prisma.service';
import { UtilService } from '../../common/services/util.service';
import { LoginDto } from './dto/login.dto';
import { AuthResponseDto } from './dto/auth-response.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { jwtConstants } from './constants';
import { user } from '../user/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private utilService: UtilService
  ) {}

  // Verificar el usuario y contraseña
  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.prisma.user.findFirst({
      where: { username },
      select: {
        id: true,
        username: true,
        name: true,
        lastname: true,
        password: true
      }
    });

    if (user && await this.utilService.checkPassword(password, user.password)) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  // Generar el token JWT
  async generateTokens(user: any): Promise<{ accessToken: string; refreshToken: string }> {
    // Obtener informacion del usuario (payload)
    const payload = { 
      sub: user.id, 
      username: user.username,
      name: user.name,
      lastname: user.lastname
    };

    // accessToken (60 segundos)
    const accessToken = this.jwtService.sign(payload, {
      secret: jwtConstants.secret,
      expiresIn: '60s'
    });

    // refreshToken (7 dias de expiracion)
    const refreshToken = this.jwtService.sign(payload, {
      secret: jwtConstants.refreshSecret,
      expiresIn: '7d'
    });

    // Almacenar refresh token en la base de datos
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await this.prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: user.id,
        expiresAt
      }
    });

    return { accessToken, refreshToken };
  }

  // Login principal
  async login(loginDto: LoginDto): Promise<AuthResponseDto> {
    const { username, password } = loginDto;

    // Verificar el usuario y contraseña
    const user = await this.validateUser(username, password);
    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    // Generar el token JWT
    const tokens = await this.generateTokens(user);

    return {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      user: {
        id: user.id,
        username: user.username,
        name: user.name,
        lastname: user.lastname
      }
    };
  }

  // Refresh token
  async refreshToken(refreshTokenDto: RefreshTokenDto): Promise<AuthResponseDto> {
    const { refreshToken } = refreshTokenDto;

    try {
      // Verificar el refresh token
      const payload = this.jwtService.verify(refreshToken, {
        secret: jwtConstants.refreshSecret
      });

      // Verificar que el refresh token exista en la base de datos y no haya expirado
      const storedToken = await this.prisma.refreshToken.findFirst({
        where: {
          token: refreshToken,
          userId: payload.sub,
          expiresAt: {
            gt: new Date()
          }
        }
      });

      if (!storedToken) {
        throw new UnauthorizedException('Refresh token inválido o expirado');
      }

      // Obtener información del usuario
      const user = await this.prisma.user.findUnique({
        where: { id: payload.sub },
        select: {
          id: true,
          username: true,
          name: true,
          lastname: true
        }
      });

      if (!user) {
        throw new UnauthorizedException('Usuario no encontrado');
      }

    
      // Generar nuevos tokens
      const tokens = await this.generateTokens(user);

      // Eliminar el refresh token usado
      await this.prisma.refreshToken.delete({
        where: { id: storedToken.id }
      });

      return {
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        user: {
          id: user.id,
          username: user.username,
          name: user.name,
          lastname: user.lastname
        }
      };

    } catch (error) {
      throw new UnauthorizedException('Refresh token inválido');
    }
  }

  // Logout
  async logout(refreshToken: string): Promise<void> {
    await this.prisma.refreshToken.deleteMany({
      where: {
        token: refreshToken
      }
    });
  }

  // Obtener información del usuario
  async getProfile(userId: number): Promise<any> {
    console.log('getProfile called with userId:', userId); // Debug
    
    const user = await this.prisma.user.findUnique({
      where: { id: Number(userId) }, // Forzar tipo number
      select: {
        id: true,
        username: true,
        name: true,
        lastname: true,
        created_at: true
      }
    });

    if (!user) {
      throw new UnauthorizedException('Usuario no encontrado');
    }

    console.log('User found:', user); // Debug
    return user;
  }

      public async getUserByUsername(username: string) {
        return await this.prisma.user.findFirst({
            where: { username }
        });
    }

}
