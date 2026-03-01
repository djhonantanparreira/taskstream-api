import {
    CreateDateColumn,
    PrimaryGeneratedColumn,
    Column,
    BeforeUpdate,
} from 'typeorm';

export abstract class BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @CreateDateColumn({
        name: 'created_at',
        type: 'timestamp with time zone',
        default: () => 'CURRENT_TIMESTAMP',
    })
    createdAt: Date;

    @Column({
        name: 'updated_at',
        type: 'timestamp with time zone',
        nullable: true,
    })
    updatedAt: Date | null;

    @BeforeUpdate()
    updateTimestamp() {
        this.updatedAt = new Date();
    }
}
