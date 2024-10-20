import { Component } from '@angular/core';
import { HeaderService } from 'src/app/services/admin/header.service';
import { OrderService } from 'src/app/services/admin/order.service';
import { ClientCustomer } from '../customer-list/customer-list.component';
import { WarehouseService } from 'src/app/services/admin/warehouse.service';
import { CustomerModel } from 'src/app/models/model/customer/customerModel';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { GeneralService } from 'src/app/services/admin/general.service';
import { ProductService } from 'src/app/services/admin/product.service';
import { ToasterService } from 'src/app/services/ui/toaster.service';
import { UserService } from 'src/app/services/admin/user.service';
import { CustomerService } from 'src/app/services/admin/customer.service';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrl: './customers.component.css'
})
export class CustomersComponent {
  customers: CustomerModel[] = []
  currentPage = 0
  constructor(
    private formBuilder: FormBuilder,
    private toasterService: ToasterService,
    private orderService: OrderService,
    private productService: ProductService,
    private warehouseService: WarehouseService,
    private generalService: GeneralService,
    private activatedRoute: ActivatedRoute,
    private headerService: HeaderService,
    private routerService: Router,
    private userService: UserService,
    private customerService: CustomerService
  ) { }

  type: string;
  route: string;

  async ngOnInit() {
    this.activatedRoute.params.subscribe(async (params) => {
      if (params) {
        if (params["type"] == "vendor") {
          this.route = params["type"]
          this.type = "1"
          this.headerService.updatePageTitle("Tedarikçi Listesi")
          this.customers = await this.customerService.getCustomerList(this.type);

        }
        if (params["type"] == "retail") {
          this.route = params["type"]
          this.type = "4"
          this.headerService.updatePageTitle("Perakende Müşteri Listesi")
          this.customers = await this.customerService.getCustomerList(this.type);

        }
        if (params["type"] == "whosale") {
          this.route = params["type"]
          this.type = "3"
          this.headerService.updatePageTitle("Toptan Müşteri Listesi")
          this.customers = await this.customerService.getCustomerList(this.type);

        }
      }

    })
  }

  goPage(customer: CustomerModel) {
    this.routerService.navigate(["add-customer", this.route, customer.currAccCode])
  }
}
