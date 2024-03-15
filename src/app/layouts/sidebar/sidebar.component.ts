import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GeneralService } from 'src/app/services/admin/general.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

  constructor(private router: Router, private generalService: GeneralService) { }

  ngOnInit(): void {
  }
  async routeNewPage() {
    const result = await this.generalService.generateGUID()
    this.router.navigate(["/warehouse-operation/" + result])
  }
  async routeNewPage2() {
    const result = await this.generalService.generateGUID()
    this.router.navigate(["/warehouse-operation/" + "REQ-" + result])
  }

  async routeNewPage3() {
    const result = await this.generalService.generateGUID()
    this.router.navigate(["/create-order/" + result])
  }



}
