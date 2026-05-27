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

@Component({
  selector: 'app-register',

  standalone: true,

  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule
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
          Validators.required
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
          Validators.minLength(6)
        ]
      ]
    });
  }

  onSubmit() {

    if (this.registerForm.invalid) {
      return;
    }

    this.loading = true;

    this.authService.register(
      this.registerForm.value
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

      error: () => {

        this.errorMessage =
          'Registration failed';

        this.loading = false;
      }
    });
  }
}