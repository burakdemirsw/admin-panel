import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Router, ActivatedRoute } from '@angular/router';
import { BrowserMultiFormatReader } from '@zxing/library';
import { NgxSpinnerService } from 'ngx-spinner';
import { ClientUrls } from 'src/app/models/const/ClientUrls';
import { QrOperationResponseModel } from 'src/app/models/model/client/qrOperationResponseModel';
import { CountProductRequestModel } from 'src/app/models/model/order/countProductRequestModel';
import { OrderBillingListModel } from 'src/app/models/model/order/orderBillingListModel';
import { ProductOfOrder } from 'src/app/models/model/order/productOfOrders';
import { CollectedProduct } from 'src/app/models/model/product/collectedProduct';
import { ItemBillingModel } from 'src/app/models/model/product/itemBillingModel ';
import { QrOperationModel } from 'src/app/models/model/product/qrOperationModel';
import {
  ProductCountModel
} from 'src/app/models/model/shelfNameModel';
import { FastTransferModel } from 'src/app/models/model/warehouse/fastTransferModel';
import { TransferRequestListModel } from 'src/app/models/model/warehouse/transferRequestListModel';
import { WarehouseOfficeModel } from 'src/app/models/model/warehouse/warehouseOfficeModel';
import { GeneralService } from 'src/app/services/admin/general.service';
import { HeaderService } from 'src/app/services/admin/header.service';
import { OrderService } from 'src/app/services/admin/order.service';
import { ProductService } from 'src/app/services/admin/product.service';
import { WarehouseService } from 'src/app/services/admin/warehouse.service';
import { HttpClientService } from 'src/app/services/http-client.service';
import { ToasterService } from 'src/app/services/ui/toaster.service';
declare var window: any;
@Component({
  selector: 'app-shelf-transfer-request',
  templateUrl: './shelf-transfer-request.component.html',
  styleUrls: ['./shelf-transfer-request.component.css'],
})
export class ShelfTransferRequestComponent implements OnInit {
  lastCollectedProducts: CollectedProduct[] = [];
  productsToCollect: FastTransferModel[];
  collectedProducts: FastTransferModel[] = [];
  process: boolean = false;
  checkForm: FormGroup;
  activeTab: number = 1;
  // warehouseModels: WarehouseOperationDetailModel[] = [];
  pageDescription: string = null;
  shelfNumbers: string = 'RAFLAR:';

  currentOrderNo: string;
  private codeReader: BrowserMultiFormatReader;

  constructor(
    private formBuilder: FormBuilder,
    private toasterService: ToasterService,
    private orderService: OrderService,
    private router: Router,
    private httpClient: HttpClient,
    private activatedRoute: ActivatedRoute,
    private productService: ProductService,
    private warehouseService: WarehouseService,
    private generalService: GeneralService,
    private httpClientService: HttpClientService,
    private title: Title,
    private headerService: HeaderService
  ) {
    this.codeReader = new BrowserMultiFormatReader();
  }
  orderNo: string;
  orderBillingModel: OrderBillingListModel;
  url2: string = ClientUrls.baseUrl + '/Order/CountTransferProductPuschase';
  totalCount: number = 0;
  orderBillingList: OrderBillingListModel[] = [];
  itemBillingModels: ItemBillingModel[] = [];
  modalImageUrl: string;
  formModal: any;
  warehouseModels: WarehouseOfficeModel[] = [];
  shelfNo: string;
  shelfNoList: string[] = [];
  barcodeValue: string = null; // Değişkeni tanımlayın
  currentPage: number = 1;
  transferProducts: TransferRequestListModel[] = [];
  _transferProducts: TransferRequestListModel[] = [];
  lastCollectedProduct: TransferRequestListModel = null;

  transferProductsColums: string[] = [
    'Id',
    'Stok Kodu',
    'Raf',
    'Transfer Miktarı',
    'Hedef Raf',
    'Miktar',
    'Barkod',
    'Çekmece Adedi',
    'İşlemler'

  ];
  _transferProductsColums: string[] = [
    'Id',
    'Stok Kodu',
    'Raf',
    'Transfer Miktarı',
    'Hedef Raf',
    'Miktar',
    'Barkod',
    'Çekmece Adedi',
    'İşlem'

  ];
  currentPageType: string;
  async ngOnInit() {


    this.title.setTitle('Raflar Arası Transfer İstek');
    this.headerService.updatePageTitle('Raflar Arası Transfer İstek');
    //this.spinnerService.show();
    this.formGenerator();
    this.currentOrderNo = (await this.generalService.generateGUID()).toString();
    this.activatedRoute.params.subscribe(async (params) => {
      if (params["type"]) {
        await this.getTransferRequestListModel(params["type"]);
      }

    });

    this.collectedProducts = [];
    //this.spinnerService.hide();
  }

  offices: any[] = ["M", "U"]

  warehouses: any[] = ["MD", "UD"]


  goPage(pageType: string) {
    location.href = location.origin + "/shelf-transfer-request/" + pageType;
  }
  //-------------------
  async getShelves(barcode: string) {
    var newResponse = await this.productService.countProductByBarcode(
      barcode
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
  productShelvesDialog: boolean = false;
  productShelves: string[] = [];
  //-------------------
  goDown2(barcode: string, shelfNo: string, itemCode: string, transferQuantity: number) {
    // packageNo'ya eşleşen ProductOfOrder'ı bulun
    const matchingProduct = this.transferProducts.find(
      (product) =>
        product.barcode === barcode &&
        product.shelfNo == shelfNo &&
        product.itemCode == itemCode &&
        product.transferQuantity == transferQuantity
    );

    if (matchingProduct) {
      // Ürünü diziden çıkarın
      const index = this.transferProducts.indexOf(matchingProduct);
      if (index !== -1) {
        if (this.transferProducts.length - 1 >= index + 1) {
          this._transferProducts = [];
          this._transferProducts.push(this.transferProducts[index + 1]);
          this.lastCollectedProduct = this.transferProducts[index + 1];
        } else {
          this._transferProducts = [];
          this._transferProducts.push(this.transferProducts[0]);
        }
      }
    }
  }


  async onDataChange(type: string) {
    this.transferProducts = [];
    await this.getTransferRequestListModel(type);
  }

  deletedProductList: TransferRequestListModel[] = [];
  async addDeletedItemList(item: TransferRequestListModel) {
    this.deletedProductList.push(item);
    await this.getTransferRequestListModel(this.selectedButton.toString());
    this.toasterService.info("Ürün Transfer Edilecek Ürünlerden Silindi")
  }


  selectedButton: number = 0;
  async getTransferRequestListModel(type: string) {
    const response = await this.warehouseService.getTransferRequestListModel(type);
    this.selectedButton = Number(type);
    console.log(type)
    if (type === '0') {
      this.toasterService.success("Varsayılan Ürünler Getirildi")
    } else if (type === '1') {
      this.toasterService.success("Raflar Fullendi")

    } else if (type === '2') {
      this.toasterService.success("Çanta Ürünleri Getirildi")

    }
    this.transferProducts = response;

    if (this.deletedProductList.length > 0) {
      this.deletedProductList.forEach((deletedItem) => {

        this.transferProducts.forEach((inventoryItem, _index) => {


          if (inventoryItem.barcode === deletedItem.barcode &&
            inventoryItem.shelfNo === deletedItem.shelfNo &&
            inventoryItem.itemCode === deletedItem.itemCode) {
            this.transferProducts.splice(_index, 1);
          }


        });

      });
    }




    // İşlem sonrası çıkarılacak öğelerin indekslerini tutacak dizi
    let itemsToRemoveIndexes: number[] = [];

    //console.log(this.collectedProducts);
    //console.log(this.transferProducts);
    // inventoryItems üzerinde döngü
    this.transferProducts.forEach((inventoryItem, index) => { //transfer edilcek ürünler
      // Eşleşme arama ve güncelleme
      this.collectedProducts.forEach((transferItem) => { //toplanan ürünler
        // barcode, shelfNo ve itemCode değerlerine göre eşleşme kontrolü
        if (inventoryItem.barcode === transferItem.barcode &&
          inventoryItem.targetShelf === transferItem.targetShelfNo &&
          inventoryItem.shelfNo === transferItem.shelfNo) {

          // Eşleşen üründen quantity değerini çıkart
          inventoryItem.transferQuantity -= transferItem.quantity;

          // Eğer transfer edilen miktar sonucunda quantity 0 veya daha az ise
          if (inventoryItem.transferQuantity <= 0) {
            // İlgili inventoryItem'ın çıkarılması için indeksini kaydet
            itemsToRemoveIndexes.push(index);
          }
        }
      });
    });

    // Çıkarılacak öğeler için ters döngü (çıkarırken sıralamayı bozmamak için)
    for (let i = itemsToRemoveIndexes.length - 1; i >= 0; i--) {
      this.collectedProducts.splice(itemsToRemoveIndexes[i], 1);
    }
    itemsToRemoveIndexes = [];
    //--------------------------------------------------------


    this.collectedProducts
    if (this.transferProducts.length > 0) {
      if (this.lastCollectedProduct == null) {
        //üste atılcak ürün seçildi
        this._transferProducts = [];
        this._transferProducts.push(this.transferProducts[0]);
        this.lastCollectedProduct = this.transferProducts[0];
      } else {
        //eğer son sayılan ürün varsa
        var foundedProduct = this.transferProducts.find(
          (p) =>
            p.barcode == this.lastCollectedProduct.barcode &&
            p.itemCode == this.lastCollectedProduct.itemCode &&
            p.shelfNo == this.lastCollectedProduct.shelfNo
        );

        if (foundedProduct) {
          //eğer ürün bulunduysa

          if (foundedProduct.quantity > 0) {
            //miktar değeri 0 dan büyükse
            this._transferProducts = [];
            this._transferProducts.push(foundedProduct);
            this.lastCollectedProduct = foundedProduct;
          } else {
            //miktar değeri 0 dan küçükse
            this._transferProducts = [];
            this._transferProducts.push(this.transferProducts[0]);
            this.lastCollectedProduct = this.transferProducts[0];
          }
        } else {
          //üürn bulunmdadıysa

          this._transferProducts = [];
          this._transferProducts.push(this.transferProducts[0]);
          this.lastCollectedProduct = this.transferProducts[0];
        }
      }
    }
  }
  calculateTotalQty() {
    //toplanan ürünler yazısı için
    let totalQty = 0;
    this.collectedProducts.forEach((item) => {
      totalQty += item.quantity;
    });
    this.totalCount = totalQty;
  }

  focusNextInput(nextInputId: string) {
    const nextInput = document.getElementById(nextInputId) as HTMLInputElement;
    if (nextInput) {
      nextInput.focus();
    }
  }
  formGenerator() {
    this.checkForm = this.formBuilder.group({
      barcode: [null, Validators.required],
      office: [null, Validators.required],
      warehouseCode: [null, Validators.required],
      shelfNo: [null, Validators.required],
      quantity: [null],
      batchCode: [null],
      targetShelfNo: [null, Validators.required],
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
  }
  async confirmTransfer(operationNumberList: string[]) {
    var response = await this.orderService.confirmTransfer(operationNumberList);
    if (response) {
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
  getSelectedOffice(from: number) {
    this.getWarehouseList(this.checkForm.get('office')?.value, 1);
  }
  finishTransfer(model: any) {
    this.generalService.waitAndNavigate(
      'Hızlı Transfer İşlemi Başarılı',
      'dashboard'
    );
  }
  async getWarehouseList(value: string, from: number): Promise<any> {
    //bu alanı servise bağla
    try {
      if (from === 1) {
        const selectElement = document.getElementById(
          'office'
        ) as HTMLSelectElement;

        value = selectElement.value == '' ? 'M' : selectElement.value;
        const response = await this.httpClientService
          .get<WarehouseOfficeModel>({
            controller: 'Warehouse/GetWarehouseModel/' + value,
          })
          .toPromise();

        if (response) {
          this.warehouseModels.push(response[0]);

          this.checkForm
            .get('warehouseCode')
            .setValue(response[0].warehouseCode);
          const selectedValue2 = this.checkForm.get('warehouseCode').value;

          // this.toasterService.success('Form Değeri \n' + selectedValue2); //null geliyor
          return true;
        } else {
          this.toasterService.error('Depo Çekilemedi');
          return false;
        }
      }
    } catch (error: any) {
      return false;
      ////console.log(error.message);
    }
  }
  async setFormValues(barcode: string, check: boolean): Promise<string> {
    this.shelfNumbers = 'RAFLAR:';
    try {
      if (barcode.includes('http') || this.generalService.isGuid(barcode)) {
        var result: string[] = await this.productService.countProductByBarcode3(
          barcode
        );
        if (result[0].includes("CANTA")) {
          // Eğer varsa, virgülle ayrılmış öğeler listesi oluşturup "CANTA" olanı çıkarıyoruz
          var items = result[0].split(",");
          items = items.filter(item => !item.startsWith("CANTA"));
          // Daha sonra, result[0]'ı güncelliyoruz
          result[0] = items.join(",");
        }
        this.shelfNumbers += result[0];
        if (check) {
          this.checkForm.get('shelfNo').setValue(result[0].split(',')[0]);
          this.checkForm.get('batchCode').setValue(result[2]);
          this.checkForm.get('barcode').setValue(result[3]);
        }

        return result[1];
      } else {
        var result: string[] = await this.productService.countProductByBarcode(
          barcode
        );
        this.shelfNumbers += result[0];
        this.checkForm.get('batchCode').setValue(result[2]); //lot yerleştirir
        return result[1];
      }
    } catch (error) {
      this.toasterService.error(error.message);
      return null;
    }
  }
  qrBarcodeUrl: string = null;
  qrOperationModels: QrOperationModel[] = [];
  async onSubmit(transferModel: FastTransferModel): Promise<any> {

    if (transferModel.barcode.includes("=")) {
      transferModel.barcode = transferModel.barcode.replace(/=/g, "-");

    }

    if (
      transferModel.barcode.includes('http') || transferModel.barcode.includes('Http') ||
      this.generalService.isGuid(transferModel.barcode)
    ) {
      var number = await this.setFormValues(transferModel.barcode, true);
      this.qrBarcodeUrl = transferModel.barcode;
      this.checkForm.get('quantity')?.setValue(Number(number));

      // this.onSubmit(this.checkForm.value);
      return;
    } else {
      transferModel.operationId = this.currentOrderNo;
      var CONSTQTY = await this.getQuantity(transferModel.barcode);
      if (transferModel.shelfNo == null || transferModel.shelfNo.trim() == '') {
        if (
          transferModel.barcode != null ||
          transferModel.barcode.trim() == ''
        ) {
          var number = await this.setFormValues(transferModel.barcode, true);
          this.checkForm.get('quantity')?.setValue(Number(number)); //quantity alanı dolduruldu
          this.toasterService.success(
            'Raflar Getirildi Ve Miktar Alanı Dolduruldu.'
          );
        } else {
          this.toasterService.warn('Barkod Alanı Boş.');
          return;
        }
      } else if (transferModel.shelfNo != null) {
        if (this.checkForm.valid === true) {
          var response2: ProductCountModel =
            await this.warehouseService.countProductRequest(
              transferModel.barcode,
              transferModel.shelfNo,
              transferModel.quantity == null
                ? Number(CONSTQTY)
                : transferModel.quantity,
              null,
              null,
              transferModel.batchCode,
              'Order/CountProductControl',
              this.orderNo,
              ''
            );
          //sayım yapıldı ve barkod doğrulaması yapıldı CountProductControl

          if (response2.status != 'Barcode') {
            this.toasterService.error('Bu Qr Barkoduna Ait Barkod Bulunamadı');
            return;
          }
          //burada parti ve barkod için istek at
          var qrmodelResponse = await this.productService.qrControl(
            transferModel.barcode
          );
          if (qrmodelResponse.batchCode) {
            if (transferModel.batchCode == null || transferModel.batchCode === '') {
              transferModel.batchCode = qrmodelResponse.batchCode;
            }

            // transferModel.barcode = qrmodelResponse.barcode; //qr basılmadı
          }
          var newResponse = await this.productService.countProductByBarcode(
            transferModel.barcode
          );

          const shelves = newResponse[0]
            .split(',')
            .filter((raflar) => raflar.trim() !== '')
            .map((raflar) => raflar.toLowerCase());

          if (shelves.includes(transferModel.shelfNo.toLowerCase())) {
            transferModel.quantity =
              transferModel.quantity != null
                ? transferModel.quantity
                : Number(CONSTQTY);

            var response = await this.warehouseService.fastTransfer(
              transferModel
            );

            //TRANSFER İŞLEMİ YAPILDI
            if (response > 0) {
              //↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓
              var qrResponse: QrOperationResponseModel =
                await this.productService.qrOperationMethod(
                  this.qrBarcodeUrl,
                  this.checkForm,
                  transferModel,
                  Number(CONSTQTY),
                  false,
                  'FT'
                );
              if (qrResponse != null && qrResponse.state === true) {
                this.qrOperationModels.push(qrResponse.qrOperationModel);
              } else if (qrResponse === null) {
                this.qrBarcodeUrl = null
              }
              //↑↑↑↑↑↑↑↑↑ EĞER QRURl BOŞ DEĞİLSE KONTROL EDİLCEK ↑↑↑↑↑↑↑↑↑

              this.collectedProducts.push(transferModel);
              this.collectedProducts.reverse();
              await this.getTransferRequestListModel(this.selectedButton.toString());
              this.toasterService.success("Okutma Başarılı")
              // setInterval(() => {

              //   location.reload();
              // }, 2000);
              //LİSTEYE EKLENDİ
            } else {
              this.toasterService.error('Ekleme Yapılmadı');
            }

            this.generalService.beep();
            this.clearForm();

            if (this.selectedButton == 2) {
              this.checkForm.get('targetShelfNo').setValue(transferModel.targetShelfNo);
            }
          } else {
            if (
              confirm(
                'Raf Bulunamadı! Raf Barkod Doğrulaması Yapılmadan Eklensin mi(2)?'
              )
            ) {
              if (!transferModel.quantity) {
                transferModel.quantity = Number(CONSTQTY);
              }

              var response = await this.warehouseService.fastTransfer(
                transferModel
              );
              if (response > 0) {

                //↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓
                var qrResponse: QrOperationResponseModel =
                  await this.productService.qrOperationMethod(
                    this.qrBarcodeUrl,
                    this.checkForm,
                    transferModel,
                    Number(CONSTQTY),
                    false,
                    'FT'
                  );
                if (qrResponse != null && qrResponse.state === true) {
                  this.qrOperationModels.push(qrResponse.qrOperationModel);
                } else if (qrResponse === null) {
                  this.clearForm();
                  console.log(this.selectedButton.toString());
                  if (this.selectedButton == 2) {
                    this.checkForm.get('targetShelfNo').setValue(transferModel.targetShelfNo);
                  }
                }

                //↑↑↑↑↑↑↑↑↑ EĞER QRURl BOŞ DEĞİLSE KONTROL EDİLCEK ↑↑↑↑↑↑↑↑↑

                this.collectedProducts.push(transferModel);
                this.collectedProducts.reverse();
                await this.getTransferRequestListModel(this.selectedButton.toString());

                this.toasterService.success("Okutma Başarılı")
                this.generalService.beep();
                // setInterval(() => {

                //   location.reload();();
                // }, 2000);

                //LİSTEYE EKLENDİ
              } else {
                this.toasterService.error('Ekleme Yapılmadı');
              }

              this.clearForm();
              console.log(this.selectedButton.toString());
              if (this.selectedButton == 2) {
                this.checkForm.get('targetShelfNo').setValue(transferModel.targetShelfNo);
              }
            }
          }
        } else {
          this.generalService.whichRowIsInvalid(this.checkForm);
        }
      }
    }
  }

  async deleteFastTransfer(qrModel: FastTransferModel) {
    const confirmDelete = window.confirm(
      'Bu hareketi silmek istediğinizden emin misiniz?'
    );

    if (confirmDelete) {
      var shelfNo = qrModel.shelfNo;
      qrModel.shelfNo = qrModel.targetShelfNo;
      qrModel.targetShelfNo = shelfNo;
      var response = await this.warehouseService.fastTransfer(qrModel);
      if (response) {
        this.deleteFromList(qrModel);
      }
      var model: QrOperationModel = new QrOperationModel();
      var qrOperationModel: QrOperationModel = new QrOperationModel();

      qrOperationModel = this.qrOperationModels.find(
        (p) =>
          p.barcode == qrModel.barcode &&
          p.batchCode == qrModel.batchCode &&
          p.shelfNo == qrModel.targetShelfNo
      );
      if (qrOperationModel) {
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
          // //console.log(this.qrOperationModels);
          this.generalService.beep3();
          this.toasterService.success('Qr Operasyonu Geri Alındı');
        } else {
          this.toasterService.error('Qr Operasyonu Geri Alınamadı');
        }
      } else {
        this.toasterService.error('Qr Operasyonu Geri Alınamadı');
      }
    }
  }
  deleteFromList(model: FastTransferModel) {
    // collectedProducrts dizisinde model'i bul
    const index = this.collectedProducts.findIndex(
      (p) =>
        p.barcode == model.barcode &&
        p.batchCode == model.batchCode &&
        p.quantity == model.quantity &&
        p.shelfNo == model.shelfNo &&
        p.targetShelfNo == model.targetShelfNo
    );

    // Eğer bulunduysa, diziden kaldır
    if (index !== -1) {
      this.collectedProducts.splice(index, 1);
      this.calculateTotalQty();
      this.toasterService.success('Ürün Silindi');
    }
  }
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
  async getQuantity(barcode: string): Promise<string> {
    this.shelfNumbers = 'RAFLAR:';

    var result: string[] = await this.productService.countProductByBarcode(
      barcode
    );

    // this.shelfNumbers += result[0];
    return result[1];
  }

  clearShelfNumbers() {
    this.checkForm.get('shelfNo').setValue(null);
    this.checkForm.get('barcode').setValue(null);
    this.checkForm.get('batchCode').setValue(null);

    this.focusNextInput('shelfNo');
    this.shelfNumbers = 'RAFLAR:';
    this.qrBarcodeUrl = null;
    this.checkForm.get('quantity').setValue(null);
  }
  clearTargetShelfNumber() {
    this.clearShelfNumbers();
    this.checkForm.get('targetShelfNo').setValue(null);
  }
  clearForm() {
    this.checkForm.get('barcode').setValue(null);
    this.checkForm.get('quantity').setValue(null);
    this.checkForm.get('shelfNo').setValue(null);
    this.checkForm.get('batchCode').setValue(null);
    this.checkForm.get('targetShelfNo').setValue(null);
    this.focusNextInput('shelfNo');
    this.qrBarcodeUrl = null;
    this.shelfNumbers = 'RAFLAR:';

    this.calculateTotalQty();
  }
  async deleteCountProduct(
    orderNo: string,
    itemCode: string
  ): Promise<boolean> {
    const result = await this.productService.deleteProductFromFastTransfer(
      this.currentOrderNo,
      itemCode
    );
    this.collectedProducts =
      await this.warehouseService.getGetAllFastTransferModelById(
        this.currentOrderNo
      );
    return false;
  }
}
