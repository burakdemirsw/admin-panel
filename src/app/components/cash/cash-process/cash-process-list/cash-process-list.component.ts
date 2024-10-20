import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ToasterService } from 'src/app/services/ui/toaster.service';
import { OrderService } from 'src/app/services/admin/order.service';
import { CashHeader_VM } from "src/app/models/model/invoice/CashHeader_VM";
import { HeaderService } from 'src/app/services/admin/header.service';
import { CashService } from 'src/app/services/admin/cash.service';

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
    private orderService: OrderService,
    private headerService: HeaderService,
    private cashService: CashService

  ) { }

  ngOnInit(): void {
    this.headerService.updatePageTitle("Nakit Kasa Hareketleri")
    this.loadCashHeaders(); // Bileşen yüklendiğinde cash headers'ı yükle
  }

  // Cash header verilerini yüklemek için fonksiyon
  async loadCashHeaders() {
    try {
      this.cashHeaders = await this.cashService.getCashHeaders(); // Servisten veriyi al
    } catch (error) {
      this.toasterService.error("Cash headers yüklenirken bir hata oluştu."); // Hata durumunda bildirim
      console.error(error);
    }
  }

  async deleteProcess(header: CashHeader_VM) {
    if (window.confirm("Hareket Silinecektir Emin Misiniz")) {
      var response = await this.cashService.deleteCashHeader(header.id);
      if (response) {
        this.loadCashHeaders();
      }
    }

  }
}
