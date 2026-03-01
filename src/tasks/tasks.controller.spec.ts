import { Test, TestingModule } from '@nestjs/testing';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TaskStatus } from './task.enum';

describe('TasksController', () => {
    let controller: TasksController;
    let mockTasksService: any;

    beforeEach(async () => {
        mockTasksService = {
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
        };

        const module: TestingModule = await Test.createTestingModule({
            controllers: [TasksController],
            providers: [
                { provide: TasksService, useValue: mockTasksService },
            ],
        }).compile();

        controller = module.get<TasksController>(TasksController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('create', () => {
        it('should create a task', async () => {
            const createTaskDto: CreateTaskDto = {
                title: 'Test Task',
                description: 'Test Description',
            };

            const createdTask = {
                id: 'some-uuid',
                ...createTaskDto,
                status: TaskStatus.PENDING,
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            mockTasksService.create.mockResolvedValue(createdTask);

            const result = await controller.create(createTaskDto);

            expect(mockTasksService.create).toHaveBeenCalledWith(createTaskDto);
            expect(result).toEqual(createdTask);
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

            mockTasksService.findAll.mockResolvedValue(tasks);

            const result = await controller.findAll();

            expect(mockTasksService.findAll).toHaveBeenCalled();
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

            mockTasksService.findOne.mockResolvedValue(task);

            const result = await controller.findOne('some-uuid');

            expect(mockTasksService.findOne).toHaveBeenCalledWith('some-uuid');
            expect(result).toEqual(task);
        });
    });

    describe('update', () => {
        it('should update a task', async () => {
            const updateTaskDto: UpdateTaskDto = {
                title: 'Updated Task',
                status: TaskStatus.IN_PROGRESS,
            };

            const updatedTask = {
                id: 'some-uuid',
                title: 'Updated Task',
                description: 'Test Description',
                status: TaskStatus.IN_PROGRESS,
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            mockTasksService.update.mockResolvedValue(updatedTask);

            const result = await controller.update('some-uuid', updateTaskDto);

            expect(mockTasksService.update).toHaveBeenCalledWith('some-uuid', updateTaskDto);
            expect(result).toEqual(updatedTask);
        });
    });

    describe('remove', () => {
        it('should remove a task', async () => {
            mockTasksService.remove.mockResolvedValue(undefined);

            await controller.remove('some-uuid');

            expect(mockTasksService.remove).toHaveBeenCalledWith('some-uuid');
        });
    });
});