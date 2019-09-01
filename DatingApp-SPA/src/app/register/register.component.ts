import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AuthService } from '../_services/auth.service';
import { AlertifyService } from '../_services/alertify.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  // parent to child communication
  @Input() valuesFromHome: any = {};
  // child to parent communication
  @Output() cancelRegister = new EventEmitter();
  model: any = {};
  public loading = false;

  constructor(private authService: AuthService, private alertify: AlertifyService, private toastr: ToastrService) { }

  ngOnInit() {
  }

  register() {
    this.loading = true;
    this.authService.register(this.model).subscribe(() => {
      this.loading = false;
      this.alertify.success('registration successful');
      this.toastr.info('registration successful', 'Information');
    }, error => {
      this.loading = false;
      this.alertify.error(error);
      this.toastr.error(error, 'Error');
    });
  }

  cancel() {
    this.cancelRegister.emit(false);
  }

}
