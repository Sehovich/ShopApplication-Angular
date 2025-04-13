import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../../../shared/material.module';
import { Product } from '../../../../models/product.model';
import { ProductService } from '../../../../services/product.service';
import { NotificationService } from '../../../../services/notification.service';



@Component({
  standalone: true,
  selector: 'app-favorite-products-page',
  imports: [CommonModule, MaterialModule],
  templateUrl: './favorite-products-page.component.html'
})
export class FavoriteProductsPageComponent implements OnInit {
  favorites: Product[] = [];

  constructor(
    private productService: ProductService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    const ids = this.getFavoriteIds();
    ids.forEach(id => {
      this.productService.getProductById(id).subscribe(product => {
        this.favorites.push(product);
      });
    });
  }

  getFavoriteIds(): number[] {
    return JSON.parse(localStorage.getItem('favorites') || '[]');
  }

  removeFromFavorites(id: number) {
    const updated = this.getFavoriteIds().filter(favId => favId !== id);
    localStorage.setItem('favorites', JSON.stringify(updated));
    this.favorites = this.favorites.filter(p => p.id !== id);
    this.notificationService.success('Removed from favorites');
  }
}