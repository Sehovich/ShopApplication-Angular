import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Product, ProductApiResponse } from '../models/product.model';
import { Observable, of, tap } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ProductService {

  private readonly apiUrl = `${environment.apiUrl}/products`;
  private cachedPages = new Map<number, Product[]>(); 

  constructor(private http: HttpClient) {}

  getProductsByPage(page: number, limit: number): Observable<Product[]> {
    const cached = this.cachedPages.get(page);
    if (cached) return of(cached);
  
    return this.http.get<Product[]>(`${this.apiUrl}?page=${page}&pageSize=${limit}`).pipe(
      tap(products => this.cachedPages.set(page, products))
    );
  }

  clearCache() {
    this.cachedPages.clear();
  }

  getProductById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/${id}`);
  }
}
