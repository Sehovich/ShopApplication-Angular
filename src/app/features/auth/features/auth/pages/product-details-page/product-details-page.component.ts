import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { MaterialModule } from '../../../../../../shared/material.module';
import { Product } from '../../../../../../models/product.model';
import { ProductService } from '../../../../../../services/product.service';


@Component({
  standalone: true,
  selector: 'app-product-details-page',
  imports: [CommonModule, MaterialModule],
  templateUrl: './product-details-page.component.html',
  styleUrls: ['./product-details-page.component.scss']
})
export class ProductDetailsPageComponent implements OnInit {
  product!: Product;
  isFavorite = false;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService
  ) {}

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.productService.getProductById(id).subscribe((res) => {
      this.product = res;
      this.isFavorite = this.checkFavorite(this.product.id);
    });
  }

  toggleFavorite() {
    const favs = this.getFavorites();
    if (this.isFavorite) {
      localStorage.setItem('favorites', JSON.stringify(favs.filter(id => id !== this.product.id)));
    } else {
      localStorage.setItem('favorites', JSON.stringify([...favs, this.product.id]));
    }
    this.isFavorite = !this.isFavorite;
  }

  getFavorites(): number[] {
    return JSON.parse(localStorage.getItem('favorites') || '[]');
  }

  checkFavorite(id: number): boolean {
    return this.getFavorites().includes(id);
  }
}
