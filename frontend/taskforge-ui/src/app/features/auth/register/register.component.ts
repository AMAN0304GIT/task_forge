import { Component } from '@angular/core';

import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import { Router } from '@angular/router';

import { AuthService }
from '../../../core/services/auth.service';

import { CommonModule } from '@angular/common';

import { MatFormFieldModule }
from '@angular/material/form-field';

import { MatInputModule }
from '@angular/material/input';

import { MatButtonModule }
from '@angular/material/button';

import { MatCardModule }
from '@angular/material/card';

import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-register',

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

  templateUrl: './register.component.html',

  styleUrls: ['./register.component.css']
})
export class RegisterComponent {

  registerForm: FormGroup;

  loading = false;

  successMessage = '';

  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {

    this.registerForm = this.fb.group({

      username: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(40),
          Validators.pattern(/\S/)
        ]
      ],

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
          Validators.minLength(6),
          Validators.maxLength(128)
        ]
      ]
    });
  }

  onSubmit() {

    this.successMessage = '';

    this.errorMessage = '';

    this.registerForm.markAllAsTouched();

    if (this.registerForm.invalid) {
      return;
    }

    this.loading = true;

    this.authService.register(
      {
        username: this.registerForm.value.username?.trim(),
        email: this.registerForm.value.email?.trim(),
        password: this.registerForm.value.password
      }
    ).subscribe({

      next: () => {

        this.successMessage =
          'Registration successful';

        this.loading = false;

        setTimeout(() => {

          this.router.navigate(
            ['/login']
          );

        }, 1500);
      },

      error: (error) => {

        this.errorMessage =
          error?.error?.detail || 'Registration failed';

        this.loading = false;
      }
    });
  }
}
