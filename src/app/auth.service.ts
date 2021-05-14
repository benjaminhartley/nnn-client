import {Injectable, OnDestroy} from '@angular/core';
import { HttpClient } from '@angular/common/http';

import {Observable, Subscription} from 'rxjs';

import jwtDecode from 'jwt-decode';

import serverUrl from '../utils/serverUrl';

export interface SignupRequest {
  name: string;
  password: string;
  email?: string;
}

interface LoginRequest {
  name: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService implements OnDestroy {
  signupSubscription: Subscription | null = null;
  loginSubscription: Subscription | null = null;
  refreshSubscription: Subscription | null = null;

  constructor(private http: HttpClient) { }

  ngOnDestroy(): void {
    if (this.signupSubscription) {
      this.signupSubscription.unsubscribe();
    }

    if (this.loginSubscription) {
      this.loginSubscription.unsubscribe();
    }

    if (this.refreshSubscription) {
      this.refreshSubscription.unsubscribe();
    }
  }

  public isLoggedIn(): boolean {
    return !isExpiredOrMissingAccessToken(this.getAccessToken());
  }

  public getAccessTokenName(): string | null {
    const token = this.getAccessToken();

    if (!token) {
      return null;
    }

    const decodedToken: any = jwtDecode(token);
    return decodedToken.user?.name || null;
  }

  public getAccessToken(): string | null {
    return localStorage.getItem('userAccessToken');
  }

  public getRefreshToken(): string | null {
    return localStorage.getItem('userRefreshToken');
  }

  public clearTokens(): void {
    localStorage.removeItem('userAccessToken');
    localStorage.removeItem('userRefreshToken');
  }

  public async signUp(signupRequest: SignupRequest): Promise<void> {
    return new Promise((resolve, reject) => {
      const body = {
        name: signupRequest.name,
        password: signupRequest.password,
        email: signupRequest.email,
      };

      const url = serverUrl.getServerUrl();
      this.signupSubscription = this.http.post(`${url}/auth/signup`, body)
        .subscribe((res: any) => {
          localStorage.setItem('userAccessToken', res.data?.userAccessToken);
          localStorage.setItem('userRefreshToken', res.data?.userRefreshToken);
          resolve();
        }, (e) => {
          console.error(e);

          if (e.status === 400) {
            reject(new Error('invalid signup data'));
          } else if (e.status === 409) {
            reject(new Error('username taken'));
          } else {
            reject(new Error('unknown signup error'));
          }
        });
    });
  }

  public async login(loginRequest: LoginRequest): Promise<void> {
    return new Promise((resolve, reject) => {
      const body = {
        name: loginRequest.name,
        password: loginRequest.password,
      };

      const url = serverUrl.getServerUrl();
      this.loginSubscription = this.http.post(`${url}/auth/login`, body)
        .subscribe((res: any) => {
          localStorage.setItem('userAccessToken', res.data?.userAccessToken);
          localStorage.setItem('userRefreshToken', res.data?.userRefreshToken);
          resolve();
        }, (e) => {
          console.error(e);
          reject(new Error('error logging in'));
        });
    });
  }

  public async refreshToken(): Promise<void> {
    return new Promise((resolve) => {
      const accessToken = this.getAccessToken();
      const refreshToken = this.getRefreshToken();

      // no access token or it's expired
      if (isExpiredOrMissingAccessToken(accessToken)) {
        if (isExpiredOrMissingAccessToken(refreshToken)) {
          // nothing to work with
          this.clearTokens();
          return resolve();
        }

        const body = { token: refreshToken };
        const url = serverUrl.getServerUrl();

        this.refreshSubscription = this.http.post(`${url}/auth/refresh`, body)
          .subscribe((res: any) => {
            console.log('received updated tokens');
            localStorage.setItem('userAccessToken', res.data?.userAccessToken);
            localStorage.setItem('userRefreshToken', res.data?.userRefreshToken);
            resolve();
          });
      } else {
        // token is still valid
        resolve();
      }
    });
  }

  public logout(): void {
    this.clearTokens();
  }
}

function isExpiredOrMissingAccessToken(token: string | null): boolean {
  if (!token) {
    return true;
  }

  const decodedToken: any = jwtDecode(token);

  if (!decodedToken || !decodedToken.exp) {
    return true;
  }

  const exp = decodedToken.exp * 1000;
  const now = new Date().getTime();

  return now >= exp;
}
