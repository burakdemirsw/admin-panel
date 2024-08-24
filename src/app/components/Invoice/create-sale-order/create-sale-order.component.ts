import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CustomerModel } from 'src/app/models/model/customer/customerModel';
import { CollectedInvoiceProduct, CreatePurchaseInvoice, InvoiceProcess } from 'src/app/models/model/invoice/createPurchaseInvoice';
import { SalesPersonModel } from 'src/app/models/model/order/salesPersonModel';
import { OfficeModel } from 'src/app/models/model/warehouse/officeModel';
import { WarehouseOfficeModel } from 'src/app/models/model/warehouse/warehouseOfficeModel';
import { GeneralService } from 'src/app/services/admin/general.service';
import { OrderService } from 'src/app/services/admin/order.service';
import { ProductService } from 'src/app/services/admin/product.service';
import { WarehouseService } from 'src/app/services/admin/warehouse.service';
import { ToasterService } from 'src/app/services/ui/toaster.service';
import { HeaderService } from '../../../services/admin/header.service';
declare var window: any;
@Component({
  selector: 'app-create-sale-order',
  templateUrl: './create-sale-order.component.html',
  styleUrls: ['./create-sale-order.component.css'],
})
export class CreateSaleOrderComponent implements OnInit {
  //----------
  processCodes: string[] = ["WS", "BP", "R", "ws", "bp", "r", "prws"]
  processTypes: string[] = ["invoice", "order", "proposal"]
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
  productForm: FormGroup;
  invoiceForm: FormGroup;
  proposal_bp_form: FormGroup;
  proposal_r_form: FormGroup;

  warehouseModels: WarehouseOfficeModel[] = [];
  visible: boolean = false;
  infoProducts: CreatePurchaseInvoice[] = [];
  selectedCustomer: any;

  constructor(
    private formBuilder: FormBuilder,
    private toasterService: ToasterService,
    private orderService: OrderService,
    private productService: ProductService,
    private warehouseService: WarehouseService,
    private generalService: GeneralService,
    private activatedRoute: ActivatedRoute,
    private headerService: HeaderService,
    private routerService: Router
  ) { }
  async ngOnInit() {

    this.userId = Number(localStorage.getItem('userId'));
    this.activatedRoute.params.subscribe(async (params) => {
      if (this.processCodes.includes(params["processCode"]) && this.processTypes.includes(params["processType"])) {
        this.processCode = params["processCode"].toUpperCase();
        this.processType = params["processType"];

        this.product_formGenerator();
        this.createUpdateProductForm();

        this.createDiscountForm();
        if (this.processCode == "R" && this.processType == "invoice") {
          this.headerService.updatePageTitle('Satış Faturası (R)');
          this.invoice_r_formGenerator();
          await this.getWarehouseAndOffices();

          await this.getCustomerList('4'); //Perakende Müşterileri Çeker
        } else if (this.processCode == "BP" && this.processType == "invoice") {
          this.headerService.updatePageTitle('Alış Faturası (BP)');
          this.invoice_bp_formGenerator();
          await this.getWarehouseAndOffices();

          await this.getCustomerList('1'); //Tedarikçileri Çeker
        } else if (this.processCode == "R" && this.processType == "proposal") {//teklif paneli
          this.headerService.updatePageTitle('Satış Teklif Oluştur');
          this.proposal_r_formGenerator();
          await this.getWarehouseAndOffices();
          await this.getCustomerList('3');
        }
        else if (this.processCode == "BP" && this.processType == "proposal") {//teklif paneli
          this.headerService.updatePageTitle('Alış Teklif Oluştur');
          this.proposal_bp_formGenerator();
          await this.getWarehouseAndOffices();
          await this.getCustomerList('1');
        }

        this.setHeaders();
        if (params['processId']) {
          this.newOrderNumber = params['processId'];
          await this.getInvoiceProcess();
          if (this.invoiceProcess) {
            await this.getProductOfProcess();
          }
        }
        this.activeIndex = Number(params['activeIndex'])

      } else {
        location.href = "/dashboard"
      }

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
      var response: InvoiceProcess = await this.orderService.editInvoiceProcess(this.invoiceProcess)
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
    var response: InvoiceProcess = await this.orderService.editInvoiceProcess(this.invoiceProcess);
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

  async resetDiscount() {
    this.invoiceProcess.discountRate2 = 0;
    this.invoiceProcess.discountRate1 = 0
    var response: InvoiceProcess = await this.orderService.editInvoiceProcess(this.invoiceProcess);
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
    var number = this.invoiceProducts?.reduce((acc, product) => acc + product.quantity * (product.price), 0);
    if (number.toString().includes('.')) {
      return Number(number.toString().split('.')[0])
    } else {
      return number
    }
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
      var response = await this.orderService.getInvoiceProcessList(this.processCode, this.newOrderNumber);
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


  async updateProduct(product: CollectedInvoiceProduct) {
    console.log(product);
    product.price = this.updateProductForm.get('price').value;

    product.priceVI = this.updateProductForm.get('priceVI').value;

    product.quantity = this.updateProductForm.get('quantity').value;

    var response = await this.orderService.updateCollectedInvoiceProduct(product);
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
  async updateInvocieProcess(formValue: any) {

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
    request.currAccCode = this.processCode == 'R' ? formValue.currAccCode.code : null;
    request.vendorCode = this.processCode == 'BP' ? formValue.vendorCode.code : null;
    request.eInvoiceNumber = (this.processCode == 'BP' && this.processType == 'invoice') ? formValue.eInvoiceNumber : null;
    request.description = formValue.description;
    request.internalDescription = formValue.internalDescription;
    request.officeCode = formValue.officeCode;
    request.warehouseCode = formValue.warehouseCode.code;
    request.taxTypeCode = formValue.taxTypeCode.code;
    request.isCompleted = false;

    var response = await this.orderService.editInvoiceProcess(request);
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
    this.toasterService.info(this.processCode + "Faturası Oluşturuluyor...")
    var request: InvoiceProcess = new InvoiceProcess();
    request.userId = this.userId;
    request.processCode = this.processCode
    request.processType = this.processType;;
    request.salesPersonCode = null;
    request.isReturn = formValue.isReturn;
    request.invoiceNumber = this.invoiceNumber;
    request.officeCode = formValue.officeCode;
    request.currAccCode = this.processCode == 'R' ? formValue.currAccCode.code : null;
    request.vendorCode = this.processCode == 'BP' ? formValue.vendorCode.code : null;
    request.eInvoiceNumber = (this.processCode == 'BP' && this.processType == 'invoice') ? formValue.eInvoiceNumber : null;
    request.description = formValue.description;
    request.internalDescription = formValue.internalDescription;

    request.warehouseCode = formValue.warehouseCode.code;
    request.taxTypeCode = formValue.taxTypeCode.code;
    request.isCompleted = false;

    var response = await this.orderService.editInvoiceProcess(request);
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
  setFormValueFromProcess(v: InvoiceProcess) {
    this.invoiceProcess = v;
    const officeCode = v.officeCode;
    const warehouseCode = this.warehouses.find(o => o.code == v.warehouseCode);
    const salesPersonCode = this.salesPersonModelList.find(o => o.code == v.salesPersonCode);
    const currAccCode = this.customerList2.find(o => o.code == v.currAccCode);
    const vendorCode = this.customerList2.find(o => o.code == v.vendorCode);
    const taxTypeCode = this.taxTypeCodeList.find(o => o.code == v.taxTypeCode);
    const isReturn = v.isReturn;
    const eInvoiceNumber = v.eInvoiceNumber;
    const internalDescription = v.internalDescription;
    const description = v.description;

    if (this.processType == 'invoice') {
      this.invoiceForm.get('officeCode').setValue(officeCode);
      this.invoiceForm.get('warehouseCode').setValue(warehouseCode);
      this.invoiceForm.get('salesPersonCode').setValue(salesPersonCode);
      this.selectedCustomer = currAccCode
      if (this.processCode == 'R') {

        this.invoiceForm.get('currAccCode').setValue(currAccCode);
      } else {
        this.invoiceForm.get('vendorCode').setValue(vendorCode);

      }
      this.invoiceForm.get('taxTypeCode').setValue(taxTypeCode);
      this.invoiceForm.get('isReturn').setValue(isReturn);
      this.invoiceForm.get('eInvoiceNumber').setValue(eInvoiceNumber);
      this.invoiceForm.get('description').setValue(description);
      this.invoiceForm.get('internalDescription').setValue(internalDescription);
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
      this.discountForm.get('percentDiscountRate').setValue(v.discountRate1);
      this.discountForm.get('cashDiscountRate').setValue(v.discountRate2);

      // Diğer değerleri set ediyoruz
      this.newOrderNumber = v.id;
      this.invoiceNumber = v.invoiceNumber;
    } else if (this.processType == 'proposal' && this.processCode == 'R') {
      this.proposal_r_form.get('officeCode').setValue(officeCode);
      this.proposal_r_form.get('warehouseCode').setValue(warehouseCode);
      this.proposal_r_form.get('salesPersonCode').setValue(salesPersonCode);
      this.selectedCustomer = currAccCode
      this.proposal_r_form.get('currAccCode').setValue(currAccCode);
      this.proposal_r_form.get('taxTypeCode').setValue(taxTypeCode);
      this.proposal_r_form.get('description').setValue(description);
      this.proposal_r_form.get('internalDescription').setValue(internalDescription);
      this.discountForm.get('percentDiscountRate').setValue(v.discountRate1);
      this.discountForm.get('cashDiscountRate').setValue(v.discountRate2);
      this.newOrderNumber = v.id;
      this.invoiceNumber = v.invoiceNumber;
    } else {
      this.toasterService.error("Form Verileri Yerleştirilemedi")
    }

  }
  async getProductOfProcess(): Promise<void> {
    try {
      const response = await this.orderService.getCollectedInvoiceProducts(
        this.newOrderNumber
      );
      this.invoiceProducts = response;
      this.infoProducts = [];
      this.calculateTotalQty();
    } catch (error: any) {
      this.toasterService.warn(error.message);
    }
  }

  async getCustomerList(request: string): Promise<void> {
    this.customerList = await this.warehouseService.getCustomerList(request);

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

  product_formGenerator() {
    this.productForm = this.formBuilder.group({
      shelfNo: [null, [Validators.required, Validators.maxLength(10)]],
      barcode: [null, [Validators.required, Validators.minLength(5)]],
      quantity: [null, Validators.required]
    });


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
      eInvoiceNumber: [
        null
      ],

    });
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
    });
  }
  proposal_bp_formGenerator() {
    this.proposal_bp_form = this.formBuilder.group({
      officeCode: [null, Validators.required],
      warehouseCode: [null, Validators.required],
      vendorCode: [null, Validators.required],
      salesPersonCode: [null],
      description: [null],
      internalDescription: [null],
      taxTypeCode: [null, Validators.required]
    });
  }
  proposal_r_formGenerator() {
    this.proposal_r_form = this.formBuilder.group({
      officeCode: [null, Validators.required],
      warehouseCode: [null, Validators.required],
      currAccCode: [null, Validators.required],
      salesPersonCode: [null],
      description: [null],
      internalDescription: [null],
      taxTypeCode: [null],
    });
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
      const response: boolean = await this.orderService.deleteCollectedInvoiceProduct(
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

  async createInvoice(): Promise<any> {
    var confirmation = window.confirm(
      'Fatura kesilecektir, devam edilsin mi?'
    );

    if (confirmation) {
      var response = await this.orderService.createInvoice_New(this.processCode, this.invoiceProcess.id);
      if (response) {
        this.toasterService.success('Faturalaştırma Başarılı.');
        this.routerService.navigate([`/create-process/0/${this.processCode}/${this.invoiceProcess.id}`]);

        // this.routerService.navigate(["/dashboard"])
      } else {
        this.toasterService.error('Faturalaştırma Başarısız.');
      }
    }
    //this.spinnerService.hide();
  }

  async setFormValues(model: CreatePurchaseInvoice): Promise<CreatePurchaseInvoice> {

    try {
      var result: string[] = await this.productService.getShelvesOfProduct(
        model.barcode
      );
      this.shelfNumbers = result[0];
      this.productForm.get('batchCode').setValue(result[2]);
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

        var product_detail = await this.orderService.getProductDetailByPriceCode(this.processCode, model.barcode);
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
        var response = await this.orderService.addCollectedInvoiceProduct(request)
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

          var product_detail = await this.orderService.getProductDetailByPriceCode(this.processCode, model.barcode);
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
          var response = await this.orderService.addCollectedInvoiceProduct(request)
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
    this.totalCount = totalQty;
  }
  async deleteInvoice() {
    if (this.invoiceProcess.id) {
      var response = await this.orderService.deleteInvoiceProcess(this.invoiceProcess.id);
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
  goPage() {
    this.routerService.navigate([`/create-process/${this.processType}/${this.processCode}/0`]);

  }
  async createProposalReport() {

    if (window.confirm("Mail Gönderilsin mi?")) {
      var data = await this.productService.createProposalReport(this.invoiceProcess.id, true);
    } else {
      var data = await this.productService.createProposalReport(this.invoiceProcess.id, false);
    }

    this.routerService.navigate([`/create-process/${this.processType}/${this.processCode}/0/${this.invoiceProcess.id}`]);

  }


}
