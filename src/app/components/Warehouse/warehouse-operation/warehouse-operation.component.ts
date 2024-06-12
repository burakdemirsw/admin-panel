import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ClientUrls } from 'src/app/models/const/ClientUrls';
import { BarcodeModel } from 'src/app/models/model/product/barcodeModel';
import { InventoryItem } from 'src/app/models/model/product/inventoryItemModel';
import { QrOperationModel } from 'src/app/models/model/product/qrOperationModel';
import { WarehouseTransferModel } from 'src/app/models/model/warehouse/fastTransferModel';
import { OfficeModel } from 'src/app/models/model/warehouse/officeModel';
import { WarehouseItem } from 'src/app/models/model/warehouse/warehouseItem';
import { WarehouseModel } from 'src/app/models/model/warehouse/warehouseModel';
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
  selector: 'app-warehouse-operation',
  templateUrl: './warehouse-operation.component.html',
  styleUrls: ['./warehouse-operation.component.css'],
})
export class WarehouseOperationComponent implements OnInit {
  currentOrderNo: string = '';
  activeTab: number = 1;
  warehoseModel: WarehouseModel[];
  warehouseForm: FormGroup;
  isDisabled: boolean = true;
  qrCode: string = null;
  currentBarcode: string = null;
  stockStatus: boolean = false;
  warehousePackageDetails: WarehouseModel[] = [];
  wrongItemList: WarehouseItem[] = [];
  _inventoryItems: InventoryItem[] = [];
  inventoryItems: InventoryItem[] = []; //transfer Edilecek ürünler
  warehouseTransferForms: WarehouseTransferModel[] = []; //eklenen ürünler
  lastCollectedProduct: InventoryItem = null;
  deletedProductList: InventoryItem[] = [];
  currentDataType: string;
  modalImageUrl: string;
  formModal: any;
  barcode: string = null;
  blockedCount: boolean = false;
  blockedCountReason = '';
  qrOperationModels: QrOperationModel[] = [];
  totalCount: number;
  shelfNumbers: string = 'Raf No';
  productShelvesDialog: boolean = false;
  productShelves: string[] = [];
  constructor(
    private httpClientService: HttpClientService,
    private formBuilder: FormBuilder,
    private toasterService: ToasterService,
    private activatedRoute: ActivatedRoute,
    private generalService: GeneralService,
    private productService: ProductService,
    private warehouseService: WarehouseService,
    private httpClient: HttpClient,
    private orderService: OrderService,
    private headerService: HeaderService
  ) { } // Add this line

  //#region Params
  warehouseModels: WarehouseOfficeModel[] = [];
  warehouseModels2: WarehouseOfficeModel[] = [];
  barcodeModel: BarcodeModel = new BarcodeModel();
  shelfNo: string = null;
  colorCode: string = null;
  itemDim1Code: string = null;
  itemCode: string = null;
  batchCode: string;
  officeModels: OfficeModel[] = [];
  visible: boolean = false;
  _barcode: string = null;
  quantity: number = null;
  offices: any[] = [];
  warehouses: any[] = [];
  inventoryItemColums: string[] = [
    'Id',
    'Fotoğraf',
    'Raf',
    'Ürün Kodu',
    'Transfer Miktarı',
    'UD Stok',
    'MD Stok',
    'Ürün',
    'Barkod',
  ];
  _inventoryItemColums: string[] = [
    'Fotoğraf',
    'Raf',
    'Ürün Kodu',
    'Transfer Miktarı',
    'UD Stok',
    'MD Stok',
    'Ürün',
    'Barkod',
    'İşlemler',
  ];
  pageStatus = '';
  //#endregion

  async ngOnInit() {

    //depolar ve ofisleri çeker
    this.getWarehouseAndOffices();

    //eğer istek sayfası ise düzenleme yapıldı
    if (location.href.includes('REQ-')) {
      this.activatedRoute.params.subscribe(async (params) => {
        if (params['type']) {
          this.currentDataType = params['type'];
        }
      });


      if (this.currentDataType === '1') {
        this.pageStatus = 'Depolar Arası İstek - Standart';
      } else {
        this.pageStatus = 'Depolar Arasıİstek - Raf Fulle';
      }
    } else {
      if (location.href.includes('MT-')) {
        this.pageStatus = 'Mağaza Depoları Arası Transfer';
        this.currentDataType = '-1';
      }
      else if (location.href.includes('RC-')) {
        this.pageStatus = 'Merkeze İade';
        this.currentDataType = '-1';
      }
      else {
        this.pageStatus = 'Depolar Arası Transfer';
        this.currentDataType = '-1';
      }


    }

    this.toasterService.success('Sipariş No: ' + this.currentOrderNo);
    this.formGenerator();
    this.activatedRoute.params.subscribe(async (params) => {

      if (location.href.includes('MT-')) {
        this.currentOrderNo = params['number'];
        this.pageStatus = 'Mağaza Depoları Arası Transfer';
        this.currentDataType = '-1';
      } else if (location.href.includes('RC-')) {
        this.currentOrderNo = params['number'];
        this.pageStatus = 'Merkeze İade';
        this.currentDataType = '-1';
      }

      else {
        this.currentOrderNo = 'TP-' + params['number'];
        this.pageStatus = 'Depolar Arası Transfer';
        this.currentDataType = '-1';
      }

      this.toasterService.success('Sipariş No: ' + this.currentOrderNo);
      await this.getProductOfCount(this.currentOrderNo);
      this.warehouseForm.get('orderNo').setValue(this.currentOrderNo);
    });
  }

  async getWarehouseAndOffices() {
    var response = await this.warehouseService.getWarehouseAndOffices();
    this.warehouseModels = response;

    const officeSet = new Set();
    const warehouseSet = new Set();

    this.warehouseModels.forEach(model => {
      officeSet.add(model.officeCode);
      warehouseSet.add(model.warehouseCode);
    });

    this.offices = Array.from(officeSet);
    this.warehouses = Array.from(warehouseSet).map(code => {
      const model = this.warehouseModels.find(warehouse => warehouse.warehouseCode === code);
      return {
        code: model.warehouseCode,
        name: model.warehouseDescription
      };
    });
  }



  change(barcode: string, quantity: number) {
    this.visible = !this.visible;
    this._barcode = barcode;
    this.quantity = quantity;
  }

  goDown2(
    barcode: string,
    shelfNo: string,
    itemCode: string,
    transferQty: number
  ) {
    // packageNo'ya eşleşen ProductOfOrder'ı bulun
    const matchingProduct = this.inventoryItems.find(
      (product) =>
        product.barcode === barcode &&
        product.shelfNo == shelfNo &&
        product.itemCode == itemCode &&
        product.transferQty == transferQty
    );

    // Eğer eşleşen bir ürün bulunduysa
    if (matchingProduct) {
      // Ürünü diziden çıkarın
      const index = this.inventoryItems.indexOf(matchingProduct);
      if (index !== -1) {
        if (this.inventoryItems.length - 1 >= index + 1) {
          this._inventoryItems = [];
          this._inventoryItems.push(this.inventoryItems[index + 1]);
          this.lastCollectedProduct = this.inventoryItems[index + 1];
        } else {
          this._inventoryItems = [];
          this._inventoryItems.push(this.inventoryItems[0]);
        }
      }
    }
  }

  async addDeletedItemList(item: InventoryItem) {
    this.deletedProductList.push(item);
    await this.getProductOfCount(this.currentOrderNo);
    this.toasterService.info('Ürün Transfer Edilecek Ürünlerden Silindi');
  }

  goPage(currentDataType: string) {
    location.href =
      location.origin +
      '/warehouse-operation/' +
      this.currentOrderNo.split('TP-')[1] +
      '/' +
      currentDataType;
  }
  async onDataChange(currentDataType: string) {
    this.headerService.updatePageTitle(this.pageStatus);
    if (this.deletedProductList.length > 0) {
      this.deletedProductList.forEach((deletedItem) => {
        this.inventoryItems.forEach((inventoryItem, _index) => {
          if (
            inventoryItem.barcode === deletedItem.barcode &&
            inventoryItem.shelfNo === deletedItem.shelfNo &&
            inventoryItem.itemCode === deletedItem.itemCode
          ) {
            this.inventoryItems.splice(_index, 1);
          }
        });
      });
    }
  }
  pasteItemToForm(item: InventoryItem) {
    this.warehouseForm.get('shelfNo').setValue(item.shelfNo);
    this.warehouseForm.get('quantity').setValue(item.quantity);
    this.warehouseForm.get('barcode').setValue(item.barcode);
  }

  updateInventoryAndTransfers() {
    //eğer silinmiş ürün listesinde ürün varsa onları kaldır
    // İşlem sonrası çıkarılacak öğelerin indekslerini tutacak dizi
    let itemsToRemoveIndexes: number[] = [];

    // inventoryItems üzerinde döngü
    this.inventoryItems.forEach((inventoryItem, index) => {
      // Eşleşme arama ve güncelleme
      this.warehouseTransferForms.forEach((transferItem) => {
        // barcode, shelfNo ve itemCode değerlerine göre eşleşme kontrolü
        if (
          inventoryItem.barcode === transferItem.barcode &&
          inventoryItem.shelfNo === transferItem.shelfNo &&
          inventoryItem.itemCode === transferItem.itemCode
        ) {
          // Eşleşen üründen quantity değerini çıkart
          inventoryItem.transferQty -= transferItem.quantity;

          // Eğer transfer edilen miktar sonucunda quantity 0 veya daha az ise
          if (inventoryItem.transferQty <= 0) {
            // İlgili inventoryItem'ın çıkarılması için indeksini kaydet
            itemsToRemoveIndexes.push(index);
          }
        }
      });
    });

    // Çıkarılacak öğeler için ters döngü (çıkarırken sıralamayı bozmamak için)
    for (let i = itemsToRemoveIndexes.length - 1; i >= 0; i--) {
      this.inventoryItems.splice(itemsToRemoveIndexes[i], 1);
    }
    itemsToRemoveIndexes = [];
    //--------------------------------------------------------

    // Çıkarılacak öğeler için ters döngü (çıkarırken sıralamayı bozmamak için)

    //--------------------------------------------------------

    if (this.inventoryItems.length > 0) {
      if (this.lastCollectedProduct == null) {
        //üste atılcak ürün seçildi
        this._inventoryItems = [];
        this._inventoryItems.push(this.inventoryItems[0]);
        this.lastCollectedProduct = this.inventoryItems[0];
      } else {
        //eğer son sayılan ürün varsa
        var foundedProduct = this.inventoryItems.find(
          (p) =>
            p.barcode == this.lastCollectedProduct.barcode &&
            p.itemCode == this.lastCollectedProduct.itemCode &&
            p.shelfNo == this.lastCollectedProduct.shelfNo
        );

        if (foundedProduct) {
          //eğer ürün bulunduysa

          if (foundedProduct.quantity > 0) {
            //miktar değeri 0 dan büyükse
            this._inventoryItems = [];
            this._inventoryItems.push(foundedProduct);
            this.lastCollectedProduct = foundedProduct;
          } else {
            //miktar değeri 0 dan küçükse
            this._inventoryItems = [];
            this._inventoryItems.push(this.inventoryItems[0]);
            this.lastCollectedProduct = this.inventoryItems[0];
          }
        } else {
          //üürn bulunmdadıysa

          this._inventoryItems = [];
          this._inventoryItems.push(this.inventoryItems[0]);
          this.lastCollectedProduct = this.inventoryItems[0];
        }
      }
    }
  }

  async getProductOfCount(orderNo: string): Promise<any> {
    //sayılanları çeker
    this.warehouseTransferForms =
      await this.warehouseService.getWarehouseTransferModels(orderNo);

    await this.onDataChange(this.currentDataType);

    this.updateInventoryAndTransfers();

    this.calculateTotalQty();
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

  formGenerator() {
    try {
      this.warehouseForm = this.formBuilder.group({
        id: [null],
        shelfNo: [this.shelfNo, Validators.required],
        barcode: [this.currentBarcode, Validators.required],
        quantity: [null, Validators.required],
        batchCode: [this.batchCode],
        office: [null, Validators.required],
        officeTo: [null, Validators.required],
        warehouseCode: [null, Validators.required],
        toWarehouseCode: [null, Validators.required],
        orderNo: [null, Validators.required],
      });

    } catch (error) {
      console.error(error);
      // Handle the error as needed.
    }
  }
  onModelChanged(value: string) {
    this.getShelfByQrDetail(value);
  }

  handleTransfer() {
    if (location.href.includes('MT-')) {
      this.transferBetweenStoreWarehouses(this.currentOrderNo);
    } else if (location.href.includes('RC-')) {
      this.refundToCenter(this.currentOrderNo);
    }

    else {
      this.storeTransfer(this.currentOrderNo);
    }
  }

  async refundToCenter(currentOrderNo: string) {
    if (currentOrderNo != null && currentOrderNo !== '') {
      const userConfirmed = window.confirm(
        this.currentOrderNo +
        ' numaralı transfer için İşlemi başlatmak istediğinize emin misiniz?'
      );

      if (userConfirmed) {
        try {

          const data = await this.httpClient
            .get<WarehouseItem | any>(
              ClientUrls.baseUrl +
              '/warehouse/refund-to-center/' +
              currentOrderNo
            )
            .toPromise();

          if (data === true) {
            this.generalService.waitAndNavigate(
              'Mağaza Depoları Arası Transfer İşlemi Başarıyla Gerçekleşti.',
              'warehouse-operation-list'
            );
          } else {
            this.toasterService.error('İşlem Başarısız');
          }
        } catch (error: any) {

        }
      } else {
        this.toasterService.warn('İşlem iptal edildi.');
      }
    } else {
      this.toasterService.warn('Sipariş No Boş Geliyor.');
    }

  }

  async transferBetweenStoreWarehouses(currentOrderNo: string) {
    if (currentOrderNo != null && currentOrderNo !== '') {
      const userConfirmed = window.confirm(
        this.currentOrderNo +
        ' numaralı transfer için İşlemi başlatmak istediğinize emin misiniz?'
      );

      if (userConfirmed) {
        try {

          const data = await this.httpClient
            .get<WarehouseItem | any>(
              ClientUrls.baseUrl +
              '/warehouse/transfer-between-store-warehouses/' +
              currentOrderNo
            )
            .toPromise();

          if (data === true) {
            this.generalService.waitAndNavigate(
              'Mağaza Depoları Arası Transfer İşlemi Başarıyla Gerçekleşti.',
              'warehouse-operation-list'
            );
          } else {
            this.toasterService.error('İşlem Başarısız');
          }
        } catch (error: any) {

        }
      } else {
        this.toasterService.warn('İşlem iptal edildi.');
      }
    } else {
      this.toasterService.warn('Sipariş No Boş Geliyor.');
    }

  }


  async storeTransfer(currentOrderNo: string) {
    if (currentOrderNo != null && currentOrderNo !== '') {
      const userConfirmed = window.confirm(
        this.currentOrderNo +
        ' numaralı transfer için İşlemi başlatmak istediğinize emin misiniz?'
      );

      if (userConfirmed) {
        try {

          const data = await this.httpClient
            .get<WarehouseItem | any>(
              ClientUrls.baseUrl +
              '/warehouse/store-transfer/' +
              currentOrderNo
            )
            .toPromise();

          if (data === true) {
            this.generalService.waitAndNavigate(
              'Mağaza Transfer İşlemi Başarıyla Gerçekleşti.',
              'warehouse-operation-list'
            );
          } else {
            this.toasterService.error('İşlem Başarısız');
          }
        } catch (error: any) {

        }
      } else {
        this.toasterService.warn('İşlem iptal edildi.');
      }
    } else {
      this.toasterService.warn('Sipariş No Boş Geliyor.');
    }

  }
  async transferToNebim(currentOrderNo: string) {
    if (currentOrderNo != null && currentOrderNo !== '') {
      const userConfirmed = window.confirm(
        this.currentOrderNo +
        ' numaralı transfer için İşlemi başlatmak istediğinize emin misiniz?'
      );

      if (userConfirmed) {
        try {

          const data = await this.httpClient
            .get<WarehouseItem | any>(
              ClientUrls.baseUrl +
              '/warehouse/TransferProducts/' +
              currentOrderNo
            )
            .toPromise();

          if (data === true) {
            this.generalService.waitAndNavigate(
              'Transfer İşlemi Başarıyla Gerçekleşti.',
              'warehouse-operation-list'
            );
          } else {
            this.toasterService.error('İşlem Başarısız');
          }
        } catch (error: any) {

        }
      } else {
        this.toasterService.warn('İşlem iptal edildi.');
      }
    } else {
      this.toasterService.warn('Sipariş No Boş Geliyor.');
    }

  }
  async setShelfNo(barcode: string): Promise<string> {
    if (barcode) {
      var result: string[] = await this.productService.countProductByBarcode(
        barcode
      );
      this.shelfNumbers += result[0];
      return result[1];
    } else {
      this.toasterService.warn('Barkod Alanı Boş.');
      return null;
    }
  }

  async setFormValues(

    product: WarehouseTransferModel
  ): Promise<WarehouseTransferModel> {
    var result: string[] = await this.productService.countProductByBarcode(
      product.barcode
    );
    this.shelfNumbers = result[0];
    this.warehouseForm.get('barcode').setValue(result[3]);
    this.warehouseForm.get('batchCode').setValue(result[2].toString());
    this.warehouseForm.get('quantity').setValue(result[1]);


    var updated_product: WarehouseTransferModel = product;
    updated_product.quantity = Number(result[1]);
    updated_product.batchCode = result[2];
    updated_product.barcode = result[3];
    return updated_product;
  }

  async onSubmit(formValue: WarehouseTransferModel): Promise<any> {

    formValue.operationId = this.currentOrderNo;
    formValue.warehouseCode = formValue.warehouseCode.code;
    formValue.toWarehouseCode = formValue.toWarehouseCode.code;


    if (!this.warehouseForm.valid) {
      var updated_product = await this.setFormValues(

        formValue
      );
      formValue = updated_product;
      this.toasterService.success('Formu Verileri Dolduruldu.');
      return;
    }

    if (this.warehouseForm.valid) {


      const shelves = this.shelfNumbers
        .split(',')
        .filter((raflar) => raflar.trim() !== '')
        .map((raflar) => raflar.toLowerCase());
      shelves.forEach((s) => {
        s = s.toLowerCase();
      });

      if (shelves.includes(formValue.shelfNo.toLowerCase())) {
        var response = await this.warehouseService.addWarehouseTransferModel(
          formValue
        );
        if (response) {
          this.generalService.beep();

          await this.getProductOfCount(this.currentOrderNo);

          this.clearQrAndBatchCode();

          return;

        } else {
          this.toasterService.error('İşlem Başarısız');
          return;
        }


      } else {
        if (
          confirm(
            'Raf Bulunamadı! Raf Barkod Doğrulaması Yapılmadan Eklensin mi(2)?'
          )
        ) {
          var number = await this.setShelfNo(formValue.barcode);
          this.warehouseForm.get('quantity')?.setValue(Number(number));

          var response = await this.warehouseService.addWarehouseTransferModel(
            formValue
          );

          await this.getProductOfCount(this.currentOrderNo); //this.list.push(formValue);
          this.generalService.beep();
          this.clearQrAndBatchCode();
        } else {
          var number = await this.setShelfNo(formValue.barcode);
          this.warehouseForm.get('quantity')?.setValue(Number(number));
          this.toasterService.success(
            'Raflar Getirildi Ve Miktar Alanı Dolduruldu.'
          );
        }
      }
    } else {
      this.toasterService.error('Form Geçersiz');
    }
  }
  calculateTotalQty() {
    let totalQty = 0;
    this.warehouseTransferForms.forEach((item) => {
      totalQty += item.quantity;
    });
    this.totalCount = totalQty;
  }
  clearQrAndBatchCode() {
    this.warehouseForm.get('barcode').setValue(null);
    this.warehouseForm.get('batchCode').setValue(null);
    this.warehouseForm.get('quantity').setValue(null);
    this.warehouseForm.get('shelfNo').setValue(null);
    this.shelfNumbers = 'Raf No:';


    this.focusNextInput('shelfNo');
    this.calculateTotalQty();
  }
  resetForm() {
    this.warehouseForm.patchValue({
      shelfNo: null,
      barcode: null,
      batchCode: null,
      itemCode: null,
    });
    this.focusNextInput('shelfNo');
  }
  warehosueModel: WarehouseModel = new WarehouseModel();
  getShelfDetail(id: string): any {
    //apiden gerekli fonksiyonlar kurulcak

    try {
      this.httpClientService
        .get<WarehouseModel>({
          controller: 'Shelves/' + id,
        })
        .subscribe((data) => {
          ////// console.log(data);
          this.warehoseModel = data;
          this.warehosueModel = data[0];
          this.formGenerator();
        });
    } catch (error: any) {
      // console.log(error.message);
    }
  }

  deleteRow(index: number) {
    this.warehouseTransferForms.splice(index, 1); // İlgili satırı listeden sil
  }
  focusNextInput2() {
    this.onSubmit(this.warehouseForm.value);
  }

  focusNextInput(nextInputId: string) {
    const nextInput = document.getElementById(nextInputId) as HTMLInputElement;
    if (nextInput) {
      nextInput.focus();
    }
  }

  getShelfByQrDetail(id: string): any {
    //apiden gerekli fonksiyonlar kurulcak

    try {
      this.httpClientService
        .get<WarehouseModel>({
          controller: 'Shelves/qr/' + id,
        })
        .subscribe((data) => {
          ////// console.log(data);
          this.warehoseModel = data;
          this.warehosueModel = data[0];
          this.formGenerator();
        });
    } catch (error: any) {
      // console.log(error.message); sadasd
    }
  }

  clearShelfNumbers() {
    this.warehouseForm.get('shelfNo').setValue(null);
    this.warehouseForm.get('barcode').setValue(null);
    this.focusNextInput('shelfNo');
    this.shelfNumbers = 'Raf No';

    this.warehouseForm.get('quantity').setValue(null);
  }

  async deleteOrderProduct(orderNo: string, product: any): Promise<boolean> {
    const confirmDelete = window.confirm(
      'Bu hareketi silmek istediğinizden emin misiniz?'
    );

    if (confirmDelete) {
      const response: boolean = await this.warehouseService.deleteWarehouseTransferModel(
        product.id

      );
      if (response) {
        this.warehouseTransferForms = this.warehouseTransferForms.filter(
          (o) =>
            !(o.barcode == product.itemCode && o.shelfNo == product.shelfNo)
        );
        this.calculateTotalQty();
        await this.getProductOfCount(this.currentOrderNo);
        this.toasterService.success('Silme İşlemi Başarılı.');
      } else {
        this.toasterService.error('Silme İşlemi Başarısız.');
      }

      return response;
    } else {
      return false;
    }
  }

  updateItemStock() {
    location.reload();
  }

  //--------------------------------------------------------------------

  async getShelves(barcode: string) {
    var newResponse = await this.productService.countProductByBarcode(barcode);
    const shelves = newResponse[0]
      .split(',')
      .filter((raflar) => raflar.trim() !== '');

    this.productShelves = shelves;
    this.productShelvesDialog = true;
  }
  setShelveToForm(shelve) {
    this.warehouseForm.get('shelfNo').setValue(shelve);
    this.toasterService.success('Raf Yerleştirildi');
    this.productShelvesDialog = false;
  }
  //--------------------------------------------------------------------
}
