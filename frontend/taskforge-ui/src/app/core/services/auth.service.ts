import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import {
  LoginRequest,
  RegisterRequest,
  TokenResponse
} from '../models/auth.model';

import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = environment.apiUrl;

  constructor(
    private http: HttpClient
  ) {}

  register(
    data: RegisterRequest
  ): Observable<any> {

    return this.http.post(
      `${this.apiUrl}/auth/register`,
      data
    );
  }

  login(
    data: LoginRequest
  ): Observable<TokenResponse> {

    return this.http.post<TokenResponse>(
      `${this.apiUrl}/auth/login`,
      data
    );
  }

  saveToken(token: string) {

    localStorage.setItem(
      'access_token',
      token
    );
  }

  getToken() {

    return localStorage.getItem(
      'access_token'
    );
  }

  logout() {

    localStorage.removeItem(
      'access_token'
    );
  }

  isAuthenticated(): boolean {

    return !!this.getToken();
  }
}