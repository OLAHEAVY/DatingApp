import { Component, OnInit } from '@angular/core';
import { AuthService } from '../_services/auth.service';
import { AlertifyService } from '../_services/alertify.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
  model: any = {};

  // passing the auth service into the constructor
  constructor(public authService: AuthService, private alertify: AlertifyService, private router: Router, private toastr: ToastrService) { }

  ngOnInit() {
  }

  // This is the method that logs the user in
  login() {
    this.authService.login(this.model).subscribe(next => {
      this.alertify.success('Logged in Successfull');
      this.toastr.success('Logged in Successfull', 'Success');
    }, error => {
      this.alertify.error(error);
      this.toastr.error(error, 'Error');
    }, () => {
      this.router.navigate(['/members']);
    });
  }

  // This is the method that changes the display if the user is logged in.
  loggedIn() {
    return this.authService.loggedin();
  }

  logout() {
    localStorage.removeItem('token');
    this.alertify.warning('Logged Out');
    this.toastr.warning('Logged Out', 'Warning');
    this.router.navigate(['home']);
  }

}
