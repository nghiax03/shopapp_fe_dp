import { Injectable, Inject } from '@angular/core';
import { Product } from '../models/product';
import { CommonModule, DOCUMENT } from '@angular/common';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ApiResponse } from '../responses/api.response';

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  private apiBaseUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient) { }

  // Corrected function name and parameter usage
  authenticate(loginType: 'facebook' | 'google'): Observable<string> {
    return this.http.get<string>(`${this.apiBaseUrl}/users/auth/social-login?login_type=${loginType}`);
  }
}