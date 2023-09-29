import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { catchError, throwError } from 'rxjs';
import { ClientUrls } from 'src/app/models/const/ClientUrls';
import { CustomerModel } from 'src/app/models/model/customer/customerModel';
import { CreatePurchaseInvoice } from 'src/app/models/model/invoice/createPurchaseInvoice';
import { OrderBillingRequestModel } from 'src/app/models/model/invoice/orderBillingRequestModel';
import { SalesPersonModel } from 'src/app/models/model/order/salesPersonModel';
import { ProductCountModel } from 'src/app/models/model/shelfNameModel';
import { OfficeModel } from 'src/app/models/model/warehouse/officeModel';
import { WarehouseOfficeModel } from 'src/app/models/model/warehouse/warehouseOfficeModel';
import { OrderService } from 'src/app/services/admin/order.service';
import { HttpClientService } from 'src/app/services/http-client.service';
import { AlertifyService } from 'src/app/services/ui/alertify.service';

@Component({
  selector: 'app-create-sale-order',
  templateUrl: './create-sale-order.component.html',
  styleUrls: ['./create-sale-order.component.css']
})
export class CreateSaleOrderComponent implements OnInit {
  newOrderNumber: string = this.generateGUID();
  customerList: CustomerModel[] = [];
  officeModels: OfficeModel[] = [];
  invoiceProducts: CreatePurchaseInvoice[] = [];
  activeTab = 1;
  productForm: FormGroup;
  
  warehouseModels: WarehouseOfficeModel[] = [];
  currencyList: string[] = ["USD","TRY"];
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

  async ngOnInit() {
    try {
      this.spinnerService.show();
      this.formGenerator()
      await this.getWarehouseList('M');
      await this.getOfficeCodeList();
      await this.getCustomerList();
;
      this.spinnerService.hide();
    } catch (error: any) {
      console.log(error.message);
    }
  }
  
  async getOfficeCodeList(): Promise<void> {
    try {
      const data = await this.httpClientService
        .get<OfficeModel>({
          controller: 'Warehouse/GetOfficeModel',
        })
        .toPromise();
  
      this.officeModels = data;
    } catch (error: any) {
      console.log("HATA ALINDI!");
    }
  }
  
  async getWarehouseList(value: string): Promise<void> {
    try {
      const selectElement = document.getElementById(
        'office'
      ) as HTMLSelectElement;
  
      value = selectElement.value == '' ? 'M' : selectElement.value;
  
      const data = await this.httpClientService
        .get<WarehouseOfficeModel>({
          controller: 'Warehouse/GetWarehouseModel/' + value,
        })
        .toPromise();
  
      setTimeout(() => {
        this.warehouseModels = data;
      }, 1000); // 1000 milisaniye (1 saniye) bekle
    } catch (error: any) {
      console.log(error.message);
    }
  }
  
  async getCustomerList(): Promise<void> {
    try {
      const data = await this.httpClientService
        .get<CustomerModel>({
          controller: 'Order/CustomerList/1',
        })
        .toPromise();
  
      if (data != undefined) {
        this.customerList = data;
      }
    } catch (error: any) {
      console.log(error.message);
    }
  }
  
  async getSelectedOffice() {
    try {
      var office = this.productForm.get('office')?.value;
      await this.getWarehouseList(office);
  
      var warehouse: string = this.warehouseModels[0].warehouseCode;
      this.productForm
        .get('warehouse')
        ?.setValue(warehouse);
  
    } catch (error: any) {
      console.error('Veri alınamadı:', error);
    }
  }
  

  salesPersonModels : SalesPersonModel[] = []
 async  getSalesPersonModels() :Promise<any>{
    try {

      try {
        this.salesPersonModels = await this.httpClientService.get<SalesPersonModel>({
          controller : "Order/GetSalesPersonModels"
        }).toPromise();

        //this.alertifyService.success("Başarıyla "+this.salesPersonModels.length+" Adet Çekildi")
        } catch (error:any) {
        this.alertifyService.error(error.message)
        return null;
      }



    } catch (error:any) {
      this.alertifyService.error(error.message)
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
        salesPersonCode: ['', Validators.required],

        shelfNo: ['', [Validators.required, Validators.maxLength(10)]],
        barcode: ['', [Validators.required, Validators.min(5)]],
        quantity: [''],
        isReturn: [false, [Validators.required]],
        currency: [false, [Validators.required]],

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

  collectAndPack() {

    if (this.invoiceProducts.length === 0) {
      this.alertifyService.warning('Lütfen Ürün EKleyiniz.');
      return;
    } else {
      try {
        var model : OrderBillingRequestModel = new OrderBillingRequestModel();
        model.orderNo = this.newOrderNumber;
        model.invoiceType = this.productForm.get("isReturn").value;
        model.invoiceModel = 3  ; //satış faturası
        model.salesPersonCode = this.productForm.get("salesPersonCode").value; 
        model.currency = this.productForm.get("currency").value; 

        this.httpClientService
          .post<OrderBillingRequestModel>(
            {
              controller: 'Order/CollectAndPack/' + model,
            },
            model
          )
          .pipe(
            catchError((error: any) => {
              if (error.status === 400) {
                this.alertifyService.error(error.error);
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
            if(rafNo == undefined){
              this.productForm.get('shelfNo')?.setValue( requestModel.shelfNo ) 
            }else{

              this.productForm.get('shelfNo')?.setValue(rafNo);
            }
            this.productForm.get('barcode')?.setValue(description);
            model.barcode = description;
            model.shelfNo = rafNo;
            this.alertifyService.success("(2) Barkod Doğrulaması Başarılı!")

          }
        }

      }else{
        this.alertifyService.error("Form Geçerli Değil");
      }
    }
    if (this.productForm.valid) {
      if(model.quantity.toString()==''){
        model.quantity =1
      }
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
