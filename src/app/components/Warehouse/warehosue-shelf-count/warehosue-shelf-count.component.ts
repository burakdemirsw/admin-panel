import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer, SafeUrl, Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Exception } from '@zxing/library';
import { ClientUrls } from 'src/app/models/const/ClientUrls';
import { QrOperationResponseModel } from 'src/app/models/model/client/qrOperationResponseModel';
import { CreatePurchaseInvoice } from 'src/app/models/model/invoice/createPurchaseInvoice';
import { CountProductRequestModel2 } from 'src/app/models/model/order/countProductRequestModel2';
import { OrderBillingListModel } from 'src/app/models/model/order/orderBillingListModel';
import { OrderStatus } from 'src/app/models/model/order/orderStatus';
import { ProductOfOrder } from 'src/app/models/model/order/productOfOrders';
import { CountProduct3 } from 'src/app/models/model/product/countProduct';
import { CountedProductControl } from 'src/app/models/model/product/countedProduct';
import { ItemBillingModel } from 'src/app/models/model/product/itemBillingModel ';
import { QrOperationModel } from 'src/app/models/model/product/qrOperationModel';
import {
  ProductCountModel,
} from 'src/app/models/model/shelfNameModel';
import { AvailableShelf } from 'src/app/models/model/warehouse/availableShelf';
import { CompleteCountOperation_CM } from 'src/app/models/model/warehouse/completeCount_CM';
import { WarehouseOfficeModel } from 'src/app/models/model/warehouse/warehouseOfficeModel';
import { ZTMSG_CountedProduct } from 'src/app/models/model/warehouse/ztmsg_CountedProduct';
import { GeneralService } from 'src/app/services/admin/general.service';
import { HeaderService } from 'src/app/services/admin/header.service';
import { OrderService } from 'src/app/services/admin/order.service';
import { ProductService } from 'src/app/services/admin/product.service';
import { WarehouseService } from 'src/app/services/admin/warehouse.service';
import { ToasterService } from 'src/app/services/ui/toaster.service';
import { ZTMSG_ProductOnShelf } from '../../../models/model/warehouse/ztmsg_CountedProduct';
declare var window: any;
@Component({
  selector: 'app-warehosue-shelf-count',
  templateUrl: './warehosue-shelf-count.component.html',
  styleUrls: ['./warehosue-shelf-count.component.css'],
})
export class WarehosueShelfCountComponent implements OnInit {
  @Input() infoProducts: CreatePurchaseInvoice[] = [];
  @Input() isChild: boolean = false;

  countType: string;
  visible: boolean = false;
  _visible: boolean = false;
  barcode: string = null;
  quantity: number = null;
  batchCode: string = null;
  shelfNumbers: string = 'RAFLAR:';
  location = location.href;
  photoUrl: string = ClientUrls.photoUrl;
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
  offices: any[] = ["M", "U"]
  warehouses: any[] = ["MD", "UD"]
  shelves: AvailableShelf[] = [];
  shelves2: AvailableShelf[] = [];
  orderBillingList: OrderBillingListModel[] = [];
  itemBillingModels: ItemBillingModel[] = [];
  orderNo: string = '';
  warehouseModels: WarehouseOfficeModel[] = [];
  warehouseModels2: WarehouseOfficeModel[] = [];
  currentQrCode: string = '';
  orderBillingModel: OrderBillingListModel;
  list: CountProductRequestModel2[] = [];
  totalCount: number = 0;
  currentPage: number = 1;
  state: boolean = true;
  qrBarcodeUrl: string = null;
  qrOperationModels: QrOperationModel[] = [];
  isFirstBarcode: boolean = false;
  currentbarcode: string;
  barcodeList: string[] = [];
  countedProductControl: CountedProductControl[] = [];
  controlMessage = ""
  upPageDescription: string;
  tableHeaders: string[] = [
    'Fotoğraf',
    'Raf',
    'Ürün Kodu',
    'Miktar',
    'Parti',
    'Barkod',
    'Müşteri Kodu',
    'Depo',
    'Ofis',
  ];
  _tableHeaders: string[] = [
    'Resim',
    'Raf',
    'Ürün Kodu',
    'Miktar',
    'Parti',
    'Barkod',
    'İşlem',
  ];
  _tableHeaders2: string[] = [
    'Ürün Kodu',
    'Durum',
  ];
  _tableHeaders3: string[] = [
    'Resim',
    'Raf',
    'Ürün Kodu',
    'Eklenen Miktar',
    'Çıkarılan Miktar',
    'Parti',
    'Barkod',
    'İşlem',
  ];
  constructor(
    private formBuilder: FormBuilder,
    private toasterService: ToasterService,
    private httpClient: HttpClient,
    private productService: ProductService,
    private generalService: GeneralService,
    private warehouseService: WarehouseService,
    private activatedRoute: ActivatedRoute,
    private title: Title,
    private sanitizer: DomSanitizer,
    private orderService: OrderService,
    private router: Router,
    private headerService: HeaderService
  ) {

  }


  async ngOnInit() {
    this.formGenerator();
    this.activatedRoute.params.subscribe(async (params) => {
      this.countType = params['type'];

      this.currentOrderNo = params['orderNo'];
      await this.addOperationStatus();
      await this.getProductOfCount(this.currentOrderNo);
      // if (this.countType == "count") {

      // } else if (this.countType == "add-product-to-shelf") {

      // }
      // else if (this.countType == "remove-product-to-shelf") {

      // }

      if (!this.isChild) {
        this.setTitle();
      }
    });

  }

  setTitle() {

    if (this.countType == "count") {

      this.headerService.updatePageTitle('Sayım');
      this.upPageDescription = "Sayım"
    } else if (this.countType == "add-product-to-shelf") {
      this.headerService.updatePageTitle('Rafa Ürün Ekle');
      this.upPageDescription = "Rafa Ürün Ekle"
    }
    else if (this.countType == "remove-product-to-shelf") {
      this.headerService.updatePageTitle('Rafdan Ürün Çıkar');
      this.upPageDescription = "Rafdan Ürün Çıkar"
    }



  }
  change(barcode: string, quantity: number, batchCode: string) {
    this.visible = !this.visible;
    this.barcode = barcode;
    this.quantity = quantity;
    this.batchCode = batchCode;
  }

  ngOnDestroy() {
    if (this.location.includes("warehouse-shelf-count")) {
      if (!window.confirm("Sayfadan Ayrılıyorsunuz. Emin Misiniz?")) {
        this.toasterService.error(this.location + " İşlemi İptal Edildi")
        location.href = this.location;
        return;
      } else {
        return; // İşlemi iptal et
      }
    }
  }
  getProductPhoto(itemCode: string) {
    return ClientUrls.photoUrl + itemCode + ".jpg";
  }

  async addOperationStatus() {
    var request = new OrderStatus();
    request.id = await this.generalService.generateGUID();
    request.orderNo = this.currentOrderNo;
    request.status = 'Toplanıyor';
    request.warehousePerson = localStorage.getItem('name') + ' ' + localStorage.getItem('surname');
    request.createdDate = new Date();
    const response = await this.orderService.addOrderStatus(request);
    if (response) {
      this.toasterService.success('Durum Güncellendi');
    } else {
      this.toasterService.error('Durum Güncellenemedi');
    }
  }


  createJson(barcode: string, shelfNo: string, batchCode: string) {
    var model: ZTMSG_CountedProduct = this.lastCollectedProducts.find(
      (p) =>
        (p.barcode = barcode) &&
        p.shelfNo == shelfNo &&
        p.batchCode == batchCode
    );
    const formDataJSON = JSON.stringify(model); // Form verilerini JSON'a dönüştür

    this.qrCodeValue = formDataJSON;
    // this.toasterService.success(this.qrCodeValue)
  }
  async getAvailableShelves() {
    this.shelves = await this.warehouseService.getAvailableShelves();
    this.shelves2.push(this.shelves[0]);
  }

  goDown2(desc: string) {
    // packageNo'ya eşleşen ProductOfOrder'ı bulun
    const matchinShelf = this.shelves.find(
      (shelve) => shelve.description === desc
    );

    if (matchinShelf) {
      // Ürünü diziden çıkarın
      const index = this.shelves.indexOf(matchinShelf);
      if (index !== -1) {
        this.shelves2 = [];
        if (this.shelves.length - 1 >= index + 1) {
          this.shelves2.push(this.shelves[index + 1]);
        } else {
          this.shelves2.push(this.shelves[0]);
        }
      }
    }
  }

  onChangeURL(url: SafeUrl) {
    this.qrCodeDownloadLink = url;
    this.openImageModal(this.qrCodeDownloadLink);
    this.qrCodeValue = '';
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


  deleteRow(index: number) {
    this.itemBillingModels.splice(index, 1); // İlgili satırı listeden sil
  }

  formGenerator() {
    this.checkForm = this.formBuilder.group({
      barcode: [null, Validators.required],
      shelfNo: [null, Validators.required],
      quantity: [null, Validators.required],
      office: [null, Validators.required],
      batchCode: [null, Validators.required],
      warehouseCode: [null, Validators.required],
      isShelfBased: [false],
      isShelfBased2: [true]
    });


    this.checkForm.get('office').valueChanges.subscribe(value => {
      if (value === 'M') {
        this.checkForm.get('warehouseCode').setValue('MD');
      }
    });

    this.checkForm.get('office').valueChanges.subscribe(value => {
      if (value === 'U') {
        this.checkForm.get('warehouseCode').setValue('UD');
      }
    });
    this.checkForm.get('isShelfBased').valueChanges.subscribe(value => {
      this.checkForm.get('isShelfBased2').setValue(!value);
    });

    this.checkForm.get('isShelfBased2').valueChanges.subscribe(value => {
      this.checkForm.get('isShelfBased').setValue(!value);
    });

  }


  calculateTotalQty() {
    //toplanan ürünler yazısı için
    let totalQty = 0;
    this.lastCollectedProducts.forEach((item) => {
      totalQty += item.quantity;
    });
    this.totalCount = totalQty;
  }
  lastCollectedProducts: ZTMSG_CountedProduct[] = [];
  lastCollectedProducts2: ZTMSG_ProductOnShelf[] = [];

  async getProductOfCount(orderNo: string): Promise<any> {
    this.toasterService.error(this.countType);
    if (this.countType === "count") {
      this.lastCollectedProducts = await this.warehouseService.getCountsOfOperation(
        orderNo
      );
      if (this.lastCollectedProducts.length > 0) {
        this.setOfficeAndWarehouse(this.lastCollectedProducts[0].warehouseCode);
      }
    } else {
      this.lastCollectedProducts2 = await this.warehouseService.getProductOnShelf(orderNo);
    }



    this.calculateTotalQty();
  }

  setOfficeAndWarehouse(warehouseCode: string) {
    if (warehouseCode == 'MD') {
      this.checkForm.get('office').setValue('M');
      this.checkForm.get('warehouseCode').setValue('MD');
    } else {
      this.checkForm.get('office').setValue('U');
      this.checkForm.get('warehouseCode').setValue('UD');
    }
  }
  async countProductRequest(
    barcode: string,
    shelfNo: string,
    quantity: number,
    office: string,
    warehouseCode: string,
    batchCode: string,

    url: string
  ): Promise<ProductCountModel> {
    var requestModel: CountProductRequestModel2 =
      new CountProductRequestModel2();
    requestModel.barcode = barcode;
    requestModel.shelfNo = shelfNo;
    requestModel.quantity = quantity == null ? 1 : quantity;
    requestModel.office = office;
    requestModel.warehouseCode = warehouseCode;
    requestModel.batchCode = batchCode;

    var response = await this.httpClient
      .post<ProductCountModel | undefined>(url, requestModel)
      .toPromise();

    return response;
  }

  async setFormValues(product: CountProduct3): Promise<CountProduct3> {

    try {
      var state = this.generalService.isGuid(product.barcode);
      if (product.barcode.includes('http') || state) {
        var result: string[] = await this.productService.countProductByBarcode3(
          product.barcode
        );
        if (result) {
          this.shelfNumbers = result[0];
          this.checkForm.get('batchCode').setValue(result[2]);
          this.checkForm.get('barcode').setValue(result[3]);
          if (this.generalService.isNullOrEmpty(product.quantity?.toString())) {
            this.checkForm.get('quantity').setValue(Number(result[1]));
          }


          var updated_product: CountProduct3 = product;
          updated_product.quantity = this.checkForm.get('quantity').value;
          updated_product.batchCode = result[2];
          updated_product.barcode = result[3];
          return updated_product;
        } else {
          throw new Exception('setFormValues error');
        }

      } else {
        var result: string[] = await this.productService.countProductByBarcode(
          product.barcode
        );
        this.shelfNumbers = result[0];
        this.checkForm.get('batchCode').setValue(result[2]);
        this.checkForm.get('barcode').setValue(result[3]);
        if (this.generalService.isNullOrEmpty(product.quantity?.toString())) {
          this.checkForm.get('quantity').setValue(Number(result[1]));
        }

        if (result[4] == 'false' && product.barcode.length > 13) {

          if (!window.confirm('Parti Hatalı Devam Edilsin Mi?')) {
            this.checkForm.get('batchCode').setValue(null);
            this.focusNextInput('batchCode');
            this.toasterService.error('Parti Giriniz');
            return null;
          }
        }
        var updated_product: CountProduct3 = product;


        updated_product.quantity = this.checkForm.get('quantity').value;
        updated_product.batchCode = result[2];
        updated_product.barcode = result[3];
        return updated_product;
      }
    } catch (error) {
      this.toasterService.error(error.message);
      return null;
    }
  }

  async getQuantity(barcode: string): Promise<string> {
    var result: string[] = await this.productService.countProductByBarcode( //
      barcode
    );

    return result[1];
  }

  manageOnSubmit(countProductRequestModel: CountProduct3) {
    if (this.countType == "count") {
      this.onSubmit(countProductRequestModel);
    } else {
      if (this.countType == "add-product-to-shelf") {
        this.onSubmit2(countProductRequestModel, true);
      }
      else if (this.countType == "remove-product-to-shelf") {
        this.onSubmit2(countProductRequestModel, false);
      }
    }
  }
  async onSubmit(
    countProductRequestModel: CountProduct3
  ): Promise<any> {

    // EĞER BARKODTA = VARSA - İLE DEĞİŞTİR
    if (countProductRequestModel.barcode.includes('=')) {
      countProductRequestModel.barcode = countProductRequestModel.barcode.replace(/=/g, '-');
    }
    // http ile başlıyorsa veya guid ise qr işlemi yap
    if (
      countProductRequestModel.barcode.includes('http') ||
      this.generalService.isGuid(countProductRequestModel.barcode)
    ) {
      countProductRequestModel.barcode = countProductRequestModel.barcode.replace("Http", "http");
      this.qrBarcodeUrl = countProductRequestModel.barcode;
    }

    if (
      !this.checkForm.valid
    ) {
      var updated_product = await this.setFormValues(

        countProductRequestModel
      );
      countProductRequestModel = updated_product;
      if (this.checkForm.valid) {
        this.onSubmit(countProductRequestModel);
      }
      this.toasterService.success("Form Verileri Güncellendi")
      return;
    }


    if (this.checkForm.valid) {
      const url = ClientUrls.baseUrl + '/Order/CountProduct3';

      try {

        if (this.generalService.isNullOrEmpty(this.shelfNumbers)) {

          var result: string[] = await this.productService.countProductByBarcode(
            countProductRequestModel.barcode
          );

          this.shelfNumbers = result[0]
        }
        const shelves = this.shelfNumbers
          .split(',')
          .filter((raflar) => raflar.trim() !== '')
          .map((raflar) => raflar.toLowerCase());
        if (this.state) {
          this.state = false;

          // EĞER GİRİLEN RAF  RAFLARDA VARSA DİREKT SAYAR
          if (
            shelves.includes(countProductRequestModel.shelfNo.toLowerCase())
          ) {

            var request: ZTMSG_CountedProduct = new ZTMSG_CountedProduct();
            request.barcode = countProductRequestModel.barcode;
            request.shelfNo = countProductRequestModel.shelfNo;
            request.quantity = countProductRequestModel.quantity;
            request.officeCode = countProductRequestModel.office;
            request.warehouseCode = countProductRequestModel.warehouseCode;
            request.batchCode = countProductRequestModel.batchCode;
            request.operationNumber = this.currentOrderNo;
            request.isCompleted = false;
            request.operationType = this.checkForm.get("isShelfBased").value == true ? this.checkForm.get("isShelfBased").value : this.checkForm.get("isShelfBased2").value

            var _response = await this.warehouseService.addCount(request);

            if (_response != undefined) {

              var qrResponse: QrOperationResponseModel =
                await this.productService.qrOperationMethod(
                  this.qrBarcodeUrl,
                  this.checkForm,
                  countProductRequestModel,
                  countProductRequestModel.quantity,
                  false,
                  'CO'
                );
              if (qrResponse != null && qrResponse.state === true) {
                this.qrOperationModels.push(qrResponse.qrOperationModel);
              } else if (qrResponse === null) {
                this.qrBarcodeUrl = null
              }
              // QR İŞLEMLERİ YAPILDI -------------------------------------------
              this.generalService.beep();
              await this.getProductOfCount(this.currentOrderNo); //this.list.push(countProductRequestModel);
              this.clearQrAndBatchCode();
              this.state = true;
            }
          }
          // EĞER GİRİLEN RAF  RAFLARDA YOKSA SORAR
          else {
            if (
              confirm(
                'Raf Bulunamadı! Raf Barkod Doğrulaması Yapılmadan Eklensin mi(2)?'
              )
            ) {



              var request: ZTMSG_CountedProduct = new ZTMSG_CountedProduct();
              request.barcode = countProductRequestModel.barcode;
              request.shelfNo = countProductRequestModel.shelfNo;
              request.quantity = countProductRequestModel.quantity;
              request.officeCode = countProductRequestModel.office;
              request.warehouseCode = countProductRequestModel.warehouseCode;
              request.batchCode = countProductRequestModel.batchCode;
              request.operationNumber = this.currentOrderNo;
              request.isCompleted = false;
              request.operationType = this.checkForm.get("isShelfBased").value == true ? this.checkForm.get("isShelfBased").value : this.checkForm.get("isShelfBased2").value

              var _response = await this.warehouseService.addCount(request);
              // SAYIM YAPILDI -------------------------------------------


              if (_response != undefined) {

                var qrResponse: QrOperationResponseModel =
                  await this.productService.qrOperationMethod(
                    this.qrBarcodeUrl,
                    this.checkForm,
                    countProductRequestModel,
                    countProductRequestModel.quantity,
                    false,
                    'CO'
                  );
                if (qrResponse != null && qrResponse.state === true) {
                  this.qrOperationModels.push(qrResponse.qrOperationModel);
                } else if (qrResponse === null) {
                  this.qrBarcodeUrl = null
                }
                // QR İŞLEMLERİ YAPILDI -------------------------------------------


                this.generalService.beep();

                await this.getProductOfCount(this.currentOrderNo); //this.list.push(countProductRequestModel);

                this.clearQrAndBatchCode();
                this.state = true;
              }
            } else {

              this.toasterService.success(
                'Raflar Getirildi Ve Miktar Alanı Dolduruldu.'
              );
              this.state = true;
            }
          }
        }
      } catch (error: any) {
        this.toasterService.error(error.message);
        this.state = true;
      }
    }
  }
  async onSubmit2(
    countProductRequestModel: CountProduct3, isInQty: boolean
  ): Promise<any> {

    // EĞER BARKODTA = VARSA - İLE DEĞİŞTİR
    if (countProductRequestModel.barcode.includes('=')) {
      countProductRequestModel.barcode = countProductRequestModel.barcode.replace(/=/g, '-');
    }
    // http ile başlıyorsa veya guid ise qr işlemi yap
    if (
      countProductRequestModel.barcode.includes('http') ||
      this.generalService.isGuid(countProductRequestModel.barcode)
    ) {
      countProductRequestModel.barcode = countProductRequestModel.barcode.replace("Http", "http");
      this.qrBarcodeUrl = countProductRequestModel.barcode;
    }

    if (
      !this.checkForm.valid
    ) {
      var updated_product = await this.setFormValues(

        countProductRequestModel
      );
      countProductRequestModel = updated_product;
      if (this.checkForm.valid) {
        this.onSubmit2(countProductRequestModel, isInQty);
      }
      this.toasterService.success("Form Verileri Güncellendi")
      return;
    }


    if (this.checkForm.valid) {
      try {

        if (this.generalService.isNullOrEmpty(this.shelfNumbers)) {

          var result: string[] = await this.productService.countProductByBarcode(
            countProductRequestModel.barcode
          );

          this.shelfNumbers = result[0]
        }
        const shelves = this.shelfNumbers
          .split(',')
          .filter((raflar) => raflar.trim() !== '')
          .map((raflar) => raflar.toLowerCase());
        if (this.state) {
          this.state = false;

          // EĞER GİRİLEN RAF  RAFLARDA VARSA DİREKT SAYAR
          if (
            shelves.includes(countProductRequestModel.shelfNo.toLowerCase())
          ) {

            var request: ZTMSG_ProductOnShelf = new ZTMSG_ProductOnShelf();
            request.barcode = countProductRequestModel.barcode;
            request.shelfNo = countProductRequestModel.shelfNo;
            request.in_Quantity = isInQty == true ? countProductRequestModel.quantity : 0;
            request.out_Quantity = isInQty == false ? countProductRequestModel.quantity : 0;
            request.warehouseCode = countProductRequestModel.warehouseCode;
            request.batchCode = countProductRequestModel.batchCode;
            request.operationNumber = this.currentOrderNo;

            var _response = await this.warehouseService.addProductOnShelf(request);

            if (_response != undefined) {

              var qrResponse: QrOperationResponseModel =
                await this.productService.qrOperationMethod(
                  this.qrBarcodeUrl,
                  this.checkForm,
                  countProductRequestModel,
                  countProductRequestModel.quantity,
                  false,
                  'CO'
                );
              if (qrResponse != null && qrResponse.state === true) {
                this.qrOperationModels.push(qrResponse.qrOperationModel);
              } else if (qrResponse === null) {
                this.qrBarcodeUrl = null
              }
              // QR İŞLEMLERİ YAPILDI -------------------------------------------
              this.generalService.beep();
              await this.getProductOfCount(this.currentOrderNo); //this.list.push(countProductRequestModel);
              this.clearQrAndBatchCode();
              this.state = true;
            }
          }
          // EĞER GİRİLEN RAF  RAFLARDA YOKSA SORAR
          else {
            if (
              confirm(
                'Raf Bulunamadı! Raf Barkod Doğrulaması Yapılmadan Eklensin mi(2)?'
              )
            ) {



              var request: ZTMSG_ProductOnShelf = new ZTMSG_ProductOnShelf();
              request.barcode = countProductRequestModel.barcode;
              request.shelfNo = countProductRequestModel.shelfNo;
              request.in_Quantity = isInQty == true ? countProductRequestModel.quantity : 0;
              request.out_Quantity = isInQty == false ? countProductRequestModel.quantity : 0;
              request.warehouseCode = countProductRequestModel.warehouseCode;
              request.batchCode = countProductRequestModel.batchCode;
              request.operationNumber = this.currentOrderNo;

              var _response = await this.warehouseService.addProductOnShelf(request);
              // SAYIM YAPILDI -------------------------------------------


              if (_response != undefined) {

                var qrResponse: QrOperationResponseModel =
                  await this.productService.qrOperationMethod(
                    this.qrBarcodeUrl,
                    this.checkForm,
                    countProductRequestModel,
                    countProductRequestModel.quantity,
                    false,
                    'CO'
                  );
                if (qrResponse != null && qrResponse.state === true) {
                  this.qrOperationModels.push(qrResponse.qrOperationModel);
                } else if (qrResponse === null) {
                  this.qrBarcodeUrl = null
                }
                // QR İŞLEMLERİ YAPILDI -------------------------------------------


                this.generalService.beep();

                await this.getProductOfCount(this.currentOrderNo); //this.list.push(countProductRequestModel);

                this.clearQrAndBatchCode();
                this.state = true;
              }
            } else {

              this.toasterService.success(
                'Raflar Getirildi Ve Miktar Alanı Dolduruldu.'
              );
              this.state = true;
            }
          }
        }
      } catch (error: any) {
        this.toasterService.error(error.message);
        this.state = true;
      }
    }
  }



  clearShelfNumbers() {
    this.checkForm.get('shelfNo').setValue(null);
    this.checkForm.get('barcode').setValue(null);
    this.focusNextInput('shelfNo');
    this.shelfNumbers = 'Raf No';
    this.qrBarcodeUrl = null;
    this.checkForm.get('quantity').setValue(null);
    this.checkForm.get('batchCode').setValue(null);
  }
  clearQrAndBatchCode() {
    this.checkForm.get('barcode').setValue(null);
    this.checkForm.get('batchCode').setValue(null);
    this.checkForm.get('quantity').setValue(null);
    this.focusNextInput('countPageBarcode');
    this.shelfNumbers = null
    this.qrBarcodeUrl = null;
    this.calculateTotalQty();
  }

  async completeCountFromService(orderNo: string): Promise<boolean> {

    if (this.countType == "count") {
      try {


        var isShelfBased = this.checkForm.get("isShelfBased");
        var isShelfBased2 = this.checkForm.get("isShelfBased2");
        if (isShelfBased.value === false && isShelfBased2.value === false) {
          this.toasterService.error("Lütfen bir sayım tipi seçiniz")

          return false;

        }
        if (isShelfBased.value === true && isShelfBased2.value === true) {
          isShelfBased.setValue(false);
          isShelfBased2.setValue(false);

          this.toasterService.error("Sadece bir sayım tipi seçilmelidir")
          return false;

        }
        var request: CompleteCountOperation_CM
        request = new CompleteCountOperation_CM();
        request.countType = isShelfBased.value === true ? 0 : 1; //0-> raf bazında dayım | 1-> ürün bazında ürün sayım
        request.operationNo = this.currentOrderNo;
        const response = await this.warehouseService.completeCountOperation(request)

        if (response === true) {
          this.toasterService.success('İşlem Başarılı');
          this.router.navigate(['/warehouse-shelf-count-list']);
          return true;
        } else {
          this.toasterService.error('İşlem Başarısız');
          return false;
        }
      } catch (error: any) {
        this.toasterService.error('İşlem Başarısız');
        return false;
      }
    } else {
      this.toasterService.success('İşlem Başarılı');
      this.router.navigate(['/warehouse-shelf-count-list']);
      return true;
    }

  }


  async getControlledProducts() {
    this.countedProductControl = await this.warehouseService.getProductOfCountControl(this.currentOrderNo);
    if (this.collectedProducts.length > 0) {
      this.controlMessage = "Aşağıdaki Ürünlerin Sayımı BAŞARISIZDIR.Lütfen Ürünlerin Parti /  Barkodunu Kontrol Ediniz."

    } else {
      this.controlMessage = "Sayım Başarılıdır"

    }
    this._visible = true;
  }
  async deleteOrderProduct(orderNo: string, product: any): Promise<boolean> {


    const confirmDelete = window.confirm(
      'Bu hareketi silmek istediğinizden emin misiniz?'
    );

    if (confirmDelete) {
      if (this.countType == "count") {
        const response: boolean = await this.warehouseService.deleteCount(
          product
        );

        if (response) {

          this.calculateTotalQty();
          await this.getProductOfCount(this.currentOrderNo);
          this.toasterService.success('Silme İşlemi Başarılı.');
        } else {
          this.toasterService.error('Silme İşlemi Başarısız.');
        }
        return response;
      } else {
        const response: boolean = await this.warehouseService.deleteProductOnShelf(
          product.id
        );

        if (response) {

          this.calculateTotalQty();
          await this.getProductOfCount(this.currentOrderNo);
          this.toasterService.success('Silme İşlemi Başarılı.');
        } else {
          this.toasterService.error('Silme İşlemi Başarısız.');
        }
        return response;
      }



    } else {
      return false;
    }

  }


}
