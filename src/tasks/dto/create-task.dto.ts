import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { TaskStatus } from '../task.enum';

export class CreateTaskDto {
  @ApiProperty({
    example: 'Implement login page',
    description: 'The title of the task',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiPropertyOptional({
    example: 'Create the login page with email and password fields',
    description: 'Detailed description of the task',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({
    enum: TaskStatus,
    example: TaskStatus.PENDING,
    description: 'Current status of the task (defaults to pending)',
  })
  @IsEnum(TaskStatus)
  @IsOptional()
  status?: TaskStatus;
}
