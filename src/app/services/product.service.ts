import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Product, ProductApiResponse } from '../models/product.model';
import { Observable, of, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private readonly apiUrl = 'https://dummyjson.com/products';
  private cachedProducts: Product[] | null = null;

  constructor(private http: HttpClient) {}

  getProducts(): Observable<Product[]> {
    if (this.cachedProducts) {
      return of(this.cachedProducts);
    }

    return this.http.get<ProductApiResponse>(this.apiUrl).pipe(
      tap((res) => {
        this.cachedProducts = res.products;
      }),
     
      tap((res) => console.log('Fetched from API:', res.products)),
      
      (source) => new Observable<Product[]>(observer => {
        source.subscribe({
          next: res => {
            observer.next(res.products);
            observer.complete();
          },
          error: err => observer.error(err)
        });
      })
    );
  }
}
