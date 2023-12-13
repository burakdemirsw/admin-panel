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
import { CreatePurchaseInvoice } from 'src/app/models/model/invoice/createPurchaseInvoice';
import { InventoryResponseModel } from 'src/app/models/model/order/inventoryResponseModel';
import { CountConfirmData } from 'src/app/models/model/product/countConfirmModel';

declare var window: any;

@Component({
  selector: 'app-order-operation',
  templateUrl: './order-operation.component.html',
  styleUrls: ['./order-operation.component.css'],
})
export class OrderOperationComponent implements OnInit {
  infoProducts: CreatePurchaseInvoice[] = [];
  lastCollectedProducts: CollectedProduct[] = [];
  productsToCollect: ProductOfOrder[] = [];
  productsToCollect2: ProductOfOrder[] = [];
  collectedProducts: ProductOfOrder[] = [];
  process: boolean = false;
  checkForm: FormGroup;
  activeTab: number = 1;
  warehouseModels: WarehouseOperationDetailModel[] = [];
  pageDescription: string = null;
  shelfNumbers: string = 'RAFLAR:';
  operation: string = '';
  currentPage: number = 1;
  currentPage2: number = 1;
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
    private title: Title,
    private sanitizer: DomSanitizer
  ) {
    this.codeReader = new BrowserMultiFormatReader();
  }

  async ngOnInit() {
    this.spinnerService.show();

    await this.activatedRoute.params.subscribe(async (params) => {
      this.formGenerator();

      var orderNumber: string = params['orderNumber'];
      this.orderNo = orderNumber;

      var orderNumberType = orderNumber.split('-')[1];
      this.currentOrderNo = params['orderNumber'];
    //  await this.getCollectedOrderProducts(this.orderNo) //toplanan ürünler çekildi
      if (orderNumberType === 'BP') {
        await this.getAllProducts(params['orderNumber'], 'BP'); //toplanan ve toplanacak ürünleri çeker
      } else if (orderNumberType === 'WS') {
        await this.getAllProducts(params['orderNumber'], 'WS');//toplanan ve toplanacak ürünleri çeker
      } else if (orderNumberType === 'WT') {
        await this.getAllProducts(params['orderNumber'], 'WT');//toplanan ve toplanacak ürünleri çeker
      }
      this.spinnerService.hide();
      this.setPageDescription(orderNumberType);
    });
  }


  async getCollectedOrderProducts(orderNo :string) :Promise<CollectedProduct[]>
  {
   var response=  await this.productService.getCollectedOrderProducts(orderNo);
   this.lastCollectedProducts =response;

   this.calculateTotalQty();
    return response
    
  }
  visible: boolean = false;
totalCount:number = 0
  calculateTotalQty() {
    //toplanan ürünler yazısı için
    let totalQty = 0;
    this.lastCollectedProducts.forEach((item) => {
      totalQty += item.quantity;
    });
    this.totalCount = totalQty;
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

  qrCodeValue: string = '';
  qrCodeDownloadLink: any = this.sanitizer.bypassSecurityTrustResourceUrl('');

  createJson(barcode: string, shelfNo: string, itemCode: string) {
    var model: CollectedProduct = this.lastCollectedProducts.find(
      (p) =>
        (p.barcode = barcode) && p.shelfNo == shelfNo && p.itemCode == itemCode
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

  orderNo: string;
  orderBillingModel: OrderBillingListModel;
  // url2: string = ClientUrls.baseUrl + '/Order/CountTransferProductPuschase';

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
  addedProductCount: string = '';
  lastCollectedProduct:ProductOfOrder = null;
  async getAllProducts(
    orderNo: string,
    orderNoType: string
  ): Promise<any> {
    const productData = await this.orderService
      .getCollectedProducts(orderNo, orderNoType)
      .toPromise();
      
    this.productsToCollect = productData; //toplanacak ürünler çekildi 
    if(this.productsToCollect){

      if(this.lastCollectedProduct ==null){ //üste atılcak ürün seçildi
        this.productsToCollect2=[];
        this.productsToCollect2.push(productData[0]);
        this.lastCollectedProduct = productData[0]
      }else{//eğer son sayılan ürün varsa 
        var  foundedProduct = this.productsToCollect.find(p=>p.barcode == this.lastCollectedProduct.barcode
          && p.itemCode == this.lastCollectedProduct.itemCode 
          && p.shelfNo == this.lastCollectedProduct.shelfNo)
  
          if(foundedProduct){ //eğer ürün bulunduysa
  
            if(foundedProduct.quantity>0){ //miktar değeri 0 dan büyükse 
              this.productsToCollect2=[];
              this.productsToCollect2.push(foundedProduct);
              this.lastCollectedProduct = foundedProduct
            }else{//miktar değeri 0 dan küçükse 
              this.productsToCollect2=[];
              this.productsToCollect2.push(productData[0]);
              this.lastCollectedProduct = productData[0]
            }
          }else{ //üürn bulunmdadıysa 
          
            this.productsToCollect2=[];
            this.productsToCollect2.push(productData[0]);
            this.lastCollectedProduct = productData[0]
          }
      }
    }
   
    
    if (orderNoType == 'WS') { //sayım yapılabilcek ürünler listesine atıldı
      this.productsToCollect.forEach((e) => {
        if (e.quantity > e.currentQty) {
          var model: CreatePurchaseInvoice = new CreatePurchaseInvoice();

          // Eşleşen değerleri atama
          model.barcode = e.barcode;
          model.quantity = e.quantity;
          model.shelfNo = e.shelfNo;
          model.photoUrl = e.photoUrl;

          // Atanan modeli listeye ekleme
          this.infoProducts.push(model);
        }
      });

      this.addedProductCount = 'Sayım Paneli(' + this.infoProducts.length + ')';
    }

    const productData2 = await this.getCollectedOrderProducts(this.orderNo) //toplanan ürünler çekildi

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
  async confirmTransfer(operationNumberList: string[]): Promise<any> {
    //transfer onaylama yapılır ve transfer listesinin ekranına atar!
    const response: boolean = await this.orderService.confirmTransfer(
      operationNumberList
    );

    if (response) {
      this.alertifyService.success('Transfer işlemi Başarılı');
      this.router.navigate(['/warehouse-operation-list']);
    }
  }

  async collectAndPack(products: ProductOfOrder[]) {
    var orderType : string =  this.currentOrderNo.split('-')[1]
    if (
      
      orderType === 'BP' ||
      orderType === 'WS'
    ) {

      var confirmation = window.confirm(
        'İşlem Nebime Aktarılacaktır.Devam Etmek istiyor musunuz?'
    );

    if(confirmation){
      this.spinnerService.show();
        if(orderType === 'WS'){
          const response : CountConfirmData[] = await this.orderService.getInventoryFromOrderNumber(this.currentOrderNo);
          if(response.length>0){
            this.alertifyService.success("Otomatik Sayım Yapılabilir")
            const response2 = await  this.orderService.setInventoryByOrderNumber(this.currentOrderNo);
            if(response2)
            {
              this.alertifyService.success("Otomatik Sayım yapıldı")
            
              this.orderService.collectAndPack(products, this.currentOrderNo);
          
            }
          }
        }else{

          this.orderService.collectAndPack(products, this.currentOrderNo);
        }
        this.spinnerService.hide();
    }
     
    } else {
      var totalCountOfProducts = 0;
      this.productsToCollect.forEach((p) => {
        totalCountOfProducts += p.quantity;
      });

      if (totalCountOfProducts === 0) {
        var list: string[] = [this.currentOrderNo];
        await this.confirmTransfer(list);
      } else {
        var confirmation = window.confirm(
          'Tüm Ürünler Toplanmadı. Devam etmek istiyor musunuz?'
        );

        if (confirmation) {
          // Kullanıcı "evet" derse
          var list: string[] = [this.currentOrderNo];
          await this.confirmTransfer(list);
        } else {
          // Kullanıcı "hayır" derse
          // Opsiyonel: Başka bir işlem veya uyarı mesajı ekleyebilirsiniz.
        }
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
  currentProductModel: any;
  setFirstItem() {
    if (this.currentProductModel != null) {
      const barcodeToFind = this.currentProductModel.barcode;
      const shelfNoToFind = this.currentProductModel.shelfNo;

      // Find the index of the item in lastCollectedProducts
      const index = this.productsToCollect.findIndex(
        (item) =>
          item.barcode === barcodeToFind && item.shelfNo === shelfNoToFind
      );

      // If the item is found, move it to the beginning of the array
      if (index !== -1) {
        const foundItem = this.productsToCollect.splice(index, 1)[0];
        this.productsToCollect.unshift(foundItem);
      }
    }
  }
  async onSubmit(productModel: any): Promise<any> {
    //satış faturası alanı------------------------------------------------------------------------ WS
    var CONSTQTY = await this.getQuantity(productModel.barcode);
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
          productModel.quantity == null
            ? Number(CONSTQTY)
            : productModel.quantity,
          null,
          null,
          productModel.batchCode,
          'Order/CountProductControl',
          this.orderNo,
          productModel.currAccCode
        );
        //↑↑↑↑↑↑↑↑↑ BARKOD KONTROL EDİLDİ ↑↑↑↑↑↑↑↑↑

        if (response != undefined) {
          var data: ProductCountModel = response;

          if (data.status == 'RAF') {
            productModel.shelfNo = response.description;
          } else {
            productModel.barcode = response.description;
          }
        }
        if (productModel.barcode && productModel.barcode.charAt(0) === '0') {
          productModel.barcode = productModel.barcode.substring(1);
        }
        var foundModel = this.productsToCollect.find(
          (o) => o.barcode == productModel.barcode
        );

        //↑↑↑↑↑↑↑↑↑ EŞLEŞEN ÜRÜN BULUNDU ↑↑↑↑↑↑↑↑↑

        if (foundModel) {
          var newResponse = await this.productService.countProductByBarcode(
            productModel.barcode
          );

          const shelves = newResponse[0]
            .split(',')
            .filter((raflar) => raflar.trim() !== '')
            .map((raflar) => raflar.toLowerCase());

          const foundProduct = this.productsToCollect.find(
            (o) => o.barcode == productModel.barcode
            // &&
            // o.shelfNo == productModel.shelfNo  //kaldırıldı
          );

          if (
            shelves.find(
              (s) => s.toLowerCase() == productModel.shelfNo.toLowerCase()
            ) &&
            (foundProduct != null || foundProduct != undefined)
          ) {
            productModel.quantity =
              productModel.quantity == null
                ? Number(CONSTQTY)
                : productModel.quantity;

            if (foundProduct.quantity - productModel.quantity >= 0) {
              var response = await this.warehouseService.countProductRequest(
                this.checkForm.get('barcode').value,
                productModel.shelfNo,
                productModel.quantity == null
                  ? Number(CONSTQTY)
                  : productModel.quantity,
                null,
                null,
                productModel.batchCode,
                'Order/CountProduct3',
                this.orderNo,
                productModel.currAccCode
              );
              //↑↑↑↑↑↑↑↑↑ SAYIM YAPILDI ↑↑↑↑↑↑↑↑↑
              // const productData = await this.orderService
              //   .getCollectedProducts(this.currentOrderNo, 'WS')
              //   .toPromise();
              // this.productsToCollect = productData;
              // this.currentProductModel = {
              //   barcode: productModel.barcode,
              //   shelfNo: productModel.shelfNo,
              // };
              // this.productsToCollect2 = [];
              // this.productsToCollect2.push(this.productsToCollect[0]);
              // this.setFirstItem();
              // //↑↑↑↑↑↑↑↑↑ TOPLANACAK ÜRÜNLER ÇEKİLDİ ↑↑↑↑↑↑↑↑↑

              // this.lastCollectedProducts =
              // await this.getCollectedOrderProducts(this.orderNo)
               await this.getAllProducts(this.orderNo,"WS")

              //↑↑↑↑↑↑↑↑↑ TOPLANAN ÜRÜNLER ÇEKİLDİ ↑↑↑↑↑↑↑↑↑
              this.alertifyService.success('Ürün Toplama İşlemi Tamamlandı!');
              this.clearBarcodeAndQuantity();
              this.generalService.beep();
            } else {
              this.alertifyService.warning('Stok Hatası.');
            }
          } else {
            this.alertifyService.error('Raf Numarası Eşleşmedi');
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
          productModel.quantity == null
            ? Number(CONSTQTY)
            : productModel.quantity,
          null,
          null,
          productModel.batchCode,
          'Order/CountProductControl',
          this.orderNo,
          productModel.currAccCode
        );
        //↑↑↑↑↑↑↑↑↑ BARKOD KONTROL EDİLDİ ↑↑↑↑↑↑↑↑↑ ++
        if (response != undefined) {
          var data: ProductCountModel = response;

          if (data.status === 'RAF') {
            productModel.shelfNo = response.description;
          } else {
            productModel.barcode = response.description;
          }
        }
        if (productModel.barcode && productModel.barcode.charAt(0) === '0') {
          productModel.barcode = productModel.barcode.substring(1);
        }
        var foundModel = this.productsToCollect.find(
          (o) => o.barcode == productModel.barcode
        );

        //↑↑↑↑↑↑↑↑↑ EŞLEŞEN ÜRÜN BULUNDU ↑↑↑↑↑↑↑↑↑
        if (foundModel) {
          const foundProduct = foundModel;
          productModel.quantity =
            productModel.quantity == null
              ? Number(CONSTQTY)
              : productModel.quantity;

          if (foundProduct.quantity - productModel.quantity >= 0) {
            var model: WarehouseOperationProductModel =
              new WarehouseOperationProductModel();
            model.barcode = productModel.barcode;
            model.batchCode = productModel.batchCode;
            model.innerNumber = this.currentOrderNo;
            model.quantity = productModel.quantity;
            model.shelfNumber = productModel.shelfNo;
            model.warehouse = foundModel.itemDim1Code;

            const response = await this.warehouseService.transfer(model);
            //↑↑↑↑↑↑↑↑↑ TRANSFER YAPILDI ↑↑↑↑↑↑↑↑↑

            if (response > 0) {
              var response2 = await this.warehouseService.countProductRequest(
                productModel.barcode,
                productModel.shelfNo,
                productModel.quantity == null
                  ? Number(CONSTQTY)
                  : productModel.quantity,
                null,
                null,
                productModel.batchCode,
                'Order/CountProduct3',  
                this.orderNo, 
                productModel.currAccCode
              );
              //↑↑↑↑↑↑↑↑↑ SAYIM YAPILDI ↑↑↑↑↑↑↑↑↑

              // const productData = await this.orderService
              //   .getCollectedProducts(this.currentOrderNo, 'WT')
              //   .toPromise();
              // this.productsToCollect = productData;
              // this.productsToCollect2 = [];
              // this.productsToCollect2.push(this.productsToCollect[0]);
              // //↑↑↑↑↑↑↑↑↑ TOPLANACAK ÜRÜNLER ÇEKİLDİ ↑↑↑↑↑↑↑↑↑
              // this.lastCollectedProducts =
              // await this.getCollectedOrderProducts(this.orderNo)

              // //console.log(this.lastCollectedProducts)
              await this.getAllProducts(this.orderNo,'WT')
              //↑↑↑↑↑↑↑↑↑ TOPLANAN ÜRÜNLER ÇEKİLDİ ↑↑↑↑↑↑↑↑↑

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
          productModel.quantity == null
            ? Number(CONSTQTY)
            : productModel.quantity,
          null,
          null,
          productModel.batchCode,
          'Order/CountProductControl',
          this.orderNo,
          productModel.currAccCode
        );

        //↑↑↑↑↑↑↑↑↑ BARKOD KONTROL EDİLDİ ↑↑↑↑↑↑↑↑↑

        if (response != undefined) {
          var data: ProductCountModel = response;

          if (data.status == 'RAF') {
            productModel.shelfNo = response.description;
          } else {
            productModel.barcode = response.description;
          }
        }
        if (productModel.barcode && productModel.barcode.charAt(0) === '0') {
          productModel.barcode = productModel.barcode.substring(1);
        }
        var foundModel2: ProductOfOrder | undefined =
          this.productsToCollect.find(
            (o) => o?.barcode === productModel.barcode
          );
        //↑↑↑↑↑↑↑↑↑ EŞLEŞEN ÜRÜN BULUNDU ↑↑↑↑↑↑↑↑↑
        if (foundModel2 != null && foundModel2 != undefined) {
          //eğer model bulunduysa
          const foundProduct = this.productsToCollect.find(
            (o) => o.barcode == productModel.barcode
          );

          productModel.quantity =
            productModel.quantity == null
              ? Number(CONSTQTY)
              : productModel.quantity;

          if (foundProduct.quantity - productModel.quantity >= 0) {
            var response = await this.warehouseService.countProductRequest(
              productModel.barcode,
              productModel.shelfNo,
              productModel.quantity == null
                ? Number(CONSTQTY)
                : productModel.quantity,
              null,
              null,
              productModel.batchCode,
              'Order/CountProduct3',
              this.orderNo,
              productModel.currAccCode
            );
            //↑↑↑↑↑↑↑↑↑ SAYIM YAPILDI ↑↑↑↑↑↑↑↑↑
            // const productData = await this.orderService
            //   .getCollectedProducts(this.currentOrderNo, 'BP')
            //   .toPromise();
            // this.productsToCollect = productData;
            // this.productsToCollect2 = [];
            // this.productsToCollect2.push(this.productsToCollect[0]);
            // //↑↑↑↑↑↑↑↑↑ TOPLANACAK ÜRÜNLER ÇEKİLDİ ↑↑↑↑↑↑↑↑↑

            // this.lastCollectedProducts =
            // await this.getCollectedOrderProducts(this.orderNo)
            await this.getAllProducts(this.orderNo,"BP")

            //↑↑↑↑↑↑↑↑↑ TOPLANAN ÜRÜNLER ÇEKİLDİ ↑↑↑↑↑↑↑↑↑

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
      // this.alertifyService.success('true');
    } else {
      // Checkbox işaretini kaldırdığınızda, bu ürünün indexini listeden kaldırın.
      const indexToRemove = this.confirmedProductPackageNoList.findIndex(
        (p) => p.toString() == packageNo
      );
      if (indexToRemove !== -1) {
        this.confirmedProductPackageNoList.splice(indexToRemove, 1);
        // this.alertifyService.error('false');
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

      await this.getAllProducts(
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

    var result: string[] = await this.productService.countProductByBarcode(
      barcode
    );

    this.shelfNumbers += result[0];
    return result[1];
  }

  async getQuantity(barcode: string): Promise<string> {
    this.shelfNumbers = 'RAFLAR:';

    var result: string[] = await this.productService.countProductByBarcode(
      barcode
    );

    // this.shelfNumbers += result[0];
    return result[1];
  }

  clearShelfNumbers() {
    // this.checkForm.get('shelfNo').setValue(null);
    this.checkForm.get('shelfNo').setValue(null);

    this.checkForm.get('barcode').setValue(null);
    this.checkForm.get('batchCode').setValue(null);
    this.shelfNumbers = 'RAFLAR:';
    this.checkForm.get('quantity').setValue(null);
    if (this.currentOrderNo.split('-')[1] === 'WS') {
      this.focusNextInput('shelfNo');
    } else {
      this.focusNextInput('barcode');
    }
  }

  clearBarcodeAndQuantity() {
    this.checkForm.get('barcode').setValue(null);
    this.focusNextInput('barcode');
    this.shelfNumbers = 'RAFLAR:';
    this.checkForm.get('quantity').setValue(null);
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
        await this.getAllProducts(orderNo, 'BP');
      } else if (orderNo.split('-')[1] === 'WS') {
        await this.getAllProducts(orderNo, 'WS');
      } else if (orderNo.split('-')[1] === 'WT') {
        await this.getAllProducts(orderNo, 'WT');
      }
    }
    return response;
  }

  goDown(packageNo: string) {
    // packageNo'ya eşleşen ProductOfOrder'ı bulun
    const matchingProduct = this.productsToCollect.find(
      (product) => product.packageNo === packageNo
    );

    

    // Eğer eşleşen bir ürün bulunduysa
    if (matchingProduct) {
      // Ürünü diziden çıkarın
      const index = this.productsToCollect.indexOf(matchingProduct);
      if (index !== -1) {
        this.productsToCollect.splice(index, 1);

        // Ürünü dizinin sonuna ekleyin
        this.productsToCollect.push(matchingProduct);
      }
    }
  }

  goDown2(barcode: string,shelfNo :string,itemCode: string) {
    // packageNo'ya eşleşen ProductOfOrder'ı bulun
    const matchingProduct = this.productsToCollect.find(
      (product) => product.barcode === barcode && product.shelfNo == shelfNo && product.itemCode ==itemCode
    );
    

    // Eğer eşleşen bir ürün bulunduysa
    if (matchingProduct) {
      // Ürünü diziden çıkarın
      const index = this.productsToCollect.indexOf(matchingProduct);
      if (index !== -1) {
       
        if(this.productsToCollect.length-1>=index+1)
        {
          this.productsToCollect2 = [];
          this.productsToCollect2.push(this.productsToCollect[index+1])
          this.lastCollectedProduct = this.productsToCollect[index+1]

        }else{
          this.productsToCollect2 = [];
          this.productsToCollect2.push(this.productsToCollect[0])
        }
        // this.productsToCollect.splice(index, 1);

        // // Ürünü dizinin sonuna ekleyin
        // this.productsToCollect.push(matchingProduct);
      }
    }
  }
}
