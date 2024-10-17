import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Invoice_VM } from 'src/app/models/model/product/countListModel';
import { GeneralService } from 'src/app/services/admin/general.service';
import { OrderService } from 'src/app/services/admin/order.service';
import { ToasterService } from 'src/app/services/ui/toaster.service';
import { HeaderService } from '../../../services/admin/header.service';
import { InvoiceService } from 'src/app/services/admin/invoice.service';
import { UserClientInfoResponse } from 'src/app/models/model/user/userRegister_VM';
import { UserService } from 'src/app/services/admin/user.service';

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
    private invoiceService: InvoiceService,
    private generalService: GeneralService,
    private formBuilder: FormBuilder,
    private orderService: OrderService,
    private activatedRoute: ActivatedRoute,
    private userService: UserService

  ) { }
  user: UserClientInfoResponse;
  offices: any[] = ["Alış", "Satış"]
  processCodes: string[] = ["WS", "BP", "R", "ES", "es", "ws", "bp", "r", "prws"]
  processTypes: string[] = ["invoice", "order", "proposal", "shipment"]
  barcode: string = null;
  quantity: string = null;
  currentPage: number = 1; // Başlangıçta ilk sayfayı göster
  innerNumberList: string[] = [];
  filterForm: FormGroup;
  invoices: Invoice_VM[]
  selectedInvoices: Invoice_VM[]
  processCode: string;
  processType: string;
  async ngOnInit() {

    this.user = this.userService.getUserClientInfoResponse();
    this.activatedRoute.params.subscribe(async params => {

      if (this.processCodes.includes(params["processCode"]) && this.processTypes.includes(params["processType"])) {
        this.processCode = params["processCode"].toUpperCase();
        this.processType = params["processType"];

        if (this.processCode == 'R' && this.processType == 'invoice') {
          this.headerService.updatePageTitle("Peşin Satış Faturaları");
          await this.getInvoiceList();
        }
        else if ((this.processCode == 'WS' && this.processType == 'invoice')) {
          this.headerService.updatePageTitle("Toptan Satış Faturaları");
          await this.getInvoiceList();
        }
        else if ((this.processCode == 'BP' && this.processType == 'invoice')) {
          this.headerService.updatePageTitle("Alış Faturaları");
          await this.getInvoiceList();
        }
        else if ((this.processCode == 'ES' && this.processType == 'invoice')) {
          this.headerService.updatePageTitle("Masraf Faturaları");
          await this.getInvoiceList();
        }
        else if ((this.processCode == 'WS' && this.processType == 'proposal')) {
          this.headerService.updatePageTitle("Toptan Satış Teklifleri");
          await this.getInvoiceList();
        } else if ((this.processCode == 'R' && this.processType == 'order')) {
          this.headerService.updatePageTitle("Peşin Satışlar");
          await this.getInvoiceList();
        } else if ((this.processCode == 'WS' && this.processType == 'order')) {
          this.headerService.updatePageTitle("Toptan Satış Siparişleri");
          await this.getInvoiceList();
        }
        else if ((this.processCode == 'WS' && this.processType == 'shipment')) {
          this.headerService.updatePageTitle("İrsaliyeler");
          await this.getInvoiceList();
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
    this.router.navigate([`/create-process/${this.processType}/${this.processCode}/0`]);
  }
  routeToPage(orderNo: string) {
    if (orderNo.startsWith('BPI')) {
      this.router.navigate(['/create-purchase-order/' + orderNo.split('BPI-')[1]])
    } else {
      this.router.navigate(['/create-sale-order/' + orderNo.split('WSI-')[1]])
    }
  }

  async getInvoiceList(): Promise<any> {
    try {
      this.invoices = await this.invoiceService.getInvoiceList(this.processType, this.processCode, this.user.userId);
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
    this.router.navigate([`/create-process/${this.processType}/${this.processCode}/0/${id}`]);

  }
  async convertWSProposalToWSOrder(processCode: string, id: string) {
    if (window.confirm("Teklifi Siparişe Çevirilecektir. Devam edilsin mi?")) {
      var response = await this.invoiceService.convertWSProposalToWSOrder(this.processType, processCode, id);
      if (response) {
        this.toasterService.success("Teklif, Siparişe Dönüştürüldü");
        this.getInvoiceList();
      } else {
        this.toasterService.error("Teklif, Siparişe Dönüştürülemedi");
      }
    }

  }

  async convertWSOrderToWSInvoice(processCode: string, id: string) {
    if (window.confirm("Sipariş Faturaya Çevirilecektir. Devam edilsin mi?")) {
      this.toasterService.success("Sipariş, Faturaya Dönüştürüldü");
      // var response = await this.orderService.convertWSProposalToWSOrder(this.processType, processCode, id);
      // if (response) {
      //   this.toasterService.success("Sipariş, Faturaya Dönüştürüldü");
      //   this.getInvoiceList();
      // } else {
      //   this.toasterService.error("Sipariş, Faturaya Dönüştürülemedi");
      // }
    }

  }
  async deleteInvoice(id: string) {
    var response = await this.invoiceService.deleteInvoiceProcess(id);
    if (response) {
      this.toasterService.success("Silindi");
      this.getInvoiceList();
    } else {
      this.toasterService.error("Silinemedi");
    }
  }

}
