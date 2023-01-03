import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { StatusCodes } from 'http-status-codes';

import { ExceptionsMessage } from 'src/app.constant';
import { ReviewEntity } from './entity/review.entity';
import { IReview } from './models/review.interface';
import { UpdateReviewDto } from './dto/update-review.dto';
import { CreateReviewDto } from './dto/create-review-dto';
import { UserResponse } from '@users/models/users.interface';
import { UserEntity } from '@users/entity/user.entity';

@Injectable()
export class ReviewService {
  constructor(
    @InjectRepository(ReviewEntity)
    private reviewRepository: Repository<ReviewEntity>,
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>
  ) {}

  public async findAll(): Promise<IReview[]> {
    const reviews = await this.reviewRepository.find();
    return reviews;
  }

  public async findAllTags(): Promise<string[]> {
    const reviews = await this.findAll();
    const tags = reviews.map((review) => review.tags).flat();
    return tags;
  }

  public async getById(id: string): Promise<IReview[]> {
    const reviews = await this.reviewRepository
      .createQueryBuilder('reviews')
      .where({ id: id })
      .select([
        'reviews.id',
        'reviews.name',
        'reviews.title',
        'reviews.description',
        'reviews.tags',
        'reviews.category',
        'reviews.rating',
        'reviews.img',
        'reviews.userId',
      ])
      .leftJoinAndSelect('reviews.user', 'user')
      .getMany();
    //.leftJoin('reviews.files', 'files')
    return reviews ?? null;
  }

  public async create(dto: CreateReviewDto, user: UserResponse): Promise<IReview> {
    const date = String(Date.now());
    const reviewCreated = await this.reviewRepository.create({ ...dto, createdAt: date, user });
    if (reviewCreated) {
      const review = await this.reviewRepository.save(reviewCreated);
      // await this.userRepository.save({
      //   ...user,
      //   reviews: [...user.reviews, review],
      // });
      return review;
    }
    throw new HttpException(ExceptionsMessage.BAD_REQUEST, StatusCodes.BAD_REQUEST);
  }

  public async update(id: string, dto: UpdateReviewDto): Promise<IReview> {
    const date = String(Date.now());
    const reviewUpdated = await this.reviewRepository.findOne({
      where: { id: id },
      relations: ['user'],
    });
    if (!reviewUpdated) {
      throw new NotFoundException(ExceptionsMessage.NOT_FOUND_REVIEW);
    }
    return await this.reviewRepository.save({ ...reviewUpdated, ...dto, createdAt: date });
  }

  findFileByReviewId(id: string) {}

  public async delete(id: string): Promise<DeleteResult> {
    const result = await this.reviewRepository.delete({ id });
    if (result.affected === 0) {
      throw new NotFoundException(ExceptionsMessage.NOT_FOUND_REVIEW);
    }
    return result;
  }
}
