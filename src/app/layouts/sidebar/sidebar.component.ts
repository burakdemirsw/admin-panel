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
  roleDescription: string;
  userId: string;
  ngOnInit(): void {
    this.roleDescription = localStorage.getItem("roleDescription")
    this.userId = localStorage.getItem("userId")

  }
  async routeNewPage() {
    const result = await this.generalService.generateGUID()
    this.router.navigate(["/warehouse-operation/" + result])
  }
  async routeNewPage2() {
    const result = await this.generalService.generateGUID()
    this.router.navigate(["/warehouse-operation/" + "REQ-" + result + "/0"])
  }

  async routeNewPage3(pageDesc: boolean) {
    if (pageDesc) {
      const result = await this.generalService.generateGUID()
      location.href = location.origin + "/create-order/quick-order/" + result;
    } else {
      const result = await this.generalService.generateGUID()

      location.href = location.origin + "/create-order/retail-order/" + result;
    }

  }
  async routeNewPage4() {
    const result = await this.generalService.generateGUID()
    this.router.navigate(["/create-barcode/" + result])
  }

  async routeNewPage5() {
    const result = await this.generalService.generateGUID()
    this.router.navigate(["/shelf-transfer-request/" + result +
      "/0"
    ])
  }

  async routeNewPage6() {
    const result = await this.generalService.generateGUID()
    this.router.navigate(["/fast-transfer/" + result

    ])
  }
  async routeNewPage7() {
    const result = await this.generalService.generateGUID()
    this.router.navigate(["/create-product-barcode/" + result

    ])
  }
}
