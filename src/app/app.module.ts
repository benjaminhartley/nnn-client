import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { ClipboardModule } from '@angular/cdk/clipboard';

import { QRCodeModule } from 'angularx-qrcode';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { MessagesComponentComponent } from './messages-component/messages-component.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    MessagesComponentComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    FormsModule,
    HttpClientModule,
    QRCodeModule,
    ClipboardModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
