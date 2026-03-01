import { Controller, Post, Body, Get, Param, Patch, Delete, Sse, MessageEvent } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task } from './task.entity';

@Controller('tasks')
export class TasksController {
    constructor(private readonly tasksService: TasksService) { }

    @Post()
    create(@Body() createTaskDto: CreateTaskDto): Promise<Task> {
        return this.tasksService.create(createTaskDto);
    }

    @Sse('events')
    events(): Observable<MessageEvent> {
        return this.tasksService.subscribeToEvents().pipe(
            map((event) => ({ data: event } as MessageEvent)),
        );
    }

    @Get()
    findAll(): Promise<Task[]> {
        return this.tasksService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string): Promise<Task> {
        return this.tasksService.findOne(id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto): Promise<Task> {
        return this.tasksService.update(id, updateTaskDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string): Promise<void> {
        return this.tasksService.remove(id);
    }
}  
