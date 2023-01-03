import { ApiProperty } from '@nestjs/swagger';
import { IsBlockedStatus } from 'src/app.constant';
import { ReviewEntity } from 'src/review/entity/review.entity';
import { Role } from 'src/roles/entity/role.enum';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('user')
export class UserEntity {
  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426655440000',
    description: 'UserId UUID',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ example: 'User', description: 'Username' })
  @Column()
  username: string;

  @ApiProperty({ example: 'user@gmail.com', description: 'Userlogin' })
  @Column()
  login: string;

  @Column({ nullable: true })
  password?: string;

  @Column()
  createdAt?: string;

  @Column()
  updatedAt?: string;

  @Column({ default: IsBlockedStatus.ACTIVE_STATUS })
  status?: string;

  @Column({ nullable: true })
  photos?: string;

  @Column({ type: 'enum', enum: Role, default: Role.USER, nullable: true })
  roles: Role[];

  @OneToMany(() => ReviewEntity, (review) => review.user, {
    cascade: true,
    eager: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  reviews: ReviewEntity[];

  toResponse() {
    const { id, username, login, createdAt, updatedAt, status, roles, photos, reviews } = this;
    return { id, username, login, createdAt, updatedAt, status, roles, photos, reviews };
  }
}
