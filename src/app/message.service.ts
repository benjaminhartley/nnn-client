import { Injectable } from '@angular/core';

import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  errorMessages: string[] = [];
  messages: string[] = [];

  errorMessagesChange: Subject<string[]> = new Subject<string[]>();
  messagesChange: Subject<string[]> = new Subject<string[]>();

  constructor() { }

  public addErrorMessage(errorMessage: string): void {
    this.errorMessages.push(errorMessage);
    this.errorMessagesChange.next(this.errorMessages);

    setTimeout(() => {
      this.errorMessages.shift();
      this.errorMessagesChange.next(this.errorMessages);
    }, 2000);
  }

  public addMessage(errorMessage: string): void {
    this.messages.push(errorMessage);
    this.messagesChange.next(this.messages);

    setTimeout(() => {
      this.messages.shift();
      this.messagesChange.next(this.messages);
    }, 2000);
  }
}
