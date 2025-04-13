import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../../../shared/material.module';
import { RouterModule } from '@angular/router';
import { BasketService } from '../../../basket/services/basket.service';
import { NotificationService } from '../../../../services/notification.service';
import { BasketItem } from '../../../basket/models/basket-item.model';


@Component({
  standalone: true,
  selector: 'app-basket-page',
  imports: [CommonModule, MaterialModule, RouterModule],
  templateUrl: './basket-page.component.html',
  styleUrls: ['./basket-page.component.scss']
})
export class BasketPageComponent implements OnInit {
  basketItems: any[] = [];
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
      next: (items) => {
        this.basketItems = items;
        this.totalPrice = items.reduce((sum, item) => sum + item.product.price, 0);
      },
      error: () => {
        this.notificationService.error('Failed to load basket');
      }
    });
  }

  removeItem(productId: number) {
    this.basketService.removeFromBasket(productId).subscribe({
      next: () => {
        this.basketItems = this.basketItems.filter(item => item.productId !== productId);
        this.totalPrice = this.basketItems.reduce((sum, item) => sum + item.product.price, 0);
        this.notificationService.success('Item removed');
      },
      error: () => {
        this.notificationService.error('Failed to remove item');
      }
    });
  }


  increaseQuantity(item: BasketItem) {
    const newQty = item.quantity + 1;
    this.basketService.updateQuantity(item.productId, newQty).subscribe({
      next: () => {
        item.quantity = newQty;
        this.updateTotal();
      },
      error: () => this.notificationService.error('Failed to update quantity')
    });
  }
  
  decreaseQuantity(item: BasketItem) {
    if (item.quantity <= 1) return;
    const newQty = item.quantity - 1;
    this.basketService.updateQuantity(item.productId, newQty).subscribe({
      next: () => {
        item.quantity = newQty;
        this.updateTotal();
      },
      error: () => this.notificationService.error('Failed to update quantity')
    });
  }
  
  updateTotal() {
    this.totalPrice = this.basketItems.reduce((sum, item) => sum + item.quantity * item.product.price, 0);
  }
}
