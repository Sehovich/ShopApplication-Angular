import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../material.module';

import { NotificationService } from '../../services/notification.service';
import { AuthStore } from '../../features/auth/store/auth.store';
import { AuthService } from '../../services/auth.service';
import { BasketService } from '../../features/basket/services/basket.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  imports: [CommonModule, MaterialModule, RouterModule],
})
export class NavbarComponent implements OnInit, OnDestroy {
  basketCount = 0;
  private basketSub?: Subscription;

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
    
    this.basketSub = this.basketService.getBasketCount().subscribe({
      next: count => this.basketCount = count,
    });

    
    if (this.isLoggedIn) {
      this.basketService.getBasketItems().subscribe(); 
    }
  }

  logout(): void {
    this.authService.logout();
    this.basketService.clearCache(); 
    this.notificationService.success('You have been logged out');
    this.router.navigate(['/auth/login']);
  }

  ngOnDestroy(): void {
    this.basketSub?.unsubscribe();
  }
}
