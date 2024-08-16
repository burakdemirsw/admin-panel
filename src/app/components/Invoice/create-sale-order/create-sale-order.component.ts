import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CustomerModel } from 'src/app/models/model/customer/customerModel';
import { CollectedInvoiceProduct, CreatePurchaseInvoice, InvoiceProcess } from 'src/app/models/model/invoice/createPurchaseInvoice';
import { SalesPersonModel } from 'src/app/models/model/order/salesPersonModel';
import { OfficeModel } from 'src/app/models/model/warehouse/officeModel';
import { WarehouseOfficeModel } from 'src/app/models/model/warehouse/warehouseOfficeModel';
import { GeneralService } from 'src/app/services/admin/general.service';
import { OrderService } from 'src/app/services/admin/order.service';
import { BarcodeSearch_RM, ProductService } from 'src/app/services/admin/product.service';
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

  totalCount: number;
  visible2: boolean = false;
  shelfNumbers: string = 'RAFLAR:';
  salesPersonModels: SalesPersonModel[] = [];
  salesPersonModelList: any[] = [];
  selectedPerson: any;
  customerList2: any[] = [];
  addedProductCount: string = 'Sayım Paneli';
  newOrderNumber: string;
  customerList: CustomerModel[] = [];
  officeModels: OfficeModel[] = [];
  productForm: FormGroup;
  invoiceForm: FormGroup;
  warehouseModels: WarehouseOfficeModel[] = [];
  visible: boolean = false;
  infoProducts: CreatePurchaseInvoice[] = [];
  selectedCustomer: any;
  taxTypeCodeList: any[] = [{ name: 'Vergili', code: '0' }, { name: 'Vergisiz', code: '4' }]; //vergi tipi

  constructor(
    private formBuilder: FormBuilder,
    private toasterService: ToasterService,
    private orderService: OrderService,
    private productService: ProductService,
    private warehouseService: WarehouseService,
    private generalService: GeneralService,
    private activatedRoute: ActivatedRoute,
    private headerService: HeaderService,
  ) { }
  async ngOnInit() {

    this.headerService.updatePageTitle('Satış Faturası Oluştur');

    // this.isReturnInvoice = false;
    this.formGenerator();
    this.formGenerator2();
    this.createDiscountForm();

    this.createUpdateProductForm();
    await this.getCustomerList(); //müşteriler kodu
    await this.getWarehouseAndOffices();
    this.activatedRoute.params.subscribe(async (params) => {
      if (this.processCodes.includes(params["processCode"])) {
        this.processCode = params["processCode"].toUpperCase();
        if (params['processId']) {
          this.newOrderNumber = params['processId'];
          await this.getInvoiceProcess();
          if (this.invoiceProcess) {
            await this.getProductOfInvoice();
          }
        }
        this.activeIndex = Number(params['activeIndex'])
      } else {
        location.href = "/dashboard"
      }

    });

  } addToList(model: any) {
    this.toasterService.success(model.itemCode + ' Eklendi');
    this.infoProducts.push(model);
    this.addedProductCount = 'Sayım Paneli(' + this.infoProducts.length + ')';
  }
  currentDiscountRate: number = 0;
  percentDiscountRate: number;
  cashDiscountRate: number;
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
  currentCashdiscountRate: number = 0;
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
    var number = this.invoiceProducts.reduce((acc, product) => acc + product.totalPrice, 0);
    if (number.toString().includes('.')) {
      return Number(number.toString().split('.')[0])
    } else {
      return number
    }
  }
  //dip iskonto uygulandıktan sonraki fiyatı çeker
  getFinalTotalPrice2() {
    return this.invoiceProducts.reduce((acc, product) => acc + product.totalTaxedPrice, 0) *
      ((100 - this.invoiceProcess.discountRate1) / 100) - this.invoiceProcess.discountRate2;

  }
  getTotalTax(): number {
    return this.invoiceProducts.reduce((acc, product) => acc + (product.totalPrice * (product.taxRate / 100)), 0);
  }

  getTotal(): number {
    return this.invoiceProducts.reduce((acc, product) => acc + product.totalPrice, 0);
  }


  //-------------------------------------------DETAY KODLARI
  updateProductForm: FormGroup;
  discountForm: FormGroup;
  selectedProduct: CollectedInvoiceProduct;
  updateProductDialog: boolean = false;
  getTotalQuantity(): number {
    return this.invoiceProducts.reduce((sum, product) => sum + product.quantity, 0);
  }
  getTotalPrice(): number {
    return this.invoiceProducts.reduce((sum, product) => sum + product.totalPrice, 0);
  }
  getTotalTaxedPrice(): number {
    return this.invoiceProducts.reduce((sum, product) => sum + product.totalTaxedPrice, 0);
  }

  openUpdateDialog(product: CollectedInvoiceProduct) {
    this.selectedProduct = product;
    this.updateProductForm.get('price').setValue(this.selectedProduct.discountedPrice)
    this.updateProductForm.get('quantity').setValue(this.selectedProduct.quantity)
    this.updateProductForm.get('discountRate1').setValue(this.selectedProduct.discountRate1)
    this.updateProductForm.get('discountRate2').setValue(this.selectedProduct.discountRate2)

    this.updateProductDialog = true;
  }

  createUpdateProductForm() {
    this.updateProductForm = this.formBuilder.group({
      price: [null, Validators.required],
      quantity: [null, Validators.required],
      discountRate1: [null, Validators.required],
      discountRate2: [null, Validators.required],
    });
  }

  createDiscountForm() {

    this.discountForm = this.formBuilder.group({
      cashDiscountRate: [null, Validators.required],
      percentDiscountRate: [null, Validators.required]
    });
  }


  //-------------------------------------------YENI KODLAR
  processCode: string;
  processCodes: string[] = ["WS", "BP", "R", "ws", "bp", "r"]
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
  async getInvoiceProcess() {
    var response = await this.orderService.getInvoiceProcessList(this.newOrderNumber);
    if (response) {
      this.invoiceProcess = response[0];
      this.setFormValueFromProcess(this.invoiceProcess);
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
    product.discountedPrice = this.updateProductForm.get('price').value;
    product.quantity = this.updateProductForm.get('quantity').value;
    product.discountRate1 = this.updateProductForm.get('discountRate1').value; //yüzde
    product.discountRate2 = this.updateProductForm.get('discountRate2').value;
    product.totalPrice =
      product.quantity *
      (
        (product.discountedPrice * ((100 - product.discountRate1) / 100)) - product.discountRate2
      )

    product.totalTaxedPrice =
      product.quantity *
      (
        ((product.discountedPrice * (1 + (product.taxRate / 100))) * ((100 - product.discountRate1) / 100)) - product.discountRate2
      )
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
    var request: InvoiceProcess = new InvoiceProcess();
    request.id = this.invoiceProcess.id;
    request.processCode = "WS";
    request.salesPersonCode = null;
    request.isReturn = formValue.isReturn;
    request.invoiceNumber = this.invoiceNumber;
    request.currAccCode = formValue.currAccCode.code;
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
  async addInvocieProcess(formValue: any) {
    var request: InvoiceProcess = new InvoiceProcess();
    request.processCode = "WS";
    request.salesPersonCode = null;
    request.isReturn = formValue.isReturn;
    request.invoiceNumber = this.invoiceNumber;
    request.officeCode = formValue.officeCode;
    request.currAccCode = formValue.currAccCode.code;
    request.warehouseCode = formValue.warehouseCode.code;
    request.taxTypeCode = formValue.taxTypeCode.code;
    request.isCompleted = false;

    var response = await this.orderService.editInvoiceProcess(request);
    if (response) {
      this.responseHandler(true, "Eklendi")
      this.setFormValueFromProcess(response);
      return;
    } else {
      this.responseHandler(false, "Eklenmedi")
      return;
    }
  }
  setFormValueFromProcess(v: InvoiceProcess) {
    // İlk olarak gerekli değerleri değişkenlere atıyoruz
    const officeCode = v.officeCode;
    const warehouseCode = this.warehouses.find(o => o.code == v.warehouseCode);
    const salesPersonCode = this.salesPersonModelList.find(o => o.code == v.salesPersonCode);
    const currAccCode = this.customerList2.find(o => o.code == v.currAccCode);
    const taxTypeCode = this.taxTypeCodeList.find(o => o.code == v.taxTypeCode);
    const isReturn = v.isReturn;

    // Sonra bu değerleri forma atıyoruz
    this.invoiceForm.get('officeCode').setValue(officeCode);
    this.invoiceForm.get('warehouseCode').setValue(warehouseCode);
    this.invoiceForm.get('salesPersonCode').setValue(salesPersonCode);
    this.selectedCustomer = currAccCode
    this.invoiceForm.get('currAccCode').setValue(currAccCode);
    this.invoiceForm.get('taxTypeCode').setValue(taxTypeCode);
    this.invoiceForm.get('isReturn').setValue(isReturn);

    this.discountForm.get('percentDiscountRate').setValue(v.discountRate1);
    this.discountForm.get('cashDiscountRate').setValue(v.discountRate2);

    // Diğer değerleri set ediyoruz
    this.newOrderNumber = v.id;
    this.invoiceNumber = v.invoiceNumber;
  }
  async getProductOfInvoice(): Promise<void> {
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

  async getCustomerList(): Promise<void> {
    this.customerList = await this.warehouseService.getCustomerList('3');

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

  formGenerator() {
    this.productForm = this.formBuilder.group({
      shelfNo: [null, [Validators.required, Validators.maxLength(10)]],
      barcode: [null, [Validators.required, Validators.minLength(5)]],
      quantity: [null, Validators.required],
      batchCode: [null],
    });


  }
  formGenerator2() {
    this.invoiceForm = this.formBuilder.group({
      officeCode: [null],
      warehouseCode: [null],
      currAccCode: [null],
      salesPersonCode: [null],
      isReturn: [false],
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
        await this.getProductOfInvoice();
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

  async createSaleInvoice(): Promise<any> {
    var confirmation = window.confirm(
      'İşlem Nebime Aktarılacaktır.Devam Etmek istiyor musunuz?'
    );

    if (confirmation) {
      //this.spinnerService.show();
      try {

        //OTOMATIK SAYIM YAPMA KODU ↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑
        const data = await this.orderService.createSaleInvoice(
          this.invoiceProducts,
          this.newOrderNumber,
          this.productForm.get('isReturn').value,
          this.productForm.get('salesPersonCode').value.code,
          this.productForm.get('currency').value.code
        );
      } catch (error: any) { }

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
      await this.addInvocieProcess(this.productForm.value);
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
        request.price = product_detail.price * ((100 - product_detail.taxRate) / 100);
        request.discountedPrice = product_detail.price * ((100 - product_detail.taxRate) / 100);
        request.discountRate1 = 0;
        request.discountRate2 = 0;
        request.taxRate = product_detail.taxRate;

        // var mult = (1 + (request.taxRate / 100));
        // var taxed_price = (request.discountedPrice * mult);
        request.totalTaxedPrice = request.quantity * product_detail.price;
        request.totalPrice = request.quantity *
          (
            (request.discountedPrice * ((100 - request.discountRate1) / 100)) - request.discountRate2
          )
        var response = await this.orderService.addCollectedInvoiceProduct(request)
        if (response) {
          this.responseHandler(true, "Eklendi")
          this.getProductOfInvoice()
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
          request.price = product_detail.price;
          request.discountedPrice = product_detail.price;
          request.discountRate1 = 0;
          request.discountRate2 = 0;
          request.taxRate = 10;

          var taxed_price = (request.discountedPrice * (1 + (request.taxRate / 100)));
          request.totalTaxedPrice = request.quantity * taxed_price;
          request.totalPrice = request.quantity *
            (
              (request.discountedPrice * ((100 - request.discountRate1) / 100)) - request.discountRate2
            )
          var response = await this.orderService.addCollectedInvoiceProduct(request)
          if (response) {
            this.responseHandler(true, "Eklendi")
            this.getProductOfInvoice()
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


}
