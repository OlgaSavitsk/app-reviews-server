import { UserEntity } from '@users/entity/user.entity';
import { MessageEntity } from 'src/messages/entities/message.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

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
  @JoinColumn({name: 'userId'})
  user: UserEntity;

  @Column({ nullable: true })
  userId: string

  @OneToMany(() => MessageEntity, (message) => message.review, {
    cascade: true,
    eager: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  messages: MessageEntity[];
}
