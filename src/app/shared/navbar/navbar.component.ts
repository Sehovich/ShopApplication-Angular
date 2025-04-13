import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../material.module';
import { BasketService } from '../../services/basket.service';
import { NotificationService } from '../../services/notification.service';
import { AuthStore } from '../../features/auth/store/auth.store';
import { AuthService } from '../../services/auth.service';


@Component({
  standalone: true,
  selector: 'app-navbar',
  imports: [CommonModule, RouterModule, MaterialModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
  get isLoggedIn(): boolean {
    return AuthStore.isAuthenticated(); 
  }

  get basketCount(): number {
    return this.basketService.getItems().length;
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

  logout(): void {
    this.authService.logout();
    this.notificationService.success('You have been logged out');
    this.router.navigate(['/auth/login']);
  }
}
