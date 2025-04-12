import { Injectable } from '@angular/core';
import { Product } from '../models/product.model';

@Injectable({ providedIn: 'root' })
export class BasketService {
  private basket: Product[] = [];

  getItems(): Product[] {
    return this.basket;
  }

  add(product: Product) {
    if (!this.basket.find(p => p.id === product.id)) {
      this.basket.push(product);
    }
  }

  remove(productId: number) {
    this.basket = this.basket.filter(p => p.id !== productId);
  }

  clear() {
    this.basket = [];
  }

  contains(productId: number): boolean {
    return !!this.basket.find(p => p.id === productId);
  }
}
