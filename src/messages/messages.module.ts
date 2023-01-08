import { Module } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { MessagesGateway } from './messages.gateway';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MessageEntity } from './entities/message.entity';
import { ReviewEntity } from 'src/review/entity/review.entity';

@Module({
  controllers: [],
  imports: [TypeOrmModule.forFeature([MessageEntity, ReviewEntity])],
  providers: [MessagesGateway, MessagesService],
})
export class MessagesModule {}
