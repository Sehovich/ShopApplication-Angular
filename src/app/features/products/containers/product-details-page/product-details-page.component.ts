import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../../../shared/material.module';

import { Product } from '../../../../models/product.model';
import { ProductService } from '../../services/product.service';
import { ProductFavouriteService } from '../../../favorites/services/product-favourite.service';
import { BasketService } from '../../../basket/services/basket.service';
import { NotificationService } from '../../../../services/notification.service';

@Component({
  standalone: true,
  selector: 'app-product-details-page',
  templateUrl: './product-details-page.component.html',
  styleUrls: ['./product-details-page.component.scss'],
  imports: [CommonModule, MaterialModule],
})
export class ProductDetailsPageComponent implements OnInit {
  product!: Product;
  isFavorite = false;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private favouriteService: ProductFavouriteService,
    private basketService: BasketService,
    private notificationService: NotificationService
  ) {}

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.productService.getProductById(id).subscribe((res) => {
      this.product = res;
      this.checkFavoriteStatus();
    });
  }

  checkFavoriteStatus() {
    this.favouriteService.getUserFavourites().subscribe({
      next: (favs) => {
        this.isFavorite = favs.some(f => f.productId === this.product.id);
      }
    });
  }

  toggleFavorite() {
    if (this.isFavorite) {
      this.favouriteService.removeFromFavourites(this.product.id).subscribe({
        next: () => {
          this.isFavorite = false;
          this.notificationService.success('Removed from favorites');
        },
        error: () => this.notificationService.error('Failed to remove from favorites')
      });
    } else {
      this.favouriteService.addToFavourites(this.product.id).subscribe({
        next: () => {
          this.isFavorite = true;
          this.notificationService.success('Added to favorites');
        },
        error: () => this.notificationService.error('Failed to add to favorites')
      });
    }
  }

  addToCart() {
    this.basketService.addToBasket(this.product.id).subscribe({
      next: () => {
        this.basketService.getBasketItems().subscribe(); // refresh count
        this.notificationService.success('Added to basket');
      },
      error: () => this.notificationService.error('Failed to add to basket')
    });
  }
}
