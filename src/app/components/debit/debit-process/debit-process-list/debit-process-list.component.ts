import { Component, OnInit } from '@angular/core';
import { ToasterService } from 'src/app/services/ui/toaster.service';
import { OrderService } from 'src/app/services/admin/order.service';
import { DebitHeader_VM } from 'src/app/models/model/invoice/createPurchaseInvoice';

@Component({
  selector: 'app-debit-process-list',
  templateUrl: './debit-process-list.component.html',
  styleUrls: ['./debit-process-list.component.css'] // Düzeltme: styleUrls yazılacak
})
export class DebitProcessListComponent implements OnInit {
  debitHeaders: DebitHeader_VM[] = []; // DebitHeaderVm tipinde bir dizi

  constructor(
    private toasterService: ToasterService,
    private orderService: OrderService
  ) { }

  async ngOnInit() {
    await this.loadDebitHeaders(); // Bileşen yü  klendiğinde debit headers'ı yükle
  }

  // Debit header verilerini yüklemek için fonksiyon
  async loadDebitHeaders() {
    try {
      this.debitHeaders = await this.orderService.getDebitHeaders(); // Servisten veriyi al
    } catch (error) {
      this.toasterService.error("Debit headers yüklenirken bir hata oluştu."); // Hata durumunda bildirim
      console.error(error);
    }
  }
}
