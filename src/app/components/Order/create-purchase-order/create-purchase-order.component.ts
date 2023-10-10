import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ClientUrls } from 'src/app/models/const/ClientUrls';
import { CustomerModel } from 'src/app/models/model/customer/customerModel';
import { CreatePurchaseInvoice } from 'src/app/models/model/invoice/createPurchaseInvoice';
import { ProductCountModel } from 'src/app/models/model/shelfNameModel';
import { OfficeModel } from 'src/app/models/model/warehouse/officeModel';
import { WarehouseOfficeModel } from 'src/app/models/model/warehouse/warehouseOfficeModel';
import { GeneralService } from 'src/app/services/admin/general.service';
import { OrderService } from 'src/app/services/admin/order.service';
import { ProductService } from 'src/app/services/admin/product.service';
import { WarehouseService } from 'src/app/services/admin/warehouse.service';
import { AlertifyService } from 'src/app/services/ui/alertify.service';
declare var window: any;

@Component({
  selector: 'app-create-purchase-order',
  templateUrl: './create-purchase-order.component.html',
  styleUrls: ['./create-purchase-order.component.css'],
})
export class CreatePurchaseOrderComponent implements OnInit {
  newOrderNumber: string;
  customerList: CustomerModel[] = [];
  officeModels: OfficeModel[] = [];
  invoiceProducts: CreatePurchaseInvoice[] = [];
  invoiceProducts2: CreatePurchaseInvoice[] = [];

  activeTab = 1;
  productForm: FormGroup;
  warehouseModels: WarehouseOfficeModel[] = [];
  currentPage:number = 1;
  constructor(
    private formBuilder: FormBuilder,
    private alertifyService: AlertifyService,
    private orderService: OrderService,
    private productService :ProductService,
    private spinnerService: NgxSpinnerService,
    private warehouseService: WarehouseService,
    private generalService: GeneralService,
    private activatedRoute : ActivatedRoute
  ) {}

  async ngOnInit() {
    try {
      this.spinnerService.show();

      this.activatedRoute.params.subscribe(async (params) => {
        this.newOrderNumber = 'BPI-'+params['orderNo'];
        await this.getProductOfInvoice(    this.newOrderNumber );
      });
      this.formGenerator();
      await this.getWarehouseList('M');
      await this.getOfficeCodeList();
      await this.getCustomerList();

      this.spinnerService.hide();
    } catch (error: any) {
      this.alertifyService.error(error.message);
    }
  }
  totalCount : number;

  async calculateTotalQty() {

    //toplanan ürünler yazısı için
    let totalQty = 0;
    this.invoiceProducts2.forEach((item) => {
      totalQty += item.quantity;
    });
    this.totalCount = totalQty;
  }

  async getProductOfInvoice(orderNo :string): Promise<void> {
    try {
      const response = await this.productService.getProductOfInvoice( this.newOrderNumber);
      this. invoiceProducts2 = response;
      
      await this.calculateTotalQty();
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

  focusNextInput(nextInputId: string) {
    const nextInput = document.getElementById(nextInputId) as HTMLInputElement;
    if (nextInput) {
      nextInput.focus();
    }
  }

  async generateGUID(): Promise<string> {
    return await this.generalService.generateGUID();
  }

  formGenerator() {
    try {
   
      this.productForm = this.formBuilder.group({
        officeCode: [null, Validators.required],
        warehouseCode: [null, Validators.required],
        currAccCode: [null, Validators.required],
        shelfNo: [null, [Validators.required, Validators.maxLength(10)]],
        barcode: [null, [Validators.required, Validators.min(5)]],
        quantity: [null],
        isReturn: [false, [Validators.required]],
        batchCode: ['',]
            });
    } catch (error: any) {
      this.alertifyService.error(error.message);
    }
  }

  clearFormFields() {
    // Alanları temizleme
    this.productForm.patchValue({
      barcode:null,
      quantity: null,
    });
    this.focusNextInput('barcode');
    this.shelfNumbers = 'RAFLAR:'
  }

  async createPurchaseInvoice() {
    //alış faturası oluştur

    await this.orderService.createPurchaseInvoice(
      this.invoiceProducts,
      this.newOrderNumber,
      this.productForm.get('isReturn').value
    );
  }

  url: string = ClientUrls.baseUrl + '/Order/CountProductPuschase';
  shelfNumbers: string = 'RAFLAR:';  
  async setShelfNo(barcode: string) {
    this.shelfNumbers = 'RAFLAR:';

    if (barcode.length > 20) {
      this.shelfNumbers += await this.productService.countProductByBarcode(
        barcode
      );
    }
   // this.productForm.get('barcode').setValue('');
    this.focusNextInput('shelfNo');
  }
  clearShelfNumbers() {
    this.productForm.get('shelfNo').setValue(null);
    this.productForm.get('barcode').setValue(null);
    this.productForm.get('quantity').setValue(null);
    this.productForm.get('batchCode').setValue(null);
    this.focusNextInput('barcode');
    this.shelfNumbers='RAFLAR:'

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


  async onSubmit(model: CreatePurchaseInvoice): Promise<any> {
     if (model.barcode && !model.shelfNo)
       {
      

          var result: string[] = await this.productService.countProductByBarcode(
            model.barcode
          );
          this.shelfNumbers += result[0];
          this.productForm.get('quantity').setValue(result[1]);
          this.focusNextInput('shelfNo')
          return;
       
    } else {
      
        if (this.productForm.valid) {
         
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
          .filter((raflar) => raflar.trim() !==null);
            
          if (shelves.find(S=>S.toLowerCase() == model.shelfNo.toLowerCase())) { //raf barkod kontolü yapıldı
            
            var requestModel: CreatePurchaseInvoice = new CreatePurchaseInvoice();

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
              var requestModel2: ProductCountModel =
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


      this.generalService.beep();
      this.alertifyService.success('Ürün Başarılı Şekilde Eklendi.');
    } else {
      this.alertifyService.error('Form Geçerli Değil.');
    }
  }

  deleteRow(index: number) {
    this.invoiceProducts.splice(index, 1);
  }

  async deleteOrderProduct(
    orderNo: string,
    itemCode: string,
    shelfNo: string
  ): Promise<boolean> {
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
  }



  checkBarcodeAndShelf(response:any,model :CreatePurchaseInvoice):string[]{
    if (response != undefined) {
      var data: ProductCountModel = response;

      if (data.status == 'RAF') {
        this.productForm.get('shelfNo')?.setValue(data.description);
        this.productForm.get('barcode')?.setValue(null);


        var shelfAndBarcode : string[] = []
        shelfAndBarcode.push(response.description);
        shelfAndBarcode.push('');

        return shelfAndBarcode;
       
      } else {
        const responseData = JSON.parse(response.description);
        const description = responseData[0].Description;
        const rafNo = responseData[0].Rafno;


        if(this.productForm.get('shelfNo').value === null){ //eğer zaten girdiği bir değer varsa onu yerleştir yoksa gelen cevabı yerleştir
          this.productForm.get('shelfNo')?.setValue(rafNo)
        };
        this.productForm.get('barcode')?.setValue(description);


        var shelfAndBarcode : string[] = []
        shelfAndBarcode.push(description);
        shelfAndBarcode.push(this.productForm.get('shelfNo').value === null ? rafNo : model.shelfNo);
        return shelfAndBarcode;
      }


    } else {
      this.alertifyService.warning('Doğrulama Yapılamadı!');
      return null;
    }

  }
}
