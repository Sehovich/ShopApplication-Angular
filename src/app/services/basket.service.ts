import { Injectable } from '@angular/core';
import { Product } from '../models/product.model';

@Injectable({ providedIn: 'root' })
export class BasketService {
  private readonly STORAGE_KEY = 'basket';

  private basket: Product[] = [];

  constructor() {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    this.basket = stored ? JSON.parse(stored) : [];
  }

  getItems(): Product[] {
    return this.basket;
  }

  add(product: Product) {
    if (!this.basket.find(p => p.id === product.id)) {
      this.basket.push(product);
      this.save();
    }
  }

  remove(productId: number) {
    this.basket = this.basket.filter(p => p.id !== productId);
    this.save();
  }

  clear() {
    this.basket = [];
    this.save();
  }

  contains(productId: number): boolean {
    return !!this.basket.find(p => p.id === productId);
  }

  private save() {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.basket));
  }
}
