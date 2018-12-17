import { Component, OnInit } from '@angular/core';
import {Router, Routes} from '@angular/router';
import { LoginService } from '../../services/login.service';
import { UserService } from '../../services/user.service';
import {AppConst} from '../../constants/app-const';
import {HttpClient, HttpHeaders} from '@angular/common/http';




@Component({
  selector: 'app-my-account',
  templateUrl: './my-account.component.html',
  styleUrls: ['./my-account.component.css']
})
export class MyAccountComponent implements OnInit {

  public serverPath = AppConst.serverPath;
  public loginError = false;
  public loggedIn = false;
  public credential = {'username': '', 'password': ''};
  public emailSent = false;
  public usernameExists: boolean;
  public emailExists: boolean;
  public username: string;
  public email: string;
  public emailNotExists = false;
  public forgetPasswordEmailSent: boolean;
  public recoverEmail: string;

  constructor(private loginService: LoginService, private userService: UserService, private router: Router, private http: HttpClient
  ) { }

  onLogin() {
    this.loginService.sendCredential(this.credential.username, this.credential.password).subscribe(
      (res: {token: string}) => {
        console.log(res);
        localStorage.setItem('xAuthToken', res.token);
        this.loggedIn = true;
        location.reload();
        this.router.navigate(['/home']);
      },
      error => {
        this.loggedIn = false;
        this.loginError = true;
      }
    );
  }

  checkSession() {
    const url = this.serverPath + '/checkSession';
    const headers = new HttpHeaders({
      'x-auth-token' : localStorage.getItem('xAuthToken')
    });
    return this.http.get(url, {headers: headers});
  }

  logout() {
    const url = this.serverPath + '/user/logout';
    const headers = new HttpHeaders({
      'x-auth-token' : localStorage.getItem('xAuthToken')
    });
    return this.http.post(url, '', {headers: headers});
  }

  onNewAccount() {
    this.usernameExists = false;
    this.emailExists = false;
    this.emailSent = false;

    this.userService.newUser(this.username, this.email).subscribe(
      res => {
        console.log(res);
        this.emailSent = true;
      },
      error => {
        console.log(error.text());
        const errorMessage = error.text();
        if (errorMessage === 'usernameExists') { this.usernameExists = true; }
        if (errorMessage ===  'emailExists') { this.emailExists = true; }
      }
    );
  }

  onForgetPassword() {
    this.forgetPasswordEmailSent = false;
    this.emailNotExists = false;

    this.userService.retrievePassword(this.recoverEmail).subscribe(
      res => {
        console.log(res);
        this.forgetPasswordEmailSent = true;
      },
      error => {
        console.log(error.text());
        const errorMessage = error.text();
        if (errorMessage === 'Email not found') { this.emailNotExists = true; }
      }
    );
  }

  ngOnInit() {
    this.loginService.checkSession().subscribe(
      res => {
        this.loggedIn = true;
      },
      error => {
        this.loggedIn = false;
      }
    );
  }

}
