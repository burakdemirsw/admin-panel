import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { ClientUrls } from 'src/app/models/const/ClientUrls';
import { QrOperationResponseModel } from 'src/app/models/model/client/qrOperationResponseModel';
import { CountProductRequestModel } from 'src/app/models/model/order/countProductRequestModel';
import { OrderBillingListModel } from 'src/app/models/model/order/orderBillingListModel';
import { OrderStatus } from 'src/app/models/model/order/orderStatus';
import { ProductOfOrder } from 'src/app/models/model/order/productOfOrders';
import { CollectedProduct } from 'src/app/models/model/product/collectedProduct';
import { ItemBillingModel } from 'src/app/models/model/product/itemBillingModel ';
import { QrOperationModel } from 'src/app/models/model/product/qrOperationModel';
import { ProductCountModel } from 'src/app/models/model/shelfNameModel';
import {
  FastTransferModel,
  FastTransferModel2,
} from 'src/app/models/model/warehouse/fastTransferModel';
import { FastTransfer_VM, TransferRequestListModel } from 'src/app/models/model/warehouse/transferRequestListModel';
import { WarehouseOfficeModel } from 'src/app/models/model/warehouse/warehouseOfficeModel';
import { GeneralService } from 'src/app/services/admin/general.service';
import { HeaderService } from 'src/app/services/admin/header.service';
import { OrderService } from 'src/app/services/admin/order.service';
import { ProductService } from 'src/app/services/admin/product.service';
import { WarehouseService } from 'src/app/services/admin/warehouse.service';
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
  pageDescription: string = null;
  shelfNumbers: string = 'RAFLAR:';
  currentOrderNo: string;
  selectedFilter: string = '';
  product: any;

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
    private title: Title,
    private headerService: HeaderService
  ) { }
  searchText: string = '';
  orderNo: string;
  orderBillingModel: OrderBillingListModel;
  url2: string = ClientUrls.baseUrl + '/Order/CountTransferProductPuschase';
  totalCount: number = 0;
  orderBillingList: OrderBillingListModel[] = [];
  itemBillingModels: ItemBillingModel[] = [];
  modalImageUrl: string;
  formModal: any;
  warehouseModels: WarehouseOfficeModel[] = [];
  shelfNo: string = null;
  shelfNoList: string[] = [];
  barcodeValue: string = null; // Değişkeni tanımlayın
  currentPage: number = 1;

  lastCollectedProduct: TransferRequestListModel = null;


  transferProducts: TransferRequestListModel[] = [];
  _transferProducts: TransferRequestListModel[] = [];
  __transferProducts: FastTransfer_VM[] = [];

  transferProductsColums: string[] = [
    'Id',
    'Stok Kodu',
    'Raf',
    'Transfer Miktarı',
    'Hedef Raf',
    'Miktar',
    'Barkod',
    'Çekmece Adedi',
    'İşlemler',
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
    'İşlem',
  ];
  __transferProductsColumns: string[] = [
    'Barkod',                    // Barcode
    'Stok Kodu',                 // Itemcode
    'Raf No',                    // ShelfNo
    'Çekmece Adedi',             // DrawerCount
    'Transfer Miktarı',          // TransferQuantity
    'Hedef Raf',                 // TargetShelf
    'Miktar',                    // Quantity
    'Ürün Hiyerarşisi Düzey 01', // ProductHierarchyLevel01
    'Ürün Hiyerarşisi Düzey 02', // ProductHierarchyLevel02
    'Ürün Hiyerarşisi Düzey 03', // ProductHierarchyLevel03
    'Hız',                       // Speed
    'Envanter'                   // Inventory
  ];

  currentPageType: string;
  async ngOnInit() {
    this.title.setTitle('Raf Aktarma İsteği');
    this.headerService.updatePageTitle('Raf Aktarma İsteği');
    //this.spinnerService.show();
    this.formGenerator();
    // this.currentOrderNo = (await this.generalService.generateGUID()).toString();
    this.activatedRoute.params.subscribe(async (params) => {
      if (params['shelfNo']) {
        this.toasterService.success(params['shelfNo'])
        this.shelfNo = params['shelfNo']
      }
      if (params['operationNo']) {
        this.currentOrderNo = 'REQ-' + params['operationNo'];
        this.currentPageType = params['type'];
        await this.getFastTransferModels();
        // this.toasterService.info('İşlem Numarası: ' + this.currentOrderNo);

      }
      if (params['type']) {
        await this.getTransferRequestListModel(params['type']);
      }

    });
    this.addOperationStatus();
    this.collectedProducts = [];
  }
  offices: any[] = ['M', 'U'];
  warehouses: any[] = ['MD', 'UD'];

  async addOperationStatus() {
    var request = new OrderStatus();
    request.id = await this.generalService.generateGUID();
    request.orderNo = this.currentOrderNo;
    request.status = 'Raf Transfer İsteği';
    request.warehousePerson = localStorage.getItem('name') + ' ' + localStorage.getItem('surname');
    request.createdDate = new Date();
    const response = await this.orderService.addOrderStatus(request);
    // if (response) {
    //   this.toasterService.success('Durum Güncellendi');
    // } else {
    //   this.toasterService.error('Durum Güncellenemedi');
    // }
  }


  goPage(pageType: string) {
    location.href =
      location.origin +
      '/shelf-transfer-request/' +
      this.currentOrderNo.split('REQ-')[1] +
      '/' +
      pageType;
  }

  collectedFastTransferModels: FastTransferModel2[] = [];
  async getFastTransferModels() {
    var response = await this.warehouseService.getFastTransferModels(
      this.currentOrderNo
    );
    if (response) {
      this.collectedFastTransferModels = response;
      this.calculateTotalQty();
    }
  }

  async deleteFastTransferModel(request: string): Promise<boolean> {
    var response = await this.warehouseService.deleteFastTransferModel(request);
    if (response) {
      this.toasterService.success('Başarılı');
      this.getFastTransferModels();
      return true;
    } else {
      return false;
    }
  }
  async addFastTransferModel(request: FastTransferModel2): Promise<boolean> {
    var response = await this.warehouseService.addFastTransferModel(request);
    if (response) {
      this.toasterService.success('Başarılı');
      await this.getFastTransferModels();
      return true;
    } else {
      this.toasterService.error('Başarısız');
      return false;
    }
  }

  //-------------------
  async getShelves(barcode: string) {
    var newResponse = await this.productService.countProductByBarcode(barcode);
    const shelves = newResponse[0]
      .split(',')
      .filter((raflar) => raflar.trim() !== '');

    this.productShelves = shelves;
    this.productShelvesDialog = true;
  }
  setShelveToForm(shelve) {
    this.checkForm.get('shelfNo').setValue(shelve);
    this.toasterService.success('Raf Yerleştirildi');
    this.productShelvesDialog = false;
  }
  productShelvesDialog: boolean = false;
  productShelves: string[] = [];
  //-------------------
  goDown2(
    barcode: string,
    shelfNo: string,
    itemCode: string,
    transferQuantity: number
  ) {
    if (this.currentPageType != '4') {
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
    } else {
      // packageNo'ya eşleşen ProductOfOrder'ı bulun
      const matchingProduct = this.__transferProducts.find(
        (product) =>
          product.barcode === barcode &&
          product.shelfNo == shelfNo &&
          product.itemCode == itemCode &&
          product.transferQuantity == transferQuantity
      );

      if (matchingProduct) {
        // Ürünü diziden çıkarın
        const index = this.__transferProducts.indexOf(matchingProduct);
        if (index !== -1) {
          if (this.__transferProducts.length - 1 >= index + 1) {
            this._transferProducts = [];
            this._transferProducts.push(this.__transferProducts[index + 1]);
            this.lastCollectedProduct = this.__transferProducts[index + 1];
          } else {
            this._transferProducts = [];
            this._transferProducts.push(this.__transferProducts[0]);
          }
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
    this.toasterService.info('Ürün Transfer Edilecek Ürünlerden Silindi');
    this.focusNextInput('barcode');
  }

  selectedButton: number = 0;

  async getTransferRequestListModel2(type: string) {
    const response = await this.warehouseService.getTransferRequestListModel(
      type, this.shelfNo
    );
    this.selectedButton = Number(type);

    //toplanacak ürünler getirildi
    this.toasterService.success(this.shelfNo + ' Rafına Yapılacak Transferler Getirildi');

    //toplanacak ürünler atandı
    this.__transferProducts = response;
    if (this.deletedProductList.length > 0) {
      this.deletedProductList.forEach((deletedItem) => {
        this.__transferProducts.forEach((inventoryItem, _index) => {
          if (
            inventoryItem.barcode === deletedItem.barcode &&
            inventoryItem.shelfNo === deletedItem.shelfNo &&
            inventoryItem.itemCode === deletedItem.itemCode
          ) {
            this.__transferProducts.splice(_index, 1);
          }
        });
      });
    }

    // İşlem sonrası çıkarılacak öğelerin indekslerini tutacak dizi
    let itemsToRemoveIndexes: number[] = [];

    // inventoryItems üzerinde döngü
    this.__transferProducts.forEach((inventoryItem, index) => {
      //transfer edilcek ürünler
      // Eşleşme arama ve güncelleme
      this.collectedProducts.forEach((transferItem) => {
        //toplanan ürünler
        // barcode, shelfNo ve itemCode değerlerine göre eşleşme kontrolü
        if (
          inventoryItem.barcode === transferItem.barcode &&
          inventoryItem.targetShelf === transferItem.targetShelfNo &&
          inventoryItem.shelfNo === transferItem.shelfNo
        ) {
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


    if (this.__transferProducts.length > 0) {
      if (this.lastCollectedProduct == null) {
        //üste atılcak ürün seçildi
        this._transferProducts = [];
        this._transferProducts.push(this.__transferProducts[0]);
        this.lastCollectedProduct = this.__transferProducts[0];
      } else {
        //eğer son sayılan ürün varsa
        var foundedProduct = this.__transferProducts.find(
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
            this._transferProducts.push(this.__transferProducts[0]);
            this.lastCollectedProduct = this.__transferProducts[0];
          }
        } else {
          //üürn bulunmdadıysa

          this._transferProducts = [];
          this._transferProducts.push(this.__transferProducts[0]);
          this.lastCollectedProduct = this.__transferProducts[0];
        }
      }
    }

    this.mapProducts(this.__transferProducts)
    this.fillShelfNo(2);

  }

  mapProducts(data: FastTransfer_VM[]) {
    const uniqueMap = (array, key) => {
      const map = new Map();
      array.forEach(item => {
        if (!map.has(item[key])) {
          map.set(item[key], { label: item[key], value: item[key] });
        }
      });
      return Array.from(map.values()).sort((a, b) => a.label.localeCompare(b.label));
    };

    this.shelfNos = uniqueMap(this.__transferProducts, 'shelfNo');
    this.brands = uniqueMap(this.__transferProducts, 'brand');
    this.itemCodes = uniqueMap(this.__transferProducts, 'itemCode');
    // this.targetShelfs = uniqueMap(this.__transferProducts, 'targetShelf');
    this.descriptions = uniqueMap(this.__transferProducts, 'description');
    this.productHierarchyLevel01s = uniqueMap(this.__transferProducts, 'productHierarchyLevel01');
    this.productHierarchyLevel02s = uniqueMap(this.__transferProducts, 'productHierarchyLevel02');
    this.productHierarchyLevel03s = uniqueMap(this.__transferProducts, 'productHierarchyLevel03');

  }

  brands: any[] = []
  itemCodes: any[] = []
  shelfNos: any[] = []
  // targetShelfs: any[] = []
  descriptions: any[] = []
  productHierarchyLevel01s: any[] = []
  productHierarchyLevel02s: any[] = []
  productHierarchyLevel03s: any[] = []
  //tablo filtrelendiğinde en üstte kalanı üste atar
  logFilteredData(event: any) {

    try {
      if (event.filteredValue) {
        console.log('Filtered data:', event.filteredValue);
        var list: FastTransfer_VM[] = event.filteredValue;
        this.lastCollectedProduct = null;
        this._transferProducts = [list[0]];
        this.lastCollectedProduct = list[0];
        this.mapProducts(list)

      } else {
        var list: FastTransfer_VM[] = [event];
        this.lastCollectedProduct = null;
        this._transferProducts = [list[0]];
        this.lastCollectedProduct = list[0];
        this.mapProducts(list)
      }
      this.toasterService.info("Hedef Ürün Güncellendi")

    } catch (error) {
      this.toasterService.error(error.message)
    }

  }


  async getTransferRequestListModel(type: string) {
    if (type == '4') {
      await this.getTransferRequestListModel2(type);
      return;
    }
    const response = await this.warehouseService.getTransferRequestListModel(
      type, this.shelfNo
    );
    this.selectedButton = Number(type);

    //toplanacak ürünler getirildi
    if (type === '0') {
      this.toasterService.success('Varsayılan Ürünler Getirildi');
    } else if (type === '1') {
      this.toasterService.success('Raflar Fullendi');
    } else if (type === '2') {
      this.toasterService.success('Çanta Ürünleri Getirildi');
    }
    else if (type === '3') {
      this.toasterService.success('Çanta Dan Rafa Ürünleri Getirildi');
    }
    //toplanacak ürünler atandı
    this.transferProducts = response;

    if (this.deletedProductList.length > 0) {
      this.deletedProductList.forEach((deletedItem) => {
        this.transferProducts.forEach((inventoryItem, _index) => {
          if (
            inventoryItem.barcode === deletedItem.barcode &&
            inventoryItem.shelfNo === deletedItem.shelfNo &&
            inventoryItem.itemCode === deletedItem.itemCode
          ) {
            this.transferProducts.splice(_index, 1);
          }
        });
      });
    }

    // İşlem sonrası çıkarılacak öğelerin indekslerini tutacak dizi
    let itemsToRemoveIndexes: number[] = [];

    // inventoryItems üzerinde döngü
    this.transferProducts.forEach((inventoryItem, index) => {
      //transfer edilcek ürünler
      // Eşleşme arama ve güncelleme
      this.collectedProducts.forEach((transferItem) => {
        //toplanan ürünler
        // barcode, shelfNo ve itemCode değerlerine göre eşleşme kontrolü
        if (
          inventoryItem.barcode === transferItem.barcode &&
          inventoryItem.targetShelf === transferItem.targetShelfNo &&
          inventoryItem.shelfNo === transferItem.shelfNo
        ) {
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
    this.fillShelfNo(1);


  }

  fillShelfNo(type: number) {
    if (type == 1) {
      this.checkForm.get('shelfNo').setValue(this.transferProducts[0].shelfNo)
    } else if (type == 2) {
      this.checkForm.get('shelfNo').setValue(this.__transferProducts[0].shelfNo)
    }
  }
  calculateTotalQty() {
    //toplanan ürünler yazısı için
    let totalQty = 0;
    this.collectedFastTransferModels.forEach((item) => {
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
      quantity: [null, Validators.required],
      batchCode: [null],
      targetShelfNo: [null, Validators.required],
    });

    this.checkForm.get('office').valueChanges.subscribe((value) => {
      if (value === 'M') {
        this.checkForm.get('warehouseCode').setValue('MD');
      }
    });

    this.checkForm.get('office').valueChanges.subscribe((value) => {
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

  finishTransfer(model: any) {
    this.generalService.waitAndNavigate(
      'Hızlı Transfer İşlemi Başarılı',
      'dashboard'
    );
  }

  baglist: string[] = ['2', '4', '5', '6', '7', '8', '0'];

  async setCheckBarcode(product: FastTransferModel2): Promise<FastTransferModel2> {
    try {
      if (product.barcode.includes('http') || this.generalService.isGuid(product.barcode)) {
        var result: string[] = await this.productService.countProductByBarcode3(
          product.barcode
        );

        var updated_product = product;
        updated_product.barcode = result[3];
        this.checkForm.get('barcode').setValue(result[3]);
        return updated_product;
      } else {
        var result: string[] = await this.productService.countProductByBarcode(
          product.barcode
        );

        var updated_product = product;
        updated_product.barcode = result[3];
        this.checkForm.get('barcode').setValue(result[3]);
        return updated_product;
      }
    } catch (error) {
      this.toasterService.error(error.message);
      return null;
    }
  }


  async addProduct(product: FastTransfer_VM) {


    this.checkForm.get('barcode').setValue(product.itemCode.toUpperCase());
    this.checkForm.get('shelfNo').setValue(product.shelfNo.toUpperCase());
    this.checkForm.get('targetShelfNo').setValue(product.targetShelf.toUpperCase());
    this.checkForm.get('quantity').setValue(product.transferQuantity);

    if (this.checkForm.valid) {
      await this.onSubmit(this.checkForm.value);
    } else {
      this.toasterService.error("Form Geçerli Değil")
    }


  }
  async setFormValues(
    product: FastTransferModel2
  ): Promise<FastTransferModel2> {
    try {
      if (
        product.barcode.includes('http') ||
        this.generalService.isGuid(product.barcode)
      ) {
        var result: string[] = await this.productService.countProductByBarcode3(
          product.barcode
        );
        if (result[0].includes('CANTA')) {
          // Eğer varsa, virgülle ayrılmış öğeler listesi oluşturup "CANTA" olanı çıkarıyoruz
          var items = result[0].split(',');
          items = items.filter((item) => !item.startsWith('CANTA'));
          // Daha sonra, result[0]'ı güncelliyoruz
          result[0] = items.join(',');
        }
        this.shelfNumbers = result[0];
        this.checkForm.get('batchCode').setValue(result[2]);
        this.checkForm.get('barcode').setValue(result[3]);
        this.checkForm.get('quantity').setValue(Number(result[1]));

        if (this.baglist.includes(this.currentPageType)) {//SADECE CANTADA HEDEF RAF DOLUMU ISTENDI 06.05
          var finded_product = this.transferProducts.find(p => p.barcode == result[3]);
          if (finded_product) {
            this.checkForm.get('targetShelfNo').setValue(finded_product.targetShelf);
            this.checkForm.get('shelfNo').setValue(finded_product.shelfNo);
            updatedProduct.shelfNo = finded_product.shelfNo;
            updatedProduct.targetShelfNo = finded_product.targetShelf;
          }
        }
        var updatedProduct: FastTransferModel2 = product;
        updatedProduct.barcode = result[3];
        updatedProduct.batchCode = result[2];
        updatedProduct.quantity = Number(result[1]);
        return updatedProduct;
      } else {
        var result: string[] = await this.productService.countProductByBarcode(
          product.barcode
        );
        var updatedProduct: FastTransferModel2 = product;
        this.shelfNumbers = result[0];
        this.checkForm.get('batchCode').setValue(result[2]);
        this.checkForm.get('barcode').setValue(result[3]);
        this.checkForm.get('quantity').setValue(Number(result[1]));
        if (this.baglist.includes(this.currentPageType)) {//SADECE CANTADA HEDEF RAF DOLUMU ISTENDI 06.05
          var finded_product = this.transferProducts.find(p => p.barcode == result[3]);
          if (finded_product) {
            this.checkForm.get('targetShelfNo').setValue(finded_product.targetShelf);
            this.checkForm.get('shelfNo').setValue(finded_product.shelfNo);
            updatedProduct.shelfNo = finded_product.shelfNo;
            updatedProduct.targetShelfNo = finded_product.targetShelf;
          }
        }

        updatedProduct.barcode = result[3];
        updatedProduct.batchCode = result[2];
        updatedProduct.quantity = Number(result[1]);
        return updatedProduct;
      }
    } catch (error) {
      this.toasterService.error(error.message);
      return null;
    }
  }
  qrBarcodeUrl: string = null;
  qrOperationModels: QrOperationModel[] = [];
  async onSubmit(transferModel: FastTransferModel2): Promise<any> {
    if (transferModel.barcode.includes('=')) {
      transferModel.barcode = transferModel.barcode.replace(/=/g, '-');
    }
    if (
      transferModel.barcode.includes('http') ||
      this.generalService.isGuid(transferModel.barcode)
    ) {
      this.qrBarcodeUrl = transferModel.barcode;
    }

    if (!this.checkForm.valid) {
      var updated_product = await this.setFormValues(transferModel);
      transferModel = updated_product;
      if (this.checkForm.valid) {
        await
          this.onSubmit(transferModel);//OTOMATIK OLARAK FORMU GÖNDER
      } else {
        this.generalService.whichRowIsInvalid(this.checkForm);
      }
      this.toasterService.success('Form Değerleri Güncellendi');
      return;
    }

    if (this.checkForm.valid === true) {
      transferModel = await this.setCheckBarcode(transferModel);
      transferModel.operationId = this.currentOrderNo;
      console.log(this.shelfNumbers);
      if (this.shelfNumbers == undefined || this.shelfNumbers == null || this.shelfNumbers == "RAFLAR:") {
        var result: string[] = await this.productService.countProductByBarcode(
          transferModel.barcode);

        this.shelfNumbers = result[0];
      }
      const shelves = this.shelfNumbers
        .split(',')
        .filter((raflar) => raflar.trim() !== '')
        .map((raflar) => raflar.toLowerCase());

      if (shelves.includes(transferModel.shelfNo.toLowerCase())) {
        transferModel.quantity = transferModel.quantity;

        var response = await this.addFastTransferModel(transferModel);

        //RAFLAR ARASI TRANSFER YAPILDI----------------------------------
        if (response == true) {
          var qrResponse: QrOperationResponseModel =
            await this.productService.qrOperationMethod(
              this.qrBarcodeUrl,
              this.checkForm,
              transferModel,
              transferModel.quantity,
              false,
              'FT'
            );
          if (qrResponse != null && qrResponse.state === true) {
            this.qrOperationModels.push(qrResponse.qrOperationModel);
          } else if (qrResponse === null) {
            this.qrBarcodeUrl = null;
          }
          //↑↑↑↑↑↑↑↑↑ EĞER QRURl BOŞ DEĞİLSE KONTROL EDİLCEK ↑↑↑↑↑↑↑↑↑

          this.collectedProducts.push(transferModel);
          this.collectedProducts.reverse();
          if (this.selectedButton != 4) {
            await this.getTransferRequestListModel(
              this.selectedButton.toString()
            );
          }

          this.toasterService.success('Okutma Başarılı');
        } else {
          this.toasterService.error('Ekleme Yapılmadı');
        }

        this.generalService.beep();
        this.clearForm();

        if (this.baglist.includes(this.currentPageType)) {
          this.checkForm
            .get('targetShelfNo')
            .setValue(transferModel.targetShelfNo);
        }
      } else {
        if (
          confirm(
            'Raf Bulunamadı! Raf Barkod Doğrulaması Yapılmadan Eklensin mi(2)?'
          )
        ) {
          var response = await this.addFastTransferModel(transferModel);

          //RAFLAR ARASI TRANSFER YAPILDI----------------------------------
          if (response == true) {
            //↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓
            var qrResponse: QrOperationResponseModel =
              await this.productService.qrOperationMethod(
                this.qrBarcodeUrl,
                this.checkForm,
                transferModel,
                transferModel.quantity,
                false,
                'FT'
              );
            if (qrResponse != null && qrResponse.state === true) {
              this.qrOperationModels.push(qrResponse.qrOperationModel);
            } else if (qrResponse === null) {
              this.clearForm();

              if (this.baglist.includes(this.currentPageType)) {
                this.checkForm
                  .get('targetShelfNo')
                  .setValue(transferModel.targetShelfNo);
              }
            }
            this.collectedProducts.push(transferModel);
            this.collectedProducts.reverse();
            if (this.selectedButton != 4) {
              await this.getTransferRequestListModel(
                this.selectedButton.toString()
              );
            }
            this.toasterService.success('Okutma Başarılı');
            this.generalService.beep();
          } else {
            this.toasterService.error('Ekleme Yapılmadı');
          }
          this.clearForm();
          if (this.baglist.includes(this.currentPageType)) {
            this.checkForm
              .get('targetShelfNo')
              .setValue(transferModel.targetShelfNo);
          }
        }
      }
    }
  }

  async deleteFastTransfer(qrModel: FastTransferModel2) {
    const confirmDelete = window.confirm(
      'Bu hareketi silmek istediğinizden emin misiniz?'
    );

    if (confirmDelete) {
      var response = await this.deleteFastTransferModel(qrModel.id);
      if (response) {
        this.deleteFromList(qrModel);
      }
      var model: QrOperationModel = new QrOperationModel();
      var qrOperationModel: QrOperationModel = new QrOperationModel();

      qrOperationModel = this.qrOperationModels.find(
        (p) =>
          p.barcode == qrModel.barcode &&
          p.batchCode == qrModel.batchCode &&
          p.shelfNo == qrModel.shelfNo
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
          //this.generalService.beep3();
          //this.toasterService.success('Qr Operasyonu Geri Alındı');
        } else {
          // this.toasterService.error('Qr Operasyonu Geri Alınamadı');
        }
      } else {
        //  this.toasterService.error('Qr Operasyonu Geri Alınamadı');
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
    if (this.currentPageType == "2") {//sadece çanta için
      this.checkForm.get('shelfNo').setValue(this.lastCollectedProduct.shelfNo);
      this.focusNextInput('barcode');
    } else {
      this.focusNextInput('shelfNo');
    }
    this.qrBarcodeUrl = null;
    this.shelfNumbers = 'RAFLAR:';
    this.calculateTotalQty();
  }

}
