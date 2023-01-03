import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UserEntity } from './entity/user.entity';
import { PassportModule } from '@nestjs/passport';
import { ReviewEntity } from 'src/review/entity/review.entity';
import { ReviewModule } from 'src/review/review.module';

@Module({
  controllers: [UsersController],
  providers: [UsersService],
  imports: [TypeOrmModule.forFeature([UserEntity, ReviewEntity]), PassportModule],
  exports: [TypeOrmModule, UsersService],
})
export class UsersModule {}
