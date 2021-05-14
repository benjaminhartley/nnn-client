import { Component, OnInit } from '@angular/core';

import BigNumber from 'bignumber.js';

import {User} from '../../interfaces';

import nano from '../../utils/nano';

import { UserService } from '../user.service';
import {MessageService} from '../message.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  public user: User | null = null;
  withdrawalAddress = '';
  withdrawalAmount = 0;

  errorMessages: string[] = [];

  constructor(private userService: UserService, private messageService: MessageService) {}

  ngOnInit(): void {
    this.getUser();
  }

  public async getUser(): Promise<void> {
    try {
      this.user = await this.userService.getUserData();
    } catch (e) {
      console.error(e);
      this.user = null;
    }
  }

  public getUserNano(): BigNumber {
    if (!this.user?.rawAmount) {
      return new BigNumber(0);
    }

    return nano.convertRawToNano(this.user.rawAmount);
  }

  public async withdraw(): Promise<void> {
    if (this.withdrawalAddress === '' || this.withdrawalAmount <= 0) {
      this.messageService.addErrorMessage('withdrawal amount must be greater than 0');
      return;
    }

    const rawAmount = nano.convertNanoToRaw(new BigNumber(this.withdrawalAmount));
    this.userService.withdraw(rawAmount, this.withdrawalAddress)
      .then(() => {
        this.messageService.addMessage('withdrawal approved');

        setTimeout(() => {
          window.location.reload();
        }, 1333);
      })
      .catch((e) => {
        this.messageService.addErrorMessage(e.message);
      });
  }
}
