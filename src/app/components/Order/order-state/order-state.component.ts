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

  status: number;
  invoiceStatus: number;
  collectableOrders: OrderStatusModels[] = [];
  collectedOrders: OrderStatusModels[] = [];
  exchangeRates: ExchangeRate
  private intervalId: any;
  private intervalId2: any
  private intervalId3: any
  async ngOnInit() {
    var response = await this.orderService.getExchangeRates();
    this.exchangeRates = response;
    this.collectableOrders = await this.getOrders(1, 2);

    // setInterval başlat ve referansı intervalId'e ata
    this.intervalId = setInterval(async () => {
      this.collectableOrders = await this.getOrders(1, 2);
    }, 30000);

    // Yavaş yavaş sayfanın altına kaydır
    this.scrollDownSmoothly();
  }
  @ViewChild('panel') panel: OverlayPanel;

  showPanel() {
    this.panel.toggle(event);
  }
  private scrollDownIntervalId: any = null;
  private scrollUpIntervalId: any = null;

  scrollDownSmoothly() {
    const scrollStep = 2; // Sabit kaydırma adımı
    let scrollPosition = 0; // Şu anki kaydırma konumu
    this.scrollDownIntervalId = setInterval(() => {
      if (scrollPosition < document.body.scrollHeight) {
        window.scrollBy(0, scrollStep); // Sayfayı aşağı kaydır
        scrollPosition += scrollStep;
      } else {
        clearInterval(this.scrollDownIntervalId);
        this.scrollUpSmoothly(); // Ve yukarı kaydırmaya başla
      }
    }, 100); // Her 100 milisaniyede bir adım at
  }

  scrollUpSmoothly() {
    const scrollStep = 2; // Sabit kaydırma adımı
    let scrollPosition = document.body.scrollHeight; // Şu anki kaydırma konumu
    this.scrollUpIntervalId = setInterval(() => {
      if (scrollPosition > 0) {
        window.scrollBy(0, -scrollStep); // Sayfayı yukarı kaydır
        scrollPosition -= scrollStep;
      } else {
        clearInterval(this.scrollUpIntervalId);
        this.scrollDownSmoothly(); // Ve tekrar aşağı kaydırmaya başla
      }
    }, 100); // Her 100 milisaniyede bir adım at
  }

  ngOnDestroy() {
    // Bileşen yok edildiğinde tüm setInterval'leri durdur
    if (this.scrollDownIntervalId) {
      clearInterval(this.scrollDownIntervalId);
    }
    if (this.scrollUpIntervalId) {
      clearInterval(this.scrollUpIntervalId);
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
