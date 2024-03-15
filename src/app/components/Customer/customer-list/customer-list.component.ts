import { Component, OnInit } from '@angular/core';
import { ClientCustomer } from '../../Order/create-order/models/createCustomer_CM';
import { OrderService } from 'src/app/services/admin/order.service';

@Component({
  selector: 'app-customer-list',
  templateUrl: './customer-list.component.html',
  styleUrls: ['./customer-list.component.css']
})
export class CustomerListComponent implements OnInit {
  customers: ClientCustomer[] = []
  currentPage = 0
  constructor(private orderService: OrderService) { }

  async ngOnInit() {
    var salesPersonCode = localStorage.getItem('salesPersonCode');
    this.customers = await this.orderService.getClientCustomer(salesPersonCode);
  }

}
export { ClientCustomer };

