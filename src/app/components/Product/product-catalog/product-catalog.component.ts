import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Exception } from '@zxing/library';
import { OverlayOptions } from 'primeng/api';
import { CreatePurchaseInvoice } from 'src/app/models/model/invoice/createPurchaseInvoice';
import { ProductList_VM_2 } from 'src/app/models/model/product/productList_VM';
import { QrCode } from 'src/app/models/model/product/qrCode';
import { CatalogProduct, FastTransfer_VM, CatalogHeader } from 'src/app/models/model/warehouse/transferRequestListModel';
import { CatalogService } from 'src/app/services/admin/catalog.service';
import { GeneralService } from 'src/app/services/admin/general.service';
import { HeaderService } from 'src/app/services/admin/header.service';
import { BarcodeSearch_RM, ProductService } from 'src/app/services/admin/product.service';
import { HttpClientService } from 'src/app/services/http-client.service';
import { ToasterService } from 'src/app/services/ui/toaster.service';

@Component({
  selector: 'app-product-catalog',
  templateUrl: './product-catalog.component.html',
  styleUrl: './product-catalog.component.css'
})
export class ProductCatalogComponent implements OnInit {
  qrCodes: QrCode[] = [];
  showImage = false; // add this property
  view = true;

  constructor(
    private toasterService: ToasterService,

    private productService: ProductService,
    private formBuilder: FormBuilder, private sanitizer: DomSanitizer,
    private httpClientService: HttpClientService,
    private activatedRoute: ActivatedRoute,
    private headerService: HeaderService,
    private generalService: GeneralService,
    private catalogService: CatalogService,
    private router: Router
  ) { }
  currentId: string = null
  qrForm: FormGroup;
  async ngOnInit() {

    this.headerService.updatePageTitle("Katalog Oluşturma")
    this.activatedRoute.params.subscribe(async (params) => {
      this.allProducts = await this.productService.searchProduct5();
      this.currentId = params['id']
      if (this.currentId != null) {
        await this.getAllProducts();
        await this.getHeader()
        // this.toasterService.success(this.currentId)
        await this.getProducts(this.currentId);
      }
    })
    //this.spinnerService.show();

    this.formGenerator();

    //this.spinnerService.hide();
  }
  qrCodeValue: string;

  invoiceProducts2: CreatePurchaseInvoice[] = [];


  catalogHeader: CatalogHeader
  headerDesc: string

  async getHeader() {
    var r = await this.catalogService.getCatalogHeaderById(this.currentId);
    this.catalogHeader = r
  }
  async addHeader() {
    var request: CatalogHeader = new CatalogHeader();
    request.createdDate = this.generalService.getCurrentDatetime_2();
    request.updatedDate = this.generalService.getCurrentDatetime_2();
    request.description = this.headerDesc;
    request.id = this.currentId;

    var response = await this.catalogService.addCatalogHeader(request);
    if (response) {
      this.catalogHeader = response;
      this.toasterService.success("Başlık Eklendi")
    }
  }

  udpateHeader() {
    var request: CatalogHeader = new CatalogHeader();
    request.createdDate = this.generalService.getCurrentDatetime_2();
    request.updatedDate = this.generalService.getCurrentDatetime_2();
    request.description = this.headerDesc;
    request.id = this.catalogHeader.id;
  }

  createJson(barcode: string, shelfNo: string) {

    var model: QrCode = this.qrCodes.find(
      (p) => (p.barcode = barcode) && p.shelfNo == shelfNo
    );
    const formDataJSON = JSON.stringify(model.barcode + "--" + model.batchCode + "--" + model.itemCode); // Form verilerini JSON'a dönüştür

    this.qrCodeValue = formDataJSON;
    // this.toasterService.success(this.qrCodeValue)

  }
  modalImageUrl: string;
  formModal: any;
  openImageModal(imageUrl: string) {

  }


  qrCodeDownloadLink: any = this.sanitizer.bypassSecurityTrustResourceUrl('');
  onChangeURL(url: SafeUrl) {
    this.qrCodeDownloadLink = url;
    this.openImageModal(this.qrCodeDownloadLink);
    this.qrCodeValue = ''
  }

  formGenerator() {
    try {
      this.qrForm = this.formBuilder.group({
        barcode: [null, Validators.required],
      });
    } catch (error: any) {
      this.toasterService.error(error.message);
    }
  }

  selectedProductList: number[] = [];
  visible: boolean = false;
  openShelvesModal(id: any) {
    this.visible = true;
  }

  async print(base64Code: string) {
    const confirmDelete2 = window.confirm("Yazıcıdan Yazdırılacaktır. Emin misiniz?");
    if (confirmDelete2) {
      var requestModel = { imageCode: base64Code, printCount: 1 };
      var response = await this.httpClientService.post<any>({ controller: 'Order/Qr' }, requestModel).toPromise();
      // Base64 veriyi konsola bas
      if (response) {
        this.toasterService.success("Yazdırıldı")
      }
      // console.log(imgData.split('base64,')[1]);

    }
  }
  async getProducts(id: string) {

    this.basketProducts = await this.catalogService.getCatalogProducts(id)

  }

  _products: ProductList_VM_2[] = [];
  groupedProducts = [];



  groupProductsByWarehouse() {
    const grouped = this._products.reduce((acc, product) => {
      const warehouseCode = product.warehouseCode;
      if (!acc[warehouseCode]) {
        acc[warehouseCode] = { warehouseCode, products: [] };
      }
      acc[warehouseCode].products.push(product);
      return acc;
    }, {});

    this.groupedProducts = Object.values(grouped);
  }

  calculateTotalStock(products) {
    return products.reduce((sum, product) => sum + product.quantity, 0);
  }

  calculateTotalShelfStock(products) {
    return products.reduce((sum, product) => sum + product.shelfQuantity, 0);
  }


  async getProducts2(barcode: string) {
    try {


      if (barcode.includes("=")) {
        barcode = barcode.replace(/=/g, "-");

      }
      var model: BarcodeSearch_RM = new BarcodeSearch_RM(barcode);
      this.focusNextInput('barcode');
      this.qrForm.reset();
      const response = await this.productService._searchProduct(model);
      this._products = response;
      this.groupProductsByWarehouse();
      return response;
    } catch (error: any) {
      console.log(error.message);
      return null;
    }
  }
  clearBarcode() {
    this.qrForm.get('barcode').setValue(null);
    this.focusNextInput('barcode');
  }
  focusNextInput(nextInputId: string) {
    const nextInput = document.getElementById(nextInputId) as HTMLInputElement;
    if (nextInput) {
      nextInput.focus();
    }
  }
  async onSubmit(value: any) {
    // await this.getProducts(value.barcode);
    await this.getAllProducts();
    // this.toasterService.success(value.barcode);
  }
  //-------------------------------------------
  overlayOptions: OverlayOptions = {
    appendTo: 'body',  // Example of setting where the overlay should be appended
    autoZIndex: true,
    baseZIndex: 1000,
    styleClass: 'custom-overlay-class' // Custom CSS class
  };
  brands: any[] = [];
  itemCodes: any[] = [];
  shelfNos: any[] = [];
  descriptions: any[] = [];
  productHierarchyLevel01s: any[] = [];
  productHierarchyLevel02s: any[] = [];
  productHierarchyLevel03s: any[] = [];

  // Seçilen filtreleme değerleri
  selectedBrand: string = '';
  selectedItemCode: string = '';
  selectedShelfNo: string = '';
  selectedDescription: string = '';
  selectedHierarchy1: string = '';
  selectedHierarchy2: string = '';
  selectedHierarchy3: string = '';

  allProducts: FastTransfer_VM[] = [];
  filteredProducts: FastTransfer_VM[] = [];

  async getAllProducts() {
    this.allProducts = await this.productService.searchProduct5();
    this.mapProducts(this.allProducts);
    this.filterProducts(); // İlk başta tüm ürünleri göstermek için çağrılır
  }

  mapProducts(data: FastTransfer_VM[]) {
    const uniqueMap = (array: any[], key: string) => {
      const map = new Map();
      array.forEach(item => {
        if (!map.has(item[key])) {
          map.set(item[key], item[key]);
        }
      });
      return Array.from(map.values()).sort((a, b) => a.localeCompare(b));
    };

    this.shelfNos = uniqueMap(data, 'shelfNo');
    this.brands = uniqueMap(data, 'brand');
    this.itemCodes = uniqueMap(data, 'itemCode');
    this.descriptions = uniqueMap(data, 'description');
    this.productHierarchyLevel01s = uniqueMap(data, 'productHierarchyLevel01');
    this.productHierarchyLevel02s = uniqueMap(data, 'productHierarchyLevel02');
    this.productHierarchyLevel03s = uniqueMap(data, 'productHierarchyLevel03');

    // Filtreleme işlemi için verileri ilk başta doldurur
    this.filteredProducts = [...data];
  }

  filterProducts() {
    this.filteredProducts = this.allProducts.filter(product => {
      return (
        (this.selectedBrand ? product.brand === this.selectedBrand : true) &&
        (this.selectedItemCode ? product.itemCode === this.selectedItemCode : true) &&
        (this.selectedShelfNo ? product.shelfNo === this.selectedShelfNo : true) &&
        (this.selectedDescription ? product.description === this.selectedDescription : true) &&
        (this.selectedHierarchy1 ? product.productHierarchyLevel01 === this.selectedHierarchy1 : true) &&
        (this.selectedHierarchy2 ? product.productHierarchyLevel02 === this.selectedHierarchy2 : true) &&
        (this.selectedHierarchy3 ? product.productHierarchyLevel03 === this.selectedHierarchy3 : true)
      );
    });
    this.paginatedProducts = this.filteredProducts.slice(0, this.itemsPerPage);

    this.mapProducts(this.filteredProducts);

  }


  getPrice(price: string) {
    return Number(price).toFixed(2);
  }

  // Filtre seçimi değiştiğinde çağrılan fonksiyon
  onFilterChange() {
    this.filterProducts();
  }

  basketProducts: CatalogProduct[] = []
  async addToBasket(product: FastTransfer_VM | CatalogProduct) {
    // Sepette ürünün var olup olmadığını kontrol et

    if (!this.catalogHeader) {
      await this.addHeader()
      if (!this.catalogHeader) {
        return;
      } else {
        await this._addToBasket(product);
      }
    } else {
      await this._addToBasket(product);
    }

  }
  async _addToBasket(product: FastTransfer_VM | CatalogProduct) {
    const index = this.basketProducts.findIndex(basketProduct => basketProduct.itemCode === product.itemCode);

    if (index > -1) {
      // Ürün sepette bulunursa çıkar
      var request: CatalogProduct = this.convertToCatalogProduct(product);
      var id = this.basketProducts.find(p => p.itemCode == product.itemCode).id
      var delete_response = await this.catalogService.deleteCatalogProduct(id);
      if (delete_response) {
        this.toasterService.info("Ürün çıkarıldı");
        await this.getProducts(this.currentId);
      }
    } else {
      // Ürün sepette yoksa ekle
      var request: CatalogProduct = this.convertToCatalogProduct(product);
      var add_response = await this.catalogService.addCatalogProduct(request);
      if (add_response) {
        this.toasterService.success("Eklendi");
        await this.getProducts(this.currentId);
      }
      // this.basketProducts.push(product);

    }
  }

  checkProduct(product: FastTransfer_VM): boolean {
    return this.basketProducts.some(basketProduct => basketProduct.itemCode === product.itemCode);
  }
  itemsPerPage: number = 112; // İlk sayfa boyutu
  paginatedProducts: FastTransfer_VM[] = []; // Sayfalama için gösterilecek ürünler

  // Sayfalama değişikliklerini yönetmek için kullanılan fonksiyon
  onPageChange(event: any) {
    this.itemsPerPage = event.rows;
    const start = event.first;
    const end = start + this.itemsPerPage;
    this.paginatedProducts = this.filteredProducts.slice(start, end);
  }
  convertToCatalogProduct(product: FastTransfer_VM): CatalogProduct {
    return {
      id: null, // Eğer bir ID yoksa, boş bırakıyoruz.
      headerId: this.catalogHeader.id, // Aynı şekilde, headerId boş bırakılıyor.
      barcode: product.barcode,
      itemCode: product.itemCode,
      shelfNo: product.shelfNo,
      drawerCount: product.drawerCount,
      transferQuantity: product.transferQuantity,
      targetShelf: product.targetShelf,
      quantity: product.quantity,
      productHierarchyLevel01: product.productHierarchyLevel01,
      productHierarchyLevel02: product.productHierarchyLevel02,
      productHierarchyLevel03: product.productHierarchyLevel03,
      speed: product.speed,
      inventory: product.inventory,
      brand: product.brand,
      photoUrl: product.photoUrl,
      price: product.price,
      description: product.description,
      attribute1: product.attribute1,
      attribute2: product.attribute2,
      currencyCode: product.currencyCode,
      batchCode: product.batchCode
    };
  }

  async createCatalogRaport(id: string) {
    await this.catalogService.createCatalogReport(id);
  }

  async deleteBasketProducts() {
    for (var p of this.basketProducts) {
      var delete_response = await this.catalogService.deleteCatalogProduct(p.id);
      if (delete_response) {
        this.toasterService.info("Ürün çıkarıldı");
        await this.getProducts(this.currentId);
      }
    }
  }

  async selectFilteredProducts() {
    var requests: CatalogProduct[] = [];
    for (var p of this.filteredProducts) {
      const index = this.basketProducts.findIndex(basketProduct => basketProduct.itemCode === p.itemCode);

      if (index > -1) {
        continue;
      } else {
        var _request: CatalogProduct = this.convertToCatalogProduct(p);
        requests.push(_request);
      }

    }
    if (requests.length > 0) {
      var add_response = await this.catalogService.addCatalogProductBatch(requests);
      if (add_response) {
        this.toasterService.success("Eklendi");
        await this.getProducts(this.currentId);
      }
    } else {
      this.toasterService.error('Daha Önce Eklendi')
    }


  }
}
