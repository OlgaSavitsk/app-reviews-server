import { ReviewEntity } from 'src/review/entity/review.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('message')
export class MessageEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  name?: string;
 
  @Column({ nullable: true })
  text: string;

  @Column()
  createdAt?: string;

  @ManyToOne(() => ReviewEntity, (review) => review.messages, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  review: ReviewEntity;

  @Column({ nullable: true })
  reviewId: string
}
