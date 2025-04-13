import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, forkJoin, map, Observable, switchMap, tap } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { BasketItem } from '../models/basket-item.model';
import { ProductService } from '../../../services/product.service';
import { Product } from '../../../models/product.model';

@Injectable({ providedIn: 'root' })
export class BasketService {
  private baseUrl = `${environment.apiUrl}/basket`;
  private cachedItems: BasketItem[] | null = null;

  private basketCountSubject = new BehaviorSubject<number>(0);
  basketCount$ = this.basketCountSubject.asObservable();

  constructor(private http: HttpClient, private productService: ProductService) {}

  getBasketItems(): Observable<{ item: BasketItem; product: Product }[]> {
    if (this.cachedItems) {
      this.refreshBasketCount();
      return this.loadProductDetails(this.cachedItems);
    }

    return this.http.get<BasketItem[]>(this.baseUrl).pipe(
      tap(items => {
        this.cachedItems = items;
        this.refreshBasketCount();
      }),
      switchMap(items => this.loadProductDetails(items))
    );
  }

  private loadProductDetails(items: BasketItem[]): Observable<{ item: BasketItem; product: Product }[]> {
    const requests = items.map(item =>
      this.productService.getProductById(item.productId).pipe(
        map(product => ({ item, product }))
      )
    );
    return forkJoin(requests);
  }

  addToBasket(productId: number): Observable<void> {
    return this.http.post<void>(this.baseUrl, { productId }).pipe(
      tap(() => {
        this.cachedItems = null;
        this.getBasketItems().subscribe(); // re-fetch and refresh count
      })
    );
  }

  removeFromBasket(productId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${productId}`).pipe(
      tap(() => {
        if (this.cachedItems) {
          this.cachedItems = this.cachedItems.filter(i => i.productId !== productId);
        }
        this.refreshBasketCount();
      })
    );
  }

  updateQuantity(productId: number, quantity: number): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/quantity`, { productId, quantity }).pipe(
      tap(() => {
        if (this.cachedItems) {
          this.cachedItems = this.cachedItems.map(i =>
            i.productId === productId ? { ...i, quantity } : i
          );
        }
        this.refreshBasketCount();
      })
    );
  }

  getBasketCount(): Observable<number> {
    return this.basketCount$;
  }

  clearCache() {
    this.cachedItems = null;
    this.basketCountSubject.next(0);
  }

  private refreshBasketCount() {
    const count = this.cachedItems?.reduce((sum, item) => sum + item.quantity, 0) ?? 0;
    this.basketCountSubject.next(count);
  }
}
