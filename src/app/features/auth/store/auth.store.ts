import { jwtDecode } from "jwt-decode";
import { DecodedToken, decodeToken } from "../utilis/jwt.utils";


export class AuthStore {
  private static readonly tokenKey = 'access_token';

  static setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  static getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  static clear(): void {
    localStorage.removeItem(this.tokenKey);
  }

  static isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token) return false;

    try {
      const decoded = jwtDecode<DecodedToken>(token);
      return decoded.exp * 1000 > Date.now(); 
    } catch {
      return false;
    }
  }

  static getUserEmail(): string | null {
    const token = this.getToken();
    const decoded = token ? decodeToken(token) : null;
    return decoded?.email ?? null;
  }

  static getUsername(): string | null {
  const token = this.getToken();
  if (!token) return null;

  try {
    const decoded = jwtDecode<any>(token);
    return decoded.username ?? null;
  } catch {
    return null;
  }
}

  
}
