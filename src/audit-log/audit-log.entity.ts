import {
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('audit_logs')
export class AuditLog {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    event: string;

    @Column({ name: 'entity_id' })
    entityId: string;

    @Column({ name: 'entity_name' })
    entityName: string;

    @Column({ name: 'entity_before', type: 'text' })
    entityBefore: string;

    @Column({ name: 'entity_after', type: 'text' })
    entityAfter: string;

    @CreateDateColumn({
        name: 'created_at',
        type: 'timestamp with time zone',
        default: () => 'CURRENT_TIMESTAMP',
    })
    createdAt: Date;
}
