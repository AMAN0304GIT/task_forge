import { Component } from '@angular/core';

import { Router } from '@angular/router';

import { AuthService }
from '../../../core/services/auth.service';

import { MatToolbarModule }
from '@angular/material/toolbar';

import { MatButtonModule }
from '@angular/material/button';

@Component({
  selector: 'app-dashboard',

  standalone: true,

  imports: [
    MatToolbarModule,
    MatButtonModule
  ],

  templateUrl: './dashboard.component.html',

  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  logout() {

    this.authService.logout();

    this.router.navigate(
      ['/login']
    );
  }
}