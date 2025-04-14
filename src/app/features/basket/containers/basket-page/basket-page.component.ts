import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../../../shared/material.module';
import { RouterModule } from '@angular/router';
import { BasketService } from '../../services/basket.service';
import { NotificationService } from '../../../../services/notification.service';
import { BasketItem } from '../../models/basket-item.model';
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
        const grouped = new Map<number, { item: BasketItem; product: Product }>();

        for (const entry of data) {
          const existing = grouped.get(entry.item.productId);
          if (existing) {
            existing.item.quantity += entry.item.quantity;
          } else {
            grouped.set(entry.item.productId, { ...entry });
          }
        }

        this.basketItems = Array.from(grouped.values());
        this.updateTotal();
      },
      error: () => {
        this.notificationService.error('Failed to load basket');
      }
    });
  }

  increaseQuantity(entry: { item: BasketItem; product: Product }) {
    const newQty = entry.item.quantity + 1;
    this.basketService.updateQuantity(entry.item.productId, newQty).subscribe({
      next: () => {
        entry.item.quantity = newQty;
        this.updateTotal(); // ✅ just update local total
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
        this.updateTotal(); // ✅ do not reload from backend
      },
      error: () => this.notificationService.error('Failed to update quantity')
    });
  }
  

  addToBasket(productId: number) {
    this.basketService.addToBasket(productId).subscribe({
      next: () => {
        this.basketService.getBasketItems().subscribe();
        this.notificationService.success('Added to basket');
      },
      error: () => {
        this.notificationService.error('Failed to add to basket');
      }
    });
  }
  

removeItem(productId: number) {
  const entry = this.basketItems.find(e => e.item.productId === productId);
  if (!entry) return;

  if (entry.item.quantity > 1) {
    this.decreaseQuantity(entry); // Just lower quantity
  } else {
    this.basketService.removeFromBasket(productId).subscribe({
      next: () => {
        this.basketItems = this.basketItems.filter(e => e.item.productId !== productId);
        this.basketService.refreshBasketCount(); // ✅ sync navbar count
        this.updateTotal();
        this.notificationService.success('Item removed');
      },
      error: () => {
        this.notificationService.error('Failed to remove item');
      }
    });
  }
}


  updateTotal() {
    this.totalPrice = this.basketItems.reduce(
      (sum, entry) => sum + entry.product.price * entry.item.quantity,
      0
    );
  }
}
