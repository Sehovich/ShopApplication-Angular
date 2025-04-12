
import { Routes } from '@angular/router';
import { LoginPageComponent } from './features/auth/features/auth/pages/login-page/login-page.component';
import { RegisterPageComponent } from './features/auth/features/auth/pages/register-page/register-page.component';
import { ProductListPageComponent } from './features/auth/features/auth/pages/product-list-page/product-list-page.component';

export const routes: Routes = [
  { path: '', redirectTo: 'products', pathMatch: 'full' },
  { path: 'auth/login', component: LoginPageComponent },
  { path: 'auth/register', component: RegisterPageComponent },
  { path: 'products', component: ProductListPageComponent },
  
];
