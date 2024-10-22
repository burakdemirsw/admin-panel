import { Component } from '@angular/core';
import { CreditCardPaymentHeader_VM } from 'src/app/models/model/invoice/CreditCardPaymentHeader_VM';
import { CreditCardPaymentService } from 'src/app/services/admin/credit-card-payment.service';

import { HeaderService } from 'src/app/services/admin/header.service';
import { ToasterService } from 'src/app/services/ui/toaster.service';
import { InfoService } from '../../../services/admin/info.service';
import { CreditCardPaymentType } from 'src/app/models/model/invoice/CreditCardPaymentType';

@Component({
  selector: 'app-credit-card-payment-process-list',
  templateUrl: './credit-card-payment-process-list.component.html',
  styleUrl: './credit-card-payment-process-list.component.css'
})
export class CreditCardPaymentProcessListComponent {
  creditCardPaymentHeaders: CreditCardPaymentHeader_VM[] = []; // CreditCardPaymentHeaderVm tipinde bir dizi

  constructor(
    private toasterService: ToasterService,
    private headerService: HeaderService,
    private creditCardPaymentService: CreditCardPaymentService,
    private infoService: InfoService
  ) { }
  creditCardPaymentTypes: CreditCardPaymentType[] = [];
  async ngOnInit() {
    this.headerService.updatePageTitle("Kredi Kartı Ödemeleri")
    await this.loadCreditCardPaymentHeaders(); // Bileşen yü  klendiğinde creditCardPayment headers'ı yükle
    this.creditCardPaymentTypes = await this.infoService.getCreditCardPaymentType();

  }

  getDesc(code: Number) {
    return this.creditCardPaymentTypes.find(cp => cp.creditCardPaymentTypeCode == code).creditCardPaymentTypeDescription
  }
  // CreditCardPayment header verilerini yüklemek için fonksiyon
  async loadCreditCardPaymentHeaders() {
    try {
      this.creditCardPaymentHeaders = await this.creditCardPaymentService.getCreditCardPaymentHeaders(); // Servisten veriyi al
    } catch (error) {
      this.toasterService.error("CreditCardPayment headers yüklenirken bir hata oluştu."); // Hata durumunda bildirim
      console.error(error);
    }
  }

  async deleteProcess(header: CreditCardPaymentHeader_VM) {

    if (window.confirm("Hareket Silinecektir Emin Misiniz")) {
      var response = await this.creditCardPaymentService.deleteCreditCardPaymentHeader(header.id);
      if (response) {
        this.loadCreditCardPaymentHeaders();
      }
    }

  }
}

