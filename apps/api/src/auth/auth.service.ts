import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        private usersService : UsersService,
        private jwtService : JwtService,
    ) {}

    async validateUser(email : string, pass : string) {
        const user = await this.usersService.findByEmail(email);
        
        if (!user) {
            throw new NotFoundException(`User with emai "${email}" not found.`);
        }
        
        const match = await bcrypt.compare(pass, user.password_hash);

        if (!match) {
            throw new UnauthorizedException('Invalid email or password.');
        }
        return user;
    }

    async login(user : any) {
        const payload = { email : user.email, sub : user.id, role : user.role };
        return {
            access_token : this.jwtService.sign(payload),
        }
    }
}