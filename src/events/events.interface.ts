export interface TaskEvent {
    type: 'task_created' | 'task_updated' | 'task_deleted';
    payload: Record<string, any>;
}
