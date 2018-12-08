import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatButtonModule, MatCheckboxModule} from '@angular/material';
import 'hammerjs';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';

import {LoginService} from './services/login.service';
import {UserService} from './services/user.service';


import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { NavBarComponent } from './components/nav-bar/nav-bar.component';
import { MyAccountComponent } from './components/my-account/my-account.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    NavBarComponent,
    MyAccountComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatButtonModule,
    FormsModule,
    RouterModule.forRoot([
      { path: '', redirectTo: '/home', pathMatch: 'full'},
      { path: 'home', component: HomeComponent},

    ])
  ],
  providers: [
    LoginService,
    UserService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
