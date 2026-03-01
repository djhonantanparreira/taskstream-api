import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { RedisService } from '../redis/redis.service';
import { TasksService } from './tasks.service';
import { EventsService } from '../events/events.service';
import { Task } from './task.entity';
import { TaskStatus } from './task.enum';
import { CreateTaskDto } from './dto/create-task.dto';

describe('TasksService', () => {
    let service: TasksService;
    let mockRepository: any;
    let mockRedisService: any;
    let mockEventsService: EventsService;

    beforeEach(async () => {
        mockRepository = {
            create: jest.fn(),
            save: jest.fn(),
        };

        mockRedisService = {
            del: jest.fn(),
            get: jest.fn(),
        };

        mockEventsService = new EventsService();
        mockEventsService.emit = jest.fn();

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                TasksService,
                { provide: getRepositoryToken(Task), useValue: mockRepository },
                { provide: RedisService, useValue: mockRedisService },
                { provide: EventsService, useValue: mockEventsService },
            ],
        }).compile();

        service = module.get<TasksService>(TasksService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('create', () => {
        it('should create a task, invalidate cache and emit event', async () => {
            const createTaskDto: CreateTaskDto = {
                title: 'Test Task',
                description: 'Test Description',
            };

            const savedTask = {
                id: 'some-uuid',
                ...createTaskDto,
                status: TaskStatus.PENDING,
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            mockRepository.create.mockReturnValue(savedTask);
            mockRepository.save.mockResolvedValue(savedTask);

            const result = await service.create(createTaskDto);

            expect(mockRepository.create).toHaveBeenCalledWith(createTaskDto);
            expect(mockRepository.save).toHaveBeenCalledWith(savedTask);
            expect(mockRedisService.del).toHaveBeenCalledWith('tasks:all');
            expect(mockEventsService.emit).toHaveBeenCalledWith({
                type: 'task_created',
                payload: savedTask,
            });
            expect(result).toEqual(savedTask);
        });
    });

    describe('findAll', () => {
        it('should return all tasks', async () => {
            const tasks = [
                {
                    id: 'some-uuid',
                    title: 'Test Task',
                    description: 'Test Description',
                    status: TaskStatus.PENDING,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
            ];

            mockRedisService.get.mockResolvedValue(tasks);

            const result = await service.findAll();

            expect(mockRedisService.get).toHaveBeenCalledWith('tasks:all');
            expect(result).toEqual(tasks);
        });
    });
});