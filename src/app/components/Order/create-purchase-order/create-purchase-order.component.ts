import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { catchError } from 'rxjs/operators';
import { ClientUrls } from 'src/app/models/const/ClientUrls';
import { CustomerModel } from 'src/app/models/customer/customerModel';
import { CreatePurchaseInvoice } from 'src/app/models/model/invoice/createPurchaseInvoice';
import { CountProductRequestModel } from 'src/app/models/model/order/countProductRequestModel';
import { ProductOfOrder } from 'src/app/models/model/order/productOfOrders';
import { ProductCountModel } from 'src/app/models/model/shelfNameModel';
import { OfficeModel } from 'src/app/models/model/warehouse/officeModel';
import { WarehouseOfficeModel } from 'src/app/models/model/warehouse/warehouseOfficeModel';
import { OrderService } from 'src/app/services/admin/order.service';
import { HttpClientService } from 'src/app/services/http-client.service';
import { AlertifyService } from 'src/app/services/ui/alertify.service';

@Component({
  selector: 'app-create-purchase-order',
  templateUrl: './create-purchase-order.component.html',
  styleUrls: ['./create-purchase-order.component.css'],
})
export class CreatePurchaseOrderComponent implements OnInit {
  newOrderNumber: string = this.generateGUID();
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
    private spinnerService: NgxSpinnerService
  ) {}

  ngOnInit(): void {
    try {
      this.getWarehouseList('M');
      this.getOfficeCodeList();
      this.getCustomerList();
      this.formGenerator();
    } catch (error: any) {
      console.log(error.message);
    }
  }

  getOfficeCodeList(): any {
    try {
      this.httpClientService
        .get<OfficeModel>({
          controller: 'Warehouse/GetOfficeModel',
        })
        .subscribe((data) => {
          this.officeModels = data;
        });
    } catch (error: any) {
      console.log(error.message);
    }
  }

  getWarehouseList(value: string): any {
    try {
      const selectElement = document.getElementById(
        'office'
      ) as HTMLSelectElement;

      value = selectElement.value == '' ? 'M' : selectElement.value;
      this.httpClientService
        .get<WarehouseOfficeModel>({
          controller: 'Warehouse/GetWarehouseModel/' + value,
        })
        .subscribe((data) => {
          this.warehouseModels = data;
        });
    } catch (error: any) {
      this.alertifyService.error(error.message);
    }
  }

  getSelectedOffice() {
    this.getWarehouseList(this.productForm.get('office')?.value);
    this.productForm
      .get('warehouse')
      ?.setValue(this.warehouseModels[0].warehouseCode);
  }

  async getCustomerList(): Promise<any> {
    try {
      const data = await this.httpClientService
        .get<CustomerModel>({
          controller: 'Order/CustomerList',
        })
        .toPromise();
      console.log(data);
      if (data != undefined) {
        this.customerList = data;
      }
    } catch (error: any) {
      console.log(error.message);
    }
  }

  focusNextInput(nextInputId: string) {
    const nextInput = document.getElementById(nextInputId) as HTMLInputElement;
    if (nextInput) {
      nextInput.focus();
    }
  }

  generateGUID(): string {
    function generateUUID() {
      let dt = new Date().getTime();
      const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(
        /[xy]/g,
        function (c) {
          const r = (dt + Math.random() * 16) % 16 | 0;
          dt = Math.floor(dt / 16);
          return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
        }
      );
      return uuid;
    }

    return generateUUID();
  }

  formGenerator() {
    try {
      this.productForm = this.formBuilder.group({
        office: ['', Validators.required],
        warehouse: ['', Validators.required],
        currAccCode: ['', Validators.required],
        shelfNo: ['', [Validators.required, Validators.maxLength(10)]],
        barcode: ['', [Validators.required, Validators.min(5)]],
        quantity: ['1', [Validators.required, Validators.min(1)]],
      });
    } catch (error: any) {
      this.alertifyService.error(error.message);
    }
  }

  clearFormFields() {
    // Alanları temizleme
    this.productForm.patchValue({
      barcode: '',
      quantity: '1',
    });
  }

  collectAndPack() {
    if (this.invoiceProducts.length === 0) {
      this.alertifyService.warning('Lütfen Ürün EKleyiniz.');
      return;
    } else {
      try {
        this.httpClientService
          .post<String>(
            {
              controller: 'Order/CollectAndPack/' + this.newOrderNumber,
            },
            this.newOrderNumber
          )
          .pipe(
            catchError((error: any) => {
              if (error.status === 400) {
                this.alertifyService.error(error.error);
              } else {
                // this.alertifyService.error('An error occurred:');
              }
              throw error; // Rethrow the error to continue error handling
            })
          )
          .subscribe((data) => {
            this.router.navigate(['/orders-management']);
          });
      } catch (error: any) {
        this.alertifyService.error('An error occurred:');
      }
    }
  }

  url: string = ClientUrls.baseUrl + '/Order/CountProductPuschase';

  async onSubmit(model: CreatePurchaseInvoice) {
    if (
      model.shelfNo == ''
    ) {
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

          var newData : ProductCountModel = response
          if(newData.status === 'Barcode'){
            this.alertifyService.success("(1) Barkod Doğrulaması Başarılı!")
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
            this.alertifyService.success("(2) Barkod Doğrulaması Başarılı!")

          }
        }

      }
    }
    if (this.productForm.valid) {

      this.invoiceProducts.push(model);

      this.clearFormFields();

      this.focusNextInput("barcode");

      this.alertifyService.success('Ürün Başarılı Şekilde Eklendi.');
    }
  }

  deleteRow(index: number) {
    this.invoiceProducts.splice(index, 1);
  }
}
