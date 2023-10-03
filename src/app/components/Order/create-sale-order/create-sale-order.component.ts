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
    import { GeneralService } from 'src/app/services/admin/general.service';
import { OrderService } from 'src/app/services/admin/order.service';
import { ProductService } from 'src/app/services/admin/product.service';
import { WarehouseService } from 'src/app/services/admin/warehouse.service';
import { HttpClientService } from 'src/app/services/http-client.service';
import { AlertifyService } from 'src/app/services/ui/alertify.service';
declare var window: any;
@Component({
  selector: 'app-create-sale-order',
  templateUrl: './create-sale-order.component.html',
  styleUrls: ['./create-sale-order.component.css']
})
export class CreateSaleOrderComponent implements OnInit {
  newOrderNumber: string = '';
  customerList: CustomerModel[] = [];
  officeModels: OfficeModel[] = [];
  invoiceProducts: CreatePurchaseInvoice[] = [];
  invoiceProducts2: CreatePurchaseInvoice[] = [];

  activeTab = 1;
  productForm: FormGroup;
  
  warehouseModels: WarehouseOfficeModel[] = [];
  currencyList: string[] = ["Standart","Vergisiz"]; //vergi tipi
  constructor(
    private httpClientService: HttpClientService,
    private formBuilder: FormBuilder,
    private alertifyService: AlertifyService,
    private orderService: OrderService,
    private router: Router,
    private httpClient: HttpClient,
    private productService :ProductService,
    private spinnerService: NgxSpinnerService,
    private warehouseService: WarehouseService,
    private generalService: GeneralService,
    private activatedRoute : ActivatedRoute
  ) {}

  async ngOnInit() {
    try {
      this.spinnerService.show();
      this.formGenerator()

      this.activatedRoute.params.subscribe(async (params) => {
        this.newOrderNumber = 'WSI-'+params['orderNo'];
        await this.getProductOfInvoice(this.newOrderNumber );
      });


      await this.getOfficeCodeList();
      await this.getCustomerList();
      await this. getSalesPersonModels()
;
      this.spinnerService.hide();
    } catch (error: any) {
      console.log(error.message);
    }
  }
  async getProductOfInvoice(orderNo :string): Promise<void> {
    try {
      const response = await this.productService.getProductOfInvoice( this.newOrderNumber);
      this. invoiceProducts2 = response;
      this.calculateTotalQty()
    } catch (error: any) {
      this.alertifyService.warning(error.message);
    }
  }

  async getOfficeCodeList(): Promise<void> {
    try {
      this.officeModels = await this.warehouseService.getOfficeCodeList();

      // Eğer veri geldiyse ve dizi boş değilse ilk ofisi seçin
      if (this.officeModels && this.officeModels.length > 0) {
        this.productForm.get('officeCode')?.setValue(this.officeModels[0]);
      }
    } catch (error: any) {
      this.alertifyService.warning(error.message);
    }
  }

  
  async getWarehouseList(value: string): Promise<void> {
    this.warehouseModels = await this.warehouseService.getWarehouseList(value);
    console.log(this.warehouseModels)
  }
  
  async getCustomerList(): Promise<void> {
    this.customerList = await this.warehouseService.getCustomerList('1');
  }
  
  async getSelectedOffice(): Promise<any> {
    var office = (document.getElementById('officeCode') as HTMLInputElement).value;

    await this.getWarehouseList(office);
    this.productForm
      .get('warehouseCode')
      ?.setValue(this.warehouseModels[0].warehouseCode);
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
  clearShelfNumbers() {
    this.productForm.get('shelfNo').setValue('');
    this.productForm.get('barcode').setValue('');
    this.focusNextInput('shelfNo');
    this.shelfNumbers='RAFLAR:'
    this.productForm.get('quantity').setValue('');
  }


  focusNextInput(nextInputId: string) {
    const nextInput = document.getElementById(nextInputId) as HTMLInputElement;
    if (nextInput) {
      nextInput.focus();
    }
  }


  formGenerator() {
    try {
      this.productForm = this.formBuilder.group({
        officeCode: [null, Validators.required],
        warehouseCode: [null, Validators.required],
        currAccCode: [null],
        salesPersonCode: [null, Validators.required],
        shelfNo: [null, [Validators.required, Validators.maxLength(10)]],
        barcode: [null, [Validators.required, Validators.min(5)]],
        quantity: [null],
        isReturn: [false, [Validators.required]],
        currency: [null, [Validators.required]],
        batchCode: [null]

      });
    } catch (error: any) {
      this.alertifyService.error(error.message);
    }
  }

  clearFormFields() {
    // Alanları temizleme
    this.productForm.patchValue({
      barcode: '',
      quantity: null,
    });
  }

  modalImageUrl: string;
  formModal: any;
  openImageModal(imageUrl: string) {
    this.modalImageUrl = imageUrl;
    if (!this.formModal) {
      this.formModal = new window.bootstrap.Modal(
        document.getElementById('myModal')
      );
    }
    this.formModal.show();
  }



  async createSaleInvoice():Promise<any> {


    const data = await this.orderService.createSaleInvoice(this.invoiceProducts2
      ,this.newOrderNumber
      , this.productForm.get("isReturn").value
      , this.productForm.get("salesPersonCode").value
      ,this.productForm.get("currency").value
      )
    
  }

  setCurrentCustomerCode(){
    var currAccCode :string= (document.getElementById('currAccCode') as HTMLInputElement).value.toString();

   (document.getElementById('currAccCode2') as HTMLInputElement).value =  currAccCode;
  }



  url: string = ClientUrls.baseUrl + '/Order/CountProductPuschase';
  shelfNumbers: string = 'RAFLAR:';  
  async onSubmit(model: CreatePurchaseInvoice): Promise<any> {
    if (model.barcode && !model.shelfNo)
      {
     

         var result: string[] = await this.productService.countProductByBarcode(
           model.barcode
         );
         this.shelfNumbers += result[0];
         this.productForm.get('quantity').setValue(result[1]);

         return;
      
   } else {
     
       if (this.productForm.valid) {
        var value = this.productForm.get('currAccCode').value
         if(value === null){
          try {
            var currAccCodeValue =(document.getElementById('currAccCode2') as HTMLInputElement).value.toString();
            model.currAccCode=currAccCodeValue
            this.productForm.get('currAccCode').setValue(currAccCodeValue)
          } catch (error) {
            this.alertifyService.error("Müşteri Kodu Hatası.")
            return;
          }
        

         }
         var result: string[] = await this.productService.countProductByBarcode(
           model.barcode
         );
           if(this.shelfNumbers==='RAFLAR:'){ //raflar kontorl için yeniden çekildi
             this.shelfNumbers += result[0];
           }
           if( this.productForm.get('quantity').value === null){ //miktar alanı dolduruldu 
             this.productForm.get('quantity').setValue(result[1]);
           }
         const shelves = result[0]
         .split(',')
         .filter((raflar) => raflar.trim() !== '');
           
         if (shelves.includes(model.shelfNo)) { //raf barkod kontolü yapıldı
          var response: ProductCountModel = 
          await this.warehouseService.countProductRequest( //sayım
            model.barcode,
            model.shelfNo,
            model.quantity ===null
            ? Number(result[1])
            : model.quantity,
            model.officeCode,
            model.warehouseCode,
            model.batchCode,
            'Order/CountProduct3',
            this.newOrderNumber,
            model.currAccCode
          );
          if (response != undefined) {
            var data: ProductCountModel = response;
            if (data.status == 'RAF') {
              model.shelfNo = response.description;
            } else {
              model.barcode = response.description;
            }
            this.generalService.beep();
            model.quantity = Number(Number(result[1]));
           
          }
         }else{
           if (
             confirm(
               'Raf Bulunamadı! Raf Barkod Doğrulaması Yapılmadan Eklensin mi(2)?'
             )
           ){
            var response: ProductCountModel =
            await this.warehouseService.countProductRequest( //sayım
              model.barcode,
              model.shelfNo,
              model.quantity ===null
              ? Number(result[1])
              : model.quantity,
              model.officeCode,
              model.warehouseCode,
              model.batchCode,
              'Order/CountProduct3',
              this.newOrderNumber,
              model.currAccCode
            );

            if (response != undefined) {
              var data: ProductCountModel = response;
              if (data.status == 'RAF') {
                model.shelfNo = response.description;
              } else {
                model.barcode = response.description;
              }
              this.generalService.beep();
              model.quantity = Number(Number(result[1]));
             
            }
           }else{
             return;
           }
         }
          
       }
   }
   if (this.productForm.valid == true) {

     model.quantity =model.quantity ==null
     ? Number(result[1])
     : model.quantity,

     //this.invoiceProducts.push(model);
     this.getProductOfInvoice(this.newOrderNumber);

     this.clearFormFields();

     this.focusNextInput('barcode');
     this.generalService.beep();
     this.alertifyService.success('Ürün Başarılı Şekilde Eklendi.');
   } else {
     this.alertifyService.error('Form Geçerli Değil.');
   }
 }
//  checkBarcodeAndShelf(response:any,model :CreatePurchaseInvoice):string[]{
//   if (response != undefined) {
//     var data: ProductCountModel = response;

//     if (data.status == 'RAF') {
//       this.productForm.get('shelfNo')?.setValue(data.description);
//       this.productForm.get('barcode')?.setValue('');


//       var shelfAndBarcode : string[] = []
//       shelfAndBarcode.push(response.description);
//       shelfAndBarcode.push('');

//       return shelfAndBarcode;
     
//     } else {
//       const responseData = JSON.parse(response.description);
//       const description = responseData[0].Description;
//       const rafNo = responseData[0].Rafno;


//       if(this.productForm.get('shelfNo').value === ''){ //eğer zaten girdiği bir değer varsa onu yerleştir yoksa gelen cevabı yerleştir
//         this.productForm.get('shelfNo')?.setValue(rafNo)
//       };
//       this.productForm.get('barcode')?.setValue(description);


//       var shelfAndBarcode : string[] = []
//       shelfAndBarcode.push(description);
//       shelfAndBarcode.push(this.productForm.get('shelfNo').value === '' ? rafNo : model.shelfNo);
//       return shelfAndBarcode;
//     }


//   } else {
//     this.alertifyService.warning('Doğrulama Yapılamadı!');
//     return null;
//   }

// }
totalCount : number;

calculateTotalQty() {
  //toplanan ürünler yazısı için
  let totalQty = 0;
  this.invoiceProducts2.forEach((item) => {
    totalQty += item.quantity;
  });
  this.totalCount = totalQty;
}


  deleteRow(index: number) {
    this.invoiceProducts.splice(index, 1);
  }


  
  
}
