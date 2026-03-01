import { Injectable } from "@nestjs/common";
import { RedisService } from "../redis/redis.service";
import { CreateTaskDto } from "./dto/create-task.dto";
import { Task } from "./task.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { EventsService } from "../events/events.service";

@Injectable()
export class TasksService {
    constructor(
        @InjectRepository(Task)
        private readonly tasksRepository: Repository<Task>,
        private readonly redisService: RedisService,
        private readonly eventsService: EventsService,
    ) { }

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
}