import { ApiProperty } from '@nestjs/swagger';
import { Role } from 'src/roles/entity/role.enum';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

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
  name: string;

  @ApiProperty({ example: 'user@gmail.com', description: 'Userlogin' })
  @Column()
  login: string;

  @Column()
  password: string;

  @Column()
  createdAt?: string;

  @Column()
  updatedAt?: string;

  @Column()
  status?: string;

  @Column({ type: 'enum', enum: Role, default: Role.USER, nullable: true })
  roles?: Role[];

  toResponse() {
    const { id, name, login, createdAt, updatedAt, status, roles } = this;
    return { id, name, login, createdAt, updatedAt, status, roles };
  }
}
