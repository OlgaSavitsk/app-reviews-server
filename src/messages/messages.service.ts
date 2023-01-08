import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ExceptionsMessage } from 'src/app.constant';
import { Repository } from 'typeorm';
import { CreateMessageDto } from './dto/create-message.dto';
import { MessageEntity } from './entities/message.entity';
import { StatusCodes } from 'http-status-codes';

interface ClientRoom {
  [clientId: string]: string | null;
}

@Injectable()
export class MessagesService {
  clientToUser: ClientRoom = {};
  constructor(
    @InjectRepository(MessageEntity)
    private userRepository: Repository<MessageEntity>
  ) {}

  async identify(name: string, clientId: string) {
    this.clientToUser[clientId] = name;
  }

  async create(createMessageDto: CreateMessageDto, clientId: string) {
    const messageCreated = this.userRepository.create({
      reviewId: this.clientToUser[clientId],
      text: createMessageDto.text,
      createdAt: Date.now().toString(),
    });
    if (messageCreated) {
      const message = await this.userRepository.save(messageCreated);
      return message;
    }
    throw new HttpException(ExceptionsMessage.BAD_REQUEST, StatusCodes.BAD_REQUEST);
  }

  async findAll() {
    const messages = await this.userRepository.find({
      relations: ['review'],
    });
    return messages;
  }
}
