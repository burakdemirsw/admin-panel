import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HeaderService {

  private pageTitleSource = new BehaviorSubject<string>('');
  currentPageTitle = this.pageTitleSource.asObservable();

  constructor() { }

  updatePageTitle(title: string) {
    if (title.length > 25) {
      title = title.substring(0, 25) + '.';
    }
    this.pageTitleSource.next(title);
  }
}
