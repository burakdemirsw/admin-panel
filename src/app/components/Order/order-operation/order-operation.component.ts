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
import { CollectProduct } from 'src/app/models/model/product/collectProduct';
import { CollectedProduct } from 'src/app/models/model/product/collectedProduct';


declare var window: any;

@Component({
  selector: 'app-order-operation',
  templateUrl: './order-operation.component.html',
  styleUrls: ['./order-operation.component.css'],
})
export class OrderOperationComponent implements OnInit {

  lastCollectedProducts : CollectedProduct[] = []
  productsToCollect: ProductOfOrder[];
  collectedProducts: ProductOfOrder[] = [];
  process: boolean = false;
  checkForm: FormGroup;
  activeTab: number = 1;
  warehouseModels: WarehouseOperationDetailModel[] = [];
  pageDescription: string = '';
  shelfNumbers: string = 'RAFLAR:';  

  currentOrderNo: string;
  private codeReader: BrowserMultiFormatReader;

  constructor(
    private formBuilder: FormBuilder,
    private alertifyService: AlertifyService,
    private orderService: OrderService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private httpClient: HttpClient,
    private spinnerService: NgxSpinnerService,
    private productService: ProductService,
    private warehouseService: WarehouseService,
    private generalService : GeneralService
  ) {

    this.codeReader = new BrowserMultiFormatReader();

  }
  orderNo: string;

  orderBillingModel: OrderBillingListModel;
  url2: string = ClientUrls.baseUrl + '/Order/CountTransferProductPuschase';
  async ngOnInit() {
    this.spinnerService.show();

    

    await this.activatedRoute.params.subscribe(async (params) => {
      var orderNumber: string = params['orderNumber'];
      this.orderNo=orderNumber;
      
      var orderNumberType = orderNumber.split('-')[1];
      this.currentOrderNo = params['orderNumber'];
      this. lastCollectedProducts =await  this.productService.getCollectedOrderProducts(this.orderNo)
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

    this.formGenerator();
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
  async getCollectedProducts(
    orderNo: string,
    orderNoType: string
  ): Promise<any> {
    const productData = await this.orderService
      .getCollectedProducts(orderNo, orderNoType)
      .toPromise();
    // this.productsToCollect = productData.filter(
    //   (product) => product.quantity > 0
    // );
    this.productsToCollect =productData
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
      batchCode: ['', Validators.required],
    });
  }
  confirmOperation(operationNumberList: string[]) {
    if (this.orderService.confirmOperation(operationNumberList).toPromise) {
      this.router.navigate(['/warehouse-operation-confirm']);
    }
  }

  collectAndPack(list: ProductOfOrder[]) {
   
      this.orderService.collectAndPack(list, this.currentOrderNo);
    
      return null;
    
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
      if (
        productModel.shelfNo == '' ||
        productModel.shelfNo == undefined ||
        productModel.shelfNo == null
      ) {
        if (productModel.barcode != '') {
          var number = await this.setShelfNo(productModel.barcode);
          this.checkForm.get("quantity").setValue(Number(number));
        } else {
          this.alertifyService.warning('Formu Doldurunuz.');
          return;
        }
      } else if (
        productModel.shelfNo != '' ||
        productModel.shelfNo != undefined ||
        productModel.shelfNo != null
      ) {
      }
      var response = await this.warehouseService.countProductRequest(
        productModel.barcode,
        productModel.shelfNo,
        productModel.quantity,
        '',
        '',
        productModel.batchCode,
        'Order/CountProduct3',this.orderNo,
        productModel.currAccCode
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

            this.collectedProducts.push(productModel);
            this. lastCollectedProducts =await  this.productService.getCollectedOrderProducts(this.orderNo)
            this.alertifyService.success('Ürün Toplama İşlemi Tamamlandı!');
            
            this.clearBarcodeAndQuantity();

            if (this.checkForm.get('shelfNo').value != '') {
              this.focusNextInput('barcode');
            } else {
              this.focusNextInput('shelfNo');
            }
        } else if (foundProduct?.quantity === 1) {
          this.checkForm.get('shelfNo')?.setValue('');
          this.checkForm.get('quantity')?.setValue('');

          const index = this.productsToCollect.indexOf(foundProduct);
          this.collectedProducts.push(productModel);
          this. lastCollectedProducts =await  this.productService.getCollectedOrderProducts(this.orderNo)
          foundProduct.quantity -=   productModel.quantity.toString() == '' ? 1 : productModel.quantity;
         
          this.alertifyService.success('Ürün Toplama İşlemi Tamamlandı!');
          this.clearBarcodeAndQuantity();


          if (this.checkForm.get('shelfNo').value != '') {
            this.focusNextInput('barcode');
          } else {
            this.focusNextInput('shelfNo');
          }

        //  this.productsToCollect.splice(index, 1);

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
    //transfer-------------------------------------------------------------------- WT
    else if (this.currentOrderNo.split('-')[1] === 'WT') {
      if (
        productModel.shelfNo == '' ||
        productModel.shelfNo == undefined ||
        productModel.shelfNo == null
      ) {
        if (productModel.barcode != '') {
          var number = await this.setShelfNo(productModel.barcode);
          this.checkForm.get("quantity").setValue(Number(number));
        } else {
          this.alertifyService.warning('Formu Doldurunuz.');
          return;
        }
      }
      if (
        this.checkForm.get('shelfNo').value &&
        this.checkForm.get('barcode').value
      ) {
        var response = await this.warehouseService.countProductRequest(
          productModel.barcode,
          productModel.shelfNo,
          productModel.quantity,
          '',
          '',
          productModel.batchCode,
          'Order/CountProduct3',this.orderNo,
          productModel.currAccCode
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
            this. lastCollectedProducts =await  this.productService.getCollectedOrderProducts(this.orderNo)

            this.alertifyService.success('Ürün Toplama İşlemi Tamamlandı!');
            this.clearBarcodeAndQuantity();

            if (this.checkForm.get('shelfNo').value != '') {
              this.focusNextInput('barcode');
            } else {
              this.focusNextInput('shelfNo');
            }
          } else if (foundProduct?.quantity === 1) {
            this.checkForm.get('shelfNo')?.setValue('');
            this.checkForm.get('quantity')?.setValue('');
            this.checkForm.get('barcode')?.setValue('');
            if (this.checkForm.get('shelfNo').value != '') {
              this.focusNextInput('barcode');
            } else {
              this.focusNextInput('shelfNo');
            }

            const index = this.productsToCollect.indexOf(foundProduct);
            this.collectedProducts.push(foundModel);
            this. lastCollectedProducts =await  this.productService.getCollectedOrderProducts(this.orderNo)
            foundProduct.quantity -=
              productModel.quantity.toString() == ''
                ? 1
                : productModel.quantity;
            this.alertifyService.success('Ürün Toplama İşlemi Tamamlandı!');
            this.clearBarcodeAndQuantity();

            if (this.checkForm.get('shelfNo').value != '') {
              this.focusNextInput('barcode');
            } else {
              this.focusNextInput('shelfNo');
            }

           // this.productsToCollect.splice(index, 1);

            if (this.productsToCollect.length === 0) {
              var operationList: string[] = [];
              operationList.push(this.currentOrderNo);
              this. lastCollectedProducts =await  this.productService.getCollectedOrderProducts(this.orderNo)
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
    //alış-------------------------------------------------------------------- BP
    else {
      if (
        productModel.shelfNo == '' ||
        productModel.shelfNo == undefined ||
        productModel.shelfNo == null
      ) {
        if (productModel.barcode != '') {
          var number = await this.setShelfNo(productModel.barcode);
          this.checkForm.get("quantity").setValue(Number(number));
        } else {
          this.alertifyService.warning('Formu Doldurunuz.');
          return;
        }
      } else if (
        this.checkForm.get('shelfNo').value &&
        this.checkForm.get('barcode').value
      ) {
        var response = await this.warehouseService.countProductRequest(
          productModel.barcode,
          productModel.shelfNo,
          productModel.quantity,
          '',
          '',
          productModel.batchCode,
          'Order/CountProduct3',this.orderNo,
          productModel.currAccCode
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

        if (foundModel2) { //eğer model bulunduysa
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
            if (foundModel2 != undefined) {
              var foundModel3: ProductOfOrder | undefined =
                this.productsToCollect.find(
                  (o) => o?.barcode === productModel.barcode
                );

              if (foundModel3 !== undefined) {
                  foundModel3.shelfNo = productModel.shelfNo;
                  if(productModel.quantity == ''){
                    productModel.quantity = 1
                  }
                this.collectedProducts.push(productModel);
               var newList  :any  =await  this.productService.getCollectedOrderProducts(this.orderNo)
                this. lastCollectedProducts  = newList
              }
            }
            this.alertifyService.success('Ürün Toplama İşlemi Tamamlandı!');
            this.clearBarcodeAndQuantity();

            if (this.checkForm.get('shelfNo').value != '') {
              this.focusNextInput('barcode');
            } else {
              this.focusNextInput('shelfNo');
            }
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
                if(productModel.quantity == ''){
                  productModel.quantity = 1
                }
                this.collectedProducts.push(productModel);
                this. lastCollectedProducts =await  this.productService.getCollectedOrderProducts(this.orderNo)
              }
            }
            foundProduct.quantity -=
              productModel.quantity.toString() == ''
                ? 1
                : productModel.quantity;
            this.alertifyService.success('Ürün Toplama İşlemi Tamamlandı!');
            this.clearBarcodeAndQuantity();
            if (this.checkForm.get('shelfNo').value != '') {
              this.focusNextInput('barcode');
            } else {
              this.focusNextInput('shelfNo');
            }

           // this.productsToCollect.splice(index, 1);

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

  addAllSelectedProductsToList() {
    if (this.confirmedProductPackageNoList.length === 0) {
      this.alertifyService.warning('Seçilen Ürün Bulunamadı.');
      return;
    } else {
      // confirmedProductPackageNoList'deki her bir index için ilgili ürünü collectedProducts'a ekleyin.
      this.confirmedProductPackageNoList.forEach((element) => {
        var index: number = this.productsToCollect.findIndex(
          (o) => o.packageNo == element
        );
        this.collectedProducts.push(this.productsToCollect[index]);
        
        //this.productsToCollect.splice(index, 1);
      });
      this.alertifyService.success(
        'Seçilen Ürünler Başarıyla Eklendi! Eklenen Ürün Sayısı ' +
          this.collectedProducts.length
      );

      // confirmedProductPackageNoList'i temizleyin (sıfırlayın).
      this.confirmedProductPackageNoList = [];
    }
  }
  shelfNo: string;
  shelfNoList: string[] = [];
  barcodeValue: string = ''; // Değişkeni tanımlayın


  async setShelfNo(barcode: string) :Promise<string> {
    this.shelfNumbers = 'RAFLAR:';

    if (barcode.length > 20) {
      var result : string[]= await this.productService.countProductByBarcode(
        barcode
      );

      this.shelfNumbers += result[0];
      return result[1];

    }else{
      this.checkForm.get('barcode').setValue('');
      this.focusNextInput('shelfNo');
      return null;
    }
  }
  clearShelfNumbers() {
    this.checkForm.get('shelfNo').setValue('');
    this.focusNextInput('barcode');
    this.checkForm.get('quantity').setValue('');

  }
  clearBarcodeAndQuantity(){
    this.checkForm.get('barcode').setValue('');
    this.checkForm.get('quantity').setValue('');
  }
  async scanCompleteHandler(result :string) {
    if(result != undefined){
      try {
        this.alertifyService.success(result)
  
  
      } catch (error) {
        this.alertifyService.error(error.message);
      }
    }
    
  }
  async deleteOrderProduct(orderNo :string , itemCode : string):Promise<boolean>
  {
    const response :boolean = await this.productService.deleteOrderProduct(orderNo,itemCode)
    if(response){
      this. lastCollectedProducts =await  this.productService.getCollectedOrderProducts(this.orderNo)
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
