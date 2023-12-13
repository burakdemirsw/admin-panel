import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DomSanitizer, SafeUrl, Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { catchError, throwError } from 'rxjs';
import { ClientUrls } from 'src/app/models/const/ClientUrls';
import { CustomerModel } from 'src/app/models/model/customer/customerModel';
import { CreatePurchaseInvoice } from 'src/app/models/model/invoice/createPurchaseInvoice';
import { OrderBillingRequestModel } from 'src/app/models/model/invoice/orderBillingRequestModel';
import { ProductOfOrder } from 'src/app/models/model/order/productOfOrders';
import { SalesPersonModel } from 'src/app/models/model/order/salesPersonModel';
import { CountConfirmData } from 'src/app/models/model/product/countConfirmModel';
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
  styleUrls: ['./create-sale-order.component.css'],
})
export class CreateSaleOrderComponent implements OnInit {
  infoProducts: CreatePurchaseInvoice[] = [];
  addToList(model: any) {
    this.alertifyService.success(model.itemCode + ' Eklendi');
    this.infoProducts.push(model);
    this.addedProductCount = 'Sayım Paneli(' + this.infoProducts.length + ')';
  }
  constructor(
    private httpClientService: HttpClientService,
    private formBuilder: FormBuilder,
    private alertifyService: AlertifyService,
    private orderService: OrderService,

    private productService: ProductService,
    private spinnerService: NgxSpinnerService,
    private warehouseService: WarehouseService,
    private generalService: GeneralService,
    private activatedRoute: ActivatedRoute,
    private title: Title,
    private sanitizer: DomSanitizer
  ) {}

  async ngOnInit() {
    try {
      this.title.setTitle('Satış Faturası Oluştur');

      this.spinnerService.show();
      this.isReturnInvoice = false;
      this.formGenerator();

      this.activatedRoute.params.subscribe(async (params) => {
        this.newOrderNumber = 'WSI-' + params['orderNo'];
        await this.getOfficeCodeList(); //ofis kod  
        await this.getProductOfInvoice(this.newOrderNumber);
        await this.getWarehouseList(
          (document.getElementById('officeCode') as HTMLOptionElement).value
        ); //depo kodu
        await this.getCustomerList();//müşteriler kodu
        await this.getSalesPersonModels();//personeller kodu
      this.setInput();
      });

      this.spinnerService.hide();
    } catch (error: any) {
      console.log(error.message);
    }
  }


  deleteFromList(model: CreatePurchaseInvoice) {
    const index = this.infoProducts.indexOf(model); // Modelin dizideki indeksini bulun
    if (index !== -1) {
      this.infoProducts.splice(index, 1); // Modeli diziden silin
    }
  }
isReturnInvoice : boolean ;
  checkIsReturnInvoice(){
    this.isReturnInvoice= !this.productForm.get('isReturn').value
    if(this.isReturnInvoice){
      this.alertifyService.warning("İade Faturasına Geçildiği İçin Sayım Paneli")
    }
  }


  addedProductCount: string = 'Sayım Paneli';
  newOrderNumber: string = '';
  customerList: CustomerModel[] = [];
  officeModels: OfficeModel[] = [];
  invoiceProducts: CreatePurchaseInvoice[] = [];
  invoiceProducts2: CreatePurchaseInvoice[] = [];
  activeTab = 1;
  productForm: FormGroup;
  warehouseModels: WarehouseOfficeModel[] = [];
  currencyList: string[] = ['Standart', 'Vergisiz']; //vergi tipi
  visible: boolean = false;
  
 

  qrCodeValue: string;
  qrCodeDownloadLink: any = this.sanitizer.bypassSecurityTrustResourceUrl('');
  setInput() {
    if (this.invoiceProducts2.length > 0) {
      if (this.invoiceProducts2[0].officeCode == 'M') {
        (document.getElementById('officeCode') as HTMLOptionElement).value =
          'M';
        this.productForm.get('officeCode').setValue('M');
      } else {
        (document.getElementById('officeCode') as HTMLOptionElement).value =
          'U';
        this.productForm.get('officeCode').setValue('U');
      }

      this.productForm
        .get('warehouseCode')
        .setValue(this.invoiceProducts2[0].warehouseCode);
      this.productForm
        .get('currAccCode')
        .setValue(this.invoiceProducts2[0].currAccCode);
      // this.alertifyService.success(this.productForm.get("officeCode").value+"\n"+   this.productForm.get("warehouseCode").value+"\n"+ this.productForm.get("currAccCode")
      // )
    }
  }
  createJson(barcode: string, shelfNo: string) {
    var model: CreatePurchaseInvoice = this.invoiceProducts2.find(
      (p) => (p.barcode = barcode) && p.shelfNo == shelfNo
    );
    const formDataJSON = JSON.stringify(model); // Form verilerini JSON'a dönüştür

    this.qrCodeValue = formDataJSON;
    // this.alertifyService.success(this.qrCodeValue)
  }

  onChangeURL(url: SafeUrl) {
    this.qrCodeDownloadLink = url;
    this.openImageModal(this.qrCodeDownloadLink);
    this.qrCodeValue = '';
  }

  async getProductOfInvoice(orderNo: string): Promise<void> {
    try {
      const response = await this.productService.getProductOfInvoice(
        this.newOrderNumber
      );
      this.invoiceProducts2 = response;

      this.infoProducts = [];
      this.invoiceProducts2 .forEach(e => {
        if(e.quantity>e.qty){
          this.infoProducts.push(e)
        }
      });
      this.addedProductCount = 'Sayım Paneli(' + this.infoProducts.length + ')';


      this.calculateTotalQty();
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
    console.log(this.warehouseModels);
  }

  async getCustomerList(): Promise<void> {
    this.customerList = await this.warehouseService.getCustomerList('3');
  }

  async getSelectedOffice(): Promise<any> {
    var office = (document.getElementById('officeCode') as HTMLInputElement)
      .value;

    await this.getWarehouseList(office);
    this.productForm
      .get('warehouseCode')
      ?.setValue(this.warehouseModels[0].warehouseCode);
  }

  salesPersonModels: SalesPersonModel[] = [];
  async getSalesPersonModels(): Promise<any> {
    try {
      try {
        this.salesPersonModels = await this.httpClientService
          .get<SalesPersonModel>({
            controller: 'Order/GetSalesPersonModels',
          })
          .toPromise();

        //this.alertifyService.success("Başarıyla "+this.salesPersonModels.length+" Adet Çekildi")
      } catch (error: any) {
        this.alertifyService.error(error.message);
        return null;
      }
    } catch (error: any) {
      this.alertifyService.error(error.message);
    }
  }
  clearShelfNumbers() {
    this.productForm.get('shelfNo').setValue(null);
    this.productForm.get('barcode').setValue(null);
    this.productForm.get('quantity').setValue(null);
    this.productForm.get('batchCode').setValue(null);

    if(this.productForm.get("isReturn").value === false){
      this.focusNextInput('shelfNo');
    }else{
      this.focusNextInput('barcode');
    }
    this.shelfNumbers = 'RAFLAR:';
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
        currAccCode2: [null],
        salesPersonCode: [null, Validators.required],
        shelfNo: [null, [Validators.required, Validators.maxLength(10)]],
        barcode: [null, [Validators.required, Validators.min(5)]],
        quantity: [null],
        isReturn: [false, [Validators.required]],
        currency: [null, [Validators.required]],
        batchCode: [null],
      });
    } catch (error: any) {
      this.alertifyService.error(error.message);
    }
  }
  whichRowIsInvalid() {
    this.generalService.whichRowIsInvalid(this.productForm);
  }
  clearFormFields() {
    // Alanları temizleme
    this.productForm.patchValue({
      barcode: null,
      quantity: null,
    });
    this.focusNextInput('barcode');
    this.shelfNumbers = 'RAFLAR:';
    
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
  async deleteOrderProduct(
    orderNo: string,
    itemCode: string,
    shelfNo: string
  ): Promise<boolean> {
    const confirmDelete = window.confirm(
      'Bu transferi silmek istediğinizden emin misiniz?'
    );

    if (confirmDelete) {
      const response: boolean = await this.productService.deleteOrderProduct(
        this.newOrderNumber,
        itemCode
      );
      if (response) {
        this.invoiceProducts2 = this.invoiceProducts2.filter(
          (o) => !(o.barcode == itemCode && o.shelfNo == shelfNo)
        );
        this.calculateTotalQty();
        await this.getProductOfInvoice(this.newOrderNumber);
        this.alertifyService.success('Silme İşlemi Başarılı.');
      } else {
        this.alertifyService.error('Silme İşlemi Başarısız.');
      }
      return response;
    } else {
      return false;
    }
  }
  showCountPage() {
    if (this.visible) {
      this.visible = false;
    } else {
      this.visible = true;
    }
  }

  visible2: boolean = false;
  showModal2() {
    if (this.visible2) {
      this.visible2 = false;
    } else {
      this.visible2 = true;
    }
  }

  
  async createSaleInvoice(): Promise<any> {
   
   
    var confirmation = window.confirm(
      'İşlem Nebime Aktarılacaktır.Devam Etmek istiyor musunuz?'
  );

  if(confirmation){
    try {
        if (
          this.productForm.get('salesPersonCode').value === '' ||
          this.productForm.get('salesPersonCode').value == null
        ) {
          this.alertifyService.error('Satış Sorumlusu Alanı Boş');
          return;
        }
        if (
          this.productForm.get('currency').value === '' ||
          this.productForm.get('currency').value == null
        ) {
          this.alertifyService.error('Vergi Tipi Alanı Boş');
          return;
        }
        this.spinnerService.show();
        const response : CountConfirmData[] = await this.orderService.getInventoryFromOrderNumber(this.newOrderNumber);
        if(response.length>0){
          this.alertifyService.success("Otomatik Sayım Yapılabilir")
          const response2 = await  this.orderService.setInventoryByOrderNumber(this.newOrderNumber);
          if(response2)
          {
            this.alertifyService.success("Otomatik Sayım yapıldı")
            const data = await this.orderService.createSaleInvoice(
              this.invoiceProducts2,
              this.newOrderNumber,
              this.productForm.get('isReturn').value,
              this.productForm.get('salesPersonCode').value,
              this.productForm.get('currency').value
            );

          }
        }
      
      } catch (error: any) {}
      this.spinnerService.hide();
   
  }
  
  }

  setCurrentCustomerCode() {
    var currAccCode: string = (
      document.getElementById('currAccCode') as HTMLInputElement
    ).value.toString();

    (document.getElementById('currAccCode2') as HTMLInputElement).value =
      currAccCode;
  }

  url: string = ClientUrls.baseUrl + '/Order/CountProductPuschase';
  shelfNumbers: string = 'RAFLAR:';
  async onSubmit(model: CreatePurchaseInvoice): Promise<any> {
    if (model.barcode && !model.shelfNo) {
      var result: string[] = await this.productService.countProductByBarcode(
        model.barcode
      );
      this.shelfNumbers += result[0];
      this.productForm.get('quantity').setValue(result[1]);
      this.focusNextInput('shelfNo');
      return;
    } else {
      if (this.productForm.valid) {
        console.log(this.productForm.value)
        var value = this.productForm.get('currAccCode').value;
        if (value === null) {
          try {
            var currAccCodeValue = (
              document.getElementById('currAccCode2') as HTMLInputElement
            ).value.toString();
            model.currAccCode = currAccCodeValue;
            this.productForm.get('currAccCode').setValue(currAccCodeValue);
          } catch (error) {
            this.alertifyService.error('Müşteri Kodu Hatası.');
            return;
          }
        }
        var result: string[] = await this.productService.countProductByBarcode(
          model.barcode
        );
        if (this.shelfNumbers === 'RAFLAR:') {
          //raflar kontorl için yeniden çekildi
          this.shelfNumbers += result[0];
        }
        if (this.productForm.get('quantity').value === null) {
          //miktar alanı dolduruldu
          this.productForm.get('quantity').setValue(result[1]);
        }
        const shelves = result[0]
          .split(',')
          .filter((raflar) => raflar.trim() !== '');

        if (
          shelves.find((s) => s.toLowerCase() == model.shelfNo.toLowerCase())
        ) {
          //raf barkod kontolü yapıldı
          var response: ProductCountModel =
            await this.warehouseService.countProductRequest(
              //sayım
              model.barcode,
              model.shelfNo,
              model.quantity === null ? Number(result[1]) : model.quantity,
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
        } else {
          if (
            confirm(
              'Raf Bulunamadı! Raf Barkod Doğrulaması Yapılmadan Eklensin mi(2)?'
            )
          ) {
            var response: ProductCountModel =
              await this.warehouseService.countProductRequest(
                //sayım
                model.barcode,
                model.shelfNo,
                model.quantity === null ? Number(result[1]) : model.quantity,
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
          } else {
            return;
          }
        }
      }
    }
    if (this.productForm.valid == true) {
      (model.quantity =
        model.quantity == null ? Number(result[1]) : model.quantity),
        //this.invoiceProducts.push(model);
        this.getProductOfInvoice(this.newOrderNumber);

      this.clearFormFields();

      this.generalService.beep();
      this.alertifyService.success('Ürün Başarılı Şekilde Eklendi.');
    } else {
      this.whichRowIsInvalid()
      const formValuesJSON = JSON.stringify(this.productForm.value, null, 2);
      console.log(`Form Geçerli Değil:\n${formValuesJSON}`);      // console.log()
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
  totalCount: number;
  
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
