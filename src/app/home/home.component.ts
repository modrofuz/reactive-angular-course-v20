import { Component, inject, OnInit } from '@angular/core';
import { Course, sortCoursesBySeqNo } from '../model/course';
import { finalize, Observable, of, throwError } from 'rxjs';
import { catchError, delay, map, shareReplay } from 'rxjs/operators';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { CourseDialogComponent } from '../course-dialog/course-dialog.component';
import { CoursesService } from '../services/courses.service';
import { LoadingService } from '../services/loading.service';
import { MessagesService } from '../services/messages.service';

@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  standalone: false,
})
export class HomeComponent implements OnInit {
  courses$: Observable<Course[]>;
  beginnerCourses$: Observable<Course[]>;
  advancedCourses$: Observable<Course[]>;

  private readonly coursesService = inject(CoursesService);
  private readonly loadingService: LoadingService = inject<LoadingService>(LoadingService);
  private readonly messagesService: MessagesService = inject<MessagesService>(MessagesService);
  private dialog: MatDialog = inject<MatDialog>(MatDialog);

  ngOnInit() {
    this.reloadCourses();
  }
  reloadCourses() {
    // this.loadingService.loadingOn();
    const courses$ = this.coursesService.loadAllCourses().pipe(
      delay(1500),
      map((courses) => courses.sort(sortCoursesBySeqNo)),
      catchError((err) => {
        const message = 'Could not load courses';
        this.messagesService.showErrors(message);
        console.log('message', err);
        return throwError(err);
      }),
      shareReplay({ bufferSize: 1, refCount: true }),
      //   finalize(() => this.loadingService.loadingOff()),
    );
    const loadCourses$ = this.loadingService.showLoaderUntilCompleted(courses$);
    this.beginnerCourses$ = this.getBeginnerCourses$(loadCourses$);
    this.advancedCourses$ = this.getAdvancedCourses$(loadCourses$);
  }

  getBeginnerCourses$(courses$: Observable<Course[]>) {
    return courses$.pipe(
      map((courses) => {
        return this.filterCoursesByCategory(courses, 'beginner');
      }),
    );
  }

  getAdvancedCourses$(courses$: Observable<Course[]>) {
    return courses$.pipe(
      map((courses) => {
        return this.filterCoursesByCategory(courses, 'advanced');
      }),
    );
  }

  /* reloadCourses() {
    this.loadingService.loadingOn();
    this.courses$ = this.coursesService.loadAllCourses().pipe(
      delay(1500),
      map((courses) => courses.sort(sortCoursesBySeqNo)),
      shareReplay({ bufferSize: 3, refCount: true }),
      finalize(() => this.loadingService.loadingOff()),
    );
    this.beginnerCourses$ = this.getBeginnerCourses$();
    this.advancedCourses$ = this.getAdvancedCourses$();
  }

  getBeginnerCourses$() {
    return this.courses$.pipe(
      map((courses) => {
        return this.filterCoursesByCategory(courses, 'beginner');
      }),
    );
  }

  getAdvancedCourses$() {
    return this.courses$.pipe(
      map((courses) => {
        return this.filterCoursesByCategory(courses, 'advanced');
      }),
    );
  }*/

  filterCoursesByCategory(courses, category: string) {
    return courses.filter(
      (filteredCourse) => filteredCourse.category.toUpperCase() === category.toUpperCase(),
    );
  }

  editCourse(course: Course) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '400px';
    dialogConfig.data = course;
    const dialogRef = this.dialog.open(CourseDialogComponent, dialogConfig);
  }
}
