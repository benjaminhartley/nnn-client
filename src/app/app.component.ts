import { Component } from '@angular/core';

import {AuthService} from './auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'nnn-client';

  constructor(public authService: AuthService) {
  }

  public logout(): void {
    this.authService.logout();
    window.location.reload();
  }
}
