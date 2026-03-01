import { Injectable } from "@nestjs/common";
import { Observable, Subject } from "rxjs";
import { TaskEvent } from "./events.interface";

@Injectable()
export class EventsService {
    private readonly subject = new Subject<TaskEvent>();

    emit(event: TaskEvent): void {
        this.subject.next(event);
    }

    subscribe(): Observable<TaskEvent> {
        return this.subject.asObservable();
    }
}