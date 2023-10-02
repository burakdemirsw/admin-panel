import { DOCUMENT } from '@angular/common';
import { Component ,ElementRef, Inject,HostListener } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'admindashboard';
  
  constructor(@Inject(DOCUMENT) private document,private elementRef: ElementRef,  public  _router: Router) {
    const isMobile = window.innerWidth <= 768; 
    const bodyClassList = this.document.body.classList;

    this._router.events.subscribe((event) => {
      if (window.innerWidth <= 768) {
        bodyClassList.remove('toggle-sidebar');
      } else {
        if (bodyClassList.contains('toggle-sidebar')) {
         // bodyClassList.remove('toggle-sidebar');
        } else {
          bodyClassList.add('toggle-sidebar');
        }
      }
    });

  }
  

  ngOnInit() {

    var s = document.createElement("script");
    s.type = "text/javascript";
    s.src = "../assets/js/main.js";



  }
}
