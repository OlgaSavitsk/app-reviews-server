import { UserEntity } from '@users/entity/user.entity';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('review')
export class ReviewEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  name: string;

  @Column({ nullable: true })
  title: string;

  @Column({ nullable: true })
  category: string;

  @Column({ type: 'text', array: true, default: [], nullable: true })
  tags: string[] | null;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  rating: number | null;

  @Column({ nullable: true })
  score: number;

  @Column({ nullable: true })
  like: number | null;

  @Column({type: 'varchar', nullable: true })
  img: any;

  @Column({ nullable: true })
  createdAt: string;

  @Column({ nullable: true })
  filePath: string | null;

  @ManyToOne(() => UserEntity, (user) => user.reviews, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  user: UserEntity;
}
