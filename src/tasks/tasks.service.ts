import { Injectable } from "@nestjs/common";
import { RedisService } from "../redis/redis.service";
import { CreateTaskDto } from "./dto/create-task.dto";
import { Task } from "./task.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { EventsService } from "../events/events.service";
import { UpdateTaskDto } from "./dto/update-task.dto";
import { NotFoundException } from "@nestjs/common";
import { Observable } from "rxjs";
import { TaskEvent } from "../events/events.interface";

@Injectable()
export class TasksService {
    constructor(
        @InjectRepository(Task)
        private readonly tasksRepository: Repository<Task>,
        private readonly redisService: RedisService,
        private readonly eventsService: EventsService,
    ) { }

    subscribeToEvents(): Observable<TaskEvent> {
        return this.eventsService.subscribe();
    }

    async create(createTaskDto: CreateTaskDto): Promise<Task> {
        const task = this.tasksRepository.create(createTaskDto);
        await this.tasksRepository.save(task);
        await this.redisService.del('tasks:all');
        this.eventsService.emit({
            type: 'task_created',
            payload: task,
        });
        return task;
    }

    async findAll(): Promise<Task[]> {
        const cached = await this.redisService.get('tasks:all');
        if (cached) {
            return cached as Task[];
        }
        const tasks = await this.tasksRepository.find();
        await this.redisService.set('tasks:all', tasks, 30);
        return tasks;
    }

    async findOne(id: string): Promise<Task> {
        return this.tasksRepository.findOne({ where: { id } });
    }

    async update(id: string, updateTaskDto: UpdateTaskDto): Promise<Task> {
        const task = await this.tasksRepository.findOne({ where: { id } });
        if (!task) {
            throw new NotFoundException(`Task with ID "${id}" not found`);
        }
        Object.assign(task, updateTaskDto);
        await this.tasksRepository.save(task);
        await this.redisService.del('tasks:all');
        this.eventsService.emit({
            type: 'task_updated',
            payload: task,
        });
        return task;
    }

    async remove(id: string): Promise<void> {
        const task = await this.tasksRepository.findOne({ where: { id } });
        if (!task) {
            throw new NotFoundException(`Task with ID "${id}" not found`);
        }
        await this.tasksRepository.remove(task);
        await this.redisService.del('tasks:all');
        this.eventsService.emit({
            type: 'task_deleted',
            payload: { id },
        });
    }
}