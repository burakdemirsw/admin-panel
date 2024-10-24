import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { Exception } from '@zxing/library';
import { CreatePurchaseInvoice } from 'src/app/models/model/invoice/createPurchaseInvoice';
import { ProductList_VM, ProductList_VM_2 } from 'src/app/models/model/product/productList_VM';
import { QrCode } from 'src/app/models/model/product/qrCode';
import { GeneralService } from 'src/app/services/admin/general.service';
import { HeaderService } from 'src/app/services/admin/header.service';
import { BarcodeSearch_RM, ProductService } from 'src/app/services/admin/product.service';
import { HttpClientService } from 'src/app/services/http-client.service';
import { ToasterService } from 'src/app/services/ui/toaster.service';
import { FastTransfer_VM } from '../../../models/model/warehouse/transferRequestListModel';
import { OverlayOptions } from 'primeng/api';
declare var window: any;
@Component({
  selector: 'app-search-qr',
  templateUrl: './search-qr.component.html',
  styleUrls: ['./search-qr.component.css']
})
export class SearchQrComponent implements OnInit {

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
    private generalService: GeneralService
  ) { }
  currentId: string = null
  qrForm: FormGroup;
  async ngOnInit() {

    this.headerService.updatePageTitle("Ürün & Qr Sorgulama")
    this.activatedRoute.params.subscribe(async (params) => {
      this.currentId = params['id']
      if (this.currentId != null) {
        await this.getProducts(this.currentId);
      }
      // this.toasterService.success(this.currentId)
    })
    //this.spinnerService.show();

    this.formGenerator();

    //this.spinnerService.hide();
  }
  qrCodeValue: string;

  invoiceProducts2: CreatePurchaseInvoice[] = [];



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
    this.modalImageUrl = imageUrl;
    if (!this.formModal) {
      this.formModal = new window.bootstrap.Modal(
        document.getElementById('myModal')
      );
    }
    this.formModal.show();
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
  async getProducts(barcode: string) {

    if (this.generalService.isGuid(barcode) || barcode.includes('http')) {
      this._products = []
      if (this.currentId || barcode) {
        const response = await this.productService.getQr(barcode);
        this.qrCodes = response;

        return response;
      } else {
        throw new Exception("id alanı boş")
      }
    } else {
      this.qrCodes = []
      await this.getProducts2(barcode);
    }

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
    await this.getProducts(value.barcode);
    // await this.getAllProducts();
    this.toasterService.success(value.barcode);
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
    if (this.allProducts.length === 0) {
      this.allProducts = await this.productService.searchProduct5();
      this.mapProducts(this.allProducts);
      this.filterProducts(); // İlk başta tüm ürünleri göstermek için çağrılır
    }
    this.toasterService.success('Tüm Ürünler Getirildi');
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
    this.mapProducts(this.filteredProducts);

  }


  getPrice(price: string) {
    return Number(price).toFixed(2);
  }

  // Filtre seçimi değiştiğinde çağrılan fonksiyon
  onFilterChange() {
    this.filterProducts();
  }

  // basketProducts: FastTransfer_VM[] = []
  // addToBasket(p: FastTransfer_VM) {
  //   var r = this.basketProducts.some(p => p.itemCode == p.itemCode)
  //   if (r) {
  //     this.toasterService.error("Bu Ürün Daha Önce Seçildi");
  //   } else {
  //     this.basketProducts.push(p);
  //   }

  // }
}
