import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Invoice_VM } from 'src/app/models/model/product/countListModel';
import { GeneralService } from 'src/app/services/admin/general.service';
import { OrderService } from 'src/app/services/admin/order.service';
import { ToasterService } from 'src/app/services/ui/toaster.service';
import { HeaderService } from '../../../services/admin/header.service';

@Component({
  selector: 'app-invoice-list',
  templateUrl: './invoice-list.component.html',
  styleUrls: ['./invoice-list.component.css']
})
export class InvoiceListComponent implements OnInit {
  constructor(
    private headerService: HeaderService,
    private toasterService: ToasterService,
    private router: Router,
    private generalService: GeneralService,
    private formBuilder: FormBuilder,
    private orderService: OrderService,
    private activatedRoute: ActivatedRoute

  ) { }
  offices: any[] = ["Alış", "Satış"]
  barcode: string = null;
  quantity: string = null;
  currentPage: number = 1; // Başlangıçta ilk sayfayı göster
  innerNumberList: string[] = [];
  filterForm: FormGroup;
  invoices: Invoice_VM[]
  selectedInvoices: Invoice_VM[]
  processCode: string;
  async ngOnInit() {

    this.activatedRoute.params.subscribe(async params => {

      if (params["processCode"]) {
        this.processCode = params["processCode"].toUpperCase();
        if (this.processCode == 'R') {
          this.headerService.updatePageTitle("Faturalar (R))");
          await this.getInvoiceList('R');
        } else {
          this.headerService.updatePageTitle("Faturalar (BP))");
          await this.getInvoiceList('BP');
        }
      }

    })

    this.formGenerator();

  }

  formGenerator() {
    this.filterForm = this.formBuilder.group({
      orderNo: [null],
      currAccCode: [null], // Add other form controls here
      invoiceType: [null],
      startDate: [null],
      endDate: [null],
    });
  }


  addInnerNumberToList(innerNumber: string) {
    if (!this.innerNumberList.includes(innerNumber)) {
      this.innerNumberList.push(innerNumber);
    } else {
      const index = this.innerNumberList.indexOf(innerNumber);
      this.innerNumberList.splice(index, 1);
    }
  }
  async newPurchaseInvoice() {
    this.router.navigate(['/create-invoice/0/bp']);

  }

  async newSaleInvoice() {
    this.router.navigate(['/create-invoice/0/r']);
  }
  routeToPage(orderNo: string) {
    if (orderNo.startsWith('BPI')) {
      this.router.navigate(['/create-purchase-order/' + orderNo.split('BPI-')[1]])
    } else {
      this.router.navigate(['/create-sale-order/' + orderNo.split('WSI-')[1]])
    }
  }

  async getInvoiceList(processCode: string): Promise<any> {
    try {
      this.invoices = await this.orderService.getInvoiceList(processCode);
    } catch (error: any) {
      console.log(error.message);
    }
  }
  async returnInvoice() {
    var result = window.confirm("Bu transferi iade etmek istediğinizden emin misiniz?")
    if (result) {
      this.toasterService.success("İşlem Başarılı")
    }
  }
  goPage(id: string) {
    var url = `/create-invoice/0/${this.processCode == 'R' ? 'r' : 'bp'}`;
    this.router.navigate([url, id])
  }

  async deleteInvoice(id: string) {
    var response = await this.orderService.deleteInvoiceProcess(id);
    if (response) {
      this.toasterService.success("Fatura Silindi");
      this.getInvoiceList(this.processCode);
    } else {
      this.toasterService.error("Fatura Silinemedi");
    }
  }

}
