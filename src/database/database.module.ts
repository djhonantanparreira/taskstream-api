import { Module } from '@nestjs/common';
import { AuditLogModule } from '../audit-log/audit-log.module';
import { EntityAuditSubscriber } from '../shared/subscriber/entity-audit.subscriber';

@Module({
    imports: [AuditLogModule],
    providers: [EntityAuditSubscriber],
})
export class DatabaseModule { }
