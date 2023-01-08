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
import { GetReviewFilterDto } from './dto/get-review-filter.dto';
import { IPaginationOptions, paginate, Pagination } from 'nestjs-typeorm-paginate';

@Injectable()
export class ReviewService {
  constructor(
    @InjectRepository(ReviewEntity)
    private reviewRepository: Repository<ReviewEntity>
  ) {}

  public async findAll(): Promise<IReview[]> {
    const reviews = await this.reviewRepository.find({
      relations: ['messages'],
    });
    return reviews;
  }

  public async getReviewWithFilter(filterDto: GetReviewFilterDto): Promise<IReview[]> {
    const { search } = filterDto;
    if (search === 'null') return [];
    let searchReviews = (await this.findAll()).filter(
      (review) =>
        review.title.includes(search) ||
        review.name.includes(search) ||
        review.description.includes(search) ||
        review.category.includes(search)
    );
    if (searchReviews.length === 0) {
      throw new NotFoundException(ExceptionsMessage.NOT_FOUND_REVIEW);
    }
    return searchReviews;
  }

  public async findAllTags(): Promise<string[]> {
    const reviews = await this.findAll();
    const tags = reviews.map((review) => review.tags).flat();
    return tags;
  }

  public async getById(id: string): Promise<IReview[]> {
    const reviews = await this.reviewRepository
      .createQueryBuilder('review')
      .where({ id: id })
      .select([
        'review.id',
        'review.name',
        'review.title',
        'review.description',
        'review.tags',
        'review.category',
        'review.rating',
        'review.img',
        'review.userId',
        'review.messages',
      ])
      .leftJoinAndSelect('review.user', 'user')
      .leftJoin('review.messages', 'messages')
      .getMany();
    return reviews ?? null;
  }

  public async create(dto: CreateReviewDto, user: UserResponse): Promise<IReview> {
    const date = String(Date.now());
    const reviewCreated = await this.reviewRepository.create({ ...dto, createdAt: date, user });
    if (reviewCreated) {
      const review = await this.reviewRepository.save(reviewCreated);
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

  public async delete(id: string): Promise<DeleteResult> {
    const result = await this.reviewRepository.delete({ id });
    if (result.affected === 0) {
      throw new NotFoundException(ExceptionsMessage.NOT_FOUND_REVIEW);
    }
    return result;
  }

  async paginate(options: IPaginationOptions): Promise<Pagination<ReviewEntity>> {
    const reviews = await this.reviewRepository
      .createQueryBuilder('reviews')
      .select([
        'reviews.createdAt',
        'reviews.title',
        'reviews.filePath',
        'reviews.userId',
        'reviews.rating',
        'reviews.score',
        'reviews.tags',
        'reviews.id',
      ])
      .orderBy('reviews.createdAt', 'DESC');
    return paginate<ReviewEntity>(reviews, options);
  }
}
