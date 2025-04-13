import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../../../../shared/material.module';
import { Product } from '../../../../models/product.model';
import { ProductService } from '../../../../services/product.service';
import { ProductFavouriteService } from '../../../favorites/services/product-favourite.service';
import { BasketService } from '../../../basket/services/basket.service';

import { AuthStore } from '../../../auth/store/auth.store';
import { NotificationService } from '../../../../services/notification.service';

@Component({
  standalone: true,
  selector: 'app-product-list-page',
  imports: [CommonModule, MaterialModule, RouterModule],
  templateUrl: './product-list-page.component.html',
  styleUrls: ['./product-list-page.component.scss']
})
export class ProductListPageComponent implements OnInit {
  products: Product[] = [];
  favourites: number[] = [];
  currentPage = 1;
  pageSize = 8;
  sortBy: keyof Product = 'title';
  sortAsc = true;
  loading = false;

  constructor(
    private productService: ProductService,
    private favouriteService: ProductFavouriteService,
    private basketService: BasketService,
    private notificationService: NotificationService
  ) {}

  ngOnInit() {
    this.loadProducts();
    this.loadFavourites();
  }

  loadProducts() {
    this.loading = true;
    this.productService.getProductsByPage(this.currentPage, this.pageSize).subscribe({
      next: (res) => {
        this.products = this.sortProducts(res);
        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to load products', err);
        this.loading = false;
      }
    });
  }

  loadFavourites() {
    this.favouriteService.getUserFavourites().subscribe({
      next: (res) => this.favourites = res.map(f => f.productId),
      error: (err) => console.error('Failed to load favourites', err)
    });
  }

  toggleFavourite(productId: number) {
    if (!AuthStore.isAuthenticated()) return;

    if (this.favourites.includes(productId)) {
      this.favouriteService.removeFromFavourites(productId).subscribe(() => {
        this.favourites = this.favourites.filter(id => id !== productId);
        this.notificationService.success('Removed from favorites');
      });
    } else {
      this.favouriteService.addToFavourites(productId).subscribe(() => {
        this.favourites.push(productId);
        this.notificationService.success('Added to favorites');
      });
    }
  }

  isFavourite(productId: number): boolean {
    return this.favourites.includes(productId);
  }

  addToBasket(productId: number) {
    this.basketService.addToBasket(productId).subscribe({
      next: () => {
        this.notificationService.success('Added to basket');
      },
      error: () => {
        this.notificationService.error('Failed to add to basket');
      }
    });
  }

  changePage(page: number) {
    this.currentPage = page;
    this.loadProducts();
  }

  toggleSort(field: keyof Product) {
    if (this.sortBy === field) {
      this.sortAsc = !this.sortAsc;
    } else {
      this.sortBy = field;
      this.sortAsc = true;
    }
    this.products = this.sortProducts(this.products);
  }

  sortProducts(data: Product[]): Product[] {
    return [...data].sort((a, b) => {
      const aVal = a[this.sortBy];
      const bVal = b[this.sortBy];

      if (typeof aVal === 'string') {
        return this.sortAsc
          ? aVal.localeCompare(bVal as string)
          : (bVal as string).localeCompare(aVal);
      }

      return this.sortAsc ? (+aVal - +bVal) : (+bVal - +aVal);
    });
  }
}
