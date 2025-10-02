import { Controller, Get, UseGuards, Request } from "@nestjs/common";
import { AuthGuard } from '@nestjs/passport';

@Controller('protected') 
export class ProtectedController {
    @UseGuards(AuthGuard('jwt'))
    @Get()
    getProtected(@Request() req) {
        return { message : 'Hello, you are authenticated', user : req.user };
    }
}