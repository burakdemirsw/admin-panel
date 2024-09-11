import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'src/app/models/model/company/companyInfo';
import { GeneralService } from 'src/app/services/admin/general.service';
import { InfoService } from 'src/app/services/admin/info.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})

export class SidebarComponent implements OnInit {

  constructor(private router: Router, private generalService: GeneralService, private infoService: InfoService) { }
  roleDescription: string;
  userId: string;
  menuItems: MenuItem[] = [];
  async ngOnInit() {

    this.roleDescription = localStorage.getItem("roleDescription")
    this.userId = localStorage.getItem("userId")
    await this.loadMenu();
  }

  async loadMenu() {
    try {
      const data: MenuItem[] = await this.infoService.getStructuredMenu();

      // Temporary array to hold items that are not "Ayarlar"
      const otherItems: MenuItem[] = [];
      let ayarlarItem: MenuItem | null = null;

      // Check user role
      const userRole = localStorage.getItem("roleDescription");

      // Separate "Ayarlar" item from the rest based on role
      for (const item of data) {
        if (userRole === 'Salesman') {
          // If the role is Salesman, include specific items
          if (item.label === 'Toptan Satış') {
            // Within "Toptan Satış", only include "Siparişlerim"
            const filteredSubItems = item.children?.filter(subItem => subItem.label === 'Siparişlerim' || subItem.label === 'Sipariş Ver' || subItem.label === 'Perakende Satış') || [];
            if (filteredSubItems.length > 0) {
              item.children = filteredSubItems; // Set only the "Siparişlerim" submenu
              otherItems.push(item); // Add the modified "Toptan Satış" menu
            }
          } else if (['Satış & Pazarlama', 'Ürünler'].includes(item.label)) {
            otherItems.push(item); // Add these menu items unchanged
          }
        } else {
          // For non-admin roles, include items except "Anasayfa"
          if (item.label === 'Ayarlar') {
            ayarlarItem = item;
          } else if (item.label === 'Anasayfa') {
            continue;
          } else {
            otherItems.push(item);
          }
        }
      }

      // Add "Ayarlar" item to the end if it exists
      if (ayarlarItem) {
        otherItems.push(ayarlarItem);
      }

      // Update menuItems with reordered list
      this.menuItems = otherItems;
    } catch (error) {
      console.error('Error loading menu', error);
    }
  }

  onAction(action: string, param?: any) {
    switch (action) {
      case 'routeNewPage':
        this.routeNewPage();
        break;
      case 'routeNewPage2':
        this.routeNewPage2();
        break;
      case 'routeNewPage3(true)':
        this.routeNewPage3(true);
        break;
      case 'routeNewPage3(false)':
        this.routeNewPage3(false);
        break;
      case 'routeNewPage4':
        this.routeNewPage4();
        break;
      case 'routeNewPage5':
        this.routeNewPage5();
        break;
      case 'routeNewPage6':
        this.routeNewPage6();
        break;
      case 'routeNewPage7':
        this.routeNewPage7();
        break;
      default:
        console.error(`Action "${action}" not found`);
    }
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
