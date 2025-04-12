import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../material.module';
import { BasketService } from '../../services/basket.service';
import { NotificationService } from '../../services/notification.service';


@Component({
  standalone: true,
  selector: 'app-navbar',
  imports: [CommonModule, RouterModule, MaterialModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
  get isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  get basketCount(): number {
    return this.basketService.getItems().length;
  }

  constructor(
    private router: Router,
    private basketService: BasketService,
    private notificationService: NotificationService
  ) {}

  logout() {
    localStorage.removeItem('token');
    this.notificationService.success('You have been logged out');
    this.router.navigate(['/auth/login']);
  }
}
