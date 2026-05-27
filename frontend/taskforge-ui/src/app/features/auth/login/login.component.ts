import { Component } from '@angular/core';

import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import { Router } from '@angular/router';

import { AuthService } from '../../../core/services/auth.service';

import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-login',
  standalone: true,

  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    RouterLink
  ],

  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  loginForm: FormGroup;

  loading = false;

  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {

    this.loginForm = this.fb.group({
      email: [
        '',
        [
          Validators.required,
          Validators.email
        ]
      ],

      password: [
        '',
        [
          Validators.required,
          Validators.minLength(6)
        ]
      ]
    });
  }

  onSubmit() {

    this.errorMessage = '';

    this.loginForm.markAllAsTouched();

    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;

    this.authService.login(
      {
        email: this.loginForm.value.email?.trim(),
        password: this.loginForm.value.password
      }
    ).subscribe({

      next: (response) => {

        this.authService.saveToken(
          response.access_token
        );

        this.router.navigate(
          ['/dashboard']
        );
      },

      error: () => {

        this.errorMessage =
          'Invalid email or password';

        this.loading = false;
      }
    });
  }
}
