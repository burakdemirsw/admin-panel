import { Component, OnInit } from '@angular/core';
import { HeaderService } from 'src/app/services/admin/header.service';
import { OrderService } from 'src/app/services/admin/order.service';
import { ToasterService } from 'src/app/services/ui/toaster.service';
import { ClientOrder, ClientOrder_DTO, ClientOrderFilter } from '../../../models/model/order/nebimOrder';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-unfinished-order',
  templateUrl: './unfinished-order.component.html',
  styleUrls: ['./unfinished-order.component.css']
})
export class UnfinishedOrderComponent implements OnInit {

  constructor(private headerService: HeaderService, private fb: FormBuilder
    , private toasterService: ToasterService, private orderService: OrderService, private router: Router) { }
  currentPage = 1;
  orders: ClientOrder_DTO[] = [];
  visible: boolean = false;
  currentOrderState: boolean = false;
  ngOnInit(): void {
    this.createForm();
    this.getOrders(this.currentOrderState);
  }

  route(order: ClientOrder_DTO) {
    if (order.clientOrder.orderNo.includes('MSG-P')) {
      this.router.navigate(["/create-order/retail-order/" + order.clientOrder.id])
    } else {
      this.router.navigate(["/create-order/quick-order/" + order.clientOrder.id])
    }

  }
  clientOrderFilterForm: FormGroup;
  createForm() {
    this.clientOrderFilterForm = this.fb.group({
      customerCode: [null],
      salesPersonCode: [null],
      salesPersonDescription: [null],
      paymentDescription: [null],
      orderNo: [null],
      orderNumber: [null],
      createdDate: [null],
      updatedDate: [null],
      customerDescription: [null],
      isCancelled: [null]
    });
  }

  async onSubmit() {
    const filter: ClientOrderFilter = this.clientOrderFilterForm.value;


    var response = await this.orderService.getClientOrdersByFilter(filter);
    this.orders = []
    this.orders = response
    // this.filterOrdersByRole();
    this.headerService.updatePageTitle((this.currentOrderState == true ? "Aktarılan" : "Aktarılmamış") + " Siparişler");
    // API çağrısı burada yapılabilir
  }
  async getOrders(isCompleted: boolean) {
    this.headerService.updatePageTitle("Panel Siparişleri");
    this.currentOrderState = isCompleted;
    this.orders = await this.orderService.getClientOrders(isCompleted);

    this.filterOrdersByRole();
    this.headerService.updatePageTitle((this.currentOrderState == true ? "Aktarılan" : "Aktarılmamış") + " Siparişler");
  }
  filterOrdersByRole() {
    const roleDescription = localStorage.getItem('roleDescription');
    const salesPersonCode = localStorage.getItem('salesPersonCode');

    if (roleDescription !== 'Admin') {
      // Siparişlerin boş olup olmadığını kontrol et
      if (this.orders?.length > 0) {
        // Satış personel koduna göre filtreleme
        this.orders = this.orders.filter(order =>
          order.clientOrder?.salesPersonCode === salesPersonCode
        );
      }
      // Bilgilendirme mesajı
      this.toasterService.info('Sadece Kendi Siparişlerinizi Görebilirsiniz.');
    }
  }

  async deleteClientOrder(id: string) {
    var response = await this.orderService.deleteClientOrder(id);
    if (response) {
      this.toasterService.success("Sipariş Silindi")
      this.getOrders(this.currentOrderState)
    }
  }


  async updateClientOrderCancelStatus(id: string, status: boolean) {
    status = status == null ? false : status;
    var response = await this.orderService.updateClientOrderCancelStatus(id, status);
    if (response) {
      this.toasterService.success("Sipariş İptal Edildi")
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
