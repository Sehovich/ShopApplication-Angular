import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, tap } from 'rxjs';


import { environment } from '../../../../environments/environment';
import { PagedProductResponse, Product } from '../../../models/product.model';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private readonly apiUrl = `${environment.apiUrl}/products`;

  constructor(private http: HttpClient) {}

  getProductsByPage(page: number, limit: number): Observable<PagedProductResponse> {
    return this.http.get<PagedProductResponse>(`${this.apiUrl}?page=${page}&pageSize=${limit}`);
  }

  getProductById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/${id}`);
  }
}
