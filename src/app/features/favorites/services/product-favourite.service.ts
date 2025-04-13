import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ProductFavourite } from '../models/product-favourite.model';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ProductFavouriteService {
  
  private baseUrl = `${environment.apiUrl}/ProductFavourites`;

  constructor(private http: HttpClient) {}
  getUserFavourites(): Observable<ProductFavourite[]> {
    return this.http.get<ProductFavourite[]>(`${this.baseUrl}`);
  }

  addToFavourites(productId: number): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}`, { productId });
  }

  removeFromFavourites(productId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${productId}`);
  }
}
