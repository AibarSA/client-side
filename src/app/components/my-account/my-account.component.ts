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

  private serverPath = AppConst.serverPath;
  private loginError = false;
  private loggedIn = false;
  private credential = {'username': '', 'password': ''};
  private emailSent = false;
  private usernameExists: boolean;
  private emailExists: boolean;
  private username: string;
  private email: string;
  private emailNotExists = false;
  private forgetPasswordEmailSent: boolean;
  private recoverEmail: string;

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

  ngOnInit() {
  }

}
