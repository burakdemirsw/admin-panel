import { Component, OnInit } from '@angular/core';
import { TransferredOrder } from 'src/app/models/model/marketplace/transferredOrder';
import { MarketplaceService } from '../../../services/admin/marketplace.service';
import { FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { GeneralService } from 'src/app/services/admin/general.service';
import { HeaderService } from 'src/app/services/admin/header.service';
import { OrderService } from 'src/app/services/admin/order.service';
import { ToasterService } from 'src/app/services/ui/toaster.service';

@Component({
  selector: 'app-transferred-orders',
  templateUrl: './transferred-orders.component.html',
  styleUrl: './transferred-orders.component.css'
})
export class TransferredOrdersComponent implements OnInit {
  orders: TransferredOrder[] = [];
  constructor(private marketplaceService: MarketplaceService,
    private headerService: HeaderService,
    private toasterService: ToasterService,
    private router: Router,
    private generalService: GeneralService,
    private formBuilder: FormBuilder,
    private orderService: OrderService,
    private activatedRoute: ActivatedRoute
  ) {

  }
  ngOnInit(): void {
    this.headerService.updatePageTitle('Aktarılan Siparişler')
    this.getTransferredOrders();
  }
  async getTransferredOrders() {
    this.orders = await this.marketplaceService.getTransferredOrders();
  }
  async changeTransferredOrderStatus(order: TransferredOrder) {
    var response = await this.marketplaceService.changeTransferredOrderStatus(order.id.toString(), !order.isBlocked);
    if (response) {
      this.toasterService.success('Sipariş Durumu Değiştirildi')
      await this.getTransferredOrders()
    } else {
      this.toasterService.error('Sipariş Durumu Değiştirilemedi')
    }
  }
}
