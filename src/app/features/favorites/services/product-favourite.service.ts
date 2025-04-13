import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ProductFavourite } from '../models/product-favourite.model';
import { Observable, of, tap } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ProductFavouriteService {
  private baseUrl = `${environment.apiUrl}/ProductFavourites`;
  private favouriteIds: number[] | null = null;

  constructor(private http: HttpClient) {}

  getUserFavourites(): Observable<ProductFavourite[]> {
    if (this.favouriteIds) {
      return of(this.favouriteIds.map(id => ({ productId: id, id: '', userId: '' } as ProductFavourite)));
    }

    return this.http.get<ProductFavourite[]>(`${this.baseUrl}`).pipe(
      tap(favs => {
        this.favouriteIds = favs.map(f => f.productId);
      })
    );
  }

  isFavourite(productId: number): boolean {
    return this.favouriteIds?.includes(productId) ?? false;
  }

  addToFavourites(productId: number): Observable<void> {
    return this.http.post<void>(this.baseUrl, { productId }).pipe(
      tap(() => {
        if (!this.favouriteIds) this.favouriteIds = [];
        this.favouriteIds.push(productId);
      })
    );
  }

  removeFromFavourites(productId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${productId}`).pipe(
      tap(() => {
        this.favouriteIds = this.favouriteIds?.filter(id => id !== productId) ?? null;
      })
    );
  }
}
