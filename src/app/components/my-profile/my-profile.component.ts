import { Component, OnInit } from '@angular/core';
import {AppConst} from '../../constants/app-const';
import {UserService} from '../../services/user.service';
import {User} from '../../models/user';
import {Router} from '@angular/router';
import {LoginService} from '../../services/login.service';
import {PaymentService} from '../../services/payment.service';
import {UserPayment} from '../../models/user-payment';
import {UserBilling} from '../../models/user-billing';
import {UserShipping} from '../../models/user-shipping';
import {ShippingService} from '../../services/shipping.service';


@Component({
  selector: 'app-my-profile',
  templateUrl: './my-profile.component.html',
  styleUrls: ['./my-profile.component.css']
})
export class MyProfileComponent implements OnInit {

  public serverPath = AppConst.serverPath;
  public dataFetched = false;
  public loginError: boolean;
  public loggedIn: boolean;
  public credential = {'username': '', 'password': ''};

  public user: User = new User();
  public updateSuccess: boolean;
  public newPassword: string;
  public incorrectPassword: boolean;
  public currentPassword: string;

  public selectedProfileTab = 0;
  public selectedBillingTab = 0;
  public selectedShippingTab = 0;

  public userPayment: UserPayment = new UserPayment();
  public userBilling: UserBilling = new UserBilling();
  public userPaymentList: UserPayment[] = [];
  public defaultPaymentSet: boolean;
  public defaultUserPaymentId: number;
  public stateList: string[] = [];

  public userShipping: UserShipping = new UserShipping();
  public userShippingList: UserShipping[] = [];

  public defaultUserShippingId: number;
  public defaultShippingSet: boolean;

  constructor(
    private loginService: LoginService,
    private userService: UserService,
    private paymentService: PaymentService,
    private shippingService: ShippingService,
    private router: Router
  ) { }

  selectedShippingChange(val: number) {
    this.selectedShippingTab = val;
  }
  selectedBillingChange(val: number) {
    this.selectedBillingTab = val;
  }

  onUpdateUserInfo () {
    this.userService.updateUserInfo(this.user, this.newPassword, this.currentPassword).subscribe(
      res => {
        console.log(res);
        this.updateSuccess = true;
      },
      error => {
        console.log(error.text());
        const errorMessage = error.text();
        if (errorMessage === 'Incorrect current password!') { this.incorrectPassword = true; }
      }
    );
  }

  onNewPayment() {
    this.paymentService.newPayment(this.userPayment).subscribe(
      res => {
        this.getCurrentUser();
        this.selectedBillingTab = 0;
        this.userPayment = new UserPayment();
      },
      error => {
        console.log(error);
      }
    );

  }

  onUpdatePayment(payment: UserPayment) {
    this.userPayment = payment;
    this.userBilling = payment.userBilling;
    this.selectedBillingTab = 1;
  }

  onRemovePayment(id: number) {
    this.paymentService.removePayment(id).subscribe(
      res => {
        this.getCurrentUser();
      },
      error => {
        console.log(error.text());
      }
    );

  }

  setDefaultPayment() {
    this.defaultPaymentSet = false;
    this.paymentService.setDefaultPayment(this.defaultUserPaymentId).subscribe(
      res => {
        this.getCurrentUser();
        this.defaultPaymentSet = true;

      },
      error => {
        console.log(error.text());
      }
    );

  }

  onNewShipping() {
    this.shippingService.newShipping(this.userShipping).subscribe(
      res => {
        this.getCurrentUser();
        this.selectedShippingTab = 0;
        this.userShipping = new UserShipping();
      },
      error => {
        console.log(error.text());
      }
    );
  }

  onUpdateShipping(shipping: UserShipping) {
    this.userShipping = shipping;
    this.selectedShippingTab = 1;
  }

  onRemoveShipping(id: number) {
    this.shippingService.removeShipping(id).subscribe(
      res => {
        this.getCurrentUser();
      },
      error => {
        console.log(error.text());
      }
    );
  }

  setDefaultShipping() {
    this.defaultShippingSet = false;
    this.shippingService.setDefaultShipping(this.defaultUserShippingId).subscribe(
      res => {
        this.getCurrentUser();
        this.defaultShippingSet = true;
      },
      error => {
        console.log(error.text());
      }
    );
  }

  getCurrentUser() {
    this.userService.getCurrentUser().subscribe(
      res => {
        this.user = JSON.parse(JSON.stringify(res));
        this.userPaymentList = this.user.userPaymentList;
        this.userShippingList = this.user.userShippingList;

        for (const index in this.userPaymentList) {
          if (this.userPaymentList[index].defaultPayment) {
            this.defaultUserPaymentId = this.userPaymentList[index].id;
            break;
          }
        }

        for (const index in this.userShippingList) {
          if (this.userShippingList[index].userShippingDefault) {
            this.defaultUserShippingId = this.userShippingList[index].id;
            break;
          }
        }

        this.dataFetched = true;
      },
      err => {
        console.log(err);
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
        console.log('inactive session');
        this.router.navigate(['/myAccount']);
      }
    );

    this.getCurrentUser();

    for (const s in AppConst.usStates) {
      this.stateList.push(s);
    }

    this.userBilling.userBillingState = '';
    this.userPayment.type = '';
    this.userPayment.expiryMonth = '';
    this.userPayment.expiryYear = '';
    this.userPayment.userBilling = this.userBilling;
    this.defaultPaymentSet = false;

    this.userShipping.userShippingState = '';
    this.defaultShippingSet = false;
  }

}
