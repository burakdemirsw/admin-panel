import { Component, OnInit, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common'
import { Router } from '@angular/router';
import { SessionService } from 'src/app/services/ui/session.service';
import { UserService } from 'src/app/services/admin/user.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor(private userService: UserService, @Inject(DOCUMENT) private document: Document, private router: Router, private sessionService: SessionService) { }

  userName: string;
  ngOnInit(): void {
    var userName = localStorage.getItem('name') + " " + localStorage.getItem('surname');

    if (userName) {
      this.userName = userName;

    }
  }
  sidebarToggle() {
    //toggle sidebar function
    this.document.body.classList.toggle('toggle-sidebar');
  }
  logOut() {
    this.userService.logOut();
  }
}
