import { Controller, Post, Body, Get } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { Task } from './task.entity';

@Controller('tasks')
export class TasksController {
    constructor(private readonly tasksService: TasksService) { }

    @Post()
    create(@Body() createTaskDto: CreateTaskDto): Promise<Task> {
        return this.tasksService.create(createTaskDto);
    }

    @Get()
    findAll(): Promise<Task[]> {
        return this.tasksService.findAll();
    }
}
