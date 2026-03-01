import { Test, TestingModule } from '@nestjs/testing';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskStatus } from './task.enum';

describe('TasksController', () => {
    let controller: TasksController;
    let mockTasksService: any;

    beforeEach(async () => {
        mockTasksService = {
            create: jest.fn(),
            findAll: jest.fn(),
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
});