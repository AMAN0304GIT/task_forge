import { Component } from '@angular/core';

import { Router } from '@angular/router';

import { AuthService } from '../../../core/services/auth.service';

import { MatToolbarModule } from '@angular/material/toolbar';

import { MatButtonModule } from '@angular/material/button';

import { MatIconModule } from '@angular/material/icon';

import { MatListModule } from '@angular/material/list';

import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',

  standalone: true,

  imports: [CommonModule, MatToolbarModule, MatButtonModule, MatIconModule, MatListModule],

  templateUrl: './dashboard.component.html',

  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent {
  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  logout() {
    this.authService.logout();

    this.router.navigate(['/login']);
  }

  boards() {
    this.router.navigate(['/boards']);
  }
}
