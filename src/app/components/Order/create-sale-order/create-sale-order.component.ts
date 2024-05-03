import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer, SafeUrl, Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ClientUrls } from 'src/app/models/const/ClientUrls';
import { QrOperationResponseModel } from 'src/app/models/model/client/qrOperationResponseModel';
import { CustomerModel } from 'src/app/models/model/customer/customerModel';
import { CreatePurchaseInvoice } from 'src/app/models/model/invoice/createPurchaseInvoice';
import { SalesPersonModel } from 'src/app/models/model/order/salesPersonModel';
import { QrOperationModel } from 'src/app/models/model/product/qrOperationModel';
import {
  ProductCountModel
} from 'src/app/models/model/shelfNameModel';
import { OfficeModel } from 'src/app/models/model/warehouse/officeModel';
import { WarehouseOfficeModel } from 'src/app/models/model/warehouse/warehouseOfficeModel';
import { GeneralService } from 'src/app/services/admin/general.service';
import { OrderService } from 'src/app/services/admin/order.service';
import { ProductService } from 'src/app/services/admin/product.service';
import { WarehouseService } from 'src/app/services/admin/warehouse.service';
import { HttpClientService } from 'src/app/services/http-client.service';
import { ToasterService } from 'src/app/services/ui/toaster.service';
declare var window: any;
@Component({
  selector: 'app-create-sale-order',
  templateUrl: './create-sale-order.component.html',
  styleUrls: ['./create-sale-order.component.css'],
})
export class CreateSaleOrderComponent implements OnInit {
  infoProducts: CreatePurchaseInvoice[] = [];
  addToList(model: any) {
    this.toasterService.success(model.itemCode + ' Eklendi');
    this.infoProducts.push(model);
    this.addedProductCount = 'Sayım Paneli(' + this.infoProducts.length + ')';
  }
  constructor(
    private httpClientService: HttpClientService,
    private formBuilder: FormBuilder,
    private toasterService: ToasterService,
    private orderService: OrderService,
    private productService: ProductService,
    private warehouseService: WarehouseService,
    private generalService: GeneralService,
    private activatedRoute: ActivatedRoute,
    private title: Title,
    private sanitizer: DomSanitizer
  ) { }
  selectedCustomer: any;
  offices: any[] = ["M", "U"]
  warehouses: any[] = ["MD", "UD"]
  currencyList: any[] = [{ name: 'Vergili', code: '0' }, { name: 'Vergisiz', code: '4' }]; //vergi tipi

  async ngOnInit() {
    try {
      this.title.setTitle('Satış Faturası Oluştur');


      this.isReturnInvoice = false;
      this.formGenerator();

      this.activatedRoute.params.subscribe(async (params) => {
        this.newOrderNumber = 'WSI-' + params['orderNo'];

        await this.getProductOfInvoice(this.newOrderNumber);
        await this.getCustomerList(); //müşteriler kodu
        await this.getSalesPersonModels(); //personeller kodu
        this.setInput();
      });

      //this.spinnerService.hide();
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
  isReturnInvoice: boolean;
  checkIsReturnInvoice() {
    this.isReturnInvoice = !this.productForm.get('isReturn').value;
    if (this.isReturnInvoice) {
      this.toasterService.warn(
        'İade Faturasına Geçildiği İçin Sayım Paneli'
      );
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
  visible: boolean = false;
  qrCodeValue: string;
  qrCodeDownloadLink: any = this.sanitizer.bypassSecurityTrustResourceUrl('');
  setInput() {
    if (this.invoiceProducts2.length > 0) {
      if (this.invoiceProducts2[0].officeCode == 'M') {

        this.productForm.get('officeCode').setValue('M');
      } else {

        this.productForm.get('officeCode').setValue('U');
      }

      this.productForm
        .get('warehouseCode')
        .setValue(this.invoiceProducts2[0].warehouseCode);
      this.productForm
        .get('currAccCode')
        .setValue(this.invoiceProducts2[0].currAccCode);
      // this.toasterService.success(this.productForm.get("officeCode").value+"\n"+   this.productForm.get("warehouseCode").value+"\n"+ this.productForm.get("currAccCode")
      // )
    }
  }
  createJson(barcode: string, shelfNo: string) {
    var model: CreatePurchaseInvoice = this.invoiceProducts2.find(
      (p) => (p.barcode = barcode) && p.shelfNo == shelfNo
    );
    const formDataJSON = JSON.stringify(model); // Form verilerini JSON'a dönüştür

    this.qrCodeValue = formDataJSON;
    // this.toasterService.success(this.qrCodeValue)
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
      this.invoiceProducts2.forEach((e) => {
        if (e.quantity > e.qty) {
          this.infoProducts.push(e);
        }
      });
      this.addedProductCount = 'Sayım Paneli(' + this.infoProducts.length + ')';

      this.calculateTotalQty();
    } catch (error: any) {
      this.toasterService.warn(error.message);
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
      this.toasterService.warn(error.message);
    }
  }

  async getWarehouseList(value: string): Promise<void> {
    this.warehouseModels = await this.warehouseService.getWarehouseList(value);
    console.log(this.warehouseModels);
  }
  customerList2: any[] = [];
  async getCustomerList(): Promise<void> {
    this.customerList = await this.warehouseService.getCustomerList('3');
    this.customerList.forEach((c) => {
      var color: any = { name: c.currAccDescription, code: c.currAccCode };
      this.customerList2.push(color);
    });
  }

  salesPersonModels: SalesPersonModel[] = [];
  salesPersonModelList: any[] = [];
  selectedPerson: any;
  async getSalesPersonModels(): Promise<any> {
    try {
      try {
        this.salesPersonModels = await this.orderService.getSalesPersonModels();

        this.salesPersonModels.forEach((c) => {
          var color: any = { name: c.firstLastName, code: c.salespersonCode };
          this.salesPersonModelList.push(color);
        });

        //this.toasterService.success("Başarıyla "+this.salesPersonModels.length+" Adet Çekildi")
      } catch (error: any) {
        this.toasterService.error(error.message);
        return null;
      }
    } catch (error: any) {
      this.toasterService.error(error.message);
    }
  }

  async getSelectedOffice(): Promise<any> {
    var office = (document.getElementById('officeCode') as HTMLInputElement)
      .value;

    await this.getWarehouseList(office);
    this.productForm
      .get('warehouseCode')
      ?.setValue(this.warehouseModels[0].warehouseCode);
  }

  clearShelfNumbers() {
    this.productForm.get('shelfNo').setValue(null);
    this.productForm.get('barcode').setValue(null);
    this.productForm.get('quantity').setValue(null);
    this.productForm.get('batchCode').setValue(null);

    if (this.productForm.get('isReturn').value === false) {
      this.focusNextInput('shelfNo');
    } else {
      this.focusNextInput('barcode');
    }
    this.shelfNumbers = 'RAFLAR:';
    this.qrBarcodeUrl = null;
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
        barcode: [null, [Validators.required, Validators.minLength(5)]],
        quantity: [null],
        isReturn: { value: true, disabled: true },
        currency: [null, Validators.required],
        batchCode: [null],
      });

      this.productForm.get('officeCode').valueChanges.subscribe(value => {
        if (value === 'M') {
          this.productForm.get('warehouseCode').setValue('MD');
        }
      });

      this.productForm.get('officeCode').valueChanges.subscribe(value => {
        if (value === 'U') {
          this.productForm.get('warehouseCode').setValue('UD');
        }
      });


    } catch (error: any) {
      this.toasterService.error(error.message);
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
    this.qrBarcodeUrl = null;
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
  async deleteOrderProduct(orderNo: string, product: any): Promise<boolean> {
    const confirmDelete = window.confirm(
      'Bu hareketi silmek istediğinizden emin misiniz?'
    );

    if (confirmDelete) {
      const response: boolean = await this.productService.deleteOrderProduct(
        this.newOrderNumber,
        product.itemCode, product.id
      );
      if (response) {
        this.invoiceProducts2 = this.invoiceProducts2.filter(
          (o) =>
            !(o.barcode == product.itemCode && o.shelfNo == product.shelfNo)
        );
        this.calculateTotalQty();
        await this.getProductOfInvoice(this.newOrderNumber);
        this.toasterService.success('Silme İşlemi Başarılı.');
      } else {
        this.toasterService.error('Silme İşlemi Başarısız.');
      }

      var model: QrOperationModel = new QrOperationModel();
      var qrOperationModel: QrOperationModel = new QrOperationModel();
      console.log(this.qrOperationModels);
      qrOperationModel = this.qrOperationModels.find(
        (p) =>
          p.barcode == product.barcode &&
          p.batchCode == product.batchCode &&
          p.shelfNo == product.shelfNo
      );

      var matchingData = this.qrOperationModels.filter(
        (p) =>
          p.barcode == product.barcode &&
          p.batchCode == product.batchCode &&
          p.shelfNo == product.shelfNo
      );
      const totalQuantity = 0;

      if (qrOperationModel) {
        if (matchingData) {
          const totalQuantity = matchingData.reduce(
            (acc, curr) => acc + curr.qty,
            0
          );
          qrOperationModel.qty = totalQuantity;
        }

        // qrOperationModel nesnesini model'e kopyala
        model = Object.assign({}, qrOperationModel);

        if (qrOperationModel.isReturn) {
          model.isReturn = false;
        } else {
          model.isReturn = true;
        }
        const qrOperationResponse = await this.productService.qrOperation(
          model
        );
        if (qrOperationResponse) {
          console.log(this.qrOperationModels);
          this.generalService.beep3();
          this.toasterService.success('Qr Operasyonu Geri Alındı');
        } else {
          this.toasterService.error('Qr Operaasyonu Geri Alınamadı');
        }
      } else {
        this.toasterService.error('Qr Operaasyonu Geri Alınamadı');
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

    if (confirmation) {
      //this.spinnerService.show();
      try {
        if (
          this.productForm.get('salesPersonCode').value === '' ||
          this.productForm.get('salesPersonCode').value == null
        ) {
          this.toasterService.error('Satış Sorumlusu Alanı Boş');
          return;
        }
        if (
          this.productForm.get('currency').value === '' ||
          this.productForm.get('currency').value == null
        ) {
          this.toasterService.error('Vergi Tipi Alanı Boş');
          return;
        }

        //OTOMATIK SAYIM YAPMA KODU ↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑
        const data = await this.orderService.createSaleInvoice(
          this.invoiceProducts2,
          this.newOrderNumber,
          this.productForm.get('isReturn').value,
          this.productForm.get('salesPersonCode').value.code,
          this.productForm.get('currency').value.code
        );
      } catch (error: any) { }

    }
    //this.spinnerService.hide();
  }

  setCurrentCustomerCode() {
    var currAccCode: string = (
      document.getElementById('currAccCode') as HTMLInputElement
    ).value.toString();

    (document.getElementById('currAccCode2') as HTMLInputElement).value =
      currAccCode;
  }

  async setFormValues(barcode: string, check: boolean): Promise<string> {
    this.shelfNumbers = 'RAFLAR:';
    try {
      if (barcode.includes('http') || this.generalService.isGuid(barcode)) {
        var result: string[] = await this.productService.countProductByBarcode3(
          barcode
        );
        this.shelfNumbers += result[0];
        if (check) {
          var currentShelfNo = this.productForm.get('shelfNo').value;
          // if(currentShelfNo==null ){
          //   this.productForm.get('shelfNo').setValue(result[0].split(',')[0]);
          // }

          this.productForm.get('batchCode').setValue(result[2]);
          this.productForm.get('barcode').setValue(result[3]);
        }

        return result[1];
      } else {
        var result: string[] = await this.productService.countProductByBarcode(
          barcode
        );
        this.productForm.get('batchCode').setValue(result[2]);
        this.productForm.get('barcode').setValue(result[3]);
        if (result[4] == 'false') {

          if (!window.confirm('Parti Hatalı Devam Edilsin Mi?')) {
            this.productForm.get('batchCode').setValue(null);
            this.focusNextInput('batchCode');
            this.toasterService.error('Parti Giriniz');
            return null;
          }


        }
        this.shelfNumbers += result[0];
        return result[1];
      }
    } catch (error) {
      this.toasterService.error(error.message);
      return null;
    }
  }

  url: string = ClientUrls.baseUrl + '/Order/CountProductPuschase';
  shelfNumbers: string = 'RAFLAR:';
  qrBarcodeUrl: string = null;
  qrOperationModels: QrOperationModel[] = [];
  async onSubmit(model: CreatePurchaseInvoice): Promise<any> {

    if (model.barcode.includes("=")) {
      model.barcode = model.barcode.replace(/=/g, "-");

    }
    if (
      model.barcode.includes('http') ||
      this.generalService.isGuid(model.barcode)
    ) {
      var number = await this.setFormValues(model.barcode, true);
      this.productForm.get('quantity')?.setValue(Number(number));
      this.qrBarcodeUrl = model.barcode;
      // this.onSubmit(this.productForm.value);
      return;
    }

    if (model.barcode && !model.shelfNo) {
      var number = await this.setFormValues(model.barcode, true);
      this.productForm.get('quantity')?.setValue(Number(number)); //quantity alanı dolduruldu
      this.focusNextInput('shelfNo');
      return;
    } else {
      if (this.productForm.valid) {
        if (model.currAccCode) {
          model.currAccCode = this.productForm.get('currAccCode').value.code;
        }
        if (model.salesPersonCode) {
          model.salesPersonCode =
            this.productForm.get('salesPersonCode').value.code;
        }
        console.log(this.productForm.value);
        var value = this.productForm.get('currAccCode').value;
        if (value === null) {
          try {
            var currAccCodeValue = (
              document.getElementById('currAccCode2') as HTMLInputElement
            ).value.toString();
            model.currAccCode = currAccCodeValue;
            this.productForm.get('currAccCode').setValue(currAccCodeValue);
          } catch (error) {
            this.toasterService.error('Müşteri Kodu Hatası.');
            return;
          }
        }

        var result = await this.productService.countProductByBarcode(
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

            //↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓


            var qrResponse: QrOperationResponseModel =
              await this.productService.qrOperationMethod(
                this.qrBarcodeUrl,
                this.productForm,
                model,
                Number(result[1]),
                this.productForm.get('isReturn').value,
                'WSI'
              );
            if (qrResponse != null && qrResponse.state === true) {
              this.qrOperationModels.push(qrResponse.qrOperationModel);
            } else {
              this.qrBarcodeUrl = null
            }

            //↑↑↑↑↑↑↑↑↑ EĞER QRURl BOŞ DEĞİLSE KONTROL EDİLCEK ↑↑↑↑↑↑↑↑↑

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

              //↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓

              var qrResponse: QrOperationResponseModel =
                await this.productService.qrOperationMethod(
                  this.qrBarcodeUrl,
                  this.productForm,
                  model,
                  Number(result[1]),
                  this.productForm.get('isReturn').value,
                  'WSI'
                );
              if (qrResponse != null && qrResponse.state === true) {
                this.qrOperationModels.push(qrResponse.qrOperationModel);
              } else {
                this.qrBarcodeUrl = null
              }
              //↑↑↑↑↑↑↑↑↑ EĞER QRURl BOŞ DEĞİLSE KONTROL EDİLCEK ↑↑↑↑↑↑↑↑↑

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
      this.toasterService.success('Ürün Başarılı Şekilde Eklendi.');
    } else {
      this.whichRowIsInvalid();
      const formValuesJSON = JSON.stringify(this.productForm.value, null, 2);
      console.log(`Form Geçerli Değil:\n${formValuesJSON}`); // console.log()
    }
  }

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
