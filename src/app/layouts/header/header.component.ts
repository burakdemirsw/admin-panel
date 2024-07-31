import { Component, OnInit, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common'
import { Router } from '@angular/router';
import { SessionService } from 'src/app/services/ui/session.service';
import { UserService } from 'src/app/services/admin/user.service';
import { HeaderService } from '../../services/admin/header.service';
import { UserClientInfoResponse } from 'src/app/models/model/user/userRegister_VM';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor(private headerService: HeaderService, private userService: UserService, @Inject(DOCUMENT) private document: Document, private router: Router, private sessionService: SessionService) { }

  user_info: UserClientInfoResponse;
  userName: string;
  currentPageTitle: string = '';
  ngOnInit(): void {

    this.user_info = this.userService.getUserClientInfoResponse();
    this.headerService.currentPageTitle.subscribe(title => {
      this.currentPageTitle = title;
    });
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
