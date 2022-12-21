import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import dataSource from './ormconfig';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { CoreModule } from './core/core.module';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    UsersModule,
    ConfigModule.forRoot({
      envFilePath: '.env',
    }),
    TypeOrmModule.forRoot(dataSource.options),
    AuthModule,
    CoreModule,
    PassportModule.register({ session: true }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
