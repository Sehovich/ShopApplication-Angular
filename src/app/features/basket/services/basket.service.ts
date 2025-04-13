import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  BehaviorSubject,
  forkJoin,
  map,
  Observable,
  switchMap,
  tap
} from 'rxjs';
import { environment } from '../../../../environments/environment';
import { BasketItem } from '../models/basket-item.model';
import { ProductService } from '../../products/services/product.service';
import { Product } from '../../../models/product.model';

@Injectable({ providedIn: 'root' })
export class BasketService {
  private baseUrl = `${environment.apiUrl}/basket`;
  private cachedItems: BasketItem[] | null = null;

  private basketCountSubject = new BehaviorSubject<number>(0);
  basketCount$ = this.basketCountSubject.asObservable();

  constructor(
    private http: HttpClient,
    private productService: ProductService
  ) {}

  getBasketItems(): Observable<{ item: BasketItem; product: Product }[]> {
    return this.http.get<BasketItem[]>(this.baseUrl).pipe(
      tap(items => this.cachedItems = items),
      switchMap(items => this.loadProductDetails(items)),
      tap(entries => {
        const total = entries.reduce((sum, e) => sum + e.item.quantity, 0);
        this.basketCountSubject.next(total);
      })
    );
  }

  private loadProductDetails(
    items: BasketItem[]
  ): Observable<{ item: BasketItem; product: Product }[]> {
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
        this.loadAndRefreshCount(); // ✅ instead of getBasketItems()
      })
    );
  }

  private loadAndRefreshCount() {
    this.http.get<BasketItem[]>(this.baseUrl).subscribe(items => {
      this.cachedItems = items;
      this.refreshBasketCount();
    });
  }
  
  
  public refreshBasketCount(): void {
    const count = this.cachedItems?.reduce((sum, item) => sum + item.quantity, 0) ?? 0;
    this.basketCountSubject.next(count);
  }

  removeFromBasket(productId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${productId}`).pipe(
      tap(() => {
        this.refreshBasket();
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
  

  private refreshBasket() {
    this.cachedItems = null;
    this.getBasketItems().subscribe(); // force sync and recalculate count
  }

  getBasketCount(): Observable<number> {
    return this.basketCount$;
  }

  clearCache() {
    this.cachedItems = null;
    this.basketCountSubject.next(0);
  }
}
