import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CountProductRequestModel } from 'src/app/models/model/order/countProductRequestModel';
import { OrderBillingListModel } from 'src/app/models/model/order/orderBillingListModel';
import { ProductOfOrder } from 'src/app/models/model/order/productOfOrders';
import { ItemBillingModel } from 'src/app/models/model/product/itemBillingModel ';
import {
  ProductCountModel
} from 'src/app/models/model/shelfNameModel';
import { ProductService } from 'src/app/services/admin/product.service';
import { OrderService } from '../../../services/admin/order.service';

import { DomSanitizer, SafeUrl, Title } from '@angular/platform-browser';
import { BrowserMultiFormatReader } from '@zxing/library';
import { QrOperationResponseModel } from 'src/app/models/model/client/qrOperationResponseModel';
import { CreatePurchaseInvoice } from 'src/app/models/model/invoice/createPurchaseInvoice';
import { InvoiceOfCustomer_VM } from 'src/app/models/model/invoice/invoiceOfCustomer_VM';
import { OrderStatus } from 'src/app/models/model/order/orderStatus';
import { CollectedProduct } from 'src/app/models/model/product/collectedProduct';
import { CountConfirmData } from 'src/app/models/model/product/countConfirmModel';
import { CountProduct } from 'src/app/models/model/product/countProduct';
import {
  QrOperationModel
} from 'src/app/models/model/product/qrOperationModel';
import { WarehouseOperationListModel } from 'src/app/models/model/warehouse/warehosueOperationListModel';
import { WarehouseOperationDetailModel } from 'src/app/models/model/warehouse/warehouseOperationDetailModel';
import { WarehouseOperationProductModel } from 'src/app/models/model/warehouse/warehouseOperationProductModel';
import { ZTMSG_CountedSetProduct } from 'src/app/models/model/warehouse/ztmsg_CountedProduct';
import { GeneralService } from 'src/app/services/admin/general.service';
import { HeaderService } from 'src/app/services/admin/header.service';
import { WarehouseService } from 'src/app/services/admin/warehouse.service';
import { ToasterService } from 'src/app/services/ui/toaster.service';

declare var window: any;

@Component({
  selector: 'app-order-operation',
  templateUrl: './order-operation.component.html',
  styleUrls: ['./order-operation.component.css'],
})
export class OrderOperationComponent implements OnInit {
  expandedRows = {};
  expandedRows_2 = {};
  infoProducts: CreatePurchaseInvoice[] = [];
  lastCollectedProducts: CollectedProduct[] = [];
  productsToCollect: ProductOfOrder[] = [];
  _productsToCollect: ProductOfOrder[] = [];
  collectedProducts: ProductOfOrder[] = [];
  process: boolean = false;
  checkForm: FormGroup;
  activeTab: number = 1;
  warehouseModels: WarehouseOperationDetailModel[] = [];
  pageDescription: string = null;
  shelfNumbers: string = "Raf No"
  operation: string = '';
  currentPage: number = 1;
  currentPage2: number = 1;
  currentOrderNo: string;
  toWarehouseCode: string;
  private codeReader: BrowserMultiFormatReader;
  _visible: boolean;
  _visible2: boolean;
  showDialog() {
    this._visible = true;
  }

  invoiceTypes: any[] = [
    { name: 'Standart', key: 0 },
    { name: 'Vergisiz', key: 4 },

  ];
  _pageDescription: boolean = false;
  selectedInvoiceType: any;
  constructor(
    private headerService: HeaderService,
    private toasterService: ToasterService,
    private formBuilder: FormBuilder,
    private orderService: OrderService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private httpClient: HttpClient,
    private productService: ProductService,
    private warehouseService: WarehouseService,
    private generalService: GeneralService,
    private title: Title,
    private sanitizer: DomSanitizer,
  ) {
    this.codeReader = new BrowserMultiFormatReader();
  }
  isBPTransferForm: boolean = false;
  isInvoice: boolean = false;
  customerName: string;
  warehouseCode: string; //depokodu
  async ngOnInit() {

    //this.spinnerService.show();

    await this.activatedRoute.params.subscribe(async (params) => {
      this.formGenerator();

      var orderNumber: string = params['orderNumber'];
      if (params['isInvoice']) {
        this.isInvoice = params['isInvoice'] === "true" ? true : false;
        // this.toasterService.success(this.isInvoice.toString())
      }
      if (params['warehouseCode']) {
        this.warehouseCode = (params['warehouseCode']);
        // this.toasterService.success(this.warehouseCode)
      }
      // if (orderNumber.includes('MIS')) {
      //   orderNumber = orderNumber.split('MIS-')[0]
      // }
      if (orderNumber.startsWith("W-")) {
        var orderNumberType = "WT";
        this.isBPTransferForm = true;
        this.orderNo = orderNumber.split('W-')[1];

      } else {
        var orderNumberType = orderNumber.split('-')[1];
        this.currentOrderNo = params['orderNumber'];
        this.orderNo = orderNumber;
      }


      //  await this.getCollectedOrderProducts(this.orderNo) //toplanan ürünler çekildi
      if (orderNumberType === 'BP') {
        await this.getAllProducts(params['orderNumber'], 'BP'); //toplanan ve toplanacak ürünleri çeker
      } else if (orderNumberType === 'WS') {
        await this.checkClientOrderByOrderNumber(params['orderNumber']);

        await this.addOperationStatus();
        var response = await this.orderService.getOrderDetail(params['orderNumber']);
        this.customerName = response.description;
        await this.getAllProducts(params['orderNumber'], 'WS'); //toplanan ve toplanacak ürünleri çeker
      } else if (orderNumberType === 'WT' || orderNumber.startsWith("W-")) {
        if (orderNumber.startsWith("W-")) {
          this.currentOrderNo = params['orderNumber'].split('W-')[1]
          await this.getAllProducts(params['orderNumber'].split('W-')[1], 'WT'); //toplanan ve toplanacak ürünleri çeker
        } else {
          await this.getAllProducts(params['orderNumber'], 'WT'); //toplanan ve toplanacak ürünleri çeker
        }

      } else if (orderNumber.includes("MIS")) {
        orderNumberType = "MIS"
        await this.getAllProducts(params['orderNumber'], 'MIS'); //toplanan ve toplanacak ürünleri çeker
      }
      if (location.href.includes("MIS")) {
        this._pageDescription = true

      }

      //this.spinnerService.hide();
      this.setPageDescription(orderNumberType);
    });
    // this.toasterService.info(this.currentOrderNo)
  }
  //selam ben burak
  async addOperationStatus() {
    var request = new OrderStatus();
    request.id = await this.generalService.generateGUID();
    request.orderNo = this.currentOrderNo;
    request.status = 'Hazırlanıyor';
    request.warehousePerson = localStorage.getItem('name') + ' ' + localStorage.getItem('surname');
    request.createdDate = new Date();
    const response = await this.orderService.addOrderStatus(request);
    // if (response) {
    //   this.toasterService.success('Durum Güncellendi');
    // } else {
    //   this.toasterService.error('Durum Güncellenemedi');
    // }
  }

  //-----------------------------------------------------EKSIK URUNLER İŞLEMLERİ
  async addMissingProduct(products: ProductOfOrder[]) {

    var missingProducts: ProductOfOrder[] = []

    products.forEach(product => {
      var _product = new ProductOfOrder();
      _product = Object.assign({}, product);
      _product.shelfNo = "MIS-" + this.currentOrderNo;

      missingProducts.push(_product);
    });



    // var response = await this.httpClientService.post<ProductOfOrder>({ controller: "order/destroy-item" }, _product).toPromise();
    var response = await this.orderService.addMissingProduct(missingProducts);
    if (response) {
      await this.getAllProducts(this.currentOrderNo, 'WS')
      this.toasterService.success("Ürünler Eksik Ürünlere Eklendi")
    }
  }

  async deleteMissingProduct(orderNumber: string, barcode: string) {
    const confirmDelete = window.confirm(
      'Eksik Ürüne Aktarım Yapmak İstiyor Musunuz?'
    );

    if (confirmDelete) {
      var response = await this.orderService.deleteMissingProduct(this.currentOrderNo, barcode);
      if (response) {
        await this.getAllProducts(this.currentOrderNo, 'MIS')
        this.toasterService.success("Ürün,Eksik Ürünlerden Silindi")
      }
    }


  }


  //-----------------------------------------------------

  logger() {
    console.log(this.lastCollectedProducts);
  }
  async getCollectedOrderProducts(
    orderNo: string
  ): Promise<CollectedProduct[]> {
    var response = await this.productService.getCollectedOrderProducts(orderNo);
    this.lastCollectedProducts = response;

    // this.toasterService.info(this.lastCollectedProducts.length.toString())
    // this.lastCollectedProducts.forEach(p => {
    //   var set_products = this.productsToCollect.find(p => p.setProducts.length > 0).setProducts;
    //   p.setProducts = set_products;
    // });
    this.calculateTotalQty();
    return response;
  }
  visible: boolean = false;
  totalCount: number = 0;
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

  //-----------------------------------------------------FATURA SEÇME İŞLEMLERİ

  invoicesOfCustomer: InvoiceOfCustomer_VM[] = [];
  selectedInvoice: InvoiceOfCustomer_VM;
  async showDialog2() {
    this._visible2 = true;
    this.invoicesOfCustomer = [];
    var response = await this.orderService.getInvoicesOfCustomer(this.currentOrderNo);
    this.invoicesOfCustomer = response;
  }

  selectInvoice(invoice: InvoiceOfCustomer_VM) {
    this.selectedInvoice = invoice
    this.toasterService.success("Fatura Seçildi");
    this._visible2 = false;
  }
  //-----------------------------------------------------


  qrCodeValue: string = '';
  qrCodeDownloadLink: any = this.sanitizer.bypassSecurityTrustResourceUrl('');

  createJson(barcode: string, shelfNo: string, itemCode: string) {
    var model: CollectedProduct = this.lastCollectedProducts.find(
      (p) =>
        (p.barcode = barcode) && p.shelfNo == shelfNo && p.itemCode == itemCode
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

  orderNo: string;
  orderBillingModel: OrderBillingListModel;
  // url2: string = ClientUrls.baseUrl + '/Order/CountTransferProductPuschase';

  setPageDescription(orderNumberType: string) {
    if (orderNumberType === 'BP') {
      this.title.setTitle('Alınan Sipariş Faturalaştır');
      this.operation = 'Toplananları Faturalaştır';
      this.pageDescription = 'Ürün Toplama Paneli';
    } else if (orderNumberType === 'WS' || orderNumberType === 'MIS') {
      this.title.setTitle('Verilen Sipariş Faturalaştır');
      this.operation = 'Toplananları Faturalaştır';

      this.pageDescription = 'Ürün Toplama Paneli';
    } else if (orderNumberType === 'WT') {
      this.title.setTitle('Transfer Detay');
      this.operation = 'Transferi Onayla';

      this.pageDescription = 'Transfer Onaylama Detay ' + this.currentOrderNo;
    }

    this.headerService.updatePageTitle(this.pageDescription);

  }

  addedProductCount: string = '';
  lastCollectedProduct: ProductOfOrder = null;
  async getAllProducts(orderNo: string, orderNoType: string): Promise<any> {
    if (orderNo.startsWith("W-")) {
      orderNo = orderNo.split("W-")[1]
    }
    if (this.currentOrderNo.includes('MIS-')) {
      orderNoType = 'MIS'
    }
    const productData = await this.orderService //toplanacak ürünler çekildi
      .getCollectedProducts(orderNo, orderNoType)
      .toPromise();
    if (productData.length === 0) {
      this._productsToCollect = []
      // this.toasterService.success("SAYIM TAMAMLANDI");

    }
    this.productsToCollect = productData; //toplanacak ürünler çekildi
    if (this.orderNo.includes('WS') && this.lockedSetProduct) {
      this.lockSetProduct_force(this.lockedSetProduct);
    }
    // this.productsToCollect = this.productsToCollect.filter(p => p.quantity > 0);

    if (this.isLocked) {
      this.setTopProduct(this.productsToCollect.find(p => p.lineId == this.lockedSetProduct.lineId).setProducts)
    } else {
      this.setTopProduct(productData)
    }


    // if (orderNoType == 'WS') {
    //   //sayım yapılabilcek ürünler listesine atıldı
    //   // this.productsToCollect.forEach((e) => {
    //   //   if (e.quantity > e.currentQty) {
    //   //     var model: CreatePurchaseInvoice = new CreatePurchaseInvoice();
    //   //     model.barcode = e.barcode;
    //   //     model.quantity = e.quantity;
    //   //     model.shelfNo = e.shelfNo;
    //   //     model.photoUrl = e.photoUrl;
    //   //     this.infoProducts.push(model);
    //   //   }
    //   // });
    //   // this.addedProductCount = 'Sayım Paneli(' + this.infoProducts.length + ')';
    // }
    if (orderNoType == 'WT') {
      var response =
        await this.warehouseService.getWarehosueOperationListByInnerNumber(
          this.currentOrderNo
        );
      if (response) {
        var warehouseOperationListModel: WarehouseOperationListModel = response;
        this.toWarehouseCode = warehouseOperationListModel.toWarehouseCode;
        // this.toasterService.success(this.toWarehouseCode);
      }
    }

    await this.getCollectedOrderProducts(this.orderNo); //toplanan ürünler çekildi
  }

  setTopProduct(productData: ProductOfOrder[]) {
    if (this.productsToCollect.length > 0) {
      if (this.stickedProduct != null) {
        var _foundedProduct = this.productsToCollect.find(
          (p) =>
            p.barcode == this.stickedProduct.barcode &&
            p.itemCode == this.stickedProduct.itemCode &&
            p.shelfNo == this.stickedProduct.shelfNo
        );
        if (!_foundedProduct) {

          this.productsToCollect.find(product =>
            product.setProducts.some(setProduct => {
              if (
                setProduct.barcode == this.stickedProduct.barcode &&
                setProduct.itemCode == this.stickedProduct.itemCode &&
                setProduct.shelfNo == this.stickedProduct.shelfNo
              ) {
                _foundedProduct = setProduct;
                return true; // Bu `some` döngüsünden çıkmak için true döndürülür
              }
              return false;
            })
          );
        }

        if (_foundedProduct == undefined || _foundedProduct.quantity == 0) {
          if (this.lastCollectedProduct == null) {
            //üste atılcak ürün seçildi
            this._productsToCollect = [];
            this._productsToCollect.push(productData[0]);
            this.lastCollectedProduct = productData[0];
            this.checkForm.get('shelfNo').setValue(productData[0].shelfNo);

          } else {

            if (!this.isLocked) {
              var foundedProduct = this.productsToCollect.find(
                (p) =>
                  p.barcode == this.lastCollectedProduct.barcode &&
                  p.itemCode == this.lastCollectedProduct.itemCode &&
                  p.shelfNo == this.lastCollectedProduct.shelfNo
              );
            } else {
              var foundedProduct = this.productsToCollect.find(p => p.lineId == this.lockedSetProduct.lineId).setProducts.find(
                (p) =>
                  p.barcode == this.lastCollectedProduct.barcode &&
                  p.itemCode == this.lastCollectedProduct.itemCode &&
                  p.shelfNo == this.lastCollectedProduct.shelfNo
              );
            }


            if (foundedProduct) {
              //eğer ürün bulunduysa

              if (foundedProduct.quantity > 0) {
                //miktar değeri 0 dan büyükse üste at
                this._productsToCollect = [];
                this._productsToCollect.push(foundedProduct);
                this.lastCollectedProduct = foundedProduct;
                this.checkForm.get('shelfNo').setValue(foundedProduct.shelfNo);

              } else {
                //miktar değeri 0 dan küçükse
                this._productsToCollect = [];
                this._productsToCollect.push(productData[0]);
                this.lastCollectedProduct = productData[0];
                this.checkForm.get('shelfNo').setValue(productData[0].shelfNo);

              }
            } else {
              //eğer ürün bulunamadıysa
              this._productsToCollect = [];
              this._productsToCollect.push(productData[0]);
              this.lastCollectedProduct = productData[0];
              this.checkForm.get('shelfNo').setValue(productData[0].shelfNo);

            }
          }
        } else {
          //üürn bulunmdadıysa

          this._productsToCollect = [];
          this._productsToCollect.push(_foundedProduct);
          this.lastCollectedProduct = _foundedProduct;
          this.checkForm.get('shelfNo').setValue(_foundedProduct.shelfNo);
        }
      } else {
        //üürn bulunmdadıysa

        this._productsToCollect = [];
        this._productsToCollect.push(productData[0]);
        this.lastCollectedProduct = productData[0];
        this.checkForm.get('shelfNo').setValue(productData[0].shelfNo);

      }


    }


  }
  stickedProduct: ProductOfOrder = null;
  stickToTop(product: ProductOfOrder, add: boolean) {
    if (product.quantity > 0 && add) {
      this.stickedProduct = product;

      if (this.isLocked) {
        this.setTopProduct(this.lockedSetProduct.setProducts);

      } else {

        this.setTopProduct(this.productsToCollect)
      }

      // this.toasterService.success('Ürün Sabitlendi')
    } else if (!add) {
      this.stickedProduct = null;
      this.setTopProduct(this.productsToCollect)
      // this.toasterService.success('Ürün Sabitlenenlerden Kaldırıldı')
    }
  }
  goDown2(barcode: string, shelfNo: string, itemCode: string) {
    // packageNo'ya eşleşen ProductOfOrder'ı bulun
    const matchingProduct = this.productsToCollect.find(
      (product) =>
        product.barcode === barcode &&
        product.shelfNo == shelfNo &&
        product.itemCode == itemCode
    );

    // Eğer eşleşen bir ürün bulunduysa
    if (matchingProduct) {
      // Ürünü diziden çıkarın
      const index = this.productsToCollect.indexOf(matchingProduct);
      if (index !== -1) {
        if (this.productsToCollect.length - 1 >= index + 1) {
          this.stickToTop(this.productsToCollect[index + 1], true)
          // this._productsToCollect = [];
          // this._productsToCollect.push(this.productsToCollect[index + 1]);
          // this.lastCollectedProduct = this.productsToCollect[index + 1];
          // this.checkForm.get('shelfNo').setValue(this.productsToCollect[index + 1].shelfNo);
        } else {
          this._productsToCollect = [];
          this._productsToCollect.push(this.productsToCollect[0]);
          this.checkForm.get('shelfNo').setValue(this.productsToCollect[0].shelfNo);

        }
        // this.productsToCollect.splice(index, 1);

        // // Ürünü dizinin sonuna ekleyin
        // this.productsToCollect.push(matchingProduct);
      }
    }
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
      // invoiceType: [null]
    });


  }
  async confirmTransfer(operationNumberList: string[]): Promise<any> {
    //transfer onaylama yapılır ve transfer listesinin ekranına atar!
    const response: boolean = await this.orderService.confirmTransfer(
      operationNumberList
    );

    if (response) {
      this.toasterService.success('Transfer işlemi Başarılı');
      this.router.navigate(['/warehouse-operation-list']);
    }
  }

  cancelStatus: boolean = false;
  async checkClientOrderByOrderNumber(orderNumber: string) {
    var response = await this.orderService.checkClientOrderByOrderNumber(orderNumber)
    if (response) {
      this.cancelStatus = true;
      this.toasterService.error('Bu Sipariş İptal Edilmiştir Lütfen Ürünleri Yerine Yerleştiriniz');

    }
  }
  async collectAndPack_WS(products: ProductOfOrder[]) {


    if (!this.selectedInvoiceType) {
      this.toasterService.error("Vergi Tipi Seçiniz");
      return;
    }
    //this.spinnerService.show();
    const response: CountConfirmData[] =
      await this.orderService.getInventoryFromOrderNumber(
        this.currentOrderNo
      );
    if (response.length > 0) {
      this.toasterService.success('Otomatik Sayım Yapılabilir');
      const response2 = await this.orderService.setInventoryByOrderNumber(
        this.currentOrderNo
      );
      if (response2) {
        this.toasterService.success('Otomatik Sayım yapıldı');

        var _response = await this.orderService.collectAndPack(products, this.currentOrderNo, this.selectedInvoiceType.key);
        if (_response) {
          ////console.log(this.productsToCollect)
          if (this.productsToCollect.length > 0) {
            this.addMissingProduct(this.productsToCollect);
          }
          this.router.navigate(['/orders-managament/1/2']);
        }
      }

    }
    // await this.orderService.collectAndPack(products, this.currentOrderNo, this.selectedInvoiceType.key);
    //this.spinnerService.hide();
  }
  async collectAndPack(products: ProductOfOrder[]) {
    //console.log(this.currentOrderNo);
    var orderType: string = "";
    if (this.currentOrderNo.includes("MIS")) {
      orderType = "MIS"
    } else if (location.href.includes("W-")) {
      orderType = "WT"
    }

    else {
      orderType = this.currentOrderNo.split('-')[1];
    }
    if (orderType === 'BP' || orderType === 'WS' || orderType === 'MIS') {
      var confirmation = window.confirm(
        'İşlem Nebime Aktarılacaktır.Devam Etmek istiyor musunuz?'
      );

      if (confirmation) {
        //this.spinnerService.show();
        if (orderType === 'WS' || orderType === 'MIS') {
          this.showDialog();
          //this.spinnerService.hide();
          return;

        } else {
          this.orderService.collectAndPack(products, this.currentOrderNo, null, this.selectedInvoice);
        }

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
    //this.spinnerService.hide();
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

  async setFormValues(barcode: string): Promise<CountProduct> {



    try {
      if (barcode.includes('http') || this.generalService.isGuid(barcode)) {
        var result: string[] = await this.productService.countProductByBarcode3(
          barcode
        );
        this.shelfNumbers = result[0];
        var currentShelfNo = this.checkForm.get('shelfNo').value;
        this.checkForm.get('batchCode').setValue(result[2]);
        this.checkForm.get('barcode').setValue(result[3]);
        this.checkForm.get('quantity').setValue(result[1]);


        var product: CountProduct = new CountProduct(result[3], currentShelfNo, result[2], Number(result[1]));

        //üste okutulan ürün yerleştirme

        var foundedProduct = this.productsToCollect.find(
          (p) =>
            p.barcode == product.barcode
        );

        this.stickToTop(foundedProduct, true);
        //------------------
        return product;
      } else {
        var result: string[] = await this.productService.countProductByBarcode4(
          barcode, this.warehouseCode
        );
        this.shelfNumbers = result[0];
        var currentShelfNo = this.checkForm.get('shelfNo').value;
        this.checkForm.get('barcode').setValue(result[3]);
        this.checkForm.get('batchCode').setValue(result[2].toString());
        if (this.checkForm.get('quantity').value == null || this.checkForm.get('quantity').value == 1) {
          this.checkForm.get('quantity').setValue(result[1]);
        }

        if (result[4] == 'false' && result[3].length != 13) {

          if (!window.confirm('Parti Hatalı Devam Edilsin Mi?')) {
            this.checkForm.get('batchCode').setValue(null);
            this.focusNextInput('batchCode');
            this.toasterService.error('Parti Giriniz');
            return null;
          }
        }
        var product: CountProduct = new CountProduct(result[3], currentShelfNo, result[2], null);
        if (this.checkForm.get('quantity').value == null || this.checkForm.get('quantity').value == 1) {
          product.quantity = Number(result[1]);
        } else {
          product.quantity = this.checkForm.get('quantity').value;
        }


        //üste okutulan ürün yerleştirme
        if (this.isLocked) {
          var foundedProduct = this.lockedSetProduct.setProducts.find(
            (p) =>
              p.barcode == product.barcode
          );


          // this.stickToTop(foundedProduct, true);
          //------------------
          return product;
        } else {
          var foundedProduct = this.productsToCollect.find(
            (p) =>
              p.barcode == product.barcode
          );


          this.stickToTop(foundedProduct, true);
          //------------------
          return product;
        }

      }
    } catch (error) {
      this.toasterService.error(error.message);
      return null;
    }
  }



  qrBarcodeUrl: string = null;
  qrOperationModels: QrOperationModel[] = [];
  async onSubmit(productModel: CountProduct): Promise<any> {

    // = işareti varsa - yap
    if (productModel.barcode.includes("=")) {
      productModel.barcode = productModel.barcode.replace(/=/g, "-");

    }
    if (productModel.barcode.includes("Http")) {
      productModel.barcode = productModel.barcode.replace("Http", "http");

    }

    // http ile başlıyorsa veya guid ise qr işlemi yap
    if (
      productModel.barcode.includes('http') ||
      this.generalService.isGuid(productModel.barcode)
    ) {
      this.qrBarcodeUrl = productModel.barcode;
    }

    if (!this.checkForm.valid) {

      var updated_product = await this.setFormValues(

        productModel.barcode
      );

      if (this.checkForm.get('quantity').value == null || this.checkForm.get('quantity').value >= 1) {


        if ((this.currentOrderNo.split('-')[1] === 'WS' || this.currentOrderNo.includes('MIS-')) && this.checkForm.valid) {
          await this.onSubmit(updated_product);
        }
      }

      // this.toasterService.success("Formu Verileri Dolduruldu.")
      return;
    }

    //satış faturası alanı------------------------------------------------------------------------ WS

    if (this.currentOrderNo.split('-')[1] === 'WS' || this.currentOrderNo.includes('MIS-')) {


      if (this.checkForm.valid) {

        //SET ÜRÜNÜ KODLARI


        // //EĞER KİTLENMEDİYSE VE DİREKT SET ÜRÜNÜ İSE

        // if (!this.isLocked && this.productsToCollect.find(p => p.barcode == productModel.barcode)?.setProducts.length > 0) {
        //   await this.collectSelectedProduct(lp);
        //   this.toasterService.error('Lütfen Ürünü Kitleyiniz Ve Set Ürünlerini Okutunuz');

        //   return;
        // }
        // //EĞER KİTLENDİSYE  VE DİREKT SET ÜRÜNÜ İSE
        // else if (this.isLocked && this.productsToCollect.find(p => p.barcode == productModel.barcode)?.setProducts.length > 0) {
        //   this.toasterService.error('Lütfen Set Ürünlerini Okutunuz');
        //   return;
        // }
        //EĞER KİTLENDİYSE VE SETİN İÇİNDEKİ ÜRÜN OKUTULDUYSA
        if (this.isLocked && this.lockedSetProduct) {
          // this.toasterService.info('SET ÜRÜNÜ ALGILANDI');
          if (this.lockedSetProduct.setProducts.some(p => p.quantity > 0 && p.barcode == productModel.barcode)) {

            var sp = this.lockedSetProduct.setProducts.find(p => p.quantity > 0 && p.barcode == productModel.barcode);
            if (sp.quantity - productModel.quantity < 0) {
              this.toasterService.error('Stok Hatası');
              return;
            }
            var result: string[] = await this.productService.countProductByBarcode3(
              productModel.barcode
            );
            this.shelfNumbers = result[0];
            var newResponse = this.shelfNumbers;
            this.shelfNumbers += this.lockedSetProduct.shelfNo;
            const shelves = newResponse
              .split(',')
              .filter((raflar) => raflar.trim() !== '')
              .map((raflar) => raflar.toLowerCase());

            const foundProduct = this.lockedSetProduct.setProducts.find(
              (o) => o.barcode == productModel.barcode

            );

            var shelf_req = shelves.find(
              (s) => s.toLowerCase() == productModel.shelfNo.toLowerCase()
            ) &&
              (foundProduct != null || foundProduct != undefined);

            if (!shelf_req) {
              if (!window.confirm(
                'Raf Numarası Eşleşmedi Yine De Eklemek İstiyor Musunuz?'
              )) {
                this.toasterService.error('Eklenmedi');
                return;
              }
            }
            if (foundProduct.quantity - productModel.quantity >= 0) {

              var _setRequest: ZTMSG_CountedSetProduct = new ZTMSG_CountedSetProduct();
              _setRequest.barcode = productModel.barcode;
              _setRequest.batchCode = productModel.barcode;
              _setRequest.quantity = productModel.quantity
              _setRequest.batchCode = productModel.batchCode
              _setRequest.shelfNo = productModel.shelfNo;
              _setRequest.lineId = foundProduct.lineId;
              _setRequest.operationNumber = this.orderNo;
              _setRequest.setItemCode = this.lockedSetProduct.itemCode;
              _setRequest.isCompleted = true;
              var set_response = await this.warehouseService.addSetProduct(
                _setRequest
              );
              if (set_response) {
                await this.getAllProducts(this.orderNo, 'WS');
                //eğer artık okutulan set ürününün tüm ürünleri toplandıysa
                var lp = this.productsToCollect.find(p => p.lineId == this.lockedSetProduct.lineId)
                if (!lp.setProducts.some(p => p.quantity > 0)) {
                  this.isLocked = false;
                  this.lockedSetProduct = null;
                  this.old_list = [];
                  await this.collectSelectedProduct(lp);
                  return;
                }
                //↑↑↑↑↑↑↑↑↑ TÜM ÜRÜNLER ÇEKİLDİ ↑↑↑↑↑↑↑↑↑
                // this.toasterService.success('Ürün Toplama İşlemi Tamamlandı!');
                this.clearBarcodeAndQuantity();
                return;
              } else {
                this.toasterService.error('Sayım Yapılamadı');
                return;
              }
              //↑↑↑↑↑↑↑↑↑ SAYIM YAPILDI ↑↑↑↑↑↑↑↑↑



            } else {
              this.toasterService.warn('Stok Hatası.');
              return;
            }
          } else {
            this.toasterService.warn('set ürünü bulunamadı')
            return;
          }

        }



        var foundModel = this.productsToCollect.find(
          (o) => o.barcode == productModel.barcode
        );

        //↑↑↑↑↑↑↑↑↑ EŞLEŞEN ÜRÜN BULUNDU ↑↑↑↑↑↑↑↑↑

        if (true) {
          var newResponse = this.shelfNumbers;
          const shelves = newResponse
            .split(',')
            .filter((raflar) => raflar.trim() !== '')
            .map((raflar) => raflar.toLowerCase());

          const foundProduct = this.productsToCollect.find(
            (o) => o.barcode == productModel.barcode

          );

          if (
            shelves.find(
              (s) => s.toLowerCase() == productModel.shelfNo.toLowerCase()
            ) &&
            (foundProduct != null || foundProduct != undefined)
          ) {



            if (foundProduct.quantity - productModel.quantity >= 0) {
              var lineId = this.productsToCollect.find(p => p.barcode == productModel.barcode
              ).lineId
              if (!lineId) {
                this.toasterService.error("lineId bulunamadı")
              }

              var response = await this.warehouseService.countProductRequest2(
                this.checkForm.get('barcode').value,
                productModel.shelfNo,
                productModel.quantity,
                null,
                null,
                productModel.batchCode,
                'Order/CountProduct4',
                this.orderNo,
                null,
                lineId
              );

              //↑↑↑↑↑↑↑↑↑ SAYIM YAPILDI ↑↑↑↑↑↑↑↑↑
              if (response && response != null && response != undefined) {

                var qrResponse: QrOperationResponseModel =
                  await this.productService.qrOperationMethod(
                    foundModel.lineId,
                    this.currentOrderNo,
                    this.qrBarcodeUrl,
                    this.checkForm,
                    productModel,
                    productModel.quantity,
                    false,
                    'WS'
                  );
                if (qrResponse != null && qrResponse.state === true) {
                  this.qrOperationModels.push(qrResponse.qrOperationModel);
                } else if (qrResponse === null) {
                  this.qrBarcodeUrl = null
                }

                //↑↑↑↑↑↑↑↑↑ EĞER QRURl BOŞ DEĞİLSE KONTROL EDİLCEK ↑↑↑↑↑↑↑↑↑
              } else {
                this.toasterService.error("Sayım Sırasında Hata Alındı")
                return;
              }

              await this.getAllProducts(this.orderNo, 'WS');

              //↑↑↑↑↑↑↑↑↑ TÜM ÜRÜNLER ÇEKİLDİ ↑↑↑↑↑↑↑↑↑
              this.toasterService.success('Ürün Toplama İşlemi Tamamlandı!');
              this.clearBarcodeAndQuantity();

            } else {
              this.toasterService.warn('Stok Hatası.');
            }
          } else {
            const confirmDelete = window.confirm(
              'Raf Numarası Eşleşmedi Yine De Eklemek İstiyor Musunuz?'
            );

            if (confirmDelete) {

              //↑↑↑↑↑↑↑↑↑ EĞER QRURl BOŞ DEĞİLSE KONTROL EDİLCEK ↑↑↑↑↑↑↑↑↑
              productModel.quantity =
                productModel.quantity;

              if (foundProduct.quantity - productModel.quantity >= 0) {
                var lineId = this.productsToCollect.find(p => p.barcode == productModel.barcode
                ).lineId
                if (!lineId) {
                  this.toasterService.error("lineId bulunamadı")
                }

                var response = await this.warehouseService.countProductRequest2(
                  this.checkForm.get('barcode').value,
                  productModel.shelfNo,
                  productModel.quantity,
                  null,
                  null,
                  productModel.batchCode,
                  'Order/CountProduct4',
                  this.orderNo,
                  null,
                  lineId
                );
                //↑↑↑↑↑↑↑↑↑ SAYIM YAPILDI ↑↑↑↑↑↑↑↑↑

                await this.getAllProducts(this.orderNo, 'WS');

                //↑↑↑↑↑↑↑↑↑ TOPLANAN ÜRÜNLER ÇEKİLDİ ↑↑↑↑↑↑↑↑↑
                this.toasterService.success('Ürün Toplama İşlemi Tamamlandı!');
                this.clearBarcodeAndQuantity();

              } else {
                this.toasterService.warn('Stok Hatası.');
              }

            } else {
              this.toasterService.error("Eklenmedi")
            }
          }
        }
      }

    }
    //transfer-------------------------------------------------------------------- WT
    else if (this.currentOrderNo.split('-')[1] === 'WT' || this.isBPTransferForm === true) {

      //okututulan ürünü üste at ;

      //
      if (this.checkForm.valid) {

        if (productModel.barcode && productModel.barcode.charAt(0) === '0') {
          productModel.barcode = productModel.barcode.substring(1);
        }
        var foundModel = this.productsToCollect.find(
          (o) => o.barcode == productModel.barcode
        );

        //↑↑↑↑↑↑↑↑↑ EŞLEŞEN ÜRÜN BULUNDU ↑↑↑↑↑↑↑↑↑
        if (foundModel) {
          const foundProduct = foundModel;
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
              var lineId = this.productsToCollect.find(p => p.barcode == productModel.barcode
              ).lineId
              if (!lineId) {
                this.toasterService.error("lineId bulunamadı")
              }
              var response2 = await this.warehouseService.countProductRequest2(
                productModel.barcode,
                productModel.shelfNo,
                productModel.quantity,
                null,
                null,
                productModel.batchCode == null ? "" : productModel.batchCode,
                'Order/CountProduct4',
                this.orderNo,
                null,
                lineId
              );
              //↑↑↑↑↑↑↑↑↑ SAYIM YAPILDI ↑↑↑↑↑↑↑↑↑
              if (response2 && response2 != null && response2 != undefined) {

                //↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓
                var qrResponse: QrOperationResponseModel =
                  await this.productService.qrOperationMethod(
                    foundModel.lineId,
                    this.currentOrderNo,
                    this.qrBarcodeUrl,
                    this.checkForm,
                    productModel,
                    productModel.quantity,
                    false,
                    'WT'
                  );
                if (qrResponse != null && qrResponse.state === true) {
                  this.qrOperationModels.push(qrResponse.qrOperationModel);
                } else if (qrResponse === null) {
                  this.qrBarcodeUrl = null
                }

                //↑↑↑↑↑↑↑↑↑ EĞER QRURl BOŞ DEĞİLSE KONTROL EDİLCEK ↑↑↑↑↑↑↑↑↑
              } else {
                this.toasterService.error("Sayım Sırasında Hata Alındı")

                return;
              }

              await this.getAllProducts(this.orderNo, 'WT');
              //↑↑↑↑↑↑↑↑↑ TOPLANAN ÜRÜNLER ÇEKİLDİ ↑↑↑↑↑↑↑↑↑

              this.toasterService.success('Ürün Toplama İşlemi Tamamlandı!');
              this.clearBarcodeAndQuantity();
            }
          } else {
            this.toasterService.warn('Stok Hatası.');
          }
        } else {
          this.toasterService.warn('Eşleşen Ürün Bulunamadı');
        }
      }

    }
    //alış-------------------------------------------------------------------- BP
    else {
      if (this.checkForm.valid) {
        var response = await this.warehouseService.countProductRequest(
          productModel.barcode,
          productModel.shelfNo,
          productModel.quantity,
          null,
          null,
          productModel.batchCode,
          'Order/CountProductControl',
          this.orderNo,
          null
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

          const foundProduct = this.productsToCollect.find(
            (o) => o.barcode == productModel.barcode
          );



          if (foundProduct.quantity - productModel.quantity >= 0) {
            var lineId = this.productsToCollect.find(p => p.barcode == productModel.barcode && p.shelfNo == productModel.shelfNo
            ).lineId
            if (!lineId) {
              this.toasterService.error("lineId bulunamadı")
            }
            var response = await this.warehouseService.countProductRequest2(
              productModel.barcode,
              productModel.shelfNo,
              productModel.quantity,
              null,
              null,
              productModel.batchCode,
              'Order/CountProduct4',
              this.orderNo,
              null,
              lineId
            );
            //↑↑↑↑↑↑↑↑↑ SAYIM YAPILDI ↑↑↑↑↑↑↑↑↑
            if (response && response != null && response != undefined) {
              var qrResponse: QrOperationResponseModel =
                await this.productService.qrOperationMethod(
                  foundModel.lineId,
                  this.currentOrderNo,
                  this.qrBarcodeUrl,
                  this.checkForm,
                  productModel,
                  productModel.quantity,
                  false,
                  'BP'
                );
              if (qrResponse != null && qrResponse.state === true) {
                this.qrOperationModels.push(qrResponse.qrOperationModel);
              } else if (qrResponse === null) {
                this.qrBarcodeUrl = null
              }

            } else {
              this.toasterService.error("Sayım Sırasında Hata Alındı")

              return;
            }


            await this.getAllProducts(this.orderNo, 'BP');

            //↑↑↑↑↑↑↑↑↑ TOPLANAN ÜRÜNLER ÇEKİLDİ ↑↑↑↑↑↑↑↑↑

            this.toasterService.success('Ürün Toplama İşlemi Tamamlandı!');
            this.clearBarcodeAndQuantity();
          }
        } else {
          this.toasterService.warn('Eşleşen Ürün Bulunamadı');
        }
      } else {
        this.toasterService.warn('Formu Doldurunuz');
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
      // this.toasterService.success('true');
    } else {
      // Checkbox işaretini kaldırdığınızda, bu ürünün indexini listeden kaldırın.
      const indexToRemove = this.confirmedProductPackageNoList.findIndex(
        (p) => p.toString() == packageNo
      );
      if (indexToRemove !== -1) {
        this.confirmedProductPackageNoList.splice(indexToRemove, 1);
        // this.toasterService.error('false');
      }
    }
  }
  urr: string = "https://lh3.googleusercontent.com/d/1H2pjyH0zqSbZMgw5pn1zU0DlbrgDlL5K";
  async addAllSelectedProductsToList(): Promise<any> {
    if (this.confirmedProductPackageNoList.length === 0) {
      this.toasterService.warn('Seçilen Ürün Bulunamadı.');
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
            'Order/CountProduct4',
            this.currentOrderNo,
            ''
          );
        }
      }

      await this.getAllProducts(
        this.currentOrderNo,
        this.currentOrderNo.split('-')[1]
      );

      this.toasterService.success('Seçilen Ürünler Başarıyla Eklendi');

      this.confirmedProductPackageNoList = [];
      return;
    }
  }
  shelfNo: string;
  shelfNoList: string[] = [];
  barcodeValue: string = null; // Değişkeni tanımlayın

  productShelvesDialog: boolean = false;
  productShelves: string[] = [];
  async getShelves(barcode: string) {
    var newResponse = await this.productService.countProductByBarcode4(
      barcode, this.warehouseCode
    );
    const shelves = newResponse[0]
      .split(',')
      .filter((raflar) => raflar.trim() !== '')


    this.productShelves = shelves;
    this.productShelvesDialog = true;
  }
  setShelveToForm(shelve) {
    this.checkForm.get('shelfNo').setValue(shelve);
    this.toasterService.success("Raf Yerleştirildi");
    this.productShelvesDialog = false;
  }



  clearShelfNumbers() {
    // this.checkForm.get('shelfNo').setValue(null);
    this.checkForm.get('shelfNo').setValue(null);

    this.checkForm.get('barcode').setValue(null);
    this.checkForm.get('batchCode').setValue(null);

    this.qrBarcodeUrl = null;
    this.shelfNumbers = 'Raf No';

    this.checkForm.get('quantity').setValue(null);
    if (this.currentOrderNo.split('-')[1] === 'WS') {
      this.focusNextInput('shelfNo');
    } else {
      this.focusNextInput('barcode');
    }
  }

  clearBarcodeAndQuantity() {
    if (this.currentOrderNo.includes('WS') || this.currentOrderNo.includes('WT')) {
      if (this.lastCollectedProduct) {
        this.checkForm.get('shelfNo').setValue(this.lastCollectedProduct.shelfNo);
      }
      this.checkForm.get('batchCode').setValue(null);

    }
    if (this.currentOrderNo.includes('WT')) {

      this.focusNextInput('shelfNo');
    } else {
      this.focusNextInput('barcode');

    }
    this.checkForm.get('barcode').setValue(null);
    this.shelfNumbers = 'Raf No'
    this.qrBarcodeUrl = null;
    this.checkForm.get('batchCode').setValue(null);
    this.checkForm.get('quantity').setValue(null);
    this.generalService.beep();
  }
  async scanCompleteHandler(result: string) {
    if (result != undefined) {
      try {
        this.toasterService.success(result);
      } catch (error) {
        this.toasterService.error(error.message);
      }
    }
  }
  async deleteOrderProduct(orderNo: string, product: CollectedProduct): Promise<boolean> {

    if (this.currentOrderNo.includes("MIS")) {
      await this.deleteMissingProduct("MIS-" + orderNo, product.barcode);
      return true;
    }
    const confirmDelete = window.confirm(
      'Bu hareketi silmek istediğinizden emin misiniz?'
    );

    if (confirmDelete) {
      // eğer set ürünü iset
      if (product.setProducts.length > 1) {
        var delete_set_response = await this.warehouseService.deleteCountedSetProductByOrder(orderNo, product.itemCode);
        if (delete_set_response) {
          this.toasterService.success("Set Ürünleri Silindi");
        }
      }
      const response: boolean = await this.productService.deleteOrderProduct(
        orderNo,
        product.itemCode,
        product.id
      );
      if (response) {
        this.toasterService.success('Silme İşlemi Başarılı');
        this.generalService.beep3();
        this.lastCollectedProducts =
          await this.productService.getCollectedOrderProducts(this.orderNo);

        if (orderNo.includes("MIS")) {
          await this.getAllProducts(orderNo, 'MIS'); //toplanan ve toplanacak ürünleri çeker
        }
        if (this.isBPTransferForm) {
          await this.getAllProducts(orderNo, 'WT')
        } else {
          if (orderNo.split('-')[1] === 'BP') {
            await this.getAllProducts(orderNo, 'BP');
          } else if (orderNo.split('-')[1] === 'WS') {
            await this.getAllProducts(orderNo, 'WS');
          } else if (orderNo.split('-')[1] === 'WT') {
            await this.getAllProducts(orderNo, 'WT');
          }
        }

      }
      var model: QrOperationModel = new QrOperationModel();
      var qrOperationModel: QrOperationModel = new QrOperationModel();
      ////console.log(this.qrOperationModels);
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
          ////console.log(this.qrOperationModels);
          this.generalService.beep3();
          // this.toasterService.success('Qr Operasyonu Geri Alındı');
        } else {
          // this.toasterService.error('Qr Operaasyonu Geri Alınamadı');
        }
      } else {
        // this.toasterService.error('Qr Operaasyonu Geri Alınamadı');
      }

      return response;
    } else {
      return false;
    }
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


  //--------------
  barcodeDialog: boolean = false;
  barcode: string = null;
  quantity: number = null;
  change(barcode: string, quantity: number) {
    this.barcodeDialog = !this.barcodeDialog;
    this.barcode = barcode;
    this.quantity = quantity
  }

  //----------------------------
  //----------------------------SET KODLARI

  isLocked: boolean = false;
  lockedSetProduct: ProductOfOrder;
  old_list: ProductOfOrder[] = [];
  lockSetProduct(setProduct: ProductOfOrder) {
    if (this.lockedSetProduct?.lineId != setProduct.lineId) {
      if (setProduct.setProducts.length > 0) {
        // Herhangi bir ürünün toplanmayan adedi var mı kontrol et
        if (setProduct.setProducts.some(p => p.quantity > 0)) {
          this.lockedSetProduct = setProduct;
          this.isLocked = true;
          this.old_list = [...this.productsToCollect]; // Mevcut listeyi yedekle
          this.productsToCollect = this.productsToCollect.filter(p => p === setProduct); // Diğer ürünleri filtrele
          this.stickToTop(setProduct.setProducts.find(p => p.quantity > 0), true);
          this.toasterService.success("Ürün Kitlendi");
        } else {
          this.toasterService.error("Tüm Set Ürünleri Toplanmıştır");
        }
      } else {
        this.toasterService.error("Bu Bir Set Ürünü Değildir");
        return;
      }
    }
  }
  lockSetProduct_force(setProduct: ProductOfOrder) {
    if (setProduct.setProducts.length > 0) {
      // Herhangi bir ürünün toplanmayan adedi var mı kontrol et
      if (setProduct.setProducts.some(p => p.quantity > 0)) {
        // this.stickToTop(setProduct.setProducts.find(p => p.quantity > 0), true);
        // this.lockedSetProduct = setProduct;
        // this.isLocked = true;
        this.old_list = [];
        this.old_list = [...this.productsToCollect]; // Mevcut listeyi yedekle
        this.productsToCollect = this.productsToCollect.filter(p => p.lineId === setProduct.lineId); // Diğer ürünleri filtrele
        this.toasterService.success("Ürün Kitlendi");
      } else {
        this.toasterService.error("Tüm Set Ürünleri Toplanmıştır");
      }
    } else {
      this.toasterService.error("Bu Bir Set Ürünü Değildir");
      return;
    }
  }

  unlockSetProduct() {
    if (this.isLocked) {
      this.productsToCollect = this.old_list; // Eski listeyi geri yükle
      this.isLocked = false;
      this.lockedSetProduct = null;
      this.toasterService.success("Ürün Kilidi Kaldırıldı");
    }
  }

  async deleteSetProduct(product: ProductOfOrder) {
    var response = await this.warehouseService.deleteSetCount(this.orderNo, product.barcode);
    await this.getAllProducts(this.orderNo, 'WS')
  }
  async collectSelectedProduct(product: ProductOfOrder) {
    this.checkForm.reset();
    this.checkForm.get('shelfNo').setValue(product.shelfNo);
    this.checkForm.get('barcode').setValue(product.barcode);
    this.checkForm.get('quantity').setValue(product.quantity);

    await this.onSubmit(this.checkForm.value);
  }

  //----------------------------
}
