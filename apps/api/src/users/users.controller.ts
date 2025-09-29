import { Controller, Post, Body, Get, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import * as bcrypt from 'bcrypt';

@Controller('users')
export class UsersController {
    constructor(private readonly users : UsersService) {}

    @Post('seed')
    async seed(@Body() body : { email : string, password : string }) {
        const hash = await bcrypt.hash(body.password, 10);
        const u = await this.users.create(body.email, hash);
        return { id : u.id, email : u.email };
    }

    @Get('by-email')
    find(@Query('email') email : string) {
        return this.users.findByEmail(email);
    }
}