import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CustomerModel } from 'src/app/models/model/customer/customerModel';
import { InvoiceProcess } from "src/app/models/model/invoice/InvoiceProcess";
import { CreatePurchaseInvoice } from "src/app/models/model/invoice/CreatePurchaseInvoice.1";
import { CollectedInvoiceProduct } from "src/app/models/model/invoice/CollectedInvoiceProduct";
import { SalesPersonModel } from 'src/app/models/model/order/salesPersonModel';
import { OfficeModel } from 'src/app/models/model/warehouse/officeModel';
import { WarehouseOfficeModel } from 'src/app/models/model/warehouse/warehouseOfficeModel';
import { GeneralService } from 'src/app/services/admin/general.service';
import { OrderService } from 'src/app/services/admin/order.service';
import { ProductService } from 'src/app/services/admin/product.service';
import { WarehouseService } from 'src/app/services/admin/warehouse.service';
import { ToasterService } from 'src/app/services/ui/toaster.service';
import { HeaderService } from '../../../services/admin/header.service';
import { CustomerAddress_VM, GetCustomerAddress_CM } from 'src/app/models/model/order/getCustomerList_CM';
import { BasketProduct_VM } from 'src/app/models/model/warehouse/transferRequestListModel';
import { UserService } from '../../../services/admin/user.service';
import { InvoiceService } from 'src/app/services/admin/invoice.service';
import { RaportService } from 'src/app/services/admin/raport.service';
import { CustomerService } from 'src/app/services/admin/customer.service';
import { InfoService } from 'src/app/services/admin/info.service';
import { cdPaymentDesc } from '../../../models/model/invoice/cdPaymentDesc';
import { ProcessPayment } from 'src/app/models/model/invoice/ProcessPayment';
import { BankAccount } from 'src/app/models/model/invoice/BankAccount';
import { CashAccount } from "src/app/models/model/nebim/CashAccount";
import { cdCurrencyDesc } from "src/app/models/model/nebim/cdCurrencyDesc";
import { cdCreditCardTypeDesc } from "src/app/models/model/nebim/cdCreditCardTypeDesc";
import { DatePipe } from '@angular/common';
declare var window: any;
@Component({
  selector: 'app-create-sale-order',
  templateUrl: './create-sale-order.component.html',
  styleUrls: ['./create-sale-order.component.css'],
})
export class CreateSaleOrderComponent implements OnInit, OnDestroy {
  //----------
  processCodes: string[] = ["WS", "BP", "R", "ES", "ws", "bp", "r", "prws", "es"]
  processTypes: string[] = ["invoice", "order", "proposal", "shipment"]
  taxTypeCodeList: any[] = [{ name: 'Vergili', code: '0' }, { name: 'Vergisiz', code: '4' }]; //vergi tipi
  processCode: string;
  processType: string;
  lineHeading: string;
  detailHeading: string;
  userId: number;


  //----------
  totalCount: number;
  visible2: boolean = false;
  shelfNumbers: string = 'RAFLAR:';
  salesPersonModels: SalesPersonModel[] = [];
  salesPersonModelList: any[] = [];
  selectedPerson: any;
  customerList2: any[] = [];
  newOrderNumber: string;
  customerList: CustomerModel[] = [];
  officeModels: OfficeModel[] = [];
  warehouseModels: WarehouseOfficeModel[] = [];
  visible: boolean = false;
  infoProducts: CreatePurchaseInvoice[] = [];
  selectedCustomer: any;
  applicationCode: string;
  itemTypeCode = 1;
  addCustomerDialog: boolean = false;
  constructor(
    private formBuilder: FormBuilder,
    private toasterService: ToasterService,
    private orderService: OrderService,
    private invoiceService: InvoiceService,
    private productService: ProductService,
    private warehouseService: WarehouseService,
    private generalService: GeneralService,
    private activatedRoute: ActivatedRoute,
    private headerService: HeaderService,
    private routerService: Router,
    private UserService: UserService,
    private raportService: RaportService,
    private customerService: CustomerService,
    private infoService: InfoService
  ) { }
  async ngOnInit() {


    this.userId = Number(localStorage.getItem('userId'));
    this.activatedRoute.params.subscribe(async (params) => {
      if (this.processCodes.includes(params["processCode"]) && this.processTypes.includes(params["processType"])) {
        this.processCode = params["processCode"].toUpperCase();
        this.processType = params["processType"];

        this.loadPaymentForms()
        this.product_formGenerator();
        this.createUpdateProductForm();
        this.createDiscountForm();
        if ((this.processCode == "R" || this.processCode == "WS") && this.processType == "invoice") {
          this.headerService.updatePageTitle(`Satış Faturası ${this.processCode}`);
          this.applicationCode = "Invoice";
          this.invoice_r_formGenerator();
          await this.getWarehouseAndOffices();
          if (this.processCode == "R") {
            await this.getCustomerList('4'); //Perakende Müşterileri Çeker
          } else {
            await this.getCustomerList('3'); //TOPTAN Müşterileri Çeker
          }

        } else if (this.processCode == "BP" && this.processType == "invoice") {
          this.headerService.updatePageTitle('Alış Faturası (ES)');
          this.applicationCode = "Invoice";
          this.invoice_bp_formGenerator();
          await this.getWarehouseAndOffices();

          await this.getCustomerList('1'); //Tedarikçileri Çeker
        }
        else if (this.processCode == "ES" && this.processType == "invoice") {
          this.headerService.updatePageTitle('Masraf Faturası (ES)');
          this.applicationCode = "Invoice";
          this.invoice_bp_formGenerator();
          await this.getWarehouseAndOffices();
          await this.getCustomerList('1'); //Tedarikçileri Çeker
        }
        else if (this.processCode == "WS" && this.processType == "proposal") {//teklif paneli
          this.headerService.updatePageTitle('Toptan Satış Teklif Oluştur');
          this.applicationCode = "Proposal";
          this.proposal_ws_formGenerator();
          await this.getWarehouseAndOffices();
          await this.getCustomerList('3');
        }
        else if (this.processCode == "BP" && this.processType == "proposal") {//teklif paneli
          this.headerService.updatePageTitle('Alış Teklif Oluştur');
          this.applicationCode = "Proposal";
          this.proposal_bp_formGenerator();
          await this.getWarehouseAndOffices();
          await this.getCustomerList('1');
        }
        else if (this.processCode == "R" && this.processType == "order") {//sipariş paneli
          this.headerService.updatePageTitle('Peşin Satış Oluştur');
          this.applicationCode = "Order";
          this.order_r_formGenerator();
          await this.getWarehouseAndOffices();
          await this.getCustomerList('4');
        }
        else if (this.processCode == "WS" && this.processType == "order") {//sipariş paneli
          this.headerService.updatePageTitle('Toptan Satış Oluştur');
          this.applicationCode = "Order";
          this.order_r_formGenerator();
          await this.getWarehouseAndOffices();
          await this.getCustomerList('3');
        }
        else if (this.processCode == "WS" && this.processType == "shipment") {//sipariş paneli
          this.headerService.updatePageTitle('Toptan Satış Oluştur');
          this.applicationCode = "Waybill";
          this.order_r_formGenerator();
          await this.getWarehouseAndOffices();
          await this.getCustomerList('3');
        }


        if (this.processCode != "ES") {
          this.itemTypeCode = 1;
        } else {
          this.itemTypeCode = 4;
        }
        this.setHeaders();
        if (params['processId']) {
          this.newOrderNumber = params['processId'];
          await this.getInvoiceProcess();
          if (this.invoiceProcess) {
            await this.getProductOfProcess();
          }
        } else {
          this.setFormValueFromUser()
        }
        this.activeIndex = Number(params['activeIndex'])

      } else {
        location.href = "/dashboard"
      }

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


  //-------------------------------------------DETAY KODLARI
  updateProductForm: FormGroup;
  discountForm: FormGroup;
  selectedProduct: CollectedInvoiceProduct;
  updateProductDialog: boolean = false;
  currentDiscountRate: number = 0;
  percentDiscountRate: number;
  cashDiscountRate: number;
  currentCashdiscountRate: number = 0;

  getTotalQuantity(): number {
    return this.invoiceProducts.reduce((sum, product) => sum + product.quantity, 0);
  }
  getTotalPrice(): number {
    return this.invoiceProducts.reduce((sum, product) => sum + (product.quantity * product.price), 0);
  }
  getTotalTaxedPrice(): number {
    return this.invoiceProducts.reduce((sum, product) => sum + (product.quantity * product.priceVI), 0);
  }

  openUpdateDialog(product: CollectedInvoiceProduct) {
    this.selectedProduct = product;
    this.updateProductForm.get('price').setValue(this.selectedProduct.price)
    this.updateProductForm.get('priceVI').setValue(this.selectedProduct.priceVI)
    this.updateProductForm.get('quantity').setValue(this.selectedProduct.quantity)
    // this.updateProductForm.get('discountRate1').setValue(this.selectedProduct.discountRate1)
    // this.updateProductForm.get('discountRate2').setValue(this.selectedProduct.discountRate2)

    this.updateProductDialog = true;
  }

  createUpdateProductForm() {
    this.updateProductForm = this.formBuilder.group({
      price: [null, Validators.required],
      priceVI: [null, Validators.required],
      quantity: [null, Validators.required]
    });

    // price değiştiğinde priceVI değerini güncelle
    this.updateProductForm.get('price').valueChanges.subscribe(value => {
      if (value !== null) {
        const taxRate = this.selectedProduct.taxRate / 100;
        const priceVI = parseFloat((value * (1 + taxRate)).toFixed(2));
        this.updateProductForm.get('priceVI').setValue(priceVI, { emitEvent: false });
      }
    });

    // priceVI değiştiğinde price değerini güncelle
    this.updateProductForm.get('priceVI').valueChanges.subscribe(value => {
      if (value !== null) {
        const taxRate = this.selectedProduct.taxRate / 100;
        const price = parseFloat((value / (1 + taxRate)).toFixed(2));
        this.updateProductForm.get('price').setValue(price, { emitEvent: false });
      }
    });


  }

  createDiscountForm() {

    this.discountForm = this.formBuilder.group({
      cashDiscountRate: [null, Validators.required],
      percentDiscountRate: [null, Validators.required]
    });
  }

  async discount(discountAmount: number) {

    if (discountAmount >= 0 && discountAmount <= 100) {
      this.invoiceProcess.discountRate1 = discountAmount;
      var response: InvoiceProcess = await this.invoiceService.editInvoiceProcess(this.invoiceProcess)
      if (response) {
        this.invoiceProcess = response;
        this.getFinalTotalPrice2();
        this.toasterService.success('Güncellendi')
        this.generalService.beep();
      } else {
        this.toasterService.error('Güncellenmedi')
      }
    } else {
      this.toasterService.error('1 ile 100 arasında bir değer giriniz.')
    }


  }


  async cashDiscount(discountAmount: number) {
    this.invoiceProcess.discountRate2 = discountAmount;
    var response: InvoiceProcess = await this.invoiceService.editInvoiceProcess(this.invoiceProcess);
    if (response) {
      this.invoiceProcess = response;

      // await this.getProposalProducts();
      this.getFinalTotalPrice2();
      this.toasterService.success('Güncellendi')
      this.generalService.beep();
    } else {
      this.toasterService.error('Güncellenmedi')
    }
  }
  calculateTotalTax() {
    var total_tax = 0;
    var total_sum = 0;

    // Tüm ürünlerin toplam miktarını ve toplam tutarını hesaplayın
    this.invoiceProducts.forEach(p => {
      total_sum += p.quantity * p.price;
    });

    // Vergi matrahını ve toplam KDV'yi hesaplayın
    this.invoiceProducts.forEach(p => {
      // İlk indirim oranını birim fiyata uygula
      var discountedPrice = p.price * ((100 - (this.invoiceProcess?.discountRate1 || 0)) / 100);

      // İkinci indirim tutarını, toplam tutar üzerinden paylaştırarak uygula
      var discountRate2Amount = (this.invoiceProcess?.discountRate2 || 0) * ((p.quantity * p.price) / total_sum);

      // İndirimi uyguladıktan sonra vergi matrahını bul
      var taxBase = (discountedPrice * p.quantity) - discountRate2Amount;

      // Vergiyi hesapla ve total_tax'a ekle
      total_tax += (taxBase * (p.taxRate / 100));
    });

    return total_tax;
  }

  async resetDiscount() {
    this.invoiceProcess.discountRate2 = 0;
    this.invoiceProcess.discountRate1 = 0
    var response: InvoiceProcess = await this.invoiceService.editInvoiceProcess(this.invoiceProcess);
    if (response) {
      this.invoiceProcess = response;

      this.getFinalTotalPrice2();
      this.toasterService.success('Güncellendi')
      this.generalService.beep();
    } else {
      this.toasterService.error('Güncellenmedi')
    }

  }
  getFinalTotalPrice() {
    var p = this.invoiceProducts?.reduce((acc, product) => acc + product.quantity * (product.price), 0);
    p = (p * ((100 - this.invoiceProcess?.discountRate1) / 100)) - this.invoiceProcess?.discountRate2;
    return p;
  }
  //dip iskonto uygulandıktan sonraki fiyatı çeker
  getFinalTotalPrice2() {

    var p = this.invoiceProducts?.reduce((acc, product) => acc + product.quantity * (product.priceVI), 0);
    p = (p * ((100 - this.invoiceProcess?.discountRate1) / 100)) - this.invoiceProcess?.discountRate2;
    return p;


  }
  getTotalTax(): number {
    return this.invoiceProducts?.reduce((acc, product) => {
      const productTotalWithoutTax = product.quantity * product.priceVI / (1 + (product.taxRate / 100));
      const productTax = (product.quantity * product.priceVI) - productTotalWithoutTax;
      return acc + productTax;
    }, 0);
  }

  getTotal(): number {
    return this.invoiceProducts?.reduce((acc, product) => acc + (product.quantity * product.price), 0);
  }

  //-------------------------------------------YENI KODLAR


  invoiceProcess: InvoiceProcess;
  invoiceProducts: CollectedInvoiceProduct[] = [];
  invoiceNumber: string;
  activeIndex: number = 0;
  offices: any[] = []
  warehouses: any[] = []
  logger(e) {
    console.log(e)
    this.activeIndex = e.index
  }
  setHeaders() {
    if (this.processType == "invoice") {
      this.lineHeading = "Fatura Satırları";
      this.detailHeading = "Fatura Detay";

    } else if (this.processType == "proposal") {
      this.lineHeading = "Teklif Satırları";
      this.detailHeading = "Teklif Detay";

    } else if (this.processType == "order") {
      this.lineHeading = "Sipariş Satırları";
      this.detailHeading = "Sipariş Detay";

    }
  }
  async getInvoiceProcess() {

    if (this.generalService.isGuid(this.newOrderNumber)) {
      var response = await this.invoiceService.getInvoiceProcessList(this.processCode, this.newOrderNumber);
      if (response.length > 0) {
        this.invoiceProcess = response[0];
        this.setFormValueFromProcess(this.invoiceProcess);
      } else {
        this.routerService.navigate([`/create-process/${this.processType}/${this.processCode}/0`]);
        this.toasterService.error("İşlem Bulunamadı")
      }
    } else {
      this.routerService.navigate([`/create-process/${this.processType}/${this.processCode}/0`])
    }

  }

  async updateProduct(product: CollectedInvoiceProduct) {
    console.log(product);
    product.price = this.updateProductForm.get('price').value;
    product.priceVI = this.updateProductForm.get('priceVI').value;
    product.quantity = this.updateProductForm.get('quantity').value;


    var response = await this.invoiceService.updateCollectedInvoiceProduct(product);
    if (response) {
      // this.getTotalPrice2();
      // await this.getProposalProducts();
      this.toasterService.success('Güncellendi')
      this.generalService.beep();
      this.updateProductDialog = false
    } else {
      this.toasterService.error('Güncellenmedi')
    }
  }
  reloadStatus = true; //eğer nebime siparişi/faturayı/teklifi attıysa sayfa kapanırken soru sormasın diye eklendi;
  async ngOnDestroy() {
    if (this.reloadStatus) {
      if (this.invoiceProcess.applicationCode == 'Order') {
        if (!this.invoiceProcess.isCompleted && this.invoiceProcess.eInvoiceNumber != null) {
          if (window.confirm("Sipariş Durumu Tamamlandı Olarak Değişecektir. Çıkmak İstiyor Musunuz?")) {
            await this.changeStatusOfProcess(true, true)
          } else {
            await this.changeStatusOfProcess(true, true)
          }



        }
      }
    }


  }

  async changeStatusOfProcess(isCompleted: boolean, reload: boolean) {
    var req: InvoiceProcess = Object.assign(this.invoiceProcess);
    req.isCompleted = isCompleted;
    var response = await this.invoiceService.editInvoiceProcess(this.invoiceProcess);
    if (reload) {
      this.invoiceProcess.isCompleted = false;
      // this.routerService.navigate([`/create-process/${this.processType}/${this.processCode}/1/${response.id}`]);

    }


  }
  async updateInvocieProcess(formValue: any, isCompleted?: boolean) {

    if (!this.invoiceProcess) {
      await this.addInvoiceProcess(formValue);
    }
    var request: InvoiceProcess = new InvoiceProcess();
    request.id = this.invoiceProcess.id;
    request.userId = this.userId;
    request.processType = this.processType;
    request.processCode = this.processCode;
    request.salesPersonCode = null;
    request.isReturn = formValue.isReturn;
    request.invoiceNumber = this.invoiceNumber;
    request.currAccCode = ((this.processCode == 'R' || this.processCode == 'WS') || (this.processType == 'order')) ? formValue.currAccCode.code : null;
    request.vendorCode = (this.processCode == 'BP' || this.processCode == 'ES') ? formValue.vendorCode.code : null;
    // request.eInvoiceNumber = formValue.eInvoiceNumber;
    request.eInvoiceNumber = this.invoiceProcess.eInvoiceNumber;
    request.description = formValue.description;
    request.internalDescription = formValue.internalDescription;
    request.officeCode = formValue.officeCode;
    request.warehouseCode = formValue.warehouseCode.code;
    request.taxTypeCode = formValue.taxTypeCode.code;
    request.shippingPostalAddressId = formValue.shippingPostalAddressId.code
    request.billingPostalAddressId = formValue.billingPostalAddressId.code
    request.isCompleted = isCompleted != undefined ? isCompleted : this.invoiceProcess.isCompleted;
    request.applicationCode = this.applicationCode;
    var response = await this.invoiceService.editInvoiceProcess(request);
    if (response) {
      this.responseHandler(true, "Güncellendi")
      this.setFormValueFromProcess(response);
      return;
    } else {
      this.responseHandler(false, "Güncellenmedi")
      return;
    }


  }
  async addInvoiceProcess(formValue: any) {
    // this.toasterService.info(this.processCode + "Faturası Oluşturuluyor...")
    var request: InvoiceProcess = new InvoiceProcess();
    request.userId = this.userId;
    request.processCode = this.processCode
    request.processType = this.processType;;
    request.salesPersonCode = null;
    request.isReturn = formValue.isReturn;
    request.invoiceNumber = this.invoiceNumber;
    request.officeCode = formValue.officeCode;
    request.currAccCode = ((this.processCode == 'R' || this.processCode == 'WS') || (this.processType == 'order')) ? formValue.currAccCode.code : null;
    request.vendorCode = (this.processCode == 'BP' || this.processCode == 'ES') ? formValue.vendorCode.code : null;
    request.eInvoiceNumber = formValue.eInvoiceNumber;
    request.description = formValue.description;
    request.internalDescription = formValue.internalDescription;

    request.warehouseCode = formValue.warehouseCode.code;
    request.taxTypeCode = formValue.taxTypeCode.code;
    request.shippingPostalAddressId = formValue.shippingPostalAddressId?.code
    request.billingPostalAddressId = formValue.billingPostalAddressId?.code
    request.applicationCode = this.applicationCode;
    request.isCompleted = false;

    var response = await this.invoiceService.editInvoiceProcess(request);
    if (response) {
      // Handle success response
      this.responseHandler(true, "Eklendi");
      // Navigate to the desired URL using response.id
      this.routerService.navigate([`/create-process/${this.processType}/${this.processCode}/1/${response.id}`]);
      // // Set form values from the process
      // this.setFormValueFromProcess(response);
      return;
    } else {
      // Handle failure response
      this.responseHandler(false, "Eklenmedi");
      return;
    }
  }

  setFormValueFromUser() {
    var user = this.UserService.getUserClientInfoResponse();
    const officeCode = user.officeCode;
    const warehouseCode = this.warehouses.find(o => o.code == user.warehouseCode);

    if (this.processType == 'invoice') {
      // this.invoiceForm
      this.invoiceForm.get('officeCode').setValue(officeCode);
      this.invoiceForm.get('warehouseCode').setValue(warehouseCode);
    } else if (this.processType == 'proposal' && this.processCode == 'BP') {
      // Sonra bu değerleri forma atıyoruz
      //this.proposal_bp_form

      this.proposal_bp_form.get('officeCode').setValue(officeCode);
      this.proposal_bp_form.get('warehouseCode').setValue(warehouseCode);
    } else if (this.processType == 'proposal' && this.processCode == 'WS') {
      //this.proposal_ws_form

      this.proposal_ws_form.get('officeCode').setValue(officeCode);
      this.proposal_ws_form.get('warehouseCode').setValue(warehouseCode);
    } else if (this.processType == 'order' && (this.processCode == 'R' || this.processCode == 'WS')) {
      //this.order_r_form
      this.order_r_form.get('officeCode').setValue(officeCode);
      this.order_r_form.get('warehouseCode').setValue(warehouseCode);

    }



  }
  async setFormValueFromProcess(v: InvoiceProcess) {
    this.invoiceProcess = v;
    const officeCode = v.officeCode;
    const warehouseCode = this.warehouses.find(o => o.code == v.warehouseCode);
    const salesPersonCode = this.salesPersonModelList.find(o => o.code == v.salesPersonCode);
    const currAccCode = this.customerList2.find(o => o.code == v.currAccCode);
    const vendorCode = this.customerList2.find(o => o.code == v.vendorCode);

    //eğer müşteri varsa bu müşteriye ait adresleri getir
    if (currAccCode || vendorCode) {
      await this.getCustomerAddresses(currAccCode?.code ? currAccCode?.code : vendorCode?.code);
    }

    const taxTypeCode = this.taxTypeCodeList.find(o => o.code == v.taxTypeCode);
    const shippingPostalAddressId = this.addresses_vm.find(o => o.code == v.shippingPostalAddressId);
    const billingPostalAddressId = this.addresses_vm.find(o => o.code == v.billingPostalAddressId);
    const isReturn = v.isReturn;
    const eInvoiceNumber = v.eInvoiceNumber;
    const internalDescription = v.internalDescription;
    const description = v.description;

    if (this.processType == 'invoice') {
      this.invoiceForm.get('officeCode').setValue(officeCode);
      this.invoiceForm.get('warehouseCode').setValue(warehouseCode);
      this.invoiceForm.get('salesPersonCode').setValue(salesPersonCode);
      this.selectedCustomer = currAccCode
      if (this.processCode == 'R' || this.processCode == 'WS') {

        this.invoiceForm.get('currAccCode').setValue(currAccCode);
      } else {
        this.invoiceForm.get('vendorCode').setValue(vendorCode);

      }
      this.invoiceForm.get('taxTypeCode').setValue(taxTypeCode);
      this.invoiceForm.get('isReturn').setValue(isReturn);
      this.invoiceForm.get('eInvoiceNumber').setValue(eInvoiceNumber);
      this.invoiceForm.get('description').setValue(description);
      this.invoiceForm.get('internalDescription').setValue(internalDescription);
      if (shippingPostalAddressId) {
        this.invoiceForm.get('shippingPostalAddressId').setValue(shippingPostalAddressId);
      }
      if (billingPostalAddressId) {
        this.invoiceForm.get('billingPostalAddressId').setValue(billingPostalAddressId);
      }
      this.discountForm.get('percentDiscountRate').setValue(v.discountRate1);
      this.discountForm.get('cashDiscountRate').setValue(v.discountRate2);

      // Diğer değerleri set ediyoruz
      this.newOrderNumber = v.id;
      this.invoiceNumber = v.invoiceNumber;
    } else if (this.processType == 'proposal' && this.processCode == 'BP') {
      // Sonra bu değerleri forma atıyoruz
      this.proposal_bp_form.get('officeCode').setValue(officeCode);
      this.proposal_bp_form.get('warehouseCode').setValue(warehouseCode);
      this.proposal_bp_form.get('salesPersonCode').setValue(salesPersonCode);
      this.selectedCustomer = vendorCode
      this.proposal_bp_form.get('vendorCode').setValue(vendorCode);
      this.proposal_bp_form.get('taxTypeCode').setValue(taxTypeCode);
      this.proposal_bp_form.get('description').setValue(description);
      this.proposal_bp_form.get('internalDescription').setValue(internalDescription);
      if (shippingPostalAddressId) {
        this.proposal_bp_form.get('shippingPostalAddressId').setValue(shippingPostalAddressId);
      }
      if (billingPostalAddressId) {
        this.proposal_bp_form.get('billingPostalAddressId').setValue(billingPostalAddressId);
      }

      this.discountForm.get('percentDiscountRate').setValue(v.discountRate1);
      this.discountForm.get('cashDiscountRate').setValue(v.discountRate2);

      // Diğer değerleri set ediyoruz
      this.newOrderNumber = v.id;
      this.invoiceNumber = v.invoiceNumber;
    } else if (this.processType == 'proposal' && this.processCode == 'WS') {
      this.proposal_ws_form.get('officeCode').setValue(officeCode);
      this.proposal_ws_form.get('warehouseCode').setValue(warehouseCode);
      this.proposal_ws_form.get('salesPersonCode').setValue(salesPersonCode);
      this.selectedCustomer = currAccCode;
      this.proposal_ws_form.get('currAccCode').setValue(currAccCode);
      this.proposal_ws_form.get('taxTypeCode').setValue(taxTypeCode);
      this.proposal_ws_form.get('description').setValue(description);
      this.proposal_ws_form.get('internalDescription').setValue(internalDescription);
      if (shippingPostalAddressId) {
        this.proposal_ws_form.get('shippingPostalAddressId').setValue(shippingPostalAddressId);
      }
      if (billingPostalAddressId) {
        this.proposal_ws_form.get('billingPostalAddressId').setValue(billingPostalAddressId);
      }

      this.discountForm.get('percentDiscountRate').setValue(v.discountRate1);
      this.discountForm.get('cashDiscountRate').setValue(v.discountRate2);
      this.newOrderNumber = v.id;
      this.invoiceNumber = v.invoiceNumber;

      //eğer müşteri varsa bu müşteriye ait adresleri getir
      if (currAccCode) {
        await this.getCustomerAddresses(currAccCode.code);
      }
    } else if (this.processType == 'order' && (this.processCode == 'R' || this.processCode == 'WS')) {
      this.order_r_form.get('officeCode').setValue(officeCode);
      this.order_r_form.get('warehouseCode').setValue(warehouseCode);
      this.order_r_form.get('salesPersonCode').setValue(salesPersonCode);
      this.selectedCustomer = currAccCode;
      this.order_r_form.get('currAccCode').setValue(currAccCode);
      this.order_r_form.get('taxTypeCode').setValue(taxTypeCode);
      this.order_r_form.get('description').setValue(description);
      this.order_r_form.get('internalDescription').setValue(internalDescription);
      if (shippingPostalAddressId) {
        this.order_r_form.get('shippingPostalAddressId').setValue(shippingPostalAddressId);
      }
      if (billingPostalAddressId) {
        this.order_r_form.get('billingPostalAddressId').setValue(billingPostalAddressId);
      }

      this.discountForm.get('percentDiscountRate').setValue(v.discountRate1);
      this.discountForm.get('cashDiscountRate').setValue(v.discountRate2);
      this.newOrderNumber = v.id;
      this.invoiceNumber = v.invoiceNumber;


    }

    else {
      this.toasterService.error("Form Verileri Yerleştirilemedi")
    }

  }
  async getProductOfProcess(): Promise<void> {
    try {
      const response = await this.invoiceService.getCollectedInvoiceProducts(
        this.newOrderNumber
      );
      this.invoiceProducts = response;
      this.infoProducts = [];
      this.calculateTotalQty();
    } catch (error: any) {
      this.toasterService.warn(error.message);
    }
  }

  //--------------------------------------------------------------CUSTOMER
  async getCustomerList(request: string): Promise<void> {
    this.customerList = await this.customerService.getCustomerList(request);

    // customerList2'yi Set yapısını kullanarak güncelliyoruz
    const updatedCustomerList = new Set(this.customerList.map(c => ({
      name: c.currAccDescription,
      code: c.currAccCode
    })));

    // updatedCustomerList'i array'e çevirerek customerList2'ye atıyoruz
    this.customerList2 = Array.from(updatedCustomerList);
  }
  async getSalesPersonModels(): Promise<any> {
    try {
      try {
        this.salesPersonModels = await this.orderService.getSalesPersonModels();

        this.salesPersonModels.forEach((c) => {
          var color: any = { name: c.firstLastName, code: c.salespersonCode };
          this.salesPersonModelList.push(color);
        });

        //this.toasterService.success("Başarıyla "+this.salesPersonModels.length+" Adet Çekildi")
      } catch (error: any) {
        this.toasterService.error(error.message);
        return null;
      }
    } catch (error: any) {
      this.toasterService.error(error.message);
    }
  }

  //-----------------------------------------------------


  //------------------------------------------------------- SİPARİŞ
  async createOrder(): Promise<any> {
    var confirmation = window.confirm(
      'Sipariş tamamlanacaktır, devam edilsin mi?'
    );

    if (confirmation) {
      var response = await this.invoiceService.createOrder_New(this.processCode, this.invoiceProcess.id);
      if (response) {
        this.reloadStatus = false;
        this.toasterService.success('Sipariş Oluşturuldu.');
        // this.routerService.navigate([`/create-process/0/${this.processCode}/${this.invoiceProcess.id}`]);
        this.routerService.navigate([`/process-list/${this.processType}/${this.processCode}`]);

        // this.routerService.navigate(["/dashboard"])
      } else {
        this.toasterService.error('Sipariş Oluşturulamadı.');
      }
    }
    //this.spinnerService.hide();
  }

  //------------------------------------------------------- FATURA
  async deleteInvoice() {
    if (this.invoiceProcess.id) {
      var response = await this.invoiceService.deleteInvoiceProcess(this.invoiceProcess.id);
      if (response) {
        this.toasterService.success("Fatura Silindi");
        this.routerService.navigate([`/create-process/0/${this.processCode}`]);

      } else {
        this.toasterService.error("Fatura Silinemedi");
      }
    } else {
      this.toasterService.error("Fatura Silinemedi");

    }
  }

  async createInvoice(): Promise<any> {
    var confirmation = window.confirm(
      'Fatura kesilecektir, devam edilsin mi?'
    );

    if (confirmation) {
      var response = await this.invoiceService.createInvoice_New(this.processCode, this.invoiceProcess.id);
      if (response) {
        this.toasterService.success('Faturalaştırma Başarılı.');
        // this.routerService.navigate([`/create-process/0/${this.processCode}/${this.invoiceProcess.id}`]);
        this.routerService.navigate([`/process-list/${this.processType}/${this.processCode}`]);
        // this.routerService.navigate(["/dashboard"])
      } else {
        this.toasterService.error('Faturalaştırma Başarısız.');
      }
    }
    //this.spinnerService.hide();
  }


  //-----------------------------------------------------------FORMS
  productForm: FormGroup;
  invoiceForm: FormGroup;
  proposal_bp_form: FormGroup;
  proposal_ws_form: FormGroup;
  order_r_form: FormGroup;
  shipment_ws_form: FormGroup;
  trackChanges(form: FormGroup, isCustomer: boolean) {
    var customer_vendor = isCustomer ? 'currAccCode' : 'vendorCode';
    form.get(customer_vendor).valueChanges.subscribe(async newVal => {
      await this.getCustomerAddresses(newVal.code)
    });
    form.get('billingPostalAddressId').valueChanges.subscribe(async newVal => {
      if (!form.value.shippingPostalAddressId) {
        var fa = this.addresses_vm.find(a => a.code == form.get('billingPostalAddressId').value.code);
        if (fa) {
          form.get('shippingPostalAddressId').setValue(fa);
        }
      }
    });
  }


  product_formGenerator() {
    this.productForm = this.formBuilder.group({
      shelfNo: [null, [Validators.required, Validators.maxLength(10)]],
      barcode: [null, [Validators.required, Validators.minLength(5)]],
      quantity: [null, Validators.required]
    });


  }
  order_r_formGenerator() {
    this.order_r_form = this.formBuilder.group({
      officeCode: [null, Validators.required],
      warehouseCode: [null, Validators.required],
      currAccCode: [null, Validators.required],
      salesPersonCode: [null],
      description: [null],
      internalDescription: [null],
      taxTypeCode: [null, Validators.required],
      shippingPostalAddressId: [null],
      billingPostalAddressId: [null],
    });
    this.trackChanges(this.order_r_form, true);
  }
  invoice_r_formGenerator() {
    this.invoiceForm = this.formBuilder.group({
      officeCode: [null, Validators.required],
      warehouseCode: [null, Validators.required],
      currAccCode: [null, Validators.required],
      salesPersonCode: [null],
      isReturn: [false, Validators.required],
      description: [null],
      internalDescription: [null],
      taxTypeCode: [null, Validators.required],
      shippingPostalAddressId: [null],
      billingPostalAddressId: [null],
      eInvoiceNumber: [
        null
      ],
    });
    this.trackChanges(this.invoiceForm, true);

  }
  invoice_bp_formGenerator() {
    this.invoiceForm = this.formBuilder.group({
      officeCode: [null, Validators.required],
      warehouseCode: [null, Validators.required],
      vendorCode: [null, Validators.required],
      salesPersonCode: [null],
      description: [null],
      internalDescription: [null],
      eInvoiceNumber: [
        null, Validators.required
      ],
      isReturn: [false, Validators.required],
      taxTypeCode: [null, Validators.required],
      shippingPostalAddressId: [null],
      billingPostalAddressId: [null],
    });
    this.trackChanges(this.invoiceForm, false);

  }
  proposal_bp_formGenerator() {
    this.proposal_bp_form = this.formBuilder.group({
      officeCode: [null, Validators.required],
      warehouseCode: [null, Validators.required],
      vendorCode: [null, Validators.required],
      salesPersonCode: [null],
      description: [null],
      internalDescription: [null],
      taxTypeCode: [null, Validators.required],
      shippingPostalAddressId: [null],
      billingPostalAddressId: [null],
    });
    this.trackChanges(this.proposal_bp_form, false);

  }
  proposal_ws_formGenerator() {
    this.proposal_ws_form = this.formBuilder.group({
      officeCode: [null, Validators.required],
      warehouseCode: [null, Validators.required],
      currAccCode: [null, Validators.required],
      salesPersonCode: [null],
      description: [null],
      internalDescription: [null],
      taxTypeCode: [null],
      shippingPostalAddressId: [null],
      billingPostalAddressId: [null],
    });
    this.trackChanges(this.proposal_ws_form, true);

  }
  shipment_ws_formGenerator() {
    this.shipment_ws_form = this.formBuilder.group({
      officeCode: [null, Validators.required],
      warehouseCode: [null, Validators.required],
      currAccCode: [null, Validators.required],
      description: [null],
      internalDescription: [null],
      shippingPostalAddressId: [null],
      billingPostalAddressId: [null],
    });
    this.trackChanges(this.order_r_form, true);
  }
  //------------------------------------------------------------- TEKLİF

  async createProposalReport() {

    if (window.confirm("Teklif Gönderilsin mi?")) {
      var data = await this.raportService.createProposalReport(this.invoiceProcess.id);
      this.toasterService.info("Genel Ayarlarınızda Otomatik Mail Parametresi Açık İse Mail Otomatik Gidecektir")
    }
  }


  async completeProposal() {
    if (window.confirm("Teklif Gönderilsin mi?")) {
      var data = await this.invoiceService.createProposal_New(this.processCode, this.invoiceProcess.id);
      this.toasterService.info("Genel Ayarlarınızda Otomatik Mail Parametresi Açık İse Mail Otomatik Gidecektir")

      if (this.invoiceProcess.isCompleted == false && this.invoiceProcess.eInvoiceNumber != null) {
        location.reload()
      } else {
        this.routerService.navigate([`/process-list/${this.processType}/${this.processCode}`]);
        // this.routerService.navigate([`/create-process/${this.processType}/${this.processCode}/0/${this.invoiceProcess.id}`]);
        //process-list/proposal/ws
      }
    }

  }

  //----------------------------------------------------------- ADRES
  addresses: CustomerAddress_VM[] = []
  addresses_vm: any[] = []
  selectedAddresses: CustomerAddress_VM[] = []
  selectAddressDialog: boolean = false;


  async getCustomerAddresses(currAccCode: string) {

    var request: GetCustomerAddress_CM = new GetCustomerAddress_CM();
    request.currAccCode = currAccCode;
    this.addresses = await this.customerService.getCustomerAddress(request)
    if (this.addresses.length > 0) {
      const addressSet = new Set();
      this.addresses.forEach(model => {
        addressSet.add(model.postalAddressID);
      });
      this.addresses_vm = Array.from(addressSet).map(code => {
        const model = this.addresses.find(a => a.postalAddressID === code);
        return {
          code: model.postalAddressID,
          name: model.address
        };
      });
      if (this.addresses_vm.length > 0) {
        if (this.processType == 'invoice') {
          this.invoiceForm.get("billingPostalAddressId").setValue(this.addresses_vm[0])
          this.invoiceForm.get("shippingPostalAddressId").setValue(this.addresses_vm[0])
          this.invoiceForm.get("taxTypeCode").setValue(this.taxTypeCodeList[1])

        } else if (this.processType == 'proposal' && this.processCode == 'BP') {
          this.proposal_bp_form.get("billingPostalAddressId").setValue(this.addresses_vm[0])
          this.proposal_bp_form.get("shippingPostalAddressId").setValue(this.addresses_vm[0])
          this.proposal_bp_form.get("taxTypeCode").setValue(this.taxTypeCodeList[1])

        } else if (this.processType == 'proposal' && this.processCode == 'WS') {
          this.proposal_ws_form.get("billingPostalAddressId").setValue(this.addresses_vm[0])
          this.proposal_ws_form.get("shippingPostalAddressId").setValue(this.addresses_vm[0])
          this.proposal_ws_form.get("taxTypeCode").setValue(this.taxTypeCodeList[1])

        } else if (this.processType == 'order' && (this.processCode == 'R' || this.processCode == 'WS')) {
          this.order_r_form.get("billingPostalAddressId").setValue(this.addresses_vm[0])
          this.order_r_form.get("shippingPostalAddressId").setValue(this.addresses_vm[0])
          this.order_r_form.get("taxTypeCode").setValue(this.taxTypeCodeList[1])

        }

      }

      // console.log(this.addresses_vm)

      // this.selectCurrentAddress(this.addresses[0])
      // this.selectAddressDialog = false;
      // this.activeIndex = 2;
    }

    if (this.addresses.length === 0) {

      this.toasterService.error("Adres Bulunamadı Adres Ekleyiniz")
    }
    this.selectAddressDialog = true;

  }
  async selectCurrentAddress(request: CustomerAddress_VM) {

  }


  //------------------------------------------------------------- OTHERS
  clearShelfNumbers() {
    this.productForm.get('shelfNo').setValue(null);
    this.productForm.get('barcode').setValue(null);
    this.productForm.get('quantity').setValue(null);
    this.productForm.get('batchCode').setValue(null);

    if (this.productForm.get('isReturn').value === false) {
      this.focusNextInput('shelfNo');
    } else {
      this.focusNextInput('barcode');
    }
    this.shelfNumbers = 'RAFLAR:';
  }
  focusNextInput(nextInputId: string) {
    const nextInput = document.getElementById(nextInputId) as HTMLInputElement;
    if (nextInput) {
      nextInput.focus();
    }
  }
  whichRowIsInvalid() {
    this.generalService.whichRowIsInvalid(this.productForm);
  }
  clearFormFields() {
    // Alanları temizleme
    this.productForm.patchValue({
      barcode: null,
      quantity: null,
    });
    this.focusNextInput('barcode');
    this.shelfNumbers = 'RAFLAR:';
  }
  async deleteOrderProduct(id: string): Promise<boolean> {
    const confirmDelete = window.confirm(
      'Bu hareketi silmek istediğinizden emin misiniz?'
    );

    if (confirmDelete) {
      const response: boolean = await this.invoiceService.deleteCollectedInvoiceProduct(
        id
      );
      if (response) {
        this.calculateTotalQty();
        await this.getProductOfProcess();
        this.toasterService.success('Silme İşlemi Başarılı.');
      } else {
        this.toasterService.error('Silme İşlemi Başarısız.');
      }
      return response;
    } else {
      return false;
    }
  }

  showModal2() {
    if (this.visible2) {
      this.visible2 = false;
    } else {
      this.visible2 = true;
    }
  }
  async setFormValues(model: CreatePurchaseInvoice): Promise<CreatePurchaseInvoice> {

    try {
      var result: string[] = await this.productService.getShelvesOfProduct(
        model.barcode
      );
      this.shelfNumbers = result[0];
      this.productForm.get('batchCode').setValue(result[2]?.toString());
      this.productForm.get('barcode').setValue(result[3]);
      this.productForm.get('quantity').setValue(result[1]);

      var updated_product: CreatePurchaseInvoice = model;
      updated_product.quantity = Number(result[1]);
      updated_product.batchCode = result[2];
      updated_product.barcode = result[3];

      return updated_product;
    } catch (error) {
      this.toasterService.error(error.message);
      return null;
    }
  }
  async onSubmit(model: CreatePurchaseInvoice): Promise<any> {

    if (!this.invoiceProcess) {
      await this.addInvoiceProcess(this.productForm.value);
      return;
    }
    if (!this.productForm.valid) {
      var updated_product: CreatePurchaseInvoice = await this.setFormValues(model);
      model = updated_product;
      this.toasterService.error('Form Verileri Güncellendi.');
      return;
    }

    if (this.productForm.valid) {

      const shelves = this.shelfNumbers
        .split(',')
        .filter((raflar) => raflar.trim() !== '');

      if (
        shelves.find((s) => s.toLowerCase() == model.shelfNo.toLowerCase())
      ) {

        var product_detail = await this.invoiceService.getProductDetailByPriceCode(this.processCode, model.barcode);
        var request: CollectedInvoiceProduct = new CollectedInvoiceProduct();

        request.barcode = model.barcode;
        request.quantity = model.quantity;
        request.shelfNo = model.shelfNo;
        request.batchCode = model.batchCode;
        request.processId = this.newOrderNumber;
        request.itemCode = product_detail.itemCode;
        request.photoUrl = product_detail.photoUrl;
        request.price = product_detail.price
        request.priceVI = product_detail.priceVI
        request.discountRate1 = 0;
        request.discountRate2 = 0;
        request.taxRate = product_detail.taxRate;

        // var mult = (1 + (request.taxRate / 100));
        // var taxed_price = (request.priceVI * mult);
        // request.totalTaxedPrice = request.quantity * product_detail.priceVI;
        // request.totalPrice = request.quantity * product_detail.price
        var response = await this.invoiceService.addCollectedInvoiceProduct(request)
        if (response) {
          this.responseHandler(true, "Eklendi")
          this.getProductOfProcess()
          return;
        } else {
          this.responseHandler(false, "Eklenmedi")
          return;
        }

      } else {
        if (
          confirm(
            'Raf Bulunamadı! Raf Barkod Doğrulaması Yapılmadan Eklensin Mi?'
          )
        ) {

          var product_detail = await this.invoiceService.getProductDetailByPriceCode(this.processCode, model.barcode);
          var request: CollectedInvoiceProduct = new CollectedInvoiceProduct();

          request.barcode = model.barcode;
          request.quantity = model.quantity;
          request.shelfNo = model.shelfNo;
          request.batchCode = model.batchCode;
          request.processId = this.newOrderNumber;
          request.itemCode = product_detail.itemCode;
          request.photoUrl = product_detail.photoUrl;
          request.price = product_detail.price
          request.priceVI = product_detail.priceVI
          request.discountRate1 = 0;
          request.discountRate2 = 0;
          request.taxRate = product_detail.taxRate;

          // var mult = (1 + (request.taxRate / 100));
          // var taxed_price = (request.priceVI * mult);
          // request.totalTaxedPrice = request.quantity * product_detail.priceVI;
          // request.totalPrice = request.quantity * product_detail.price
          var response = await this.invoiceService.addCollectedInvoiceProduct(request)
          if (response) {
            this.responseHandler(true, "Eklendi")
            this.getProductOfProcess()
            return;
          } else {
            this.responseHandler(false, "Eklenmedi")
            return;
          }

          return;
        } else {
          this.toasterService.error("Form Geçersiz")
        }
      }
    }
  }
  responseHandler(response: boolean, message: string) {
    if (response == true) {

      this.toasterService.success(message)
      this.generalService.beep();
    } else {
      this.toasterService.error(message)
      this.generalService.beep2()
    }
  }
  calculateTotalQty() {
    //toplanan ürünler yazısı için
    let totalQty = 0;
    this.invoiceProducts.forEach((item) => {
      totalQty += item.quantity;
    });
    return totalQty;
  }

  goPage() {
    this.routerService.navigate([`/create-process/${this.processType}/${this.processCode}/0`]);

  }

  //----------------------------------------
  allProducts: BasketProduct_VM[] = [];
  brands: any[] = []
  itemCodes: any[] = []
  shelfNos: any[] = []
  descriptions: any[] = []
  findProductDialog: boolean = false;

  logFilteredData(event: any) {

    try {
      if (event.filteredValue) {
        console.log('Filtered data:', event.filteredValue);
        var list: BasketProduct_VM[] = event.filteredValue;
        this.mapProducts(list)

        this.toasterService.info("Dinamik Search Güncellendi")
      }

    } catch (error) {
      this.toasterService.error(error.message)
    }

  }

  mapProducts(data: BasketProduct_VM[]) {
    const uniqueMap = (array, key) => {
      const map = new Map();
      array.forEach(item => {
        if (!map.has(item[key])) {
          map.set(item[key], { label: item[key], value: item[key] });
        }
      });
      return Array.from(map.values()).sort((a, b) => a.label.localeCompare(b.label));
    };

    this.shelfNos = uniqueMap(data, 'shelfNo');
    this.brands = uniqueMap(data, 'brand');
    this.itemCodes = uniqueMap(data, 'itemCode');
    // this.targetShelfs = uniqueMap(this.__transferProducts, 'targetShelf');
    this.descriptions = uniqueMap(data, 'description');
  }
  async getAllProducts() {
    if (this.allProducts.length == 0) {

      this.allProducts = await this.productService.getBasketProducts(this.itemTypeCode, this.invoiceProcess.processCode, this.invoiceProcess.applicationCode);

    }
    this.toasterService.success('Tüm Ürünler Getirildi')
    // this.mapProducts(this.allProducts);
    this.findProductDialog = true;
  }
  search: string = "";
  async addProductFromSearch() {
    if (!this.generalService.isNullOrEmpty(this.search)) {
      if (this.allProducts.length == 0) {
        this.allProducts = await this.productService.getBasketProducts(this.itemTypeCode, this.invoiceProcess.processCode, this.invoiceProcess.applicationCode);
        if (this.allProducts.length > 0) {
          var p = this.allProducts.find(p => p.barcode.toLowerCase() == this.search.toLowerCase() || p.itemCode.toLowerCase() == this.search.toLowerCase())
          if (p) {
            await this.addProduct(p);
          }
        }
      } else {
        if (this.allProducts.length > 0) {
          var p = this.allProducts.find(p => p.barcode.toLowerCase() == this.search.toLowerCase() || p.itemCode.toLowerCase() == this.search.toLowerCase())
          if (p) {
            await this.addProduct(p);
          }
        }
      }

      this.search = "";
    }
  }
  async addProduct(p: BasketProduct_VM) {
    if (!this.invoiceProcess) {
      await this.addInvoiceProcess(this.productForm.value);
      return;
    } else {
      if (p.inventory <= 0) {
        this.toasterService.error("Yetersiz Envanter Hatası.");
        return; // Return early if inventory is not sufficient
      }

      // Step 1: Get the current total quantity of this product in the basket
      const currentTotalQuantity = await this.getCurrentTotalQuantity(p.barcode);

      // Step 2: Check if adding this product exceeds the available inventory
      const newQuantity = currentTotalQuantity + 1; // We're adding one item
      if (newQuantity > p.inventory) {
        this.toasterService.error("Envanter limitini aşıyorsunuz.");
        return; // Prevent adding the product
      }

      // Proceed to add the product
      var product_detail = await this.invoiceService.getProductDetailByPriceCode(this.processCode, p.barcode);
      var request: CollectedInvoiceProduct = new CollectedInvoiceProduct();

      request.barcode = p.barcode;
      request.quantity = 1;
      request.shelfNo = "1";
      request.batchCode = null;
      request.processId = this.newOrderNumber;
      request.itemCode = product_detail.itemCode;
      request.photoUrl = product_detail.photoUrl;
      request.price = product_detail.price;
      request.priceVI = product_detail.priceVI;
      request.discountRate1 = 0;
      request.discountRate2 = 0;
      request.taxRate = product_detail.taxRate;


      var response = await this.invoiceService.addCollectedInvoiceProduct(request);
      if (response) {
        this.responseHandler(true, "Eklendi");
        this.getProductOfProcess();
        return;
      } else {
        this.responseHandler(false, "Eklenmedi");
        return;
      }
    }
  }

  // Helper method to calculate the total quantity of a product in the basket
  private async getCurrentTotalQuantity(barcode: string): Promise<number> {
    // Assume this.invoiceProducts is the list of currently added products
    const existingProducts = this.invoiceProducts.filter(item => item.barcode === barcode);
    const totalQuantity = existingProducts.reduce((sum, item) => sum + item.quantity, 0);
    return totalQuantity;
  }

  onCustomerAdded(event: boolean) {
    if (event) {
      console.log("Müşteri başarıyla eklendi.");
      location.reload();
    }
  }

  //------------------------

  async loadPaymentForm() {
    if (this.cdPaymentDesc.length <= 0) {
      await this.getPaymentDesc();
      this.paymentDialog = true
    } else {
      this.paymentDialog = true
    }

  }
  paymentDialog: boolean = false;
  paymentsOfProcess: ProcessPayment[] = []
  cdPaymentDesc: cdPaymentDesc[] = [];
  bankAccounts: BankAccount[] = [];
  cashAccounts: CashAccount[] = [];
  currencyCodes: cdCurrencyDesc[] = [];
  creditCardTypes: cdCreditCardTypeDesc[] = [];

  loadPaymentForms() {
    this.createCashPaymentForm();
    this.createCreditCardPaymentForm();
    this.createTransferPaymentForm();
  }
  async getPaymentDesc() {
    this.cdPaymentDesc = await this.infoService.getPaymentDesc();
    this.bankAccounts = await this.infoService.getBankAccounts();
    this.cashAccounts = await this.infoService.getCashAccounts();
    this.currencyCodes = await this.infoService.getCurrencyDesc();
    this.creditCardTypes = await this.infoService.getCreditCardTypes();
    await this.getProcessPayments();
  }
  cashPaymentForm: FormGroup;
  createCashPaymentForm() {

    this.cashPaymentForm = this.formBuilder.group({
      paymentType: [1],
      paymentTypeCode: [1],
      cashAccountCode: [null, Validators.required],
      // installmentCount: [null, Validators.required],
      docCurrencyCode: [null, Validators.required],
      payment: [null, Validators.required],
      lineDescription: [null],
    });
  }
  creditCardPaymentForm: FormGroup;
  createCreditCardPaymentForm() {
    this.creditCardPaymentForm = this.formBuilder.group({
      paymentType: [2],
      paymentTypeCode: [2],
      creditCardTypeCode: [null, Validators.required],
      installmentCount: [null, Validators.required],
      docCurrencyCode: [null, Validators.required],
      payment: [null, Validators.required],
      bankAccountCode: [null, Validators.required],
      bankCode: [null],
      lineDescription: [null],
    });
  }
  transferPaymentForm: FormGroup;
  createTransferPaymentForm() {
    this.transferPaymentForm = this.formBuilder.group({
      paymentType: [4],
      paymentTypeCode: [4],
      docCurrencyCode: [null, Validators.required],
      payment: [null, Validators.required],
      bankAccountCode: [null, Validators.required],
      bankCode: [null],
      lineDescription: [null],
    });
  }
  async getProcessPayments() {
    this.paymentsOfProcess = await this.invoiceService.getProcessPayments(this.invoiceProcess.id);
  }
  async onSubmitPayment(paymentType: number) {
    var request: ProcessPayment = new ProcessPayment();

    if (Number(((this.getFinalTotalPrice() + this.calculateTotalTax()) - this.getTotalPaymentValue()).toFixed(2)) > 0) {
      //NAKIT ÖDEMELER
      if (paymentType == 1) {
        if (this.cashPaymentForm.valid) {
          var _v = this.cashPaymentForm.value;
          request.paymentType = 1;
          request.paymentTypeCode = 1;
          request.processId = this.invoiceProcess.id;
          request.installmentCount = 0;
          request.cashAccountCode = _v.cashAccountCode
          request.docCurrencyCode = _v.docCurrencyCode
          request.payment = _v.payment;
          request.lineDescription = _v.lineDescription
          request.userId = this.userId;
          request.dueDate = new Date();

          var response = await this.invoiceService.addProcessPayment(request);
          if (response) {
            this.toasterService.success("Eklendi");
            this.cashPaymentForm.reset();
            await this.getProcessPayments();
          }
        } else {
          this.generalService.whichRowIsInvalid(this.cashPaymentForm)
        }

      }
      //KREDİ ÖDEMELER
      else if (paymentType == 2) {
        if (this.creditCardPaymentForm.valid) {
          var _v = this.creditCardPaymentForm.value;
          request.paymentType = 2;
          request.paymentTypeCode = 2;
          request.processId = this.invoiceProcess.id;
          request.installmentCount = _v.installmentCount
          request.bankAccountCode = _v.bankAccountCode
          request.cashAccountCode = _v.cashAccountCode
          request.docCurrencyCode = _v.docCurrencyCode
          request.payment = _v.payment;
          request.lineDescription = _v.lineDescription
          request.userId = this.userId;
          request.dueDate = new Date();
          var response = await this.invoiceService.addProcessPayment(request);
          if (response) {
            this.toasterService.success("Eklendi");
            this.creditCardPaymentForm.reset();
            this.paymentsOfProcess = await this.invoiceService.getProcessPayments(this.invoiceProcess.id);
          }
        } else {
          this.generalService.whichRowIsInvalid(this.creditCardPaymentForm)
        }

      }
      //HAVALE ÖDEMELER
      else if (paymentType == 4) {
        if (this.transferPaymentForm.valid) {
          var _v = this.transferPaymentForm.value;
          request.paymentType = 4;
          request.paymentTypeCode = 4;
          request.processId = this.invoiceProcess.id;

          request.bankAccountCode = _v.bankAccountCode  //asdasasds
          request.installmentCount = 0;
          request.docCurrencyCode = _v.docCurrencyCode
          request.payment = _v.payment;
          request.lineDescription = _v.lineDescription
          request.userId = this.userId;
          request.dueDate = new Date();
          var response = await this.invoiceService.addProcessPayment(request);
          if (response) {
            this.toasterService.success("Eklendi");
            this.transferPaymentForm.reset();
            this.paymentsOfProcess = await this.invoiceService.getProcessPayments(this.invoiceProcess.id);
          }
        } else {
          this.generalService.whichRowIsInvalid(this.transferPaymentForm)
        }

      }
      //CARİ ÖDEMELER
      else {

      }

      console.log(request)
    } else {
      this.toasterService.error("Ödeme Tamamlanmıştır");
    }

  }
  async deletePayment(id: string) {
    var response = await this.invoiceService.deleteProcessPayment(id);
    if (response) {
      this.responseHandler(true, "Silindi");
      await this.getProcessPayments();
      return;
    } else {
      this.responseHandler(false, "Silinmedi");
      return;
    }
  }

  getPaymentDescription(id: number) {
    return this.cdPaymentDesc.find(i => i.paymentTypeCode == id).paymentTypeDescription;
  }
  getTotalPaymentValue() {
    return this.paymentsOfProcess.reduce((sum, product) => sum + product.payment, 0);

  }

}
