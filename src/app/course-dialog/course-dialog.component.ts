import { AfterViewInit, Component, inject, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Course } from '../model/course';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import moment from 'moment';
import { CoursesService } from '../services/courses.service';
import { LoadingService } from '../services/loading.service';
import { MessagesService } from '../services/messages.service';
import { catchError } from 'rxjs/operators';
import { EMPTY, throwError } from 'rxjs';

@Component({
  selector: 'course-dialog',
  templateUrl: './course-dialog.component.html',
  styleUrls: ['./course-dialog.component.css'],
  providers: [LoadingService, MessagesService],
  standalone: false,
})
export class CourseDialogComponent implements AfterViewInit {
  form: FormGroup;

  course: Course;
  private readonly coursesService: CoursesService = inject(CoursesService);
  private readonly loadingService: LoadingService = inject<LoadingService>(LoadingService);
  readonly messagesService: MessagesService = inject(MessagesService);

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<CourseDialogComponent>,
    @Inject(MAT_DIALOG_DATA) course: Course,
  ) {
    this.course = course;

    this.form = fb.group({
      description: [course.description, Validators.required],
      category: [course.category, Validators.required],
      releasedAt: [moment(), Validators.required],
      longDescription: [course.longDescription, Validators.required],
    });
  }

  ngAfterViewInit() {}

  save() {
    const changes = this.form.value;
    const saveCourse$ = this.coursesService.saveCourse(this.course.id, changes).pipe(
      catchError((err) => {
        const message = 'Could not save courses';
        this.messagesService.showErrors(message);
        console.log('message', err);
        // return throwError(err);
        return EMPTY;
      }),
    );
    this.loadingService.showLoaderUntilCompleted(saveCourse$).subscribe((value) => {
      this.dialogRef.close(value);
    });
  }

  close() {
    this.dialogRef.close();
  }
}
