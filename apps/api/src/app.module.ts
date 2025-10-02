import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ProtectedController } from './protected.controller';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    /*
      Config Module.forRoot:
        - Reads .env and attaches values to process.env
        - isGlobal:true means you don't need to import ConfigModule in every module
    */
    ConfigModule.forRoot({ isGlobal : true }),
    TypeOrmModule.forRoot({
      type : 'postgres',
      host : process.env.DB_HOST,
      port : Number(process.env.DB_PORT),
      username : process.env.DB_USER,
      password : process.env.DB_PASS,
      database : process.env.DB_NAME,
      autoLoadEntities : true,  // Automatically pickup @Entity classes
      synchronize : true, // DEV ONLY
    }),
    /*
      Make Modules available to the app
    */
    UsersModule,
    AuthModule,
  ],
  controllers: [AppController, ProtectedController],
  providers: [AppService],
})
export class AppModule {}
