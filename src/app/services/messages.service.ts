import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { filter } from 'rxjs/operators';

@Injectable(/*{
  providedIn: 'root',
}*/)
export class MessagesService {
  private messagesSubject = new BehaviorSubject<string[]>([]);
  errors$: Observable<string[]> = this.messagesSubject
    .asObservable()
    .pipe(filter((errors: string[]) => errors && errors.length > 0));

  showErrors(...errors: string[]) {
    this.messagesSubject.next(errors);
  }
}
