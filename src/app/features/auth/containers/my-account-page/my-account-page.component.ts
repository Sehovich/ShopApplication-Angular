import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../../../shared/material.module';



@Component({
  standalone: true,
  selector: 'app-my-account-page',
  imports: [CommonModule, MaterialModule],
  templateUrl: './my-account-page.component.html'
})
export class MyAccountPageComponent {
  user = this.getUser();

  getUser() {
    const token = localStorage.getItem('token');
    
    return token ? { username: 'Logged In User', email: 'user@example.com' } : null;
  }

  logout() {
    localStorage.removeItem('token');
    window.location.href = '/auth/login';
  }
}
