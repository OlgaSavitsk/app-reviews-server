import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ReviewController } from './review.controller';
import { ReviewService } from './review.service';
import { ReviewEntity } from './entity/review.entity';
import { UserEntity } from '@users/entity/user.entity';
import { UsersService } from '@users/users.service';
import { UsersModule } from '@users/users.module';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  controllers: [ReviewController],
  providers: [ReviewService],
  imports: [TypeOrmModule.forFeature([UserEntity, ReviewEntity]), UsersModule],
  exports: [ReviewService, TypeOrmModule],
})
export class ReviewModule {}
