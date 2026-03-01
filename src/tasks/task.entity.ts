import { Column, Entity } from 'typeorm';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { BaseEntity } from '../shared/entity/base.entity';
import { TaskStatus } from './task.enum';

@Entity('tasks')
export class Task extends BaseEntity {
  @ApiProperty({
    example: 'Implement login page',
    description: 'Title of the task',
  })
  @Column()
  title: string;

  @ApiPropertyOptional({
    example: 'Create the login page with email and password fields',
    description: 'Detailed description',
  })
  @Column({ nullable: true })
  description: string;

  @ApiProperty({
    enum: TaskStatus,
    example: TaskStatus.PENDING,
    description: 'Current task status',
  })
  @Column({
    type: 'enum',
    enum: TaskStatus,
    default: TaskStatus.PENDING,
  })
  status: TaskStatus;
}
