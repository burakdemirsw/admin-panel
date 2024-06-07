import { Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HeaderService {

  private pageTitleSource = new BehaviorSubject<string>('');
  currentPageTitle = this.pageTitleSource.asObservable();

  constructor(private titleService: Title) { }

  updatePageTitle(title: string) {
    this.titleService.setTitle(title); // SEO title'ını günceller
    if (title.length > 25) {
      title = title.substring(0, 25) + '.';
    }
    this.pageTitleSource.next(title);
  }
}
