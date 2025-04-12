
import { Routes } from '@angular/router';
import { LoginPageComponent } from './features/auth/features/auth/pages/login-page/login-page.component';
import { RegisterPageComponent } from './features/auth/features/auth/pages/register-page/register-page.component';
import { ProductListPageComponent } from './features/auth/features/auth/pages/product-list-page/product-list-page.component';
import { ProductDetailsPageComponent } from './features/auth/features/auth/pages/product-details-page/product-details-page.component';
import { BasketPageComponent } from './features/auth/features/auth/pages/basket-page/basket-page.component';

import { authGuard } from './core/guards/auth.guard';
import { FavoriteProductsPageComponent } from './features/auth/features/auth/pages/favorite-products-page/favorite-products-page.component';
import { MyAccountPageComponent } from './features/auth/features/auth/pages/my-account-page/my-account-page.component';

export const routes: Routes = [
  { path: '', redirectTo: 'products', pathMatch: 'full' },
  { path: 'products', component: ProductListPageComponent },
  { path: 'products/:id', component: ProductDetailsPageComponent },
  { path: 'basket', component: BasketPageComponent, canActivate: [authGuard] },
  { path: 'auth/login', component: LoginPageComponent },
  { path: 'auth/register', component: RegisterPageComponent },
  { path: 'favorites', component: FavoriteProductsPageComponent, canActivate: [authGuard] },
  { path: 'account', component: MyAccountPageComponent, canActivate: [authGuard] },
  { path: 'auth/login', component: LoginPageComponent },
  { path: 'auth/register', component: RegisterPageComponent },
];

