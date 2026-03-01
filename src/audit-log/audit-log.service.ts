import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuditLog } from './audit-log.entity';

@Injectable()
export class AuditLogService {
    constructor(
        @InjectRepository(AuditLog)
        private auditLogRepository: Repository<AuditLog>,
    ) { }

    async createLog(data: Partial<AuditLog>): Promise<AuditLog> {
        const auditLog = this.auditLogRepository.create(data);
        // Important: listeners: false prevents recursive calls if we were listening to all inserts
        return this.auditLogRepository.save(auditLog, { listeners: false });
    }
}
