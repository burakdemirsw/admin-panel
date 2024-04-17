import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HeaderServiceService {

  private pageTitleSource = new BehaviorSubject<string>('Default Page');
  currentPageTitle = this.pageTitleSource.asObservable();

  constructor() { }

  updatePageTitle(title: string) {
    this.pageTitleSource.next(title);
  }
}
