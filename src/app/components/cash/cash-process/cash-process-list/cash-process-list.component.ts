import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ToasterService } from 'src/app/services/ui/toaster.service';
import { OrderService } from 'src/app/services/admin/order.service';
import { CashHeader_VM } from 'src/app/models/model/invoice/createPurchaseInvoice';

@Component({
  selector: 'app-cash-process-list',
  templateUrl: './cash-process-list.component.html',
  styleUrls: ['./cash-process-list.component.css']
})
export class CashProcessListComponent implements OnInit {
  cashHeaders: CashHeader_VM[] = []; // CashHeaderVm tipinde bir dizi

  constructor(
    private formBuilder: FormBuilder,
    private toasterService: ToasterService,
    private orderService: OrderService
  ) { }

  ngOnInit(): void {
    this.loadCashHeaders(); // Bileşen yüklendiğinde cash headers'ı yükle
  }

  // Cash header verilerini yüklemek için fonksiyon
  async loadCashHeaders() {
    try {
      this.cashHeaders = await this.orderService.getCashHeaders(); // Servisten veriyi al
    } catch (error) {
      this.toasterService.error("Cash headers yüklenirken bir hata oluştu."); // Hata durumunda bildirim
      console.error(error);
    }
  }
}
