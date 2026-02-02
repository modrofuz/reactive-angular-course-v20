import { Component, inject, OnInit } from '@angular/core';
import { MessagesService } from '../services/messages.service';
import { Observable } from 'rxjs';
import { filter, tap } from 'rxjs/operators';

@Component({
  selector: 'messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css'],
  standalone: false,
})
export class MessagesComponent implements OnInit {
  showMessages = false;
  errors$: Observable<string[]>;

  messagesServices: MessagesService = inject<MessagesService>(MessagesService);

  constructor() {
    console.log('Message component');
  }

  ngOnInit() {
    this.errors$ = this.messagesServices.errors$.pipe(tap(() => (this.showMessages = true)));
  }

  onClose() {
    this.showMessages = false;
  }
}
