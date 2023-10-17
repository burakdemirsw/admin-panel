import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { ProductService } from 'src/app/services/admin/product.service';
import { HttpClientService } from 'src/app/services/http-client.service';
import { AlertifyService } from 'src/app/services/ui/alertify.service';
import { ActivatedRoute, Router } from '@angular/router';
import { OrderService } from '../../../services/admin/order.service';
import { OrderBillingListModel } from 'src/app/models/model/order/orderBillingListModel';
import { ProductOfOrder } from 'src/app/models/model/order/productOfOrders';
import { ItemBillingModel } from 'src/app/models/model/product/itemBillingModel ';
import { ClientUrls } from 'src/app/models/const/ClientUrls';
import { CountProductRequestModel } from 'src/app/models/model/order/countProductRequestModel';
import { ProductCountModel } from 'src/app/models/model/shelfNameModel';
import { HttpClient } from '@angular/common/http';

import { WarehouseOperationDetailModel } from 'src/app/models/model/warehouse/warehouseOperationDetailModel';
import { WarehouseService } from 'src/app/services/admin/warehouse.service';
import { BrowserMultiFormatReader } from '@zxing/library';
import { GeneralService } from 'src/app/services/admin/general.service';
import { CollectedProduct } from 'src/app/models/model/product/collectedProduct';
import { DomSanitizer, SafeUrl, Title } from '@angular/platform-browser';
import { WarehouseOperationProductModel } from 'src/app/models/model/warehouse/warehouseOperationProductModel';
import { CountedProduct } from 'src/app/models/model/product/countedProduct';

declare var window: any;

@Component({
  selector: 'app-order-operation',
  templateUrl: './order-operation.component.html',
  styleUrls: ['./order-operation.component.css'],
})
export class OrderOperationComponent implements OnInit {
  lastCollectedProducts: CollectedProduct[] = [];
  productsToCollect: ProductOfOrder[];
  collectedProducts: ProductOfOrder[] = [];
  process: boolean = false;
  checkForm: FormGroup;
  activeTab: number = 1;
  warehouseModels: WarehouseOperationDetailModel[] = [];
  pageDescription: string = null;
  shelfNumbers: string = 'RAFLAR:';
  operation: string = '';

  currentOrderNo: string;
  private codeReader: BrowserMultiFormatReader;

  constructor(
    private alertifyService: AlertifyService,
    private formBuilder: FormBuilder,
    private orderService: OrderService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private httpClient: HttpClient,
    private spinnerService: NgxSpinnerService,
    private productService: ProductService,
    private warehouseService: WarehouseService,
    private generalService: GeneralService,
    private title: Title,    private sanitizer: DomSanitizer

  ) {
    this.codeReader = new BrowserMultiFormatReader();
  }
  qrCodeValue: string =''
  qrCodeDownloadLink: any = this.sanitizer.bypassSecurityTrustResourceUrl('');

  createJson(barcode: string,shelfNo:string,itemCode:string) {
  
    var model: CollectedProduct = this.lastCollectedProducts.find(
      (p) => (p.barcode = barcode) && p.shelfNo == shelfNo  && p.itemCode == itemCode
    );
    const formDataJSON = JSON.stringify(model); // Form verilerini JSON'a dönüştür

    this.qrCodeValue = formDataJSON;
    // this.alertifyService.success(this.qrCodeValue)
    
  }

  onChangeURL(url: SafeUrl) {
    this.qrCodeDownloadLink = url;
    this.openImageModal(this.qrCodeDownloadLink);
    this.qrCodeValue = ''
  }



  orderNo: string;
  orderBillingModel: OrderBillingListModel;
  url2: string = ClientUrls.baseUrl + '/Order/CountTransferProductPuschase';
  async ngOnInit() {
    this.spinnerService.show();

    await this.activatedRoute.params.subscribe(async (params) => {
      this.formGenerator();

      var orderNumber: string = params['orderNumber'];
      this.orderNo = orderNumber;

      var orderNumberType = orderNumber.split('-')[1];
      this.currentOrderNo = params['orderNumber'];
      this.lastCollectedProducts =
        await this.productService.getCollectedOrderProducts(this.orderNo);
      if (orderNumberType === 'BP') {
        await this.getCollectedProducts(params['orderNumber'], 'BP');
      } else if (orderNumberType === 'WS') {
        await this.getCollectedProducts(params['orderNumber'], 'WS');
      } else if (orderNumberType === 'WT') {
        await this.getCollectedProducts(params['orderNumber'], 'WT');
      }
      this.spinnerService.hide();
      this.setPageDescription(orderNumberType);
    });
  }

  setPageDescription(orderNumberType: string) {
    if (orderNumberType === 'BP') {
      this.title.setTitle('Alınan Sipariş Faturalaştır');
      this.operation = 'Toplananları Faturalaştır';
      this.pageDescription = 'Ürün Toplama Paneli';
    } else if (orderNumberType === 'WS') {
      this.title.setTitle('Verilen Sipariş Faturalaştır');
      this.operation = 'Toplananları Faturalaştır';

      this.pageDescription = 'Ürün Toplama Paneli';
    } else if (orderNumberType === 'WT') {
      this.title.setTitle('Transfer Detay');
      this.operation = 'Transferi Onayla';

      this.pageDescription = 'Transfer Onaylama Detay';
    }
  }
  async getCollectedProducts(
    orderNo: string,
    orderNoType: string
  ): Promise<any> {
    const productData = await this.orderService
      .getCollectedProducts(orderNo, orderNoType)
      .toPromise();
    this.productsToCollect = productData;

    const productData2 = await this.productService.getCollectedOrderProducts(
      this.orderNo
    );

    this.lastCollectedProducts = productData2;
  }
  focusNextInput(nextInputId: string) {
    const nextInput = document.getElementById(nextInputId) as HTMLInputElement;
    if (nextInput) {
      nextInput.focus();
    }
  } //general service
  orderBillingList: OrderBillingListModel[] = [];
  itemBillingModels: ItemBillingModel[] = [];

  deleteRow(index: number) {
    this.itemBillingModels.splice(index, 1); // İlgili satırı listeden sil
  }

  formGenerator() {
    this.checkForm = this.formBuilder.group({
      barcode: [null, Validators.required],
      shelfNo: [null, Validators.required],
      quantity: [null, Validators.required],
      batchCode: [null, Validators.required],
    });
  }
  async confirmTransfer(operationNumberList: string[]) {
    //transfer onaylama yapılır ve transfer listesinin ekranına atar!
    const response: boolean = await this.orderService
      .confirmTransfer(operationNumberList)
      .toPromise();
    if (response) {
      this.router.navigate(['/warehouse-operation-confirm']);
    }
  }

  collectAndPack(products: ProductOfOrder[]) {
    if (
      this.currentOrderNo.split('-')[1] === 'BP' ||
      this.currentOrderNo.split('-')[1] === 'WS'
    ) {
      this.orderService.collectAndPack(products, this.currentOrderNo);
    } else {
      var totalCountOfProducts = 0;
      this.productsToCollect.forEach((p) => {
        totalCountOfProducts += p.quantity;
      });

      if (totalCountOfProducts === 0) {
        var list: string[] = [this.currentOrderNo];
        this.confirmTransfer(list);
      } else {
        this.alertifyService.error(
          'Toplanacak Ürün Sayısı : ' + totalCountOfProducts
        );
      }
    }
  }
  async countProductRequest(
    barcode: string,
    shelfNo: string,
    qty: number,
    orderNo: string,
    url: string
  ): Promise<ProductCountModel> {
    var requestModel: CountProductRequestModel = new CountProductRequestModel();
    requestModel.barcode = barcode;
    requestModel.shelfNo = shelfNo;
    requestModel.qty = qty.toString() == null ? 1 : qty;
    requestModel.orderNumber = orderNo;
    var response = await this.httpClient
      .post<ProductCountModel | undefined>(url, requestModel)
      .toPromise();

    return response;
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

  async onSubmit(productModel: any): Promise<any> {
    //satış faturası alanı------------------------------------------------------------------------ WS
    if (this.currentOrderNo.split('-')[1] === 'WS') {
      if (productModel.shelfNo == null) {
        if (productModel.barcode != null) {
          var number = await this.setShelfNo(productModel.barcode);
          this.checkForm.get('quantity').setValue(Number(number));
        } else {
          this.alertifyService.warning('Formu Doldurunuz.');
          return;
        }
      } else if (productModel.shelfNo && productModel.barcode) {
        var response = await this.warehouseService.countProductRequest(
          productModel.barcode,
          productModel.shelfNo,
          productModel.quantity == null ? 1 : productModel.quantity,
          null,
          null,
          productModel.batchCode,
          'Order/CountProductControl',
          this.orderNo,
          productModel.currAccCode
        );
        //********** BARKOD KONTROL EDİLDİ **********

        if (response != undefined) {
          var data: ProductCountModel = response;

          if (data.status == 'RAF') {
            productModel.shelfNo = response.description;
          } else {
            productModel.barcode = response.description;
          }
        }
        var foundModel = this.productsToCollect.find(
          (o) => o.barcode == productModel.barcode
        );

        //********** EŞLEŞEN ÜRÜN BULUNDU **********
        if (foundModel) {
          const foundProduct = this.productsToCollect.find(
            (o) =>
              o.barcode == productModel.barcode &&
              o.shelfNo == productModel.shelfNo
          );
          productModel.quantity =
            productModel.quantity == null ? 1 : productModel.quantity;

          if (foundProduct.quantity - productModel.quantity >= 0) {
            var response = await this.warehouseService.countProductRequest(
              productModel.barcode,
              productModel.shelfNo,
              productModel.quantity == null ? 1 : productModel.quantity,
              null,
              null,
              productModel.batchCode,
              'Order/CountProduct3',
              this.orderNo,
              productModel.currAccCode
            );
            //********** SAYIM YAPILDI **********
            const productData = await this.orderService
              .getCollectedProducts(this.currentOrderNo, 'WS')
              .toPromise();
            this.productsToCollect = productData; //toplanacak ürünler yenidne çekildi
            //********** TOPLANACAK ÜRÜNLER ÇEKİLDİ **********
            this.lastCollectedProducts =
              await this.productService.getCollectedOrderProducts(
                this.currentOrderNo
              );
            //********** TOPLANAN ÜRÜNLER ÇEKİLDİ **********
            this.alertifyService.success('Ürün Toplama İşlemi Tamamlandı!');
            this.clearBarcodeAndQuantity();
            this.generalService.beep();
          } else {
            this.alertifyService.warning('Stok Hatası.');
          }
        } else {
          this.alertifyService.warning('Eşleşen Ürün Bulunamadı');
        }
      }
    }
    //transfer-------------------------------------------------------------------- WT
    else if (this.currentOrderNo.split('-')[1] === 'WT') {
      if (productModel.shelfNo == null) {
        if (productModel.barcode != null) {
          var number = await this.setShelfNo(productModel.barcode);
          this.checkForm.get('quantity').setValue(Number(number));
        } else {
          this.alertifyService.warning('Formu Doldurunuz.');
          return;
        }
      } else if (productModel.shelfNo && productModel.barcode) {
        var response = await this.warehouseService.countProductRequest(
          productModel.barcode,
          productModel.shelfNo,
          productModel.quantity == null ? 1 : productModel.quantity,
          null,
          null,
          productModel.batchCode,
          'Order/CountProductControl',
          this.orderNo,
          productModel.currAccCode
        );
        //********** BARKOD KONTROL EDİLDİ **********
        if (response != undefined) {
          var data: ProductCountModel = response;

          if (data.status === 'RAF') {
            productModel.shelfNo = response.description;
          } else {
            productModel.barcode = response.description;
          }
        }
        var foundModel = this.productsToCollect.find(
          (o) => o.barcode == productModel.barcode
        );

        //********** EŞLEŞEN ÜRÜN BULUNDU **********
        if (foundModel) {
          const foundProduct = foundModel;
          productModel.quantity =
            productModel.quantity == null ? 1 : productModel.quantity;

          if (foundProduct.quantity - productModel.quantity >= 0) {
            var model: WarehouseOperationProductModel =
              new WarehouseOperationProductModel();
            model.barcode = productModel.barcode;
            model.batchCode = productModel.batchCode;
            model.innerNumber = this.currentOrderNo;
            model.quantity = productModel.quantity;
            model.shelfNumber = productModel.shelfNumber;
            model.warehouse = foundModel.itemDim1Code;

            const response = await this.warehouseService.transfer(model);
            //********** TRANSFER YAPILDI **********

            if (response > 0) {
              var response2 = await this.warehouseService.countProductRequest(
                productModel.barcode,
                productModel.shelfNo,
                productModel.quantity == null ? 1 : productModel.quantity,
                null,
                null,
                productModel.batchCode,
                'Order/CountProduct3',
                this.orderNo,
                productModel.currAccCode
              );
              //********** SAYIM YAPILDI **********

              const productData = await this.orderService
                .getCollectedProducts(this.currentOrderNo, 'WT')
                .toPromise();
              this.productsToCollect = productData;
              //********** TOPLANACAK ÜRÜNLER ÇEKİLDİ **********

              this.lastCollectedProducts =
                await this.productService.getCollectedOrderProducts(
                  this.currentOrderNo
                );
              //********** TOPLANAN ÜRÜNLER ÇEKİLDİ **********

              this.alertifyService.success('Ürün Toplama İşlemi Tamamlandı!');
              this.clearBarcodeAndQuantity();
            }
          } else {
            this.alertifyService.warning('Stok Hatası.');
          }
        } else {
          this.alertifyService.warning('Eşleşen Ürün Bulunamadı');
        }
      }
    }
    //alış-------------------------------------------------------------------- BP
    else {
      if (productModel.shelfNo == null) {
        if (productModel.barcode != null) {
          var number = await this.setShelfNo(productModel.barcode);
          this.checkForm.get('quantity').setValue(Number(number));
        } else {
          this.alertifyService.warning('Formu Doldurunuz.');
          return;
        }
      } else if (productModel.shelfNo && productModel.barcode) {
        var response = await this.warehouseService.countProductRequest(
          productModel.barcode,
          productModel.shelfNo,
          productModel.quantity == null ? 1 : productModel.quantity,
          null,
          null,
          productModel.batchCode,
          'Order/CountProductControl',
          this.orderNo,
          productModel.currAccCode
        );

        //********** BARKOD KONTROL EDİLDİ **********

        if (response != undefined) {
          var data: ProductCountModel = response;

          if (data.status == 'RAF') {
            productModel.shelfNo = response.description;
          } else {
            productModel.barcode = response.description;
          }
        }

        var foundModel2: ProductOfOrder | undefined =
          this.productsToCollect.find(
            (o) => o?.barcode === productModel.barcode
          );
        //********** EŞLEŞEN ÜRÜN BULUNDU **********
        if (foundModel2 != null && foundModel2 != undefined) {
          //eğer model bulunduysa
          const foundProduct = this.productsToCollect.find(
            (o) => o.barcode == productModel.barcode
          );

          productModel.quantity =
            productModel.quantity == null ? 1 : productModel.quantity;

          if (foundProduct.quantity - productModel.quantity >= 0) {
            var response = await this.warehouseService.countProductRequest(
              productModel.barcode,
              productModel.shelfNo,
              productModel.quantity == null ? 1 : productModel.quantity,
              null,
              null,
              productModel.batchCode,
              'Order/CountProduct3',
              this.orderNo,
              productModel.currAccCode
            );
            //********** SAYIM YAPILDI **********
            const productData = await this.orderService
              .getCollectedProducts(this.currentOrderNo, 'BP')
              .toPromise();
            this.productsToCollect = productData;
            //********** TOPLANACAK ÜRÜNLER ÇEKİLDİ **********

            this.lastCollectedProducts =
              await this.productService.getCollectedOrderProducts(
                this.currentOrderNo
              );
            //********** TOPLANAN ÜRÜNLER ÇEKİLDİ **********

            this.alertifyService.success('Ürün Toplama İşlemi Tamamlandı!');
            this.clearBarcodeAndQuantity();
          }
        } else {
          this.alertifyService.warning('Eşleşen Ürün Bulunamadı');
        }
      } else {
        this.alertifyService.warning('Formu Doldurunuz');
      }
    }
  }
  confirmedProductPackageNoList: string[] = [];

  addProductToList(packageNo: string) {
    var isChecked = (
      document.getElementById('pi' + packageNo) as HTMLInputElement
    ).checked;

    if (isChecked) {
      this.confirmedProductPackageNoList.push(packageNo);
      this.alertifyService.success('true');
    } else {
      // Checkbox işaretini kaldırdığınızda, bu ürünün indexini listeden kaldırın.
      const indexToRemove = this.confirmedProductPackageNoList.findIndex(
        (p) => p.toString() == packageNo
      );
      if (indexToRemove !== -1) {
        this.confirmedProductPackageNoList.splice(indexToRemove, 1);
        this.alertifyService.error('false');
      }
    }
  }

  async addAllSelectedProductsToList(): Promise<any> {
    if (this.confirmedProductPackageNoList.length === 0) {
      this.alertifyService.warning('Seçilen Ürün Bulunamadı.');
      return;
    } else {
      for (const element of this.confirmedProductPackageNoList) {
        const index: number = this.productsToCollect.findIndex(
          (o) => o.packageNo == element
        );
        if (true) {
          await this.warehouseService.countProductRequest(
            this.productsToCollect[index].barcode,
            this.productsToCollect[index].shelfNo,
            this.productsToCollect[index].quantity <= 0
              ? 0
              : this.productsToCollect[index].quantity,
            null,
            null,
            '',
            'Order/CountProduct3',
            this.currentOrderNo,
            ''
          );
        }
      }

      await this.getCollectedProducts(
        this.currentOrderNo,
        this.currentOrderNo.split('-')[1]
      );

      this.alertifyService.success('Seçilen Ürünler Başarıyla Eklendi');

      this.confirmedProductPackageNoList = [];
      return;
    }
  }
  shelfNo: string;
  shelfNoList: string[] = [];
  barcodeValue: string = null; // Değişkeni tanımlayın

  async setShelfNo(barcode: string): Promise<string> {
    this.shelfNumbers = 'RAFLAR:';

    if (barcode.length > 20) {
      var result: string[] = await this.productService.countProductByBarcode(
        barcode
      );

      this.shelfNumbers += result[0];
      return result[1];
    } else {
      this.checkForm.get('barcode').setValue(null);
      this.focusNextInput('shelfNo');
      return null;
    }
  }
  clearShelfNumbers() {
    // this.checkForm.get('shelfNo').setValue(null);
    this.checkForm.get('shelfNo').setValue(null);

    this.checkForm.get('barcode').setValue(null);
    this.focusNextInput('barcode');
    this.shelfNumbers = 'RAFLAR:';
    this.checkForm.get('quantity').setValue(null);
  }

  clearBarcodeAndQuantity() {
    this.clearShelfNumbers();
    this.generalService.beep();
  }
  async scanCompleteHandler(result: string) {
    if (result != undefined) {
      try {
        this.alertifyService.success(result);
      } catch (error) {
        this.alertifyService.error(error.message);
      }
    }
  }
  async deleteOrderProduct(
    orderNo: string,
    itemCode: string
  ): Promise<boolean> {
    const response: boolean = await this.productService.deleteOrderProduct(
      orderNo,
      itemCode
    );
    if (response) {
      this.lastCollectedProducts =
        await this.productService.getCollectedOrderProducts(this.orderNo);
      if (orderNo.split('-')[1] === 'BP') {
        await this.getCollectedProducts(orderNo, 'BP');
      } else if (orderNo.split('-')[1] === 'WS') {
        await this.getCollectedProducts(orderNo, 'WS');
      } else if (orderNo.split('-')[1] === 'WT') {
        await this.getCollectedProducts(orderNo, 'WT');
      }
    }
    return response;
  }
}
