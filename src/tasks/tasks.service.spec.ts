import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { RedisService } from '../redis/redis.service';
import { TasksService } from './tasks.service';
import { EventsService } from '../events/events.service';
import { Task } from './task.entity';
import { TaskStatus } from './task.enum';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

describe('TasksService', () => {
    let service: TasksService;
    let mockRepository: any;
    let mockRedisService: any;
    let mockEventsService: EventsService;

    beforeEach(async () => {
        mockRepository = {
            create: jest.fn(),
            save: jest.fn(),
            findOne: jest.fn(),
            remove: jest.fn(),
        };

        mockRedisService = {
            del: jest.fn(),
            get: jest.fn(),
            set: jest.fn(),
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

    describe('findOne', () => {
        it('should return a single task', async () => {
            const task = {
                id: 'some-uuid',
                title: 'Test Task',
                description: 'Test Description',
                status: TaskStatus.PENDING,
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            mockRepository.findOne.mockResolvedValue(task);

            const result = await service.findOne('some-uuid');

            expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { id: 'some-uuid' } });
            expect(result).toEqual(task);
        });
    });

    describe('update', () => {
        it('should update a task, invalidate cache and emit event', async () => {
            const updateTaskDto: UpdateTaskDto = {
                title: 'Updated Task',
                status: TaskStatus.IN_PROGRESS,
            };

            const existingTask = {
                id: 'some-uuid',
                title: 'Test Task',
                description: 'Test Description',
                status: TaskStatus.PENDING,
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            const updatedTask = {
                ...existingTask,
                ...updateTaskDto,
                updatedAt: new Date(),
            };

            mockRepository.findOne.mockResolvedValue(existingTask);
            mockRepository.save.mockResolvedValue(updatedTask);

            const result = await service.update('some-uuid', updateTaskDto);

            expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { id: 'some-uuid' } });
            expect(mockRepository.save).toHaveBeenCalledWith(updatedTask);
            expect(mockRedisService.del).toHaveBeenCalledWith('tasks:all');
            expect(mockEventsService.emit).toHaveBeenCalledWith({
                type: 'task_updated',
                payload: updatedTask,
            });
            expect(result).toEqual(updatedTask);
        });
    });

    describe('remove', () => {
        it('should remove a task, invalidate cache and emit event', async () => {
            const existingTask = {
                id: 'some-uuid',
                title: 'Test Task',
                description: 'Test Description',
                status: TaskStatus.PENDING,
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            mockRepository.findOne.mockResolvedValue(existingTask);
            mockRepository.remove.mockResolvedValue(undefined);

            await service.remove('some-uuid');

            expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { id: 'some-uuid' } });
            expect(mockRepository.remove).toHaveBeenCalledWith(existingTask);
            expect(mockRedisService.del).toHaveBeenCalledWith('tasks:all');
            expect(mockEventsService.emit).toHaveBeenCalledWith({
                type: 'task_deleted',
                payload: { id: 'some-uuid' },
            });
        });
    });
});