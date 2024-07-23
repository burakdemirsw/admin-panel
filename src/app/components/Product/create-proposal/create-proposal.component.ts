import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { CreatePurchaseInvoice } from 'src/app/models/model/invoice/createPurchaseInvoice';
import { SuggestedProduct } from 'src/app/models/model/order/suggestedProduct';
import { ProposalProduct_SM, ZTMSG_ProposalProduct } from 'src/app/models/model/product/proposalProduct_SM';
import { GeneralService } from 'src/app/services/admin/general.service';
import { HeaderService } from 'src/app/services/admin/header.service';
import { OrderService } from 'src/app/services/admin/order.service';
import { BarcodeSearch_RM, ProductService } from 'src/app/services/admin/product.service';
import { HttpClientService } from 'src/app/services/http-client.service';
import { ToasterService } from 'src/app/services/ui/toaster.service';
import { ZTMSG_ProposalProduct_VM } from '../../../models/model/product/proposalProduct_SM';

@Component({
  selector: 'app-create-proposal',
  templateUrl: './create-proposal.component.html',
  styleUrl: './create-proposal.component.css'
})
export class CreateProposalComponent implements OnInit {
  currentPage = 1;
  proposalId;
  getProductsForm: FormGroup;
  async ngOnInit() {
    this.headerService.updatePageTitle("Teklif Oluştur")
    this.formGenerator();
    this.activatedRoute.params.subscribe(async p => {
      if (p["id"]) {
        this.proposalId = p["id"];
        await this.getProposalProducts(this.proposalId)
      }
    }

    )
  }

  constructor(
    private generalService: GeneralService,
    private toasterService: ToasterService,
    private headerService: HeaderService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private productService: ProductService,
    private formBuilder: FormBuilder,
    private sanitizer: DomSanitizer,
    private httpClientService: HttpClientService,
    private orderService: OrderService
  ) { }

  qrCodeValue: string;
  modalImageUrl: string;
  formModal: any;
  searchedProductDialog: boolean = false;
  async deleteProposalProduct(proposalId: number) {

    const response: ProposalProduct_SM[] = await this.productService.deleteProposalProduct(proposalId);
    if (response) {
      this.toasterService.success("Silindi")
      await this.getProposalProducts(this.proposalId);
    }
  }

  async getProposalProducts(proposalId: string) {

    const response: ZTMSG_ProposalProduct[] = await this.productService.getProposalProducts(proposalId);
    this.selectedProducts = response;
  }

  async addProposalProduct(request: ZTMSG_ProposalProduct_VM) {

    var _request: ZTMSG_ProposalProduct = new ZTMSG_ProposalProduct();
    _request.operationId = request.operationId;
    _request.lineId = request.lineId;
    _request.barcode = request.barcode;
    _request.description = request.description;
    _request.warehouseCode = request.warehouseCode;
    _request.photoUrl = request.photoUrl;
    _request.shelfNo = request.shelfNo;
    _request.itemCode = request.itemCode;
    _request.batchCode = request.batchCode;
    _request.price = request.price;
    _request.discountedPrice = request.discountedPrice;
    _request.basePrice = request.basePrice;
    _request.quantity = request.quantity;
    _request.quantity2 = request.quantity2;
    _request.taxRate = request.taxRate;
    _request.operationId = this.proposalId;
    const response: ProposalProduct_SM[] = await this.productService.addProposalProduct(_request);
    if (response) {
      this.toasterService.success("Eklendi")
      this.searchedProductDialog = false;
      await this.getProposalProducts(this.proposalId);
    }

  }
  _products: ProposalProduct_SM[] = [];
  products: ZTMSG_ProposalProduct[] = [];
  selectedProducts: ZTMSG_ProposalProduct[] = [];

  async searchProposalProducts(model: ProposalProduct_SM) {
    try {
      const response = await this.productService.searchProposalProducts(model);
      this._products = response;
      if (this._products.length > 0) {
        await this.getProducts(this._products[0].barcode);
      }
      // this.searchedProductDialog = true;
      return response;
    } catch (error: any) {
      console.log(error.message);
      return null;
    }
  }
  formGenerator() {
    try {
      this.getProductsForm = this.formBuilder.group({
        // photoUrl: [null],
        itemCode: [null, Validators.required],
        // itemDescription: [null],
        // colorCode: [null],
        // colorDescription: [null],
        // itemDim1Code: [null],
        // barcode: [null, Validators.required],
        // price: [0,],
        // price2: [0],
        // attribute1: [null],
        // attribute2: [null],
        // attribute3: [null],
        // attribute4: [null],
        // attribute5: [null],
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


  clearBarcode() {
    this.getProductsForm.get('barcode').setValue(null);
    this.focusNextInput('barcode');
  }
  focusNextInput(nextInputId: string) {
    const nextInput = document.getElementById(nextInputId) as HTMLInputElement;
    if (nextInput) {
      nextInput.focus();
    }
  }

  async getProducts(barcode: any) {


    try {

      if (barcode.includes('http') || this.generalService.isGuid(barcode)) {

        var result: string[] = await this.productService.countProductByBarcode3(
          barcode

        );
        if (result == null) {
          this.toasterService.error("Qr Sorgusu Hatalı");
          return;
        }

        this.getProductsForm.get('barcode').setValue(result[3]);
        barcode = result[3];
        this.getProducts(barcode);
        this.toasterService.success("Form Verileri Güncellendi")
        return;
      }

      var _request = new BarcodeSearch_RM();
      _request.barcode = barcode;

      const response = await this.productService.searchProduct4(_request);

      if (response.length == 0) {
        this.toasterService.error("Ürün Sorgusundan Yanıt Alınamadı");
        await this.getsuggestedProducts(_request.barcode, true)
        this.getProductsForm.get('barcode').setValue(null);
        return;
      }
      this.products = response;
      if (this.products.length > 0) {
        this.products.forEach(async p => {
          if (p.quantity <= 0) {
            this.toasterService.error("STOK HATASI")
            this.products = [];
            this.getProductsForm.get('barcode').setValue(null);

            await this.getsuggestedProducts(_request.barcode, true)
            return;
          }

        });

        var totalQuantity = 0;
        this.selectedProducts.forEach(product => {
          if (product.barcode === this.products[0].barcode) {
            totalQuantity += product.quantity;
          }
        });

        if (totalQuantity >= this.products[0].quantity) {
          this.toasterService.error("STOK HATASI")
          this.products = [];
          this.getProductsForm.get('barcode').setValue(null);
          await this.getsuggestedProducts(_request.barcode, true)

          return;
        } else {
          this.toasterService.success(this.products.length + " Adet Ürün Bulundu")
          for (const _product of this.products) {
            await this.addProposalProduct(_product);

          }
          this.getProductsForm.get('barcode').setValue(null);
          this.products = [];
        }
      } else {
        this.toasterService.error("Ürün Bulunamadı")
      }
      this.getProductsForm.get('barcode').setValue(null);
      return;
    } catch (error: any) {

      return;
    }
  }
  suggestedProducts: SuggestedProduct[] = [];

  async routeGetProduct(request: string) {
    this.getProductsForm.get('barcode').setValue(request);
    await this.getProducts(this.getProductsForm.value)
  }
  async getsuggestedProducts(itemCode: string, openDialog: boolean) {
    this.suggestedProducts = []
    var response: SuggestedProduct[] = await this.orderService.getSuggestedProducts(itemCode);
    this.suggestedProducts = response
    if (openDialog) {
      this.openDialog("suggestedProductsDialog");

    }
  }
  suggestedProductsDialog: boolean = false;
  openDialog(dialogName: string) {

    if (dialogName === "suggestedProductsDialog") {
      this.suggestedProductsDialog = !this.suggestedProductsDialog
    }
  }

}
