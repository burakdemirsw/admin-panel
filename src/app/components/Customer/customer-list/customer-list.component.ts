import { Component, OnInit } from '@angular/core';
import { ClientCustomer } from '../../Order/create-order/models/createCustomer_CM';
import { OrderService } from 'src/app/services/admin/order.service';
import { HeaderService } from 'src/app/services/admin/header.service';

@Component({
  selector: 'app-customer-list',
  templateUrl: './customer-list.component.html',
  styleUrls: ['./customer-list.component.css']
})
export class CustomerListComponent implements OnInit {
  customers: ClientCustomer[] = []
  currentPage = 0
  constructor(private orderService: OrderService, private headerService: HeaderService) { }

  async ngOnInit() {
    this.headerService.updatePageTitle("Müşteri Listesi")
    var salesPersonCode = localStorage.getItem('salesPersonCode');
    this.customers = await this.orderService.getClientCustomer(salesPersonCode);
  }

}
export { ClientCustomer };

