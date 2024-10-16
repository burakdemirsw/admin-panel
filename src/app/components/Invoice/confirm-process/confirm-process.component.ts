import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { OrderLineDetail } from "src/app/models/model/invoice/OrderLineDetail";
import { CollectedInvoiceProduct } from "src/app/models/model/invoice/CollectedInvoiceProduct";
import { UserClientInfoResponse } from 'src/app/models/model/user/userRegister_VM';
import { WarehouseOfficeModel } from 'src/app/models/model/warehouse/warehouseOfficeModel';
import { GeneralService } from 'src/app/services/admin/general.service';
import { HeaderService } from 'src/app/services/admin/header.service';
import { OrderService } from 'src/app/services/admin/order.service';
import { UserService } from 'src/app/services/admin/user.service';
import { WarehouseService } from 'src/app/services/admin/warehouse.service';
import { ToasterService } from 'src/app/services/ui/toaster.service';
import { ProposalLineDetail } from 'src/app/models/model/invoice/ProposalLineDetail';

@Component({
  selector: 'app-confirm-process',
  templateUrl: './confirm-process.component.html',
  styleUrl: './confirm-process.component.css'
})
export class ConfirmProcessComponent implements OnInit {
  constructor(
    private formBuilder: FormBuilder,
    private toasterService: ToasterService,
    private orderService: OrderService,
    private generalService: GeneralService,
    private activatedRoute: ActivatedRoute,
    private headerService: HeaderService,
    private routerService: Router,
    private warehouseService: WarehouseService,
    private userService: UserService
  ) { }
  updateProductForm: FormGroup;
  processId: string;
  processType: string;
  processCode: string;
  selectedProduct: CollectedInvoiceProduct;
  products: CollectedInvoiceProduct[] = [];
  _products: OrderLineDetail[] = [];
  __products: ProposalLineDetail[] = [];
  updateProductDialog: boolean = false;
  updateProductDialog2: boolean = false;
  state: boolean = false;
  state2: boolean = false;

  user: UserClientInfoResponse;
  ngOnInit(): void {
    this.user = this.userService.getUserClientInfoResponse();

    this.activatedRoute.params.subscribe(async (param) => {

      if (param["processCode"] && param["processId"] && param["processType"]) {
        this.processCode = param["processCode"];
        this.processId = param["processId"];
        this.processType = param["processType"];

        if (this.processType == "proposal") {
          this.createUpdateProductForm();
          this.headerService.updatePageTitle("Teklif Onaylama");
          await this.getProducts();
        }
        if (this.processType == "order") {
          this.createUpdateProductForm2();
          await this.getWarehouseAndOffices();
          this.headerService.updatePageTitle("Sipariş Onaylama");
          await this.getProducts();
        }

      }
    })
    throw new Error('Method not implemented.');
  }

  openUpdateDialog(product: CollectedInvoiceProduct) {
    this.selectedProduct = product;
    this.updateProductForm.get('quantity').setValue(this.selectedProduct.quantity)
    this.updateProductDialog = true;
  }

  async updateProduct(product: CollectedInvoiceProduct) {

    // product.requestedShipmentQuantity = this.updateProductForm.get('requestedShipmentQuantity').value;
    // if (product.requestedShipmentQuantity > product.quantity || product.requestedShipmentQuantity < 1) {
    //   this.updateProductForm.get('requestedShipmentQuantity').setValue(1);

    //   this.toasterService.error("Miktar Hatası");
    //   return;
    // }
    // var response = await this.orderService.updateCollectedInvoiceProduct(product);
    // if (response) {

    //   this.toasterService.success('Güncellendi')
    //   this.generalService.beep();
    //   this.updateProductDialog = false
    // } else {
    //   this.toasterService.error('Güncellenmedi')
    // }
  }
  async deleteProposalLineDetail(lineDetail: ProposalLineDetail) {
    var response = await this.orderService.deleteProposalLineDetail(lineDetail.id);
    if (response) {
      this.toasterService.success("Silindi")
      await this.getProducts();
      this.updateProductDialog2 = false;
      return;
    } else {
      this.toasterService.error("Silinemedi");
      this.updateProductDialog2 = false;
      return;
    }

  }
  async addProposalLineDetail() {
    //daha önce eklenen varsa git onları bul
    var quantity: number = 0
    var _v = this.updateProductForm.value;
    var products = this.__products.filter(p => p.lineId == this.selectedProduct.id);
    if (products.length > 0) {
      for (var p of products) {
        quantity += p.requestedShipmentQuantity;
      }
    }
    if (quantity > this.selectedProduct.quantity) {
      this.toasterService.info("Miktar Hatası (1)")
      this.updateProductForm.get('quantity').setValue(1);
      return;
    }

    if (quantity + _v.quantity > this.selectedProduct.quantity) {
      this.toasterService.info("Miktar Hatası (2)")
      this.updateProductForm.get('quantity').setValue(1);
      return;
    }

    var request: ProposalLineDetail = new ProposalLineDetail();
    request.lineId = this.selectedProduct.id;
    request.requestedShipmentQuantity = _v.quantity;
    request.confirmedShipmentQuantity = 0;
    request.userId = this.user.userId;
    var response = await this.orderService.addProposalLineDetail(request);
    if (response) {
      this.toasterService.success("Eklendi")
      await this.getProducts();
      this.updateProductDialog = false;
      return;
    } else {
      this.toasterService.error("Eklenemedi");
      this.updateProductDialog = false;
      return;
    }

  }
  createUpdateProductForm() {
    this.updateProductForm = this.formBuilder.group({
      quantity: [null, Validators.required],
    });


    this.updateProductForm.get('quantity').valueChanges.subscribe(value => {
      if (value !== null) {
        if (value < 0) {
          this.toasterService.info("Miktar Hatası")
          this.updateProductForm.get('quantity').setValue(1);
          return;
        }
      }
    });



  }

  async convertConfirmedWSProposalToWSOrder(processCode: string, id: string) {
    if (window.confirm("Onaylanan Teklifin Ürünleri Siparişe Çevirilecektir. Devam edilsin mi?")) {
      var response = await this.orderService.convertConfirmedWSProposalToWSOrder(this.processType, processCode, id);
      if (response) {
        this.toasterService.success("Teklif, Siparişe Dönüştürüldü");
        this.getProducts()
        // this.getInvoiceList();
      } else {
        this.toasterService.error("Teklif, Siparişe Dönüştürülemedi");
      }
    }

  }


  checkCount2(product: CollectedInvoiceProduct): number {

    var quantity: number = 0
    var products = this.__products.filter(p => p.lineId.toLowerCase() == product.id.toLowerCase());
    if (products.length > 0) {
      for (var p of products) {
        quantity += p.confirmedShipmentQuantity;
      }
    }


    return quantity;

  }

  checkCount3(product: CollectedInvoiceProduct): number {

    var quantity: number = 0
    var products = this.__products.filter(p => p.lineId.toLowerCase() == product.id.toLowerCase());
    if (products.length > 0) {
      for (var p of products) {
        quantity += p.requestedShipmentQuantity;
      }
    }


    return quantity;

  }
  checkDisable2(product: CollectedInvoiceProduct): boolean {

    var quantity: number = 0
    var products = this.__products.filter(p => p.lineId.toLowerCase() == product.id.toLowerCase());
    if (products.length > 0) {
      for (var p of products) {
        quantity += p.confirmedShipmentQuantity;
      }
    }

    //topplanandan bükse dis : false
    if (product.quantity > quantity) {

      return false;
    } else {
      return true;
    }

  }

  //--------------------------------------------------------GENEL KODLAR
  async getProducts() {
    this.products = await this.orderService.getCollectedInvoiceProducts(this.processId);
    if (this.processType != 'order') {
      this.__products = await this.orderService.getProposalLineDetails(this.processId);

      // for (var p of this.products) {
      //   if (p.quantity - p.confirmedShipmentQuantity != 0) {
      //     this.state = true
      //   }
      // }
    }

    if (this.processType == 'order') {
      this._products = await this.orderService.getOrderLineDetails(this.processId);
      for (var _p of this.products) {
        var _s = this.checkDisable(_p)
        if (_s == false) {
          this.state2 = true;
        } else {
          this.state2 = false;
        }
      }
    }
  }
  warehouseModels: WarehouseOfficeModel[] = [];
  offices: any[] = []
  warehouses: any[] = []
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


  //--------------------------------------------------------SİPARİŞ ONAYLAMA
  updateProductForm2: FormGroup;

  async addOrderLineDetail() {
    //daha önce eklenen varsa git onları bul
    var quantity: number = 0
    var _v = this.updateProductForm2.value;
    var products = this._products.filter(p => p.lineId == this.selectedProduct.id);
    if (products.length > 0) {
      for (var p of products) {
        quantity += p.requestedShipmentQuantity;
      }
    }
    if (quantity > this.selectedProduct.quantity) {
      this.toasterService.info("Miktar Hatası (1)")
      this.updateProductForm2.get('requestedShipmentQuantity').setValue(1);
      return;
    }

    if (quantity + _v.requestedShipmentQuantity > this.selectedProduct.quantity) {
      this.toasterService.info("Miktar Hatası (2)")
      this.updateProductForm2.get('requestedShipmentQuantity').setValue(1);
      return;
    }

    var request: OrderLineDetail = new OrderLineDetail();
    request.lineId = this.selectedProduct.id;
    request.requestedShipmentQuantity = _v.requestedShipmentQuantity;
    request.warehouseCode = _v.warehouseCode.code;
    request.userId = this.user.userId;
    var response = await this.orderService.addOrderLineDetail(request);
    if (response) {
      this.toasterService.success("Eklendi")
      await this.getProducts();
      this.updateProductDialog2 = false;
      return;
    } else {
      this.toasterService.error("Eklenemedi");
      this.updateProductDialog2 = false;
      return;
    }

  }
  openUpdateDialog2(product: CollectedInvoiceProduct) {
    this.selectedProduct = product;
    // this.updateProductForm2.get('requestedShipmentQuantity').setValue(this.selectedProduct.requestedShipmentQuantity)
    this.updateProductDialog2 = true;
  }


  createUpdateProductForm2() {
    this.updateProductForm2 = this.formBuilder.group({
      requestedShipmentQuantity: [null, Validators.required],
      warehouseCode: [null, Validators.required]
    });


    // this.updateProductForm2.get('requestedShipmentQuantity').valueChanges.subscribe(value => {
    //   if (value !== null) {
    //     if ((this.selectedProduct.quantity - this.selectedProduct.confirmedShipmentQuantity) < value || value < 0) {
    //       this.toasterService.info("Miktar Hatası")
    //       this.updateProductForm2.get('requestedShipmentQuantity').setValue(1);
    //       return;
    //     }
    //   }
    // });



  }

  async deleteOrderLineDetail(lineDetail: OrderLineDetail) {
    var response = await this.orderService.deleteOrderLineDetail(lineDetail.id);
    if (response) {
      this.toasterService.success("Silindi")
      await this.getProducts();
      this.updateProductDialog2 = false;
      return;
    } else {
      this.toasterService.error("Silinemedi");
      this.updateProductDialog2 = false;
      return;
    }

  }
  checkDisable(product: CollectedInvoiceProduct): boolean {

    var quantity: number = 0
    var products = this._products.filter(p => p.lineId.toLowerCase() == product.id.toLowerCase());
    if (products.length > 0) {
      for (var p of products) {
        quantity += p.requestedShipmentQuantity;
      }
    }

    //topplanandan bükse dis : false
    if (product.quantity > quantity) {

      return false;
    } else {
      return true;
    }

  }

  checkCount(product: CollectedInvoiceProduct): number {

    var quantity: number = 0
    var products = this._products.filter(p => p.lineId.toLowerCase() == product.id.toLowerCase());
    if (products.length > 0) {
      for (var p of products) {
        quantity += p.requestedShipmentQuantity;
      }
    }


    return quantity;

  }


}
