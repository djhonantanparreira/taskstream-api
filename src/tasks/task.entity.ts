import { Column, Entity } from 'typeorm';

import { BaseEntity } from '../shared/entity/base.entity';
import { TaskStatus } from './task.enum';

@Entity('tasks')
export class Task extends BaseEntity {
    @Column()
    title: string;

    @Column({ nullable: true })
    description: string;

    @Column({
        type: 'enum',
        enum: TaskStatus,
        default: TaskStatus.PENDING,
    })
    status: TaskStatus;
}
