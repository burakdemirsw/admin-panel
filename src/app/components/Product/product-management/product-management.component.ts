import { Component, OnInit } from '@angular/core';
import { Product } from 'src/app/models/model/product/product';
import { ProductDetail } from 'src/app/models/model/product/productDetail';
import { ProductModel } from 'src/app/models/model/product/productModel';
import { HttpClientService } from 'src/app/services/http-client.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ProductList_VM } from 'src/app/models/model/product/productList_VM';
import { BarcodeSearch_RM, ProductService } from 'src/app/services/admin/product.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CreatePurchaseInvoice } from 'src/app/models/model/invoice/createPurchaseInvoice';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { GeneralService } from 'src/app/services/admin/general.service';
import { ToasterService } from 'src/app/services/ui/toaster.service';
declare var window: any;
@Component({
  selector: 'app-product-management',
  templateUrl: './product-management.component.html',
  styleUrls: ['./product-management.component.css'],
})
export class ProductManagementComponent implements OnInit {
  products: ProductList_VM[] = [];
  showImage = false; // add this property
  view = true;
  constructor(
    private httpClientService: HttpClientService,
    private toasterService: ToasterService,
    private spinnerService: NgxSpinnerService,
    private productService: ProductService,
    private formBuilder: FormBuilder, private sanitizer: DomSanitizer,
    private generalService: GeneralService
  ) { }
  productForm: FormGroup;
  ngOnInit(): void {
    //this.spinnerService.show();

    this.formGenerator();

    //this.spinnerService.hide();
  }
  qrCodeValue: string;

  invoiceProducts2: CreatePurchaseInvoice[] = [];
  createJson(barcode: string, shelfNo: string) {

    var model: ProductList_VM = this.products.find(
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
      this.productForm = this.formBuilder.group({
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

  async getProducts(barcode: string) {
    try {

      if (barcode.includes("=")) {
        barcode = barcode.replace(/=/g, "-");

      }
      var model: BarcodeSearch_RM = new BarcodeSearch_RM();
      model.barcode = barcode;
      const response = await this.productService.searchProduct(model);
      this.products = response;
      return response;
    } catch (error: any) {
      console.log(error.message);
      return null;
    }
  }
  clearBarcode() {
    this.productForm.get('barcode').setValue(null);
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
    this.toasterService.success(value.barcode);
  }
}
