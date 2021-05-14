import { Injectable, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Subscription } from 'rxjs';

import BigNumber from 'bignumber.js';

import { AuthService } from './auth.service';

import { User } from '../interfaces';
import { UserSchema, validationOptions } from '../schemas';

import serverUrl from '../utils/serverUrl';

@Injectable({
  providedIn: 'root'
})
export class UserService implements OnDestroy {
  getUserSubscription: Subscription | null = null;
  withdrawalSubscription: Subscription | null = null;

  constructor(private http: HttpClient, private authService: AuthService) {}

  ngOnDestroy(): void {
    if (this.getUserSubscription) {
      this.getUserSubscription.unsubscribe();
    }

    if (this.withdrawalSubscription) {
      this.withdrawalSubscription.unsubscribe();
    }
  }

  public async getUserData(): Promise<User | null> {
    return new Promise((resolve, reject) => {
      const url = serverUrl.getServerUrl();

      const token = this.authService.getAccessToken();
      if (!token) {
        console.warn('unauthorized');
        return resolve(null);
      }

      const name = this.authService.getAccessTokenName();

      const options = {
        headers: {
          Authorization: token,
        },
      };

      this.getUserSubscription = this.http.get(`${url}/users/${name}`, options)
        .subscribe((res: any) => {
          const validationResult = UserSchema.validate(res.data, validationOptions);
          if (validationResult.error) {
            console.error(validationResult.error);
            return reject(new Error('invalid user data format'));
          }

          resolve(formatUserData(res.data));
        }, (e) => {
          console.error(e);

          if (e.status === 404) {
            resolve(null);
          } else {
            reject(new Error('error getting user data'));
          }
        });
    });
  }

  public async withdraw(rawAmount: BigNumber, withdrawalAddress: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const url = serverUrl.getServerUrl();

      const token = this.authService.getAccessToken();
      if (!token) {
        console.warn('unauthorized');
        return resolve();
      }

      const name = this.authService.getAccessTokenName();

      const body = {
        withdrawalAddress,
        rawAmount: rawAmount.toFixed(),
      };

      const options = {
        headers: {
          Authorization: token,
        },
      };

      this.withdrawalSubscription = this.http.post(`${url}/users/${name}/withdraw`, body, options)
        .subscribe((res: any) => {
          console.log(res);
          resolve();
        }, (e) => {
          console.error(e);
          reject(new Error(e.error?.errorMessage));
        });
    });
  }
}

function formatUserData(data: any): User {
  return {
    ...data,
    rawAmount: new BigNumber(data.rawAmount),
  } as User;
}
