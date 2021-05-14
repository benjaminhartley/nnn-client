import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';

import {AuthService, SignupRequest} from '../auth.service';
import {MessageService} from '../message.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  isLoggedIn = false;

  signupUsername = '';
  signupPassword = '';
  signupEmail = '';

  loginUsername = '';
  loginPassword = '';

  errorMessages: string[] = [];

  constructor(public router: Router, public authService: AuthService, private messageService: MessageService) { }

  ngOnInit(): void {
    this.authService.refreshToken()
      .then(() => {
        this.isLoggedIn = this.authService.isLoggedIn();

        if (this.isLoggedIn) {
          this.router.navigate(['home']);
        }
      })
      .catch((e) => {
        console.error('error refreshing token:', e);
      });
  }

  public logIn(): void {
    if (!this.loginUsername || !this.loginPassword) {
      this.messageService.addErrorMessage('username and password required');
      return;
    }

    const req = {
      name: this.loginUsername,
      password: this.loginPassword,
    };

    this.authService.login(req)
      .then((res) => {
        this.isLoggedIn = true;
        this.router.navigate(['home']);
      }).catch((e) => {
        console.error('error logging in:', e);
        this.messageService.addErrorMessage('unauthorized');
        this.clearPassword();
    });
  }

  public signUp(): void {
    if (!this.signupUsername || !this.signupPassword) {
      this.messageService.addErrorMessage('username and password required');
      return;
    }

    const req: SignupRequest = {
      name: this.signupUsername,
      password: this.signupPassword,
    };

    if (this.signupEmail !== '') {
      req.email = this.signupEmail;
    }

    this.authService.signUp(req)
      .then((res) => {
        this.isLoggedIn = true;
        this.router.navigate(['home']);
      }).catch((e) => {
        console.error('error signing up:', e.message);
        this.messageService.addErrorMessage(e.message);
        this.clearPassword();
    });
  }

  private clearPassword(): void {
    this.loginPassword = '';
    this.signupPassword = '';
  }
}
