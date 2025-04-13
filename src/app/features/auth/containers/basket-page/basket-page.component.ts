import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../../../shared/material.module';
import { RouterModule } from '@angular/router';
import { BasketService } from '../../../basket/services/basket.service';
import { NotificationService } from '../../../../services/notification.service';
import { BasketItem } from '../../../basket/models/basket-item.model';
import { Product } from '../../../../models/product.model';

@Component({
  standalone: true,
  selector: 'app-basket-page',
  imports: [CommonModule, MaterialModule, RouterModule],
  templateUrl: './basket-page.component.html',
  styleUrls: ['./basket-page.component.scss']
})
export class BasketPageComponent implements OnInit {
  basketItems: { item: BasketItem; product: Product }[] = [];
  totalPrice = 0;

  constructor(
    private basketService: BasketService,
    private notificationService: NotificationService
  ) {}

  ngOnInit() {
    this.loadBasket();
  }

  loadBasket() {
    this.basketService.getBasketItems().subscribe({
      next: (data) => {
        this.basketItems = data;
        this.updateTotal();
      },
      error: () => {
        this.notificationService.error('Failed to load basket');
      }
    });
  }

  removeItem(productId: number) {
    this.basketService.removeFromBasket(productId).subscribe({
      next: () => {
        this.basketItems = this.basketItems.filter(entry => entry.item.productId !== productId);
        this.updateTotal();
        this.notificationService.success('Item removed');
      },
      error: () => {
        this.notificationService.error('Failed to remove item');
      }
    });
  }

  increaseQuantity(entry: { item: BasketItem; product: Product }) {
    const newQty = entry.item.quantity + 1;
    this.basketService.updateQuantity(entry.item.productId, newQty).subscribe({
      next: () => {
        entry.item.quantity = newQty;
        this.updateTotal();
      },
      error: () => this.notificationService.error('Failed to update quantity')
    });
  }

  decreaseQuantity(entry: { item: BasketItem; product: Product }) {
    if (entry.item.quantity <= 1) return;
    const newQty = entry.item.quantity - 1;
    this.basketService.updateQuantity(entry.item.productId, newQty).subscribe({
      next: () => {
        entry.item.quantity = newQty;
        this.updateTotal();
      },
      error: () => this.notificationService.error('Failed to update quantity')
    });
  }

  updateTotal() {
    this.totalPrice = this.basketItems.reduce(
      (sum, entry) => sum + entry.product.price * entry.item.quantity,
      0
    );
  }
}
