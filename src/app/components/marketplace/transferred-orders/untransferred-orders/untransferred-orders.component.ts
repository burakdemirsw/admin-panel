import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { TransferredOrder } from 'src/app/models/model/marketplace/transferredOrder';
import { FailedTransaction } from 'src/app/models/model/order/failedTransaction';
import { DirectRequestService } from 'src/app/services/admin/direct-request.service';
import { GeneralService } from 'src/app/services/admin/general.service';
import { HeaderService } from 'src/app/services/admin/header.service';
import { MarketplaceService } from 'src/app/services/admin/marketplace.service';
import { OrderService } from 'src/app/services/admin/order.service';
import { ToasterService } from 'src/app/services/ui/toaster.service';

@Component({

  templateUrl: './untransferred-orders.component.html',
  styleUrl: './untransferred-orders.component.css'
})
export class UntransferredOrdersComponent implements OnInit {
  orders: FailedTransaction[] = [];
  constructor(private marketplaceService: MarketplaceService,
    private headerService: HeaderService,
    private toasterService: ToasterService,
    private router: Router,
    private generalService: GeneralService,
    private formBuilder: FormBuilder,
    private orderService: OrderService,
    private activatedRoute: ActivatedRoute,
    private directRequestService: DirectRequestService
  ) {

  }
  ngOnInit(): void {
    this.headerService.updatePageTitle('Aktarılmayan Siparişler')
    this.getTransferredOrders();
  }
  async getTransferredOrders() {
    this.orders = await this.directRequestService.getRecentFailedTransactions();
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
