import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { BasketItem } from '../models/basket-item.model';

@Injectable({ providedIn: 'root' })
export class BasketService {
  getBasketItems(): Observable<BasketItem[]> {
    return this.http.get<BasketItem[]>(`${this.baseUrl}`);
  }
  private baseUrl = `${environment.apiUrl}/basket`;

  constructor(private http: HttpClient) {}

  getUserBasket(): Observable<BasketItem[]> {
    return this.http.get<BasketItem[]>(this.baseUrl);
  }

  addToBasket(productId: number): Observable<void> {
    return this.http.post<void>(this.baseUrl, { productId });
  }

  updateQuantity(productId: number, quantity: number): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/quantity`, { productId, quantity });
  }
  

  removeFromBasket(productId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${productId}`);
  }
}
