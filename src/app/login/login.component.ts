import { Component, OnInit, ViewChild } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AuthenticationService } from '../services/authentication.service'
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

export interface Note {
  content: string;
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  @ViewChild('loginform') loginFormDirective;
  loginForm: FormGroup;

  formErrors = {
    'email': '',
    'password': '',
    'name': ''
  }
  validationMessages = {
    'email': {
      'required': 'Email is required',
      'email': 'Email not in valid format.'
    },
    'password': {
      'required': 'Password is required',
      'minlength': 'Password must be at least 8 character long'
    },
    'name': {
      'required': 'Name is required',
      'minlength': 'Name must be at least 2 character long'
    }
  }
  email: string = '';
  password: string = '';
  user: any;
  name: string;
  accountCreate: boolean = false;

  nota: any;
  constructor(
    private auth: AuthenticationService,
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<LoginComponent>
  ) {

  }

  ngOnInit(): void {
    this.createForm();
    this.auth.activeUser.subscribe((user) => {
      if (user) {
        this.user = user;
      }
      else {
        this.user = null
      }
    })
  }
  createForm() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.pattern]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      name: ['', [Validators.minLength(2)]],

    })
    this.loginForm.valueChanges
      .subscribe(data => this.onValueChanged(data))

    this.onValueChanged();
  }
  onValueChanged(data?: any) {
    if (!this.loginForm) { return }
    const form = this.loginForm;
    for (const field in this.formErrors) {
      if (this.formErrors.hasOwnProperty(field)) {
        this.formErrors[field] = '';
        const control = form.get(field);
        if (control && control.dirty && !control.valid) {
          const messages = this.validationMessages[field];
          for (const key in control.errors) {
            if (control.errors.hasOwnProperty(key)) {
              this.formErrors[field] += messages[key] + ' ';
            }
          }
        }
      }

    }
  }
  signup(email: string, password: string, name: string) {
    this.auth.signUp(email, password, name)
    this.email = '';
    this.password = '';
    this.loginForm.reset({
      email: '',
      password: ''
    })
    this.loginFormDirective.resetForm();
    this.dialogRef.close();
  }
  login(email: string, password: string) {
    this.auth.login(email, password)
    this.email = '';
    this.password = '';
    this.loginForm.reset({
      email: '',
      password: ''
    })
    this.loginFormDirective.resetForm();
    this.dialogRef.close();
    this.email = '';
    this.password = '';
  }
  logout() {
    this.email = '';
    this.password = '';
    this.auth.logout()
    this.user = null;

  }

}
