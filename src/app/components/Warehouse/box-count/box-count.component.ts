import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer, Title } from '@angular/platform-browser';
import { ClientUrls } from 'src/app/models/const/ClientUrls';
import { QrOperationResponseModel } from 'src/app/models/model/client/qrOperationResponseModel';
import { CountProductRequestModel2 } from 'src/app/models/model/order/countProductRequestModel2';
import { OrderBillingListModel } from 'src/app/models/model/order/orderBillingListModel';
import { ProductOfOrder } from 'src/app/models/model/order/productOfOrders';
import { CountedProduct } from 'src/app/models/model/product/countedProduct';
import { ItemBillingModel } from 'src/app/models/model/product/itemBillingModel ';
import { QrOperationModel } from 'src/app/models/model/product/qrOperationModel';
import {
  ProductCountModel
} from 'src/app/models/model/shelfNameModel';
import { WarehouseOfficeModel } from 'src/app/models/model/warehouse/warehouseOfficeModel';
import { GeneralService } from 'src/app/services/admin/general.service';
import { HeaderService } from 'src/app/services/admin/header.service';
import { ProductService } from 'src/app/services/admin/product.service';
import { WarehouseService } from 'src/app/services/admin/warehouse.service';
import { ToasterService } from 'src/app/services/ui/toaster.service';
declare var window: any;
@Component({
  selector: 'app-box-count',
  templateUrl: './box-count.component.html',
  styleUrls: ['./box-count.component.css'],
})
export class BoxCountComponent implements OnInit {
  [x: string]: any;
  productsToCollect: ProductOfOrder[];
  collectedProducts: ProductOfOrder[] = [];
  process: boolean = false;
  checkForm: FormGroup;
  activeTab: number = 1;
  currentOrderNo: string;
  modalImageUrl: string;
  formModal: any;
  qrCodeValue: string;
  qrCodeDownloadLink: any = this.sanitizer.bypassSecurityTrustResourceUrl('');
  blocked: boolean;

  _tableHeaders: string[] = [
    'Resim',
    'Raf',
    'Ürün Kodu',
    'Miktar',
    'Parti',
    'Barkod',
    'İşlem',
  ];
  constructor(
    private formBuilder: FormBuilder,
    private toasterService: ToasterService,
    private headerService: HeaderService,
    private productService: ProductService,
    private generalService: GeneralService,
    private warehouseService: WarehouseService,

    private title: Title,
    private sanitizer: DomSanitizer
  ) {
    this.title.setTitle('Sayım');
  }
  shelfNumbers: string = 'RAFLAR:';
  async ngOnInit() {
    this.headerService.updatePageTitle('Kutu Sayım');
    this.formGenerator();
    var guid = await this.generalService.generateGUID();
    this.currentOrderNo = 'BXC-' + guid
  }


  openImageModal(imageUrl: string) {
    this.modalImageUrl = imageUrl;
    if (!this.formModal) {
      this.formModal = new window.bootstrap.Modal(
        document.getElementById('myModal')
      );
    }
    this.formModal.show();
  }

  focusNextInput(nextInputId: string) {
    const nextInput = document.getElementById(nextInputId) as HTMLInputElement;
    if (nextInput) {
      nextInput.focus();
    }
  }
  orderBillingList: OrderBillingListModel[] = [];
  itemBillingModels: ItemBillingModel[] = [];

  deleteRow(index: number) {
    this.itemBillingModels.splice(index, 1); // İlgili satırı listeden sil
  }
  orderNo: string = '';
  warehouseModels: WarehouseOfficeModel[] = [];
  warehouseModels2: WarehouseOfficeModel[] = [];

  currentQrCode: string = '';
  orderBillingModel: OrderBillingListModel;
  formGenerator() {
    this.checkForm = this.formBuilder.group({
      barcode: [null, Validators.required],
      shelfNo: [' ', Validators.required],
      quantity: [null],
      // office: [null, Validators.required],
      batchCode: [null],
      // warehouseCode: [null, Validators.required],
      isShelfBased: [null],
    });
  }

  list: CountProductRequestModel2[] = [];
  totalCount: number = 0;
  currentPage: number = 1;


  async setFormValues(barcode: string, check: boolean): Promise<string> {
    this.shelfNumbers = 'RAFLAR:';
    try {
      var state = this.generalService.isGuid(barcode);
      if (barcode.includes('http') || state) {
        var result: string[] = await this.productService.countProductByBarcode3(
          barcode
        );
        this.shelfNumbers += result[0];
        if (check) {
          var currentShelfNo = this.checkForm.get('shelfNo').value;
          this.checkForm.get('batchCode').setValue(result[2]);
          this.checkForm.get('barcode').setValue(result[3]);
        }

        return result[1];
      } else {
        var result: string[] = await this.productService.countProductByBarcode(
          barcode
        );
        this.shelfNumbers += result[0];
        return result[1];
      }
    } catch (error) {
      this.toasterService.error(error.message);
      return null;
    }
  }

  async getQuantity(barcode: string): Promise<string> {
    var result: string[] = await this.productService.countProductByBarcode(
      barcode
    );

    return result[1];
  }
  state: boolean = true;
  qrBarcodeUrl: string = null;
  qrOperationModels: QrOperationModel[] = [];

  async check() {
    if ((this.qrBarcodeUrl == null || this.qrBarcodeUrl == undefined) && (this.checkForm.value.barcode.includes('http') || this.generalService.isGuid(this.checkForm.value.barcode))) {
      await this.control(this.checkForm.value);
      return
    }
    if ((this.qrBarcodeUrl == null || this.qrBarcodeUrl == undefined)) {

      this.toasterService.error('Lütfen Bir Qr Kod Giriniz');
      this.clearQrAndBatchCode();;
      return;
    }
    await this.onSubmit(this.checkForm.value);
  }
  async control(countProductRequestModel: CountProductRequestModel2) {
    if (countProductRequestModel.barcode === 'http://www.dayve.com') {
      return;
    }
    while (countProductRequestModel.barcode.includes('=')) {
      countProductRequestModel.barcode =
        countProductRequestModel.barcode.replace('=', '-');
    }

    if (
      countProductRequestModel.barcode.includes('http') ||
      this.generalService.isGuid(countProductRequestModel.barcode)
    ) {
      var number = await this.setFormValues(
        countProductRequestModel.barcode,
        true
      );
      this.checkForm.get('quantity')?.setValue(Number(number));
      this.qrBarcodeUrl = countProductRequestModel.barcode;
      if (countProductRequestModel.shelfNo != null) {
        // this.onSubmit(this.checkForm.value);
      }
      return;
    }
  }

  async onSubmit(
    countProductRequestModel: CountProductRequestModel2
  ): Promise<any> {


    if (!this.checkForm.valid) {
      if (countProductRequestModel.barcode) {
        var number = await this.setFormValues(
          countProductRequestModel.barcode,
          true
        );
        this.checkForm.get('quantity')?.setValue(Number(number)); //quantity alanı dolduruldu
        this.toasterService.success(
          'Raflar Getirildi Ve Miktar Alanı Dolduruldu.'
        );
      } else {
        this.toasterService.warn('Barkod Alanı Boş.');
      }
      return;
    } else {
      const url = ClientUrls.baseUrl + '/Order/CountProduct3';

      try {
        var newResponse = await this.productService.countProductByBarcode(
          countProductRequestModel.barcode
        );
        const shelves = newResponse[0]
          .split(',')
          .filter((raflar) => raflar.trim() !== '')
          .map((raflar) => raflar.toLowerCase());
        if (this.state) {
          this.state = false;

          // EĞER GİRİLEN RAF  RAFLARDA VARSA DİREKT SAYAR

          var response: ProductCountModel =
            await this.warehouseService.countProductRequest(
              countProductRequestModel.barcode,
              countProductRequestModel.shelfNo,
              countProductRequestModel.quantity == null
                ? Number(newResponse[1])
                : countProductRequestModel.quantity,
              countProductRequestModel.office,
              countProductRequestModel.warehouseCode,
              countProductRequestModel.batchCode,
              'Order/CountProduct3',
              this.currentOrderNo,
              ''
            );

          // SAYIM YAPILDI -------------------------------------------

          //↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓
          var qrResponse: QrOperationResponseModel =
            await this.productService.qrOperationMethod(
              this.qrBarcodeUrl,
              this.checkForm,
              countProductRequestModel,
              Number(newResponse[1]),
              false,
              'CO'
            );
          if (qrResponse != null && qrResponse.state === true) {
            this.qrOperationModels.push(qrResponse.qrOperationModel);
          } else if (qrResponse === null) {
            this.toasterService.error('QR Kod Okunamadı.');
            this.clearQrAndBatchCode();
          }

          //↑↑↑↑↑↑↑↑↑ EĞER QRURl BOŞ DEĞİLSE KONTROL EDİLCEK ↑↑↑↑↑↑↑↑↑

          if (response != undefined) {
            var data: ProductCountModel = response;
            if (data.status == 'RAF') {
              countProductRequestModel.shelfNo = response.description;
            } else {
              countProductRequestModel.barcode = response.description;
            }

            this.generalService.beep();
            this.clearQrAndBatchCode();
            this.state = true;
          }

          // EĞER GİRİLEN RAF  RAFLARDA YOKSA SORAR

        }
      } catch (error: any) {
        this.toasterService.error(error.message);
        this.state = true;
      }
    }
  }
  isFirstBarcode: boolean = false;
  currentbarcode: string;
  barcodeList: string[] = [];


  clearShelfNumbers() {
    this.checkForm.get('shelfNo').setValue(null);
    this.checkForm.get('barcode').setValue(null);
    this.focusNextInput('shelfNo');
    this.shelfNumbers = 'RAFLAR:';
    this.qrBarcodeUrl = null;
    this.checkForm.get('quantity').setValue(null);
    this.checkForm.get('batchCode').setValue(null);
  }
  clearQrAndBatchCode() {
    this.checkForm.get('barcode').setValue(null);
    this.checkForm.get('batchCode').setValue(null);
    this.checkForm.get('quantity').setValue(null);
    this.focusNextInput('countPageBarcode');
    this.shelfNumbers = 'RAFLAR:';
    this.qrBarcodeUrl = null;
  }


  async deleteOrderProduct(orderNo: string, product: any): Promise<boolean> {
    const response: boolean = await this.productService.deleteOrderProduct(
      this.currentOrderNo,
      product.itemCode,
      product.lineId
    );
    if (response) {
      this.list = this.list.filter(
        (o) => !(o.barcode == product.itemCode && o.shelfNo == product.shelfNo)
      );


      this.toasterService.success('Silme İşlemi Başarılı.');
    } else {
      this.toasterService.error('Silme İşlemi Başarısız.');
    }
    return response;
  }
}
