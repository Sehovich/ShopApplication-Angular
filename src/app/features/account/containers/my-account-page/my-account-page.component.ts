import { Component, OnInit } from '@angular/core';
import { UserService, UserInfoDto } from '../../../../services/user.service';
import { MaterialModule } from '../../../../shared/material.module';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-my-account-page',
  templateUrl: './my-account-page.component.html',
  styleUrls: ['./my-account-page.component.scss'],
  imports : [MaterialModule,CommonModule], 
})
export class MyAccountPageComponent implements OnInit {
  userInfo: UserInfoDto | null = null;
  isLoading = true;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.userService.getCurrentUser().subscribe({
      next: (data) => {
        this.userInfo = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('[MyAccount] Failed to load user', err);
        this.isLoading = false;
      }
    });
  }
}
