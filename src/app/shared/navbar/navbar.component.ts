import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../material.module';

import { NotificationService } from '../../services/notification.service';
import { AuthStore } from '../../features/auth/store/auth.store';
import { AuthService } from '../../services/auth.service';
import { BasketService } from '../../features/basket/services/basket.service';


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  imports: [CommonModule, MaterialModule, RouterModule],
})
export class NavbarComponent implements OnInit {
  basketCount = 0;

  get isLoggedIn(): boolean {
    return AuthStore.isAuthenticated(); 
  }

  get userEmail(): string | null {
    return AuthStore.getUserEmail();
  }

  get username(): string | null {
    return AuthStore.getUsername();
  }

  constructor(
    private router: Router,
    private basketService: BasketService,
    private notificationService: NotificationService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    if (this.isLoggedIn) {
      this.basketService.getBasketItems().subscribe({
        next: (items) => this.basketCount = items.length,
        error: () => this.basketCount = 0
      });
    }
  }

  logout(): void {
    this.authService.logout();
    this.notificationService.success('You have been logged out');
    this.router.navigate(['/auth/login']);
  }
}

