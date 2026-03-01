import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuditLogService } from './audit-log.service';
import { AuditLog } from './audit-log.entity';

describe('AuditLogService', () => {
    let service: AuditLogService;
    let repository: Repository<AuditLog>;

    const mockAuditLogRepository = {
        create: jest.fn(),
        save: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AuditLogService,
                {
                    provide: getRepositoryToken(AuditLog),
                    useValue: mockAuditLogRepository,
                },
            ],
        }).compile();

        service = module.get<AuditLogService>(AuditLogService);
        repository = module.get<Repository<AuditLog>>(getRepositoryToken(AuditLog));
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('createLog', () => {
        it('should create and save an audit log with listeners: false', async () => {
            const logData = {
                event: 'insert',
                entityId: '123',
                entityName: 'Task',
                entityBefore: 'null',
                entityAfter: '{"id":"123"}',
            };

            const createdLog = { id: 'uuid-1', ...logData, createdAt: new Date() } as AuditLog;

            mockAuditLogRepository.create.mockReturnValue(createdLog);
            mockAuditLogRepository.save.mockResolvedValue(createdLog);

            const result = await service.createLog(logData);

            expect(mockAuditLogRepository.create).toHaveBeenCalledWith(logData);
            expect(mockAuditLogRepository.save).toHaveBeenCalledWith(createdLog, { listeners: false });
            expect(result).toEqual(createdLog);
        });
    });
});
