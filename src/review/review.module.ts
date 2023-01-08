import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ReviewController } from './review.controller';
import { ReviewService } from './review.service';
import { ReviewEntity } from './entity/review.entity';
import { UserEntity } from '@users/entity/user.entity';
import { UsersModule } from '@users/users.module';
import { MessageEntity } from 'src/messages/entities/message.entity';

@Module({
  controllers: [ReviewController],
  providers: [ReviewService],
  imports: [TypeOrmModule.forFeature([UserEntity, ReviewEntity, MessageEntity]), UsersModule],
  exports: [ReviewService, TypeOrmModule],
})
export class ReviewModule {}
