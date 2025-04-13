import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../../../shared/material.module';
import { RouterModule } from '@angular/router';
import { Product } from '../../../../models/product.model';
import { ProductService } from '../../../products/services/product.service';
import { ProductFavouriteService } from '../../services/product-favourite.service';
import { BasketService } from '../../../basket/services/basket.service';
import { NotificationService } from '../../../../services/notification.service';
import { firstValueFrom } from 'rxjs';

@Component({
  standalone: true,
  selector: 'app-favorite-products-page',
  imports: [CommonModule, MaterialModule, RouterModule],
  templateUrl: './favorite-products-page.component.html',
  styleUrls: ['./favorite-products-page.component.scss']
})
export class FavoriteProductsPageComponent implements OnInit {
  favoriteProducts: Product[] = [];

  constructor(
    private productService: ProductService,
    private favouriteService: ProductFavouriteService,
    private basketService: BasketService,
    private notificationService: NotificationService
  ) {}

  async ngOnInit() {
    await this.loadFavorites();
  }

  async loadFavorites() {
    try {
      const favs = await firstValueFrom(this.favouriteService.getUserFavourites());
      const productPromises = favs.map(f =>
        firstValueFrom(this.productService.getProductById(f.productId))
      );
      const products = await Promise.all(productPromises);
      this.favoriteProducts = products;
    } catch (err) {
      console.error('Failed to load favorite products', err);
    }
  }

  addToBasket(productId: number): void {
    this.basketService.addToBasket(productId).subscribe({
      next: () => {
        this.basketService.getBasketItems().subscribe(); // update count
        this.notificationService.success('Product added to basket');
      },
      error: () => {
        this.notificationService.error('Failed to add product to basket');
      }
    });
  }
}
