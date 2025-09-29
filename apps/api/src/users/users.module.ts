import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UsersService } from './users.service';     // Business logic for users
import { UsersController } from './users.controller';   // HTTP endpoints

@Module({
    /*
        TypeOrmModule.forFeature registers the 'User' entity for this module,
        so we can inject a Repository<User> into our services/controllers.
    */
    imports : [TypeOrmModule.forFeature([User])],
    providers : [UsersService],         // Make UsersService injectable
    exports : [UsersService],           // Export it so other modules can reuse
    controllers : [UsersController],    // Expost HTTP routes (e.g., /users/seed)
})

export class UsersModule {}