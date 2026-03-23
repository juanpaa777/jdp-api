import { Injectable } from "@nestjs/common";
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from '../../modules/auth/constants';

@Injectable()
export class UtilService {
    constructor(private jwtService: JwtService) {}

    encryptPassword(password: string | undefined) {
      throw new Error('Method not implemented.');
    }
    
    public async hashPassword(password: string): Promise<string> {
        return await bcrypt.hash(password, 10);
    }

    public async checkPassword(password: string, encryptedPassword: string): Promise<boolean> {
        return await bcrypt.compare(password, encryptedPassword);
    }
    
    public async generateJWT(payload: any, expiresIn: string = '60s'): Promise<string> {
        return this.jwtService.sign(payload, {
            secret: jwtConstants.secret
        });
    }

    public async verifyToken(token: string): Promise<any> {
        return this.jwtService.verify(token, {
            secret: jwtConstants.secret
        });
    }
}