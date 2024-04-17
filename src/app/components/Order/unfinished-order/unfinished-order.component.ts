import { Component, OnInit } from '@angular/core';
import { CargoService } from 'src/app/services/admin/cargo.service';
import { ToasterService } from 'src/app/services/ui/toaster.service';
import { CargoBarcode_VM, GetPackageStatus_MNG_Response } from '../../cargo/create-cargo/models/models';
import { ClientOrder } from '../create-order/models/nebimOrder';
import { OrderService } from 'src/app/services/admin/order.service';

@Component({
  selector: 'app-unfinished-order',
  templateUrl: './unfinished-order.component.html',
  styleUrls: ['./unfinished-order.component.css']
})
export class UnfinishedOrderComponent implements OnInit {

  constructor(private toasterService: ToasterService, private orderService: OrderService) { }
  currentPage = 1;
  orders: ClientOrder[] = [];
  visible: boolean = false;
  currentOrderState: boolean = false;
  ngOnInit(): void {
    this.getOrders(this.currentOrderState);
  }

  async getOrders(isCompleted: boolean) {
    this.currentOrderState = isCompleted;
    this.orders = await this.orderService.getClientOrders(isCompleted);
    this.filterOrdersByRole();
  }
  filterOrdersByRole() {
    if (localStorage.getItem('roleDescription') != 'Admin') {
      this.orders = this.orders.filter(x => x.customerCode == localStorage.getItem('salesPersonCode'))
      this.toasterService.info('Sadece Kendi Siparişlerinizi Görebilirsiniz.')
    }
  }

  async deleteClientOrder(id: string) {
    var windowResponse = window.confirm("Silmek istediğinize emin misiniz?")

    if (!windowResponse)
      return;
    var response = await this.orderService.deleteClientOrder(id);
    if (response) {
      this.toasterService.success("Sipariş Silindi")
      this.getOrders(this.currentOrderState)
    }
  }
}
