import { Injectable } from "@nestjs/common";
import * as bcrypt from 'bcrypt';

@Injectable()
export class UtilService {
    encryptPassword(password: string | undefined) {
      throw new Error('Method not implemented.');
    }
    public async hashPassword(password: string): Promise<string> {
        return await bcrypt.hash(password, 10);
    }

    public async checkPassword(password: string, encryptedPassword: string): Promise<boolean> {
        return await bcrypt.compareSync(password, encryptedPassword);
    }
    
}