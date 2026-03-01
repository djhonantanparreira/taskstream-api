import { Injectable, OnModuleInit } from '@nestjs/common';
import {
    DataSource,
    EntitySubscriberInterface,
    EventSubscriber,
    InsertEvent,
    RemoveEvent,
    UpdateEvent,
} from 'typeorm';
import { BaseEntity } from '../../shared/entity/base.entity';
import { AuditLogService } from '../../audit-log/audit-log.service';
import { AuditLog } from '../../audit-log/audit-log.entity';

@Injectable()
@EventSubscriber()
export class EntityAuditSubscriber
    implements EntitySubscriberInterface, OnModuleInit {
    constructor(
        private readonly dataSource: DataSource,
        private readonly auditLogService: AuditLogService,
    ) { }

    onModuleInit() {
        this.dataSource.subscribers.push(this);
    }

    listenTo() {
        return BaseEntity;
    }

    async afterInsert(event: InsertEvent<BaseEntity>): Promise<void> {
        const entityType = event.metadata.targetName;
        if (entityType === AuditLog.name) return;

        await this.auditLogService.createLog({
            event: 'insert',
            entityId: event.entity.id,
            entityName: entityType,
            entityAfter: JSON.stringify(event.entity),
            entityBefore: 'null',
        });
    }

    async afterUpdate(event: UpdateEvent<BaseEntity>): Promise<void> {
        const entityType = event.metadata.targetName;
        if (entityType === AuditLog.name) return;

        await this.auditLogService.createLog({
            event: 'update',
            entityId: event.entity?.id || event.databaseEntity?.id,
            entityName: entityType,
            entityAfter: JSON.stringify(event.entity || null),
            entityBefore: JSON.stringify(event.databaseEntity || null),
        });
    }

    async afterSoftRemove(event: UpdateEvent<BaseEntity>): Promise<void> {
        const entityType = event.metadata.targetName;
        if (entityType === AuditLog.name) return;

        await this.auditLogService.createLog({
            event: 'soft_remove',
            entityId: event.entity?.id || event.databaseEntity?.id,
            entityName: entityType,
            entityAfter: JSON.stringify(event.entity || null),
            entityBefore: JSON.stringify(event.databaseEntity || null),
        });
    }

    async afterRemove(event: RemoveEvent<BaseEntity>): Promise<void> {
        const entityType = event.metadata.targetName;
        if (entityType === AuditLog.name) return;

        await this.auditLogService.createLog({
            event: 'remove',
            entityId: event.entity?.id || event.databaseEntity?.id,
            entityName: entityType,
            entityAfter: 'null',
            entityBefore: JSON.stringify(event.databaseEntity || null),
        });
    }
}
