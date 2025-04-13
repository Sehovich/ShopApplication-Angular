
import { Routes } from '@angular/router';
import { LoginPageComponent } from './features/auth/containers/login-page/login-page.component';
import { RegisterPageComponent } from './features/auth/containers/register-page/register-page.component';
import { ProductListPageComponent } from './features/auth/containers/product-list-page/product-list-page.component';
import { ProductDetailsPageComponent } from './features/auth/containers/product-details-page/product-details-page.component';
import { BasketPageComponent } from './features/auth/containers/basket-page/basket-page.component';
import { FavoriteProductsPageComponent } from './features/favorites/containers/favorite-products-page/favorite-products-page.component';
import { MyAccountPageComponent } from './features/account/containers/my-account-page/my-account-page.component';

import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
    { path: '', redirectTo: 'products', pathMatch: 'full' },
    { path: 'products', component: ProductListPageComponent },
    { path: 'products/:id', component: ProductDetailsPageComponent },
    { path: 'basket', component: BasketPageComponent, canActivate: [authGuard] },
    { path: 'auth/login', component: LoginPageComponent },
    { path: 'auth/register', component: RegisterPageComponent },
    { path: 'favorites', component: FavoriteProductsPageComponent, canActivate: [authGuard] },
    { path: 'account', component: MyAccountPageComponent, canActivate: [authGuard] }
    
  ];
  

