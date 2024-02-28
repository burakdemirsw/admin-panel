import { DOCUMENT } from '@angular/common';
import { Component, ElementRef, Inject, HostListener } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'admindashboard';

  constructor(@Inject(DOCUMENT) private document, private elementRef: ElementRef, public _router: Router) {
    const isMobile = window.innerWidth <= 768;
    const bodyClassList = this.document.body.classList;

    this._router.events.subscribe((event) => {
      if (bodyClassList.contains('toggle-sidebar')) {
        //console.log('algılandı(1)');
        bodyClassList.remove('toggle-sidebar');
      }
    });

  }

  ngOnInit() {
    var s = document.createElement("script");
    s.type = "text/javascript";
    s.src = "../assets/js/main.js";
    console.clear();

  }

  @HostListener('document:click', ['$event'])
  onClick(event: MouseEvent) {
    const sidebar = document.getElementById('sidebar');
    const header = document.getElementById('header');
    const bodyClassList = this.document.body.classList;
    const isMobile = window.innerWidth <= 768;
    if ((sidebar && !sidebar.contains(event.target as Node)) && (header && !header.contains(event.target as Node))) {
      //   console.log('algılandı(3)');
      if (bodyClassList.contains('toggle-sidebar')) {
        bodyClassList.remove('toggle-sidebar');
      }
      if (!isMobile) {
        if (!bodyClassList.contains('toggle-sidebar')) {
          // console.log('Pc de Farklı Yere Tıklandığı için Sidebar Kapandı');
          bodyClassList.add('toggle-sidebar');
        }
      }
    }
  }
}
