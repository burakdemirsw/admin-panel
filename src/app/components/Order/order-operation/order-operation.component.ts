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
import { Exception } from '@zxing/library';
import { MenuItem } from 'primeng/api';
import { CreatePurchaseInvoice } from "src/app/models/model/invoice/CreatePurchaseInvoice.1";
import { InvoiceOfCustomer_VM } from 'src/app/models/model/invoice/invoiceOfCustomer_VM';
import { OrderStatus } from 'src/app/models/model/order/orderStatus';
import { CollectedProduct } from 'src/app/models/model/product/collectedProduct';
import { CountProduct } from 'src/app/models/model/product/countProduct';
import {
  QrOperationModel
} from 'src/app/models/model/product/qrOperationModel';
import { WarehouseOperationListModel } from 'src/app/models/model/warehouse/warehosueOperationListModel';
import { WarehouseOperationDetailModel } from 'src/app/models/model/warehouse/warehouseOperationDetailModel';
import { WarehouseOperationProductModel } from 'src/app/models/model/warehouse/warehouseOperationProductModel';
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
  infoProducts: CreatePurchaseInvoice[] = [];
  lastCollectedProducts: CollectedProduct[] = [];
  productsToCollect: ProductOfOrder[] = [];
  selectedProducts: ProductOfOrder[] = [];
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
  tableHeaders: string[] = [
    'Fotoğraf', 'Raf', 'Stok Kodu', 'Ürün', 'Barkod', 'Sipariş', 'Sayılan', 'Beden', 'Renk', 'Stok', 'İşlemler'
  ];
  invoiceTypes: any[] = [
    { name: 'Standart', key: 0 },
    { name: 'Vergisiz', key: 4 },

  ];
  _pageDescription: boolean = false;
  selectedInvoiceType: any;
  _visible: boolean;
  _visible2: boolean;

  items: MenuItem[] = [
    {
      label: 'Seçilenleri Topla',
      command: () => {
        this.collectSelectedProducts();
      }
    }
  ];


  showDialog() {
    this._visible = true;
  }

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
    private gs: GeneralService,
    private title: Title,
    private sanitizer: DomSanitizer,
  ) {

  }
  //#region  params
  isBPTransferForm: boolean = false;
  isInvoice: boolean = false;
  customerName: string;
  warehouseCode: string; //depokodu
  orderBillingList: OrderBillingListModel[] = [];
  itemBillingModels: ItemBillingModel[] = [];
  confirmedProductPackageNoList: string[] = [];
  modalImageUrl: string;
  formModal: any;
  currentProductModel: any;
  qrBarcodeUrl: string = null;
  qrOperationModels: QrOperationModel[] = [];
  urr: string = "https://lh3.googleusercontent.com/d/1H2pjyH0zqSbZMgw5pn1zU0DlbrgDlL5K";
  shelfNo: string;
  shelfNoList: string[] = [];
  barcodeValue: string = null; // Değişkeni tanımlayın
  productShelvesDialog: boolean = false;
  productShelves: string[] = [];
  barcodeDialog: boolean = false;
  barcode: string = null;
  quantity: number = null;
  orderNo: string;
  orderBillingModel: OrderBillingListModel;
  invoicesOfCustomer: InvoiceOfCustomer_VM[] = [];
  selectedInvoice: InvoiceOfCustomer_VM;
  qrCodeValue: string = '';
  qrCodeDownloadLink: any = this.sanitizer.bypassSecurityTrustResourceUrl('');
  visible2: boolean = false;
  visible: boolean = false;
  totalCount: number = 0;
  addedProductCount: string = '';
  lastCollectedProduct: ProductOfOrder = null;
  userType: number;
  //#endregion
  async ngOnInit() {

    //this.spinnerService.show();

    await this.activatedRoute.params.subscribe(async (params) => {
      this.formGenerator();

      var orderNumber: string = params['orderNumber'];
      if (params['isInvoice']) {
        this.isInvoice = params['isInvoice'] === "true" ? true : false;

      }
      if (params['warehouseCode']) {
        this.warehouseCode = (params['warehouseCode']);

      }

      if (orderNumber.startsWith("W-")) {
        var orderNumberType = "WT";
        this.isBPTransferForm = true;
        this.orderNo = orderNumber.split('W-')[1];

      } else {
        var orderNumberType = orderNumber.split('-')[1];
        this.currentOrderNo = params['orderNumber'];
        this.orderNo = orderNumber;
      }


      if (orderNumberType === 'BP') {
        this.userType = 0; //Perakende
        await this.getAllProducts(params['orderNumber'], 'BP'); //toplanan ve toplanacak ürünleri çeker
      } else if (orderNumberType === 'WS') {
        this.userType = 1; //Toptan
        await this.addOrderStatus();
        var response = await this.orderService.getOrderDetail(params['orderNumber']);
        this.customerName = response.description;
        await this.getAllProducts(params['orderNumber'], 'WS'); //toplanan ve toplanacak ürünleri çeker
      } else if (orderNumberType === 'WT' || orderNumber.startsWith("W-") || orderNumberType === 'S') {
        this.userType = 0; //Perakende
        if (orderNumber.startsWith("W-")) {
          this.currentOrderNo = params['orderNumber'].split('W-')[1]
          await this.getAllProducts(params['orderNumber'].split('W-')[1], 'WT'); //toplanan ve toplanacak ürünleri çeker
        } else if (orderNumberType === 'WT') {
          await this.getAllProducts(params['orderNumber'], 'WT'); //toplanan ve toplanacak ürünleri çeker
        }
        else if (orderNumberType === 'S') {
          await this.getAllProducts(params['orderNumber'], 'WT'); //toplanan ve toplanacak ürünleri çeker
        }

      } else if (orderNumber.includes("MIS")) {
        this.userType = 0; //Perakende
        orderNumberType = "MIS"
        await this.getAllProducts(params['orderNumber'], 'MIS'); //toplanan ve toplanacak ürünleri çeker
      }
      else if (orderNumber.includes("R")) {
        this.userType = 0; //Perakende
        orderNumberType = "R"
        await this.getAllProducts(params['orderNumber'], 'R'); //toplanan ve toplanacak ürünleri çeker
      }
      if (location.href.includes("MIS")) {

        this._pageDescription = true

      }
      this.setPageDescription(orderNumberType);

      console.log(orderNumberType, this.userType);
    });
  }

  async addOrderStatus() {
    var request = new OrderStatus();
    request.id = await this.gs.generateGUID();
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


  async getCollectedOrderProducts(
    orderNo: string
  ): Promise<CollectedProduct[]> {
    var response = await this.productService.getCollectedOrderProducts(orderNo);
    this.lastCollectedProducts = response;

    this.calculateTotalQty();
    return response;
  }

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


  showModal2() {
    if (this.visible2) {
      this.visible2 = false;
    } else {
      this.visible2 = true;
    }
  }

  //-----------------------------------------------------FATURA SEÇME İŞLEMLERİ

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
  setPageDescription(orderNumberType: string) {
    if (orderNumberType === 'BP') {
      this.title.setTitle('Alınan Sipariş Faturalaştır');
      this.operation = 'Toplananları Faturalaştır';
      this.pageDescription = 'Ürün Toplama Paneli';
    } else if (orderNumberType === 'WS' || orderNumberType === 'MIS' || orderNumberType === 'R') {
      this.title.setTitle('Verilen Sipariş Faturalaştır');
      this.operation = 'Toplananları Faturalaştır';

      this.pageDescription = 'Ürün Toplama Paneli';
    } else if (orderNumberType === 'WT') {
      this.title.setTitle('Transfer Detay');
      this.operation = 'Transferi Onayla';

      this.pageDescription = 'Transfer Onaylama Detay ' + this.currentOrderNo;
    } else if (orderNumberType === 'S') {
      this.title.setTitle('Mağaza Transfer Detay');
      this.operation = 'Mağaza Transferi Onayla';

      this.pageDescription = 'Transfer Onaylama Detay ' + this.currentOrderNo;
    }




    this.headerService.updatePageTitle(this.pageDescription);

  }
  async getAllProducts(orderNo: string, orderNoType: string): Promise<any> {
    if (orderNo.startsWith("W-")) {
      orderNo = orderNo.split("W-")[1]
    }
    if (this.currentOrderNo.includes('MIS-')) {
      orderNoType = 'MIS'
    }
    const productData = await this.orderService //toplanacak ürünler çekildi
      .getCollectedProducts(orderNo, orderNoType);


    if (productData.length === 0) {
      this._productsToCollect = []
      // this.toasterService.success("SAYIM TAMAMLANDI");

    }
    this.productsToCollect = productData; //toplanacak ürünler çekildi
    if (this.productsToCollect.length > 0) {
      if (this.lastCollectedProduct == null) {
        //üste atılcak ürün seçildi
        this._productsToCollect = [];
        this._productsToCollect.push(productData[0]);
        this.lastCollectedProduct = productData[0];
      } else {
        //eğer son sayılan ürün varsa toplanacak ürünlerden bul
        var foundedProduct = this.productsToCollect.find(
          (p) =>
            p.barcode == this.lastCollectedProduct.barcode &&
            p.itemCode == this.lastCollectedProduct.itemCode &&
            p.shelfNo == this.lastCollectedProduct.shelfNo
        );

        if (foundedProduct) {
          //eğer ürün bulunduysa

          if (foundedProduct.quantity > 0) {
            //miktar değeri 0 dan büyükse üste at
            this._productsToCollect = [];
            this._productsToCollect.push(foundedProduct);
            this.lastCollectedProduct = foundedProduct;
          } else {
            //miktar değeri 0 dan küçükse
            this._productsToCollect = [];
            this._productsToCollect.push(productData[0]);
            this.lastCollectedProduct = productData[0];
          }
        } else {
          //üürn bulunmdadıysa

          this._productsToCollect = [];
          this._productsToCollect.push(productData[0]);
          this.lastCollectedProduct = productData[0];
        }
      }
    }
    if (this._productsToCollect.length > 0) {
      this.checkForm.get('shelfNo').setValue(this._productsToCollect[0].shelfNo);
    }
    if (orderNoType == 'WS') {
      //sayım yapılabilcek ürünler listesine atıldı
      this.productsToCollect.forEach((e) => {
        if (e.quantity > e.currentQty) {
          var model: CreatePurchaseInvoice = new CreatePurchaseInvoice();
          model.barcode = e.barcode;
          model.quantity = e.quantity;
          model.shelfNo = e.shelfNo;
          model.photoUrl = e.photoUrl;
          this.infoProducts.push(model);
        }
      });
      this.addedProductCount = 'Sayım Paneli(' + this.infoProducts.length + ')';
    }
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
  focusNextInput(nextInputId: string) {
    const nextInput = document.getElementById(nextInputId) as HTMLInputElement;
    if (nextInput) {
      nextInput.focus();
    }
  } //general service

  deleteRow(index: number) {
    this.itemBillingModels.splice(index, 1); // İlgili satırı listeden sil
  }

  formGenerator() {
    this.checkForm = this.formBuilder.group({
      barcode: [null, Validators.required],
      shelfNo: [null, Validators.required],
      quantity: [null, Validators.required],
      batchCode: [null],
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

  async collectAndPack_WS(products: ProductOfOrder[]) {

    var _response = await this.orderService.collectAndPack(this.userType, products, this.currentOrderNo, 0);
    if (_response) {
      this.router.navigate(['/orders-managament/1/2']);
    }
  }
  async collectAndPack(products: ProductOfOrder[]) {
    //console.log(this.currentOrderNo);
    var orderType: string = "";
    if (this.currentOrderNo.includes("MIS")) {
      orderType = "MIS"
    } else if (location.href.includes("W-")) {
      orderType = "WT"
    }
    else if (location.href.includes("R-")) {
      orderType = "R"
    }

    else {
      orderType = this.currentOrderNo.split('-')[1];
    }
    if (orderType === 'BP' || orderType === 'WS' || orderType === 'MIS' || orderType === 'R') {

      if (window.confirm(
        'İşlem Nebime Aktarılacaktır.Devam Etmek istiyor musunuz?'
      )) {

        if (orderType === 'WS' || orderType === 'MIS' || orderType === 'R') {
          this.collectAndPack_WS(this.collectedProducts);
          return;

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

  async dropItem(product: ProductOfOrder) {


    if (this.gs.isNullOrEmpty(product.shelfNo)) {
      var _product = this.productsToCollect.find(p => p.shelfNo != undefined && p.shelfNo != null && p.shelfNo != "");
      var _product2 = this.lastCollectedProducts.find(p => p.shelfNo != undefined && p.shelfNo != null && p.shelfNo != "");
      if (!_product) {

        product.shelfNo = _product2.shelfNo;

      } else {
        product.shelfNo = _product.shelfNo;
      }


    }

    var response = await this.warehouseService.countProductRequest2(
      product.barcode,
      product.shelfNo,
      product.quantity,
      null,
      null,
      null,
      null,
      'Order/CountProduct',
      this.orderNo,
      null,
      product.lineId
    );
    await this.getAllProducts(this.orderNo, 'WS');
    this.toasterService.success('Ürün Toplama İşlemi Tamamlandı!');
    this.clearBarcodeAndQuantity();

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
  openImageModal(imageUrl: string) {
    this.modalImageUrl = imageUrl;
    if (!this.formModal) {
      this.formModal = new window.bootstrap.Modal(
        document.getElementById('myModal')
      );
    }
    this.formModal.show();
  }


  async setShelves(barcode: string) {

    var result: string[] = await this.productService.getShelvesOfProduct(
      barcode
    );
    this.shelfNumbers = result[0];
  }


  async setFormValues(barcode: string): Promise<CountProduct> {

    try {
      var result: string[] = await this.productService.getShelvesOfProduct(
        barcode
      );
      this.shelfNumbers = result[0];
      var currentShelfNo = this.checkForm.get('shelfNo').value;
      this.checkForm.get('barcode').setValue(result[3]);
      this.checkForm.get('batchCode').setValue(result[2]?.toString());
      this.checkForm.get('quantity').setValue(result[1]);

      var product: CountProduct = new CountProduct(result[3], currentShelfNo, result[2], Number(result[1]));
      return product;
    } catch (error) {
      this.toasterService.error(error.message);
      return null;
    }
  }

  async collectSelectedProducts() {
    for (var product of this.selectedProducts) {
      this.checkForm.reset();
      this.checkForm.get('shelfNo').setValue(product.shelfNo);
      this.checkForm.get('barcode').setValue(product.barcode);
      this.checkForm.get('quantity').setValue(product.quantity);

      await this.onSubmit(this.checkForm.value);

    }
  }
  async onSubmit(productModel: CountProduct): Promise<any> {

    if (this.productsToCollect.length <= 0) {
      this.toasterService.error("Tüm Ürünler Toplanmıştır");
      return;
    }
    var operationType = this.orderNo.split('-')[1]

    // = işareti varsa - yap
    if (productModel.barcode.includes("=")) {
      productModel.barcode = productModel.barcode.replace(/=/g, "-");

    }
    //RAF MI BARKOD MU KONTROLÜ
    var response = await this.warehouseService.countProductRequest2(
      productModel.barcode,
      productModel.shelfNo,
      productModel.quantity,
      null,
      null,
      null,
      productModel.batchCode,
      'Order/CountProductControl',
      this.orderNo,
      null,
      lineId
    );
    if (response.status == "RAF") {
      this.checkForm.reset();
      this.checkForm.get('shelfNo').setValue(productModel.barcode);
      return;
    }

    // else if (response.  status == "Error:Ürün Rafta Bulunmamaktadır") {
    //   alert("Ürün Rafta Bulunmamaktadır, Ürüne Sayım Giriniz");
    //   return;
    // }

    if (!this.checkForm.valid) {

      var updated_product = await this.setFormValues(

        productModel.barcode
      );
      productModel = updated_product;
      // this.toasterService.error(this.currentOrderNo);
      if (this.currentOrderNo.split('-')[1] === 'WS' || this.currentOrderNo.includes('MIS-') || this.currentOrderNo.includes('R-') || this.currentOrderNo.includes('S-') || this.currentOrderNo.includes('WT-')) {
        await this.onSubmit(productModel);
      }
      // this.toasterService.success("Formu Verileri Dolduruldu.")
      return;
    }

    //satış faturası alanı------------------------------------------------------------------------ WS

    if (this.currentOrderNo.split('-')[1] === 'WS' || this.currentOrderNo.includes('MIS-') || this.currentOrderNo.includes('R-')) {


      if (this.checkForm.valid) {

        if (this.gs.isNullOrEmpty(this.shelfNumbers) || this.shelfNumbers == "Raf No") {
          await this.setShelves(productModel.barcode);
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
                productModel.barcode,
                productModel.shelfNo,
                productModel.quantity,
                null,
                null,
                null,
                productModel.batchCode == "0" ? null : productModel.batchCode,
                'Order/CountProduct',
                this.orderNo,
                null,
                lineId
              );

              //↑↑↑↑↑↑↑↑↑ SAYIM YAPILDI ↑↑↑↑↑↑↑↑↑
              if (response.status.includes('Error')) {
                this.toasterService.error("Sayım Sırasında Hata Alındı : " + response.status)
                return;

              }

              await this.getAllProducts(this.orderNo, 'WS');
              this.toasterService.success('Ürün Toplama İşlemi Tamamlandı!');
              this.clearBarcodeAndQuantity();

            } else {
              this.toasterService.warn('Stok Hatası.');
            }
          } else {
            return this.toasterService.error('Rafta Ürün Bulunamamaktadır')
            // const confirmDelete = window.confirm(
            //   'Raf Numarası Eşleşmedi Yine De Eklemek İstiyor Musunuz?'
            // );

            // if (confirmDelete) {

            //   productModel.quantity =
            //     productModel.quantity;

            //   if (foundProduct.quantity - productModel.quantity >= 0) {
            //     var lineId = this.productsToCollect.find(p => p.barcode == productModel.barcode
            //     ).lineId
            //     if (!lineId) {
            //       this.toasterService.error("lineId bulunamadı")
            //     }

            //     var response = await this.warehouseService.countProductRequest2(
            //       this.checkForm.get('barcode').value,
            //       productModel.shelfNo,
            //       productModel.quantity,
            //       null,
            //       null,
            //       null,
            //       productModel.batchCode == "0" ? null : productModel.batchCode,
            //       'Order/CountProduct',
            //       this.orderNo,
            //       null,
            //       lineId
            //     );
            //     //↑↑↑↑↑↑↑↑↑ SAYIM YAPILDI ↑↑↑↑↑↑↑↑↑
            //     if (response.status.includes('Error')) {
            //       this.toasterService.error("Sayım Sırasında Hata Alındı : " + response.status)
            //       return;

            //     }

            //     await this.getAllProducts(this.orderNo, 'WS');

            //     //↑↑↑↑↑↑↑↑↑ TOPLANAN ÜRÜNLER ÇEKİLDİ ↑↑↑↑↑↑↑↑↑
            //     this.toasterService.success('Ürün Toplama İşlemi Tamamlandı!');
            //     this.clearBarcodeAndQuantity();

            //   } else {
            //     this.toasterService.warn('Stok Hatası.');
            //   }

            // } else {
            //   this.toasterService.error("Eklenmedi")
            // }
          }
        }
      }

    }
    //transfer-------------------------------------------------------------------- WT
    else if (this.currentOrderNo.split('-')[1] === 'WT' || this.isBPTransferForm === true || operationType === 'S') {
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
            model.warehouse = this.warehouseCode;

            const response = await this.warehouseService.transfer(model);
            //ZTMS RAF STOPĞA BURADA AKTARIYORZ
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
                null,
                productModel.batchCode == null ? "" : productModel.batchCode,
                'Order/CountProduct',
                this.orderNo,
                null,
                lineId
              );
              //↑↑↑↑↑↑↑↑↑ SAYIM YAPILDI ↑↑↑↑↑↑↑↑↑


              await this.getAllProducts(this.orderNo, operationType);
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
              null,
              productModel.batchCode,
              'Order/CountProduct4',
              this.orderNo,
              null,
              lineId
            );
            //↑↑↑↑↑↑↑↑↑ SAYIM YAPILDI ↑↑↑↑↑↑↑↑↑


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



  async getShelves(barcode: string) {
    var newResponse = await this.productService.getShelvesOfProduct(
      barcode
    );
    if (newResponse != null) {
      const shelves = newResponse[0]
        .split(',')
        .filter((raflar) => raflar.trim() !== '')


      this.productShelves = shelves;
      this.productShelvesDialog = true;
    } else {
      throw new Exception('Ürün Rafları Bulunamadı')
    }

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
      this.shelfNumbers = null;
      this.focusNextInput('shelfNo');
    } else {
      this.focusNextInput('barcode');

    }
    this.checkForm.get('barcode').setValue(null);
    this.shelfNumbers = null;
    this.checkForm.get('batchCode').setValue(null);
    this.checkForm.get('quantity').setValue(null);
    this.gs.beep();
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
  async deleteOrderProduct(orderNo: string, product: any): Promise<boolean> {

    if (this.currentOrderNo.includes("MIS")) {
      await this.deleteMissingProduct("MIS-" + orderNo, product.barcode);
      return true;
    }
    const confirmDelete = window.confirm(
      'Bu hareketi silmek istediğinizden emin misiniz?'
    );

    if (confirmDelete) {
      const response: boolean = await this.productService.deleteOrderProduct(
        orderNo,
        product.itemCode,
        product.id
      );
      if (response) {
        this.toasterService.success('Silme İşlemi Başarılı');
        this.gs.beep3();
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
          } else if (orderNo.split('-')[1] === 'WS' || orderNo.split('-')[1] === 'R') {
            await this.getAllProducts(orderNo, 'WS');
          } else if (orderNo.split('-')[1] === 'WT') {
            await this.getAllProducts(orderNo, 'WT');
          }
        }
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
          this._productsToCollect = [];
          this._productsToCollect.push(this.productsToCollect[index + 1]);
          this.lastCollectedProduct = this.productsToCollect[index + 1];
        } else {
          this._productsToCollect = [];
          this._productsToCollect.push(this.productsToCollect[0]);
        }
        // this.productsToCollect.splice(index, 1);
        this.checkForm.get('shelfNo').setValue(this.lastCollectedProduct.shelfNo) //14.08

        // // Ürünü dizinin sonuna ekleyin
        // this.productsToCollect.push(matchingProduct);
      }
    }
  }
  setToTop(barcode: string, shelfNo: string, itemCode: string) {
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
        if (this.productsToCollect.length - 1 <= this.productsToCollect.length - 1) {
          this._productsToCollect = [];
          this._productsToCollect.push(this.productsToCollect[index]);
          this.lastCollectedProduct = this.productsToCollect[index];
        }
        this.checkForm.get('shelfNo').setValue(this.lastCollectedProduct.shelfNo) //14.08


      }
    }
  }
  //--------------

  change(barcode: string, quantity: number) {
    this.barcodeDialog = !this.barcodeDialog;
    this.barcode = barcode;
    this.quantity = quantity
  }
  //--------------
}
