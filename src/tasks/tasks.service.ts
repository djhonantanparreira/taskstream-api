import { Injectable } from "@nestjs/common";
import { RedisService } from "../redis/redis.service";
import { CreateTaskDto } from "./dto/create-task.dto";
import { Task } from "./task.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

@Injectable()
export class TasksService {
    constructor(
        @InjectRepository(Task)
        private readonly tasksRepository: Repository<Task>,
        private readonly redisService: RedisService,
    ) { }

    async create(createTaskDto: CreateTaskDto): Promise<Task> {
        const task = this.tasksRepository.create(createTaskDto);
        await this.tasksRepository.save(task);
        await this.redisService.del('tasks:all');
        return task;
    }
}