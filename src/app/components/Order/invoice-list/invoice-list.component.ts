import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { CountListModel } from 'src/app/models/model/product/countListModel';
import { GeneralService } from 'src/app/services/admin/general.service';
import { WarehouseService } from 'src/app/services/admin/warehouse.service';
import { HttpClientService } from 'src/app/services/http-client.service';
import { AlertifyService } from 'src/app/services/ui/alertify.service';

@Component({
  selector: 'app-invoice-list',
  templateUrl: './invoice-list.component.html',
  styleUrls: ['./invoice-list.component.css']
})
export class InvoiceListComponent implements OnInit {
  constructor(
    private httpClientService: HttpClientService,
    private alertifyService: AlertifyService,
    private spinnerService: NgxSpinnerService,
    private router: Router,
    private warehouseService : WarehouseService,
    private generalService : GeneralService,
        private formBuilder : FormBuilder

  ) { }

  async ngOnInit() {
    this.spinnerService.show();
    await this.getInvoiceList();

    this.formGenerator();
    this.spinnerService.hide();

  }
  currentPage:number = 1; // Başlangıçta ilk sayfayı göster

  innerNumberList : string[] = [];
  filterForm: FormGroup;

  formGenerator() {
    this.filterForm = this.formBuilder.group({
      orderNo: [null],
      currAccCode: [null], // Add other form controls here
      invoiceType: [null],
      startDate: [null],
      endDate: [null],
    });
  }



  addInnerNumberToList(innerNumber : string){
    if (!this.innerNumberList.includes(innerNumber)) {
      this.innerNumberList.push(innerNumber);
    } else {
      const index = this.innerNumberList.indexOf(innerNumber);
      this.innerNumberList.splice(index, 1);
    }
  }
  async newPurchaseInvoice(){
    try {
      const orderNo : string  = await this.generalService.generateGUID();
      this.router.navigate(['/create-purchase-order/'+orderNo]);
    } catch (error: any) {
      console.log(error.message);
    }

  }

  async newSaleInvoice(){
    try {
      const orderNo : string  = await this.generalService.generateGUID();
      this.router.navigate(['/create-sale-order/'+orderNo]);
    } catch (error: any) {
      console.log(error.message);
    }

  }
  routeToPage(orderNo :string){
    if(orderNo.startsWith('BPI')){
      this.router.navigate(['/create-purchase-order/'+orderNo.split('BPI-')[1]])
    }else{
      this.router.navigate(['/create-sale-order/'+orderNo.split('WSI-')[1]])
    }
  }

  countList : CountListModel[]

  async getInvoiceList(): Promise<any> {
    try {
      this.countList = await this.warehouseService.getInvoiceList();
    } catch (error: any) {
      console.log(error.message);
    }
  }

}
