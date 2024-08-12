import { Component } from '@angular/core';

@Component({
  selector: 'app-pages-unauthorized',
  standalone: true,
  imports: [],
  templateUrl: './pages-unauthorized.component.html',
  styleUrl: './pages-unauthorized.component.css'
})
export class PagesUnauthorizedComponent {
  goBack() {
    window.history.back();
  }
}
