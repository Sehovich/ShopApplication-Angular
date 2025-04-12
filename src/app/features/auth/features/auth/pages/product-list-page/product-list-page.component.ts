import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../../../../../shared/material.module';
import { Product } from '../../../../../../models/product.model';
import { ProductService } from '../../../../../../services/product.service';
import { RouterModule } from '@angular/router';



@Component({
  standalone: true,
  selector: 'app-product-list-page',
  imports: [CommonModule, MaterialModule, RouterModule],
  templateUrl: './product-list-page.component.html',
  styleUrls: ['./product-list-page.component.scss']
})
export class ProductListPageComponent implements OnInit {
  products: Product[] = [];
  paginated: Product[] = [];

  currentPage = 1;
  pageSize = 8;

  sortBy: keyof Product = 'title';
  sortAsc = true;

  constructor(private productService: ProductService) {}

  ngOnInit() {
    this.productService.getProducts().subscribe((res) => {
      this.products = res;
      this.applyPagination();
    });
  }

  changePage(page: number) {
    this.currentPage = page;
    this.applyPagination();
  }

  toggleSort(field: keyof Product) {
    if (this.sortBy === field) {
      this.sortAsc = !this.sortAsc;
    } else {
      this.sortBy = field;
      this.sortAsc = true;
    }
    this.applyPagination();
  }

  applyPagination() {
    const sorted = [...this.products].sort((a, b) => {
      const aVal = a[this.sortBy];
      const bVal = b[this.sortBy];

      if (typeof aVal === 'string') {
        return this.sortAsc
          ? aVal.localeCompare(bVal as string)
          : (bVal as string).localeCompare(aVal);
      }

      return this.sortAsc ? (+aVal - +bVal) : (+bVal - +aVal);
    });

    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.paginated = sorted.slice(start, end);
  }
}
