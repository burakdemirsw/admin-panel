import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { catchError } from 'rxjs/operators';
import { ClientUrls } from 'src/app/models/const/ClientUrls';
import { CustomerModel } from 'src/app/models/model/customer/customerModel';
import { CreatePurchaseInvoice } from 'src/app/models/model/invoice/createPurchaseInvoice';
import { OrderBillingRequestModel } from 'src/app/models/model/invoice/orderBillingRequestModel';
import { CountProductRequestModel } from 'src/app/models/model/order/countProductRequestModel';
import { ProductOfOrder } from 'src/app/models/model/order/productOfOrders';
import { ProductCountModel } from 'src/app/models/model/shelfNameModel';
import { OfficeModel } from 'src/app/models/model/warehouse/officeModel';
import { WarehouseOfficeModel } from 'src/app/models/model/warehouse/warehouseOfficeModel';
import { GeneralService } from 'src/app/services/admin/general.service';
import { OrderService } from 'src/app/services/admin/order.service';
import { WarehouseService } from 'src/app/services/admin/warehouse.service';
import { HttpClientService } from 'src/app/services/http-client.service';
import { AlertifyService } from 'src/app/services/ui/alertify.service';

@Component({
  selector: 'app-create-purchase-order',
  templateUrl: './create-purchase-order.component.html',
  styleUrls: ['./create-purchase-order.component.css'],
})
export class CreatePurchaseOrderComponent implements OnInit {
  newOrderNumber: string ;
  customerList: CustomerModel[] = [];
  officeModels: OfficeModel[] = [];
  invoiceProducts: CreatePurchaseInvoice[] = [];
  activeTab = 1;
  productForm: FormGroup;

  warehouseModels: WarehouseOfficeModel[] = [];

  constructor(
    private httpClientService: HttpClientService,
    private formBuilder: FormBuilder,
    private alertifyService: AlertifyService,
    private orderService: OrderService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private httpClient: HttpClient,
    private spinnerService: NgxSpinnerService,
    private warehouseService: WarehouseService,
    private generalService : GeneralService
  ) {
    
  }

  async ngOnInit() {
    try {
      this.spinnerService.show();
      this.newOrderNumber =await this.generateGUID();
      this.formGenerator();
      await this.getWarehouseList('M');
      await this.getOfficeCodeList();
      await this.getCustomerList();
    
      this.spinnerService.hide();
    } catch (error: any) {
      console.log(error.message);
    }
  }

  async getOfficeCodeList(): Promise<void> {
    try {
      this.officeModels = await this.warehouseService.getOfficeCodeList();
  
      // Eğer veri geldiyse ve dizi boş değilse ilk ofisi seçin
      if (this.officeModels && this.officeModels.length > 0) {
        this.productForm.get('office')?.setValue(this.officeModels[0]);
      }
    } catch (error: any) {
      this.alertifyService.warning(error.message);
    }
  }

  async getWarehouseList(value: string): Promise<void> {
    this.warehouseModels = await this.warehouseService.getWarehouseList(value);
  }

  async getCustomerList(): Promise<void> {
    this.customerList = await this.warehouseService.getCustomerList();
  }
  async getSelectedOffice():Promise<any> {
    var office  = (document.getElementById('office') as HTMLInputElement).value;

    await this.getWarehouseList(office);
    this.productForm
      .get('warehouse')
      ?.setValue(this.warehouseModels[0].warehouseCode);
  }

  focusNextInput(nextInputId: string) {
    const nextInput = document.getElementById(nextInputId) as HTMLInputElement;
    if (nextInput) {
      nextInput.focus();
    }
  }

  async generateGUID(): Promise<string> {

    return await this.generalService.generateGUID()
  }

  formGenerator() {
    try { //batchCode
      this.productForm = this.formBuilder.group({
        office: ['', Validators.required],
        warehouse: ['', Validators.required],
        currAccCode: ['', Validators.required],
        shelfNo: ['', [Validators.required, Validators.maxLength(10)]],
        barcode: ['', [Validators.required, Validators.min(5)]],
        quantity: [''],
        isReturn: [false, [Validators.required]],
        batchCode: ['', [Validators.required]]
      });
    } catch (error: any) {
      this.alertifyService.error(error.message);
    }
  }

  clearFormFields() {
    // Alanları temizleme
    this.productForm.patchValue({
      barcode: '',
      quantity: '',
    });
  }

  async createPurchaseInvoice() {  //alış faturası oluştur

   await  this.orderService.createPurchaseInvoice(this.invoiceProducts,this.newOrderNumber,this.productForm.get('isReturn').value)
   
  }

  url: string = ClientUrls.baseUrl + '/Order/CountProductPuschase';

  async onSubmit(model: CreatePurchaseInvoice) {
    if (model.shelfNo == '') {
      var requestModel: CreatePurchaseInvoice = new CreatePurchaseInvoice();
      requestModel.barcode = model.barcode;

      requestModel.quantity =
        model.quantity.toString() == '' ? 1 : model.quantity;
      requestModel.orderNumber = this.newOrderNumber;
      requestModel.office = model.office;
      requestModel.warehouse = model.warehouse;
      requestModel.currAccCode = model.currAccCode;

      var response = await this.httpClient
        .post<ProductCountModel | undefined>(this.url, requestModel)
        .toPromise();

      if (response === undefined) {
      } else {
        var data: ProductCountModel = response;

        if (data.status == 'RAF') {
          this.productForm.get('shelfNo')?.setValue(data.description);
          this.productForm.get('barcode')?.setValue('');
          model.shelfNo = response.description;
          model.barcode = '';
          this.alertifyService.success('(1) Raf Doğrulaması Yapıldı!');
        } else {
          const responseData = JSON.parse(response.description);
          const description = responseData[0].Description;
          const rafNo = responseData[0].Rafno;
          this.productForm.get('shelfNo')?.setValue(rafNo);
          this.productForm.get('barcode')?.setValue(description);
          model.barcode = description;
          model.shelfNo = rafNo;

          requestModel.shelfNo = rafNo;
          var response = await this.httpClient
            .post<ProductCountModel | undefined>(this.url, requestModel)
            .toPromise();

          var newData: ProductCountModel = response;
          if (newData.status === 'Barcode') {
            this.alertifyService.success('(1) Barkod Doğrulaması Başarılı!');
          }
        }
      }
    } else {
      if (this.productForm.valid) {
        var requestModel: CreatePurchaseInvoice = new CreatePurchaseInvoice();
        requestModel.barcode = model.barcode;
        requestModel.shelfNo = model.shelfNo;
        requestModel.quantity =
          model.quantity.toString() == '' ? 1 : model.quantity;
        requestModel.orderNumber = this.newOrderNumber;
        requestModel.office = model.office;
        requestModel.warehouse = model.warehouse;
        requestModel.currAccCode = model.currAccCode;

        var response = await this.httpClient
          .post<ProductCountModel | undefined>(this.url, requestModel)
          .toPromise();

        if (response === undefined) {
          // Handle the undefined case, perhaps throw an error or set a default value.
        } else {
          var data: ProductCountModel = response;

          if (data.status == 'RAF') {
            this.productForm.get('shelfNo')?.setValue(data.description);
            this.productForm.get('barcode')?.setValue('');
            model.shelfNo = response.description;
            model.barcode = '';
            this.alertifyService.success('(2) Raf Doğrulaması Yapıldı!');
          } else {
            const responseData = JSON.parse(response.description);
            const description = responseData[0].Description;
            const rafNo = responseData[0].Rafno;
            this.productForm.get('shelfNo')?.setValue(rafNo);
            this.productForm.get('barcode')?.setValue(description);
            model.barcode = description;
            model.shelfNo = rafNo;
            this.alertifyService.success('(2) Barkod Doğrulaması Başarılı!');
          }
        }
      }
    }
    if (this.productForm.valid) {
      if (model.quantity.toString() == '') {
        model.quantity = 1;
      }
      this.invoiceProducts.push(model);

      this.clearFormFields();

      this.focusNextInput('barcode');

      this.alertifyService.success('Ürün Başarılı Şekilde Eklendi.');
    }else{
      this.alertifyService.error("Form Geçerli Değil.")
    }
  }

  deleteRow(index: number) {
    this.invoiceProducts.splice(index, 1);
  }
}
