import { Component, OnInit } from '@angular/core';
import { AuthService } from '../_services/auth.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
  model: any = {};

  // passing the auth service into the constructor
  constructor(private authservice: AuthService) { }

  ngOnInit() {
  }

  // This is the method that logs the user in
  login() {
    this.authservice.login(this.model).subscribe(next => {
      console.log('Logged in Successfull');
    }, error => {
      console.log(error);
    });
  }

  // This is the method that changes the display if the user is logged in.
  loggedIn() {
    const token = localStorage.getItem('token');
    return !!token;
  }

  logout() {
    localStorage.removeItem('token');
    console.log('logged Out');
  }

}
