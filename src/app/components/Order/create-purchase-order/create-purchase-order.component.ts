import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer, SafeUrl, Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { QrOperationResponseModel } from 'src/app/models/model/client/qrOperationResponseModel';
import { CustomerModel } from 'src/app/models/model/customer/customerModel';
import { CreatePurchaseInvoice } from 'src/app/models/model/invoice/createPurchaseInvoice';
import { QrOperationModel } from 'src/app/models/model/product/qrOperationModel';
import {
  ProductCountModel
} from 'src/app/models/model/shelfNameModel';
import { OfficeModel } from 'src/app/models/model/warehouse/officeModel';
import { WarehouseOfficeModel } from 'src/app/models/model/warehouse/warehouseOfficeModel';
import { GeneralService } from 'src/app/services/admin/general.service';
import { HeaderService } from 'src/app/services/admin/header.service';
import { OrderService } from 'src/app/services/admin/order.service';
import { ProductService } from 'src/app/services/admin/product.service';
import { WarehouseService } from 'src/app/services/admin/warehouse.service';
import { ToasterService } from 'src/app/services/ui/toaster.service';
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
  currentPage: number = 1;
  constructor(
    private formBuilder: FormBuilder,
    private toasterService: ToasterService,
    private orderService: OrderService,
    private productService: ProductService,
    private warehouseService: WarehouseService,
    private generalService: GeneralService,
    private activatedRoute: ActivatedRoute,
    private title: Title,
    private sanitizer: DomSanitizer,
    private headerService: HeaderService
  ) { }


  offices: any[] = ["M", "U"]

  warehouses: any[] = ["MD", "UD"]



  async ngOnInit() {
    try {
      this.title.setTitle('Alış Faturası Oluştur');
      this.headerService.updatePageTitle('Alış Faturası Oluştur');
      //this.spinnerService.show();

      this.activatedRoute.params.subscribe(async (params) => {
        this.newOrderNumber = 'BPI-' + params['orderNo'];
        await this.getProductOfInvoice(this.newOrderNumber);
      });
      this.formGenerator();
      await this.getOfficeCodeList();

      await this.getCustomerList();
      this.setInput();
      //this.spinnerService.hide();
    } catch (error: any) {
      this.toasterService.error(error.message);
    }
  }

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
      // this.toasterService.success(this.productForm.get("officeCode").value+"\n"+   this.productForm.get("warehouseCode").value+"\n"+ this.productForm.get("currAccCode")
      // )
    }
  }
  onChangeURL(url: SafeUrl) {
    this.qrCodeDownloadLink = url;
    this.openImageModal(this.qrCodeDownloadLink);
    this.qrCodeValue = '';
  }

  totalCount: number;

  async calculateTotalQty() {
    //toplanan ürünler yazısı için
    let totalQty = 0;
    this.invoiceProducts2.forEach((item) => {
      totalQty += item.quantity;
    });
    this.totalCount = totalQty;
  }

  async getProductOfInvoice(orderNo: string): Promise<void> {
    try {
      const response = await this.productService.getProductOfInvoice(
        this.newOrderNumber
      );
      this.invoiceProducts2 = response;

      await this.calculateTotalQty();
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

  async getCustomerList(): Promise<void> {
    this.customerList = await this.warehouseService.getCustomerList('1');
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
        batchCode: [null, Validators.required],
      });
    } catch (error: any) {
      this.toasterService.error(error.message);
    }

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

  async createPurchaseInvoice() {
    var confirmation = window.confirm(
      'İşlem Nebime Aktarılacaktır.Devam Etmek istiyor musunuz?'
    );

    if (confirmation) {
      //this.spinnerService.show();
      try {
        await this.orderService.createPurchaseInvoice(
          this.invoiceProducts,
          this.newOrderNumber,
          this.productForm.get('isReturn').value,
          1 // BP2
        );
      } catch (error) { }

    }
    //this.spinnerService.hide();
  }

  // url: string = ClientUrls.baseUrl + '/Order/CountProductPuschase';
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
    if (this.productForm.get('isReturn').value === true) {
      this.focusNextInput('shelfNo');
    } else {
      this.focusNextInput('barcode');
    }
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

  async setFormValues(product: CreatePurchaseInvoice): Promise<CreatePurchaseInvoice> {

    try {
      if (product.barcode.includes('http') || this.generalService.isGuid(product.barcode)) {
        var result: string[] = await this.productService.countProductByBarcode3(
          product.barcode
        );
        this.shelfNumbers = result[0];
        this.productForm.get('quantity').setValue(result[1]);
        this.productForm.get('batchCode').setValue(result[2]);
        this.productForm.get('barcode').setValue(result[3]);

        var updated_product: CreatePurchaseInvoice = product;
        updated_product.barcode = result[3];
        updated_product.quantity = Number(result[1]);
        updated_product.batchCode = result[2];

        return updated_product;
      } else {
        var result: string[] = await this.productService.countProductByBarcode(
          product.barcode
        );
        this.shelfNumbers = result[0];
        this.productForm.get('quantity').setValue(result[1]);
        this.productForm.get('batchCode').setValue(result[2]);
        this.productForm.get('barcode').setValue(result[3]);

        var updated_product: CreatePurchaseInvoice = product;
        updated_product.barcode = result[3];
        updated_product.quantity = Number(result[1]);
        updated_product.batchCode = result[2];

        return updated_product;
      }
    } catch (error) {
      this.toasterService.error(error.message);
      return null;
    }
  }

  qrBarcodeUrl: string = null;
  qrOperationModels: QrOperationModel[] = [];
  async onSubmit(model: CreatePurchaseInvoice): Promise<any> {

    if (model.barcode.includes('=')) {
      model.barcode = model.barcode.replace(/=/g, '-');
    }
    if (
      model.barcode.includes('http') ||
      this.generalService.isGuid(model.barcode)
    ) {
      this.qrBarcodeUrl = model.barcode;
    }

    if (!this.productForm.valid) {
      var updated_product: CreatePurchaseInvoice = await this.setFormValues(model);
      model = updated_product;
      this.toasterService.success('Form Verileri Güncellendi.');
      return;
    }


    if (this.productForm.valid) {


      const shelves = this.shelfNumbers
        .split(',')
        .filter((raflar) => raflar.trim() !== null);

      if (
        shelves.find((S) => S.toLowerCase() == model.shelfNo.toLowerCase())
      ) {
        //raf barkod kontolü yapıldı

        var response: ProductCountModel =
          await this.warehouseService.countProductRequest(
            //sayım
            model.barcode,
            model.shelfNo,
            model.quantity,
            model.officeCode,
            model.warehouseCode,
            model.batchCode,
            'Order/CountProduct3',
            this.newOrderNumber,
            model.currAccCode
          );
        if (response != undefined) {


          var qrResponse: QrOperationResponseModel =
            await this.productService.qrOperationMethod(
              this.qrBarcodeUrl,
              this.productForm,
              model,
              model.quantity,
              this.productForm.get('isReturn').value,
              'BPI'
            );
          if (qrResponse != null && qrResponse.state === true) {
            this.qrOperationModels.push(qrResponse.qrOperationModel);
          } else {
            this.qrBarcodeUrl = null
          }
          //↑↑↑↑↑↑↑↑↑ EĞER QRURl BOŞ DEĞİLSE KONTROL EDİLCEK ↑↑↑↑↑↑↑↑↑


        }
      } else {
        if (
          confirm(
            'Raf Bulunamadı! Raf Barkod Doğrulaması Yapılmadan Eklensin mi(2)?'
          )
        ) {

          var requestModel2: ProductCountModel =
            await this.warehouseService.countProductRequest(
              //sayım
              model.barcode,
              model.shelfNo,
              model.quantity,
              model.officeCode,
              model.warehouseCode,
              model.batchCode,
              'Order/CountProduct3',
              this.newOrderNumber,
              model.currAccCode
            );

          if (requestModel2 != undefined) {


            var qrResponse: QrOperationResponseModel =
              await this.productService.qrOperationMethod(
                this.qrBarcodeUrl,
                this.productForm,
                model,
                model.quantity,
                this.productForm.get('isReturn').value,
                'BPI'
              );
            if (qrResponse != null && qrResponse.state === true) {
              this.qrOperationModels.push(qrResponse.qrOperationModel);
            } else {
              this.qrBarcodeUrl = null
            }

          }
        } else {
          this.toasterService.warn('Ekleme İşlemi Yapılmadı!');
          return;
        }
      }
    }

    if (this.productForm.valid == true) {
      this.getProductOfInvoice(this.newOrderNumber);
      this.clearFormFields();
      this.generalService.beep();
      this.toasterService.success('Ürün Başarılı Şekilde Eklendi.');
    } else {
      this.toasterService.error('Form Geçerli Değil.');
    }
  }

  deleteRow(index: number) {
    this.invoiceProducts.splice(index, 1);
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
      // console.log(this.qrOperationModels);
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
          // console.log(this.qrOperationModels);
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

  async deleteInvoiceProducts(orderNumber: string) {
    const confirmDelete = window.confirm(
      'Bu hareketi silmek istediğinizden emin misiniz?'
    );
    if (confirmDelete) {
      // Kullanıcı onayladıysa silme işlemini gerçekleştir
      const response = await this.orderService.deleteInvoiceProducts(
        orderNumber
      );
      if (response === true) {
        location.reload();
        this.toasterService.success('İşlem Başarılı');
      } else {
        this.toasterService.error('İşlem Başarısız');
      }
    }
  }

  checkBarcodeAndShelf(response: any, model: CreatePurchaseInvoice): string[] {
    if (response != undefined) {
      var data: ProductCountModel = response;

      if (data.status == 'RAF') {
        this.productForm.get('shelfNo')?.setValue(data.description);
        this.productForm.get('barcode')?.setValue(null);

        var shelfAndBarcode: string[] = [];
        shelfAndBarcode.push(response.description);
        shelfAndBarcode.push('');

        return shelfAndBarcode;
      } else {
        const responseData = JSON.parse(response.description);
        const description = responseData[0].Description;
        const rafNo = responseData[0].Rafno;

        if (this.productForm.get('shelfNo').value === null) {
          //eğer zaten girdiği bir değer varsa onu yerleştir yoksa gelen cevabı yerleştir
          this.productForm.get('shelfNo')?.setValue(rafNo);
        }
        this.productForm.get('barcode')?.setValue(description);

        var shelfAndBarcode: string[] = [];
        shelfAndBarcode.push(description);
        shelfAndBarcode.push(
          this.productForm.get('shelfNo').value === null ? rafNo : model.shelfNo
        );
        return shelfAndBarcode;
      }
    } else {
      this.toasterService.warn('Doğrulama Yapılamadı!');
      return null;
    }
  }


  //--------------
  visible: boolean = false;
  barcode: string = null;
  quantity: number = null;
  change(barcode: string, quantity: number) {
    this.visible = !this.visible;
    this.barcode = barcode;
    this.quantity = quantity
  }
  //--------------
}
