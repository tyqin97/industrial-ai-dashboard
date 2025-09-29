import { Controller, Post, Body, Get, Query, NotFoundException } from '@nestjs/common';
import { UsersService } from './users.service';
import * as bcrypt from 'bcrypt';

@Controller('users')    // Base route = /users
export class UsersController {
    // DI: we get an instance of UsersService
    constructor(private readonly users : UsersService) {}

    @Post('seed')
    async seed(@Body() body : { email : string, password : string }) {
        const hash = await bcrypt.hash(body.password, 10);
        const u = await this.users.create(body.email, hash);
        return { id : u.id, email : u.email };
    }

    @Get('by-email')
    async find(@Query('email') email : string) {
        const user = await this.users.findByEmail(email);
        return { id : user.id, email : user.email, role : user.role };
    }
}