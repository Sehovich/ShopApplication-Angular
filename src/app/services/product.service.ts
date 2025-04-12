import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Product, ProductApiResponse } from '../models/product.model';
import { Observable, of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private readonly apiUrl = 'https://dummyjson.com/products';
  private cachedPages = new Map<number, Product[]>(); 

  constructor(private http: HttpClient) {}

  getProductsByPage(page: number, limit: number): Observable<Product[]> {
    const skip = (page - 1) * limit;

    if (this.cachedPages.has(page)) {
      return of(this.cachedPages.get(page)!);
    }

    return new Observable<Product[]>(observer => {
      this.http
        .get<ProductApiResponse>(`${this.apiUrl}?limit=${limit}&skip=${skip}`)
        .subscribe({
          next: (res) => {
            this.cachedPages.set(page, res.products);
            observer.next(res.products);
            observer.complete();
          },
          error: (err) => observer.error(err)
        });
    });
  }

  clearCache() {
    this.cachedPages.clear();
  }

  getProductById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/${id}`);
  }
}
