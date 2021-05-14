import {Component, OnDestroy, OnInit} from '@angular/core';

import {MessageService} from '../message.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-messages-component',
  templateUrl: './messages-component.component.html',
  styleUrls: ['./messages-component.component.css']
})
export class MessagesComponentComponent implements OnInit, OnDestroy {
  errorMessages: string[] = [];
  messages: string[] = [];

  errorMessagesSubscription: Subscription | null = null;
  messagesSubscription: Subscription | null = null;

  constructor(private messageService: MessageService) {
    this.errorMessagesSubscription = messageService.errorMessagesChange.subscribe((value) => {
      this.errorMessages = value;
    });

    this.messagesSubscription = messageService.messagesChange.subscribe((value) => {
      this.messages = value;
    });
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    if (this.errorMessagesSubscription) {
      this.errorMessagesSubscription.unsubscribe();
    }

    if (this.messagesSubscription) {
      this.messagesSubscription.unsubscribe();
    }
  }
}
