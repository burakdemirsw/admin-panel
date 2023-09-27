import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { BarcodeModel } from 'src/app/models/model/product/barcodeModel';
import { ProductCreateModel } from 'src/app/models/model/product/productCreateModel';
import { ProductService } from 'src/app/services/admin/product.service';
import { HttpClientService } from 'src/app/services/http-client.service';
import { AlertifyService } from 'src/app/services/ui/alertify.service';
import { BarcodeAddModel } from '../../../models/model/product/barcodeAddModel';
import { OrderSaleDetail } from 'src/app/models/model/order/orderSaleDetail';
import { ActivatedRoute, Router } from '@angular/router';
import { OrderService } from '../../../services/admin/order.service';
import { OrderBillingListModel } from 'src/app/models/model/order/orderBillingListModel';
import { ProductOfOrder } from 'src/app/models/model/order/productOfOrders';
import { ItemBillingModel } from 'src/app/models/model/product/itemBillingModel ';
import { ClientUrls } from 'src/app/models/const/ClientUrls';
import { CountProductRequestModel } from 'src/app/models/model/order/countProductRequestModel';
import { ProductCountModel } from 'src/app/models/model/shelfNameModel';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { OrderBillingRequestModel } from 'src/app/models/model/invoice/orderBillingRequestModel';
import { WarehouseOperationDetailModel } from 'src/app/models/model/warehouse/warehouseOperationDetailModel';
import { CreatePurchaseInvoice } from 'src/app/models/model/invoice/createPurchaseInvoice';
import { SalesPersonModel } from 'src/app/models/model/order/salesPersonModel';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-order-operation',
  templateUrl: './order-operation.component.html',
  styleUrls: ['./order-operation.component.css'],
})
export class OrderOperationComponent implements OnInit {
  productsToCollect: ProductOfOrder[];
  collectedProducts: ProductOfOrder[] = [];
  process: boolean = false;
  checkForm: FormGroup;
  activeTab: number = 1;
  warehouseModels: WarehouseOperationDetailModel[] = [];
  pageDescription: string = '';
  shelfNumbers: string = 'RAFLAR:';

  currentOrderNo: string;
  constructor(
    private httpClientService: HttpClientService,
    private formBuilder: FormBuilder,
    private alertifyService: AlertifyService,
    private orderService: OrderService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private httpClient: HttpClient,
    private spinnerService: NgxSpinnerService,
    private productService: ProductService
  ) {}
  orderNo: string = '';
  currentQrCode: string = '';
  orderBillingModel: OrderBillingListModel;
  url2: string = ClientUrls.baseUrl + '/Order/CountTransferProductPuschase';
  ngOnInit() {
    this.activatedRoute.params.subscribe((params) => {
      var orderNumber: string = params['orderNumber'];
      var orderNumberType = orderNumber.split('-')[1];
      this.currentOrderNo = params['orderNumber'];
      if (orderNumberType === 'BP') {
        this.getCollectedProducts(params['orderNumber'], 'BP');
      } else if (orderNumberType === 'WS') {
        this.getCollectedProducts(params['orderNumber'], 'WS');
      } else if (orderNumberType === 'WT') {
        this.getCollectedProducts(params['orderNumber'], 'WT');
      }
      this.setPageDescription(orderNumberType);
    });
    this.formGenerator();
    // this.getOrdersProduct("1-WS-2-11626")
  }

  setPageDescription(orderNumberType: string) {
    if (orderNumberType === 'BP') {
      this.pageDescription = 'Ürün Toplama Paneli';
    } else if (orderNumberType === 'WS') {
      this.pageDescription = 'Ürün Toplama Paneli';
    } else if (orderNumberType === 'WT') {
      this.pageDescription = 'Transfer Onaylama Detay';
    }
  }
  async getCollectedProducts(orderNo: string, orderNoType: string) {
    const productData = await this.orderService
      .getCollectedProducts(orderNo, orderNoType)
      .toPromise();
    this.productsToCollect = productData.filter(
      (product) => product.quantity > 0
    );
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
      barcode: ['', Validators.required],
      shelfNo: ['', Validators.required],
      quantity: ['', Validators.required],
    });
  }
  confirmOperation(operationNumberList: string[]) {
    if (this.orderService.confirmOperation(operationNumberList).toPromise) {
      this.router.navigate(['/warehouse-operation-confirm']);
    }
  }

  collectAndPack(list: ProductOfOrder[]) {
    this.orderService.collectAndPack(list, this.currentOrderNo);
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
    requestModel.qty = qty.toString() == '' ? 1 : qty;
    requestModel.orderNumber = orderNo;
    var response = await this.httpClient
      .post<ProductCountModel | undefined>(url, requestModel)
      .toPromise();

    return response;
  }
  async onSubmit(productModel: ProductOfOrder): Promise<any> {
    //satış faturası alanı------------------------------------------------------------------------
    if (this.currentOrderNo.split('-')[1] === 'WS') {
      if (
        productModel.shelfNo == '' ||
        productModel.shelfNo == undefined ||
        productModel.shelfNo == null
      ) {
        this.setShelfNo(productModel.barcode);
      } else if (
        productModel.shelfNo != '' ||
        productModel.shelfNo != undefined ||
        productModel.shelfNo != null
      ) {
      }
      var response = await this.countProductRequest(
        productModel.barcode,
        productModel.shelfNo,
        productModel.quantity,
        this.currentOrderNo,
        ClientUrls.baseUrl + '/Order/CountProduct'
      );

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
      if (foundModel) {
        const foundProduct = this.productsToCollect.find(
          (o) =>
            o.barcode == productModel.barcode &&
            o.shelfNo == productModel.shelfNo
        );
        if (
          foundProduct &&
          foundProduct.quantity &&
          foundProduct.quantity > 1
        ) {
          this.checkForm.get('shelfNo')?.setValue(productModel.shelfNo);
          this.checkForm.get('quantity')?.setValue('');
          foundProduct.quantity -=
            productModel.quantity.toString() == '' ? 1 : productModel.quantity;
          this.collectedProducts.push(foundModel);
          this.alertifyService.success('Ürün Toplama İşlemi Tamamlandı!');
          this.checkForm.get('barcode')?.setValue('');
          this.focusNextInput('shelfNo');
        } else if (foundProduct?.quantity === 1) {
          this.checkForm.get('shelfNo')?.setValue('');
          this.checkForm.get('quantity')?.setValue('');

          const index = this.productsToCollect.indexOf(foundProduct);
          this.collectedProducts.push(foundModel);
          foundProduct.quantity -=
            productModel.quantity.toString() == '' ? 1 : productModel.quantity;
          this.alertifyService.success('Ürün Toplama İşlemi Tamamlandı!');
          this.checkForm.get('barcode')?.setValue('');
          this.focusNextInput('shelfNo');

          this.productsToCollect.splice(index, 1);

          if (this.productsToCollect.length === 0) {
            alert('Tüm Ürünler Toplandı!');

            this.collectAndPack(this.collectedProducts);
          }
        } else if (foundProduct?.quantity < 0 || foundProduct?.quantity === 0) {
          this.alertifyService.warning('Eşleşen Ürünün Stoğu Yok.');
        }
      } else {
        this.alertifyService.warning('Eşleşen Ürün Bulunamadı');
      }
    }
    //transfer--------------------------------------------------------------------
    else if (this.currentOrderNo.split('-')[1] === 'WT') {
      if (
        productModel.shelfNo == '' ||
        productModel.shelfNo == undefined ||
        productModel.shelfNo == null
      ) {
        this.setShelfNo(productModel.barcode);
      }
      if (
        this.checkForm.get('shelfNo').value &&
        this.checkForm.get('barcode').value
      ) {
        var response = await this.countProductRequest(
          productModel.barcode,
          productModel.shelfNo,
          productModel.quantity,
          this.currentOrderNo,
          ClientUrls.baseUrl + '/Order/CountProduct'
        );

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
        if (foundModel) {
          const foundProduct = foundModel;

          if (
            foundProduct &&
            foundProduct.quantity &&
            foundProduct.quantity > 1
          ) {
            this.checkForm.get('shelfNo')?.setValue(productModel.shelfNo);
            this.checkForm.get('quantity')?.setValue('');
            foundProduct.quantity -=
              productModel.quantity.toString() == ''
                ? 1
                : productModel.quantity;
            this.collectedProducts.push(foundModel);
            this.alertifyService.success('Ürün Toplama İşlemi Tamamlandı!');
          } else if (foundProduct?.quantity === 1) {
            this.checkForm.get('shelfNo')?.setValue('');
            this.checkForm.get('quantity')?.setValue('');
            this.checkForm.get('barcode')?.setValue('');
            this.focusNextInput('shelfNo');

            const index = this.productsToCollect.indexOf(foundProduct);
            this.collectedProducts.push(foundModel);
            foundProduct.quantity -=
              productModel.quantity.toString() == ''
                ? 1
                : productModel.quantity;
            this.alertifyService.success('Ürün Toplama İşlemi Tamamlandı!');
            this.checkForm.get('barcode')?.setValue('');
            this.focusNextInput('shelfNo');

            this.productsToCollect.splice(index, 1);

            if (this.productsToCollect.length === 0) {
              var operationList: string[] = [];
              operationList.push(this.currentOrderNo);
              this.confirmOperation(operationList);
              alert('Tüm Ürünler Toplandı!');
            }
          } else if (
            foundProduct?.quantity < 0 ||
            foundProduct?.quantity === 0
          ) {
            this.alertifyService.warning('Eşleşen Ürünün Stoğu Yok.');
          }
        } else {
          this.alertifyService.warning('Eşleşen Ürün Bulunamadı');
        }
      }
    }
    //alış--------------------------------------------------------------------
    else {
      if (
        productModel.shelfNo == '' ||
        productModel.shelfNo == undefined ||
        productModel.shelfNo == null
      ) {
        this.setShelfNo(productModel.barcode);
      } else if (
        this.checkForm.get('shelfNo').value &&
        this.checkForm.get('barcode').value
      ) {
        var response = await this.countProductRequest(
          productModel.barcode,
          productModel.shelfNo,
          productModel.quantity,
          this.currentOrderNo,
          ClientUrls.baseUrl + '/Order/CountProduct'
        );

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

        if (foundModel2) {
          const foundProduct = this.productsToCollect.find(
            (o) => o.barcode == productModel.barcode
          );
          if (
            foundProduct &&
            foundProduct.quantity &&
            foundProduct.quantity > 1
          ) {
            this.checkForm.get('shelfNo')?.setValue(productModel.shelfNo);
            this.checkForm.get('quantity')?.setValue('');
            foundProduct.quantity -=
              productModel.quantity.toString() == ''
                ? 1
                : productModel.quantity;
            if (foundModel2 !== undefined) {
              var foundModel3: ProductOfOrder | undefined =
                this.productsToCollect.find(
                  (o) => o?.barcode === productModel.barcode
                );

              if (foundModel3 !== undefined) {
                foundModel3.shelfNo = productModel.shelfNo;
                this.collectedProducts.push(foundModel3);
              }
            }
            this.alertifyService.success('Ürün Toplama İşlemi Tamamlandı!');
            this.checkForm.get('barcode')?.setValue('');
            this.focusNextInput('shelfNo');
          } else if (foundProduct?.quantity === 1) {
            this.checkForm.get('shelfNo')?.setValue('');
            this.checkForm.get('quantity')?.setValue('');

            const index = this.productsToCollect.indexOf(foundProduct);
            if (foundModel2 !== undefined) {
              var foundModel3: ProductOfOrder | undefined =
                this.productsToCollect.find(
                  (o) => o?.barcode === productModel.barcode
                );

              if (foundModel3 !== undefined) {
                foundModel3.shelfNo = productModel.shelfNo;
                this.collectedProducts.push(foundModel3);
              }
            }
            foundProduct.quantity -=
              productModel.quantity.toString() == ''
                ? 1
                : productModel.quantity;
            this.alertifyService.success('Ürün Toplama İşlemi Tamamlandı!');
            this.checkForm.get('barcode')?.setValue('');
            this.focusNextInput('shelfNo');

            this.productsToCollect.splice(index, 1);

            if (this.productsToCollect.length === 0) {
              alert('Tüm Ürünler Toplandı!');

              this.collectAndPack(this.collectedProducts);
            }
          } else if (
            foundProduct?.quantity < 0 ||
            foundProduct?.quantity === 0
          ) {
            this.alertifyService.warning('Eşleşen Ürünün Stoğu Yok.');
          }
        } else {
          this.alertifyService.warning('Eşleşen Ürün Bulunamadı');
        }
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

  addAllSelectedProductsToList() {
    if (this.confirmedProductPackageNoList.length === 0) {
      this.alertifyService.warning('Eklenen Ürün Bulunamadı.');
      return;
    } else {
      // confirmedProductPackageNoList'deki her bir index için ilgili ürünü collectedProducts'a ekleyin.
      this.confirmedProductPackageNoList.forEach((element) => {
        var index: number = this.productsToCollect.findIndex(
          (o) => o.packageNo == element
        );
        this.collectedProducts.push(this.productsToCollect[index]);
        this.productsToCollect.splice(index, 1);
      });
      this.alertifyService.success(
        'Seçilen Ürünler Başarıyla Eklendi.Eklenen Ürün Sayısı ' +
          this.collectedProducts.length
      );

      // confirmedProductPackageNoList'i temizleyin (sıfırlayın).
      this.confirmedProductPackageNoList = [];
    }
  }
  shelfNo: string;
  shelfNoList: string[] = [];
  async setShelfNo(barcode: string) {
    this.shelfNumbers = 'RAFLAR:';

    if (barcode.length > 20) {
      this.shelfNumbers += await this.productService.countProductByBarcode(
        barcode
      );
    }
    this.checkForm.get('barcode').setValue('');
    this.focusNextInput('shelfNo');
  }
  clearShelfNumbers() {
    this.checkForm.get('shelfNo').setValue('');
  }
}
