import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { LoginRequest, RegisterRequest } from '../models/auth.model';
import { AuthStore } from '../features/auth/store/auth.store';


@Injectable({ providedIn: 'root' })
export class AuthService {
  private baseUrl = `${environment.apiUrl}/auth`;

  constructor(private http: HttpClient) {}

  login(data: LoginRequest) {
    return this.http.post<{ token: string }>(`${this.baseUrl}/login`, data);
  }

  register(data: RegisterRequest) {
    return this.http.post<{ message: string }>(`${this.baseUrl}/register`, data);
  }

  logout(): void {
    AuthStore.clear();
  }

  getAuthHeaders(): HttpHeaders {
    const token = AuthStore.getToken();
    return new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  }
}
