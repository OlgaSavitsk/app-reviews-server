import {
  Body,
  Controller,
  Delete,
  FileTypeValidator,
  Get,
  HttpCode,
  HttpStatus,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  ParseUUIDPipe,
  Post,
  Put,
  Req,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { ReviewService } from './review.service';
import { ReviewEntity } from './entity/review.entity';
import { CreateReviewDto } from './dto/create-review-dto';
import { IReview } from './models/review.interface';
import { UpdateReviewDto } from './dto/update-review.dto';
import { UsersService } from '@users/users.service';
import { DeleteResult } from 'typeorm';
import { FileInterceptor } from '@nestjs/platform-express';
import { Request, Response } from 'express';
import { Multer } from 'multer';
import { multerOptions } from 'src/config/multerOptions';
import { TransformInterceptor } from '@core/interceptors/transform.interceptor';

@ApiTags('Review')
@Controller('review')
//@UseInterceptors(TransformInterceptor)
export class ReviewController {
  constructor(private readonly reviewService: ReviewService, private userService: UsersService) {}

  @ApiOperation({ summary: 'Get all reviews' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: [ReviewEntity],
  })
  @Get()
  @HttpCode(HttpStatus.OK)
  public findAll(): Promise<IReview[]> {
    return this.reviewService.findAll();
  }

  @Get('tags')
  @HttpCode(HttpStatus.OK)
  public findAllTags(): Promise<string[]> {
    return this.reviewService.findAllTags();
  }

  @ApiOperation({ summary: 'Get review by userId' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: ReviewEntity,
  })
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  public getById(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string): Promise<IReview[]> {
    return this.reviewService.getById(id);
  }

  @ApiOperation({ summary: 'Create review' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: ReviewEntity,
  })
  @UseInterceptors(FileInterceptor('image', multerOptions))
  @Post(':userId')
  @HttpCode(HttpStatus.CREATED)
  public async create(
    @Param('userId', new ParseUUIDPipe()) userId: string,
    @Body() reviewDto: any,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          //new MaxFileSizeValidator({ maxSize: 200000 }),
          new FileTypeValidator({ fileType: new RegExp('.(jpg|jpeg|png|gif)$') }),
        ],
      })
    )
    file: any
  ): Promise<IReview> {
    let parsereviewDto = JSON.parse(JSON.parse(JSON.stringify(reviewDto))['review']);
    const user = await this.userService.findOne(userId);
    if (user.id) {
      let fname = '';
      if (file) fname = file.filename;
      parsereviewDto.filePath = fname;
      parsereviewDto.img = file;
    }
    return this.reviewService.create(parsereviewDto, user);
  }

  @Get('picture/:filename')
  public async getPicture(
    @Param('filename') filename: string,
    @Req() req: Request,
    @Res() res: Response
  ) {
    return res.sendFile(filename, { root: 'public/uploads' });
  }

  @ApiOperation({ summary: 'Update review' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: ReviewEntity,
  })
  @UseInterceptors(FileInterceptor('image', multerOptions))
  @Put(':id')
  @HttpCode(HttpStatus.OK)
  public async update(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Body() updateReviewDto: any,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          //new MaxFileSizeValidator({ maxSize: 200000 }),
          new FileTypeValidator({ fileType: new RegExp('.(jpg|jpeg|png|gif)$') }),
        ],
      })
    )
    file: any
  ): Promise<IReview> {
    let parseReviewDto = JSON.parse(JSON.parse(JSON.stringify(updateReviewDto))['review']);
    let fname = '';
    if (file) fname = file.filename;
    parseReviewDto.filePath = fname;
    parseReviewDto.img = file;
    return await this.reviewService.update(id, parseReviewDto);
  }

  @ApiOperation({ summary: 'Delete review' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
  })
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  public async delete(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string
  ): Promise<DeleteResult> {
    return await this.reviewService.delete(id);
  }
}
