import { Injectable } from '@angular/core';
import { BehaviorSubject, concatMap, finalize, Observable, of, switchMap } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable(/*{
  providedIn: 'root',
}*/)
export class LoadingService {
  private loadingSubject = new BehaviorSubject<boolean>(false);
  loading$: Observable<boolean> = this.loadingSubject.asObservable();
  constructor() {
    console.log('Loading service has been created');
  }

  showLoaderUntilCompleted<T>(obs$: Observable<T>): Observable<T> {
    return of(null).pipe(
      tap(() => this.loadingOn()),
      concatMap(() => {
        return obs$;
      }),
      finalize(() => this.loadingOff()),
    );
  }

  loadingOn() {
    this.loadingSubject.next(true);
    console.log(this.loadingSubject.value);
  }

  loadingOff() {
    this.loadingSubject.next(false);
    console.log(this.loadingSubject.value);
  }
}
