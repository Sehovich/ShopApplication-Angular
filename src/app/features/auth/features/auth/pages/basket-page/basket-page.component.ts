import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../../../../../shared/material.module';
import { BasketService } from '../../../../../../services/basket.service';
import { Product } from '../../../../../../models/product.model';


@Component({
  standalone: true,
  selector: 'app-basket-page',
  imports: [CommonModule, MaterialModule],
  templateUrl: './basket-page.component.html',
})
export class BasketPageComponent {
  items: Product[] = [];

  constructor(private basketService: BasketService) {
    this.items = this.basketService.getItems();
  }

  remove(id: number) {
    this.basketService.remove(id);
    this.items = this.basketService.getItems();
  }

  clear() {
    this.basketService.clear();
    this.items = [];
  }
}
