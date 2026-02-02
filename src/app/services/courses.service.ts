import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Course } from '../model/course';

import { map, shareReplay } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CoursesService {
  private readonly http: HttpClient = inject<HttpClient>(HttpClient);

  loadAllCourses(): Observable<Course[]> {
    return this.http.get<{ payload: Course[] }>('/api/courses').pipe(map((res) => res['payload']));
  }

  saveCourse(courseId: string, changes: Partial<Course>): Observable<any> {
    return this.http.put(`/api/courses/${courseId}`, changes).pipe(shareReplay());
  }
}
