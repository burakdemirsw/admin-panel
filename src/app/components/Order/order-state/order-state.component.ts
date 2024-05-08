import { Component, OnInit, Renderer2, ViewChild } from '@angular/core';
import { OrderService } from 'src/app/services/admin/order.service';
import { ToasterService } from '../../../services/ui/toaster.service';

import { ExchangeRate } from 'src/app/models/model/order/exchangeRate';
import { OrderStatusModels } from 'src/app/models/model/order/saleOrderModel';
import { OverlayPanel } from 'primeng/overlaypanel';

@Component({
  selector: 'app-order-state',
  templateUrl: './order-state.component.html',
  styleUrls: ['./order-state.component.css']
})
export class OrderStateComponent implements OnInit {

  constructor(private renderer: Renderer2, private toasterService: ToasterService, private orderService: OrderService) { }

  currentPage = 1;
  status: number;
  invoiceStatus: number;
  collectableOrders: OrderStatusModels[] = [];
  collectedOrders: OrderStatusModels[] = [];
  exchangeRates: ExchangeRate
  private intervalId: any;

  async ngOnInit() {
    var response = await this.orderService.getExchangeRates();
    this.exchangeRates = response;
    this.collectableOrders = await this.getOrders(1, 2);
    this.collectedOrders = await this.getOrders(1, 1);
    // setInterval başlat ve referansı intervalId'e ata
    this.intervalId = setInterval(async () => {
      this.collectableOrders = await this.getOrders(1, 2);
      this.collectedOrders = await this.getOrders(1, 1);
    }, 40000);

    // Yavaş yavaş sayfanın altına kaydır
    // this.scrollDownSmoothly();
  }
  @ViewChild('panel') panel: OverlayPanel;

  showPanel() {
    this.panel.toggle(event);
  }


  ngOnDestroy() {

    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  getCollectableOrders() {

  }

  async getOrders(status: number, invoiceStatus: number): Promise<OrderStatusModels[]> {

    this.status = status;
    this.invoiceStatus = invoiceStatus;
    const response =
      await this.orderService.getSaleOrdersWithStatus(status, invoiceStatus)

    return response;

  }

}
