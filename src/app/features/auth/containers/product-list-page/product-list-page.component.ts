import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RouterModule } from '@angular/router';
import { MaterialModule } from '../../../../shared/material.module';
import { Product } from '../../../../models/product.model';
import { ProductService } from '../../../../services/product.service';


@Component({
  standalone: true,
  selector: 'app-product-list-page',
  imports: [CommonModule, MaterialModule, RouterModule],
  templateUrl: './product-list-page.component.html',
  styleUrls: ['./product-list-page.component.scss']
})
export class ProductListPageComponent implements OnInit {
  products: Product[] = [];

  currentPage = 1;
  pageSize = 8;

  sortBy: keyof Product = 'title';
  sortAsc = true;

  loading = false;

  constructor(private productService: ProductService) {}

  ngOnInit() {
    this.loadProducts();
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
