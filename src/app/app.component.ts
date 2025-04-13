import { Component } from '@angular/core';

import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './shared/navbar/navbar.component';

@Component({
  standalone: true,
  selector: 'app-root',
  imports: [RouterOutlet, NavbarComponent],
  template: `
    
    
    <div class="page-wrapper">
    <app-navbar></app-navbar>
      <router-outlet></router-outlet>
    </div>
  `,
})
export class AppComponent {}
