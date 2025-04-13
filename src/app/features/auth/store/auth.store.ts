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
  }
  