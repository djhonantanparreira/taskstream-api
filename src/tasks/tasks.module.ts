import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { Task } from './task.entity';
import { RedisModule } from '../redis/redis.module';
import { EventsModule } from '../events/events.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([Task]),
        RedisModule,
        EventsModule,
    ],
    controllers: [TasksController],
    providers: [TasksService],
})
export class TasksModule { }
