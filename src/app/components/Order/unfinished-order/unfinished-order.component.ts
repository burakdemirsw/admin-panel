import { Component, OnInit } from '@angular/core';
import { HeaderService } from 'src/app/services/admin/header.service';
import { OrderService } from 'src/app/services/admin/order.service';
import { ToasterService } from 'src/app/services/ui/toaster.service';
import { ClientOrder } from '../../../models/model/order/nebimOrder';

@Component({
  selector: 'app-unfinished-order',
  templateUrl: './unfinished-order.component.html',
  styleUrls: ['./unfinished-order.component.css']
})
export class UnfinishedOrderComponent implements OnInit {

  constructor(private headerService: HeaderService
    , private toasterService: ToasterService, private orderService: OrderService) { }
  currentPage = 1;
  orders: ClientOrder[] = [];
  visible: boolean = false;
  currentOrderState: boolean = false;
  ngOnInit(): void {
    this.getOrders(this.currentOrderState);

  }

  async getOrders(isCompleted: boolean) {
    this.headerService.updatePageTitle("Panel Siparişleri");
    this.currentOrderState = isCompleted;
    this.orders = await this.orderService.getClientOrders(isCompleted);
    this.filterOrdersByRole();
    this.headerService.updatePageTitle((this.currentOrderState == true ? "Tamamlanmış" : "Tamamlanmamış") + " Siparişler");
  }
  filterOrdersByRole() {
    if (localStorage.getItem('roleDescription') != 'Admin') {
      this.orders = this.orders.filter(x => x.customerCode == localStorage.getItem('salesPersonCode'))
      this.toasterService.info('Sadece Kendi Siparişlerinizi Görebilirsiniz.')
    }
  }

  async deleteClientOrder(id: string) {
    var response = await this.orderService.deleteClientOrder(id);
    if (response) {
      this.toasterService.success("Sipariş Silindi")
      this.getOrders(this.currentOrderState)
    }
  }

  async updateCargoStatus(order: ClientOrder) {
    var order_response = await this.orderService.getClientOrder(order.id);
    if (order_response) {

      if (order_response.clientOrder.cargoStatus == "KARGO VAR") {
        order_response.clientOrder.cargoStatus = "KARGO YOK"
      } else {
        order_response.clientOrder.cargoStatus = "KARGO VAR"
      }

      var update_response = await this.orderService.createClientOrder(order_response.clientOrder);
      if (update_response) {
        this.toasterService.success("Kargo Durumu Güncellendi")
        this.getOrders(this.currentOrderState)

      }
    }

  }
}
