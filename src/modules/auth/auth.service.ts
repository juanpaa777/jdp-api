import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../common/prisma/prisma.service';
import { UtilService } from '../../common/services/util.service';
import { LoginDto } from './dto/login.dto';
import { AuthResponseDto } from './dto/auth-response.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { jwtConstants } from './constants';
import { user } from '../user/entities/user.entity';
import { AuditService } from '../audit/audit.service';
import { LogAction, LogSeverity } from '../../generated/prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private utilService: UtilService,
    private auditService: AuditService,
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
        password: true,
        hash: true,
        role: true,
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
      lastname: user.lastname,
      hash: user.hash,
      role: user.role,
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
      await this.auditService.log({
        action: LogAction.LOGIN_FAILED,
        severity: LogSeverity.WARNING,
        username,
        details: `Intento de login fallido para: ${username}`,
      });
      throw new UnauthorizedException('Credenciales inválidas');
    }
    await this.auditService.log({
      action: LogAction.LOGIN_SUCCESS,
      severity: LogSeverity.INFO,
      userId: user.id,
      username: user.username,
      details: `Login exitoso`,
    });

    // Generar el token JWT
    const tokens = await this.generateTokens(user);

    return {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      user: {
        id: user.id,
        username: user.username,
        name: user.name,
        lastname: user.lastname,
        role: user.role,
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

      // Extraer userId del payload (puede ser 'sub' o 'id')
      const userId = payload.sub || payload.id;
      if (!userId) {
        throw new UnauthorizedException('Refresh token inválido: falta userId');
      }

      // Verificar que el refresh token exista en la base de datos y no haya expirado
      const storedToken = await this.prisma.refreshToken.findFirst({
        where: {
          token: refreshToken,
          userId: userId,
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
        where: { id: userId },
        select: {
          id: true,
          username: true,
          name: true,
          lastname: true,
          role: true,
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
          lastname: user.lastname,
          role: user.role,
        }
      };

    } catch (error) {
      throw new UnauthorizedException('Refresh token inválido');
    }
  }

  // Logout
  async logout(refreshToken: string, userId?: number, username?: string): Promise<void> {
    await this.prisma.refreshToken.deleteMany({
      where: {
        token: refreshToken
      }
    });
    await this.auditService.log({
      action: LogAction.LOGOUT,
      severity: LogSeverity.INFO,
      userId,
      username,
      details: `Cierre de sesión`,
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

    public async getUserById(id: number): Promise<user|null> {
        return await this.prisma.user.findUnique({
            where: { id }
        });
    }
    public async updateHash(user_Id: number, hash: string | null): Promise<user> {
       return await this.prisma.user.update({
            where: { id: user_Id },
            data: { 
                hash: hash 
            }
        });
    }
}
