import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomerAddress_VM, CustomerList_VM, GetCustomerList_CM } from '../../../models/model/order/getCustomerList_CM';
import { OrderService } from '../../../services/admin/order.service';
import { GetCustomerAddress_CM } from 'src/app/models/model/order/getCustomerList_CM';
import { BarcodeSearch_RM, ProductService } from 'src/app/services/admin/product.service';
import { ProductList_VM } from 'src/app/models/model/product/productList_VM';
import * as Tesseract from 'tesseract.js';
import { GoogleDriveService } from '../../../services/common/google-drive.service';
import { AddressService } from 'src/app/services/admin/address.service';
import { Address_VM } from 'src/app/models/model/order/ViewModel/provinceVM';
import { AddCustomerAddress_CM, ClientCustomer, CreateCustomer_CM } from './models/createCustomer_CM';
import { ClientOrder, ClientOrderBasketItem, Line, NebimOrder, Payment } from './models/nebimOrder';
import { GeneralService } from 'src/app/services/admin/general.service';
import { SalesPersonModel } from 'src/app/models/model/order/salesPersonModel';
import { HttpClientService } from 'src/app/services/http-client.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToasterService } from 'src/app/services/ui/toaster.service';
import { Payment_CM, Payment_CR } from 'src/app/models/model/payment/payment_CR';
import { PaymentService } from 'src/app/services/admin/payment.service';
import { PostalAddress } from 'src/app/models/nebim/customer/nebimCustomer';

@Component({
  selector: 'app-create-order',
  templateUrl: './create-order.component.html',
  styleUrls: ['./create-order.component.css']
})
export class CreateOrderComponent implements OnInit {
  [x: string]: any;
  selectedCustomers: CustomerList_VM[] = []
  selectedProducts: ProductList_VM[] = []
  selectedAddresses: CustomerAddress_VM[] = []
  selectedOfficeAndWarehosue: any[] = [];
  currAccCode: string;
  salesPersonCode: string;
  payment: Payment = new Payment();
  activeIndex = 0;
  @ViewChild('findCustomer', { static: false }) findCustomer: ElementRef;
  @ViewChild('findAddress', { static: false }) findAddress: ElementRef;
  @ViewChild('findProducts', { static: false }) findProducts: ElementRef;
  @ViewChild('preview', { static: false }) preview: ElementRef;

  true: boolean = true;
  orderNo: string;
  id: string;
  constructor(private paymentService: PaymentService, private toasterService: ToasterService, private activatedRoute: ActivatedRoute,
    private router: Router, private httpClientService: HttpClientService,
    private generalService: GeneralService, private addressService: AddressService,
    private googleDriveService: GoogleDriveService, private productService: ProductService,
    private formBuilder: FormBuilder, private orderService: OrderService) { }

  ngOnInit(): void {


    this.createGetCustomerForm();
    this.createCustomerFormMethod();
    this.createGetProductForm();
    this.createOfficeWarehouseForm();
    this._createCustomerFormMethod();
    this.getAddresses();
    this.selectOfficeAndWarehosue();

    this.activatedRoute.params.subscribe(async (params) => {
      if (params['id']) {
        this.id = params['id']
        this.getClientOrder(0);

      }
    })
    var spc = localStorage.getItem('salesPersonCode');
    if (!spc) {
      this.router.navigate(["/pages-loginv2"])
    } else {
      this.salesPersonCode = spc;
    }

  }

  //--------------------------------------------------------------------------- CLIENT ORDER
  stateOptions: any[] = [{ label: 'Standart', value: '0' }, { label: 'Vergisiz', value: '4' }];
  taxTypeCode: any;


  async getClientOrder(state: number) {
    var response = await this.orderService.getClientOrder(this.id);

    if (state === 0) {
      if (response.clientOrder) {
        var order = response;
        this.currAccCode = order.clientOrder.customerCode;
        var customer_request = new GetCustomerList_CM();
        customer_request.currAccCode = this.currAccCode;
        var customerResponse = await await this.orderService.getCustomerList_2(customer_request)
        if (customerResponse) {
          this.selectedCustomers.push(customerResponse[0]);
          this.toasterService.success("Müşteri Eklendi")
        }
        var request_address = new GetCustomerAddress_CM();
        request_address.currAccCode = this.currAccCode;
        var response = await this.orderService.getCustomerAddress(request_address)
        if (response) {
          this.selectedAddresses = response;
          console.log(this.selectedAddresses)
          this.toasterService.success("Adres Eklendi")
        }
        if (order.clientOrder.paymentDescription) {
          this.payment = new Payment();
          this.payment.currencyCode = "TRY";
          this.payment.code = "";
          this.payment.installmentCount = 0;
          this.payment.paymentType = "2";
          this.payment.creditCardTypeCode = order.clientOrder.paymentDescription;
          this.toasterService.success("Ödeme Eklendi")
        }

        this.payment.amount = this.selectedProducts.reduce((total, product) => total + product.price, 0);
        // this.selectedAddresses = []; burası
        this.orderNo = order.clientOrder.orderNo;

        if (order.clientOrderBasketItems.length > 0) {
          this.selectedProducts = [];
          order.clientOrderBasketItems.forEach(basketItem => {
            var object = this.convertLineToObject(basketItem);
            this.selectedProducts.push(object);
          });
        }

        this.toasterService.success("Sipariş Çekildi")

      } else {
        this.orderNo = this.generateRandomNumber();
        this.toasterService.success("Yeni Sipariş : " + this.orderNo)
      }
    } else {
      if (response.clientOrder) {
        var order = response;

        if (order.clientOrderBasketItems.length > 0) {
          this.selectedProducts = [];
          order.clientOrderBasketItems.forEach(basketItem => {
            var object = this.convertLineToObject(basketItem);
            this.selectedProducts.push(object);
          });
        }

        this.toasterService.success("Ürünler Çekildi")

      } else {
        this.toasterService.error("Yanıt Yok")
      }
    }

  }

  convertLineToObject(line: ClientOrderBasketItem): ProductList_VM {
    var object = new ProductList_VM();
    object.lineId = line.lineId;
    object.description = line.description;
    object.photoUrl = line.photoUrl;
    object.shelfNo = line.shelfNo;
    object.barcode = line.barcode;
    object.itemCode = line.itemCode;
    object.batchCode = line.batchCode;
    object.price = line.price;
    object.quantity = line.quantity;
    object.warehouseCode = line.warehouseCode;
    object.brandDescription = line.brandDescription;
    object.uD_Stock = line.uD_Stock;
    object.mD_Stock = line.mD_Stock;
    return object;
  }
  createClientOrder_RM(): ClientOrder {
    try {

      var request: ClientOrder = new ClientOrder()
      request.customerCode = this.currAccCode
      request.id = this.id;
      request.orderNo = this.orderNo;
      if (this.payment) {
        request.paymentType = this.payment.creditCardTypeCode;
      } else {
        request.paymentType = null;
      }

      request.shippingPostalAddressId = this.selectedAddresses[0].postalAddressID;
      request.createdDate = new Date();

      return request;
    } catch (error) {
      this.toasterService.error(error.message)
      return null;
    }

  }
  createClientOrderBasketItem_RM(line: ProductList_VM): ClientOrderBasketItem {
    try {
      var newLine = Object.assign({}, line);
      newLine.quantity = 1;
      var request: ClientOrderBasketItem = new ClientOrderBasketItem()

      request.orderId = this.id;
      request.createdDate = new Date();

      request.lineId = newLine.lineId;
      request.description = newLine.description;
      request.photoUrl = newLine.photoUrl;
      request.shelfNo = newLine.shelfNo;
      request.barcode = newLine.barcode;
      request.itemCode = newLine.itemCode;
      request.batchCode = newLine.batchCode;
      request.price = newLine.price;
      request.quantity = newLine.quantity;
      request.warehouseCode = newLine.warehouseCode;
      request.brandDescription = newLine.brandDescription;
      request.uD_Stock = newLine.uD_Stock;
      request.mD_Stock = newLine.mD_Stock;

      return request;
    } catch (error) {
      this.toasterService.error(error.message)
      return null;
    }

  }

  //---------------------------------------------------------------------------
  //--------------------------------------------------------------------------- SATIŞ ELEMANI
  salesPersonModels: SalesPersonModel[] = [];
  salesPersonModelList: any[] = [];
  selectedPerson: any;
  selectSalesPerson() {
    this.activeIndex = 1;
    this.generalService.beep();
    this.toasterService.success("Satış Elemanı Seçildi")
  }
  async getSalesPersonModels(): Promise<any> {
    try {
      try {
        this.salesPersonModels = await this.httpClientService
          .get<SalesPersonModel>({
            controller: 'Order/GetSalesPersonModels',
          })
          .toPromise();

        this.salesPersonModels.forEach((c) => {
          var color: any = { name: c.firstLastName + " " + `${c.salespersonCode}`, code: c.salespersonCode };
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
  //---------------------------------------------------------------------------
  //---------------------------------------------------------------------------ADRES
  addressForm: FormGroup
  countries: Address_VM[] = []
  provinces: Address_VM[] = []
  districts: Address_VM[] = []
  regions: Address_VM[] = []
  taxOffices: Address_VM[] = []
  updated_districts: Address_VM[] = []
  _regions: any[] = []
  _taxOffices: any = []
  _countries: any[] = []
  _provinces: any[] = []
  _districts: any[] = []
  _neighborhoods: any[] = []



  _createCustomerForm: FormGroup;
  async _submitAddressForm(values: any) {
    var postalAddress: PostalAddress = new PostalAddress();
    postalAddress.countryCode = values.address_country.code;
    postalAddress.stateCode = values.address_region.code;
    postalAddress.cityCode = values.address_province.code;
    postalAddress.districtCode = values.address_district.code;
    postalAddress.address = values.address_description;
    postalAddress.addressTypeCode = "1";
    var request: AddCustomerAddress_CM = new AddCustomerAddress_CM(this.selectedCustomers[0].currAccCode, postalAddress);
    var response = await this.orderService.addCustomerAddress(request)
    if (response) {
      var _request: GetCustomerAddress_CM = new GetCustomerAddress_CM();
      this.toasterService.success(_request.currAccCode);
      this.getCustomerAddresses(_request);
    }

  }


  //-------------------------------ADRES EKLEME
  _createCustomerFormMethod() {
    this._createCustomerForm = this.formBuilder.group({
      address_country: [null],
      address_province: [null],
      address_district: [null],
      address_region: [null],
      address_description: [null],



    });

    this._createCustomerForm.get('address_region').valueChanges.subscribe(async (value) => { //illeri getir
      var _value = this._createCustomerForm.get('address_region').value;
      var response = await this.addressService.getAddress(3, _value.code)
      this.provinces = response

      this._provinces = [];
      this.provinces.forEach((b) => {
        var provinces: any = { name: b.description, code: b.code };
        this._provinces.push(provinces);
      });
    });

    this._createCustomerForm.get('address_province').valueChanges.subscribe(async (value) => { //ilçeleri getir
      var _value = this._createCustomerForm.get('address_province').value;

      var response = await this.addressService.getAddress(4, _value.code)
      this.districts = response

      this._districts = [];
      this.districts.forEach((b) => {
        var district: any = { name: b.description, code: b.code };
        this._districts.push(district);
      });


      var _value = this._createCustomerForm.get('address_province').value;

      var response = await this.addressService.getAddress(5, _value.code)
      this.taxOffices = response

      this._taxOffices = [];
      this.taxOffices.forEach((b) => {
        var taxOffice: any = { name: b.description, code: b.code };
        this._taxOffices.push(taxOffice);
      });


    });

  }
  //-------------------------------

  async getAddresses() {
    var countries = await this.addressService.getAddress(1)
    this.countries = countries;

    this.countries.forEach((b) => {
      var country: any = { name: b.description, code: b.code };
      this._countries.push(country);
    });

    var regions = await this.addressService.getAddress(2, "TR");
    this.regions = regions;

    this.regions.forEach((b) => {
      var region: any = { name: b.description, code: b.code };
      this._regions.push(region);
    });

    //console.log(countries);
    //console.log(provinces);
  }


  //-------------------------------------------------------------------------
  //------------------------------------------------------------------------- UPLOAD
  selectedFiles: File[] = [];

  async onUpload(event: any, to: string) {
    this.selectedFiles = []; // Her seferinde diziyi sıfırla
    const files: FileList = event.target.files;
    for (let i = 0; i < files.length; i++) {
      const selectedFile: File = files[i];
      this.selectedFiles.push(selectedFile);
      this.toasterService.success("İşlem Başarılı");
      await this.addPicture(selectedFile, to);
    }
    event.target.value = ""; // Dosyaları sıfırlamak için value değerini sıfırla
  }

  async addPicture(file: File, to: string) {
    var response = await this.googleDriveService.addPicture(file);

    if (to === "bussinesCardPhotoUrl") {

      this.createCustomerForm.get("bussinesCardPhotoUrl").setValue(response.url);

    } if (to === "stampPhotoUrl") {

      this.createCustomerForm.get("stampPhotoUrl").setValue(response.url);

    }

  }

  //-------------------------------------------------------------------------

  //----------------------------------------------------OFİS DEPO

  officeWarehouseForm: FormGroup;
  offices: any[] | undefined = [
    { name: 'Ofis', code: '' },
    { name: 'M', code: 'M' },
    { name: 'U', code: 'U' }
  ];
  warehouses: any[] | undefined = [
    { name: 'Depo', code: '' },
    { name: 'Gerçek Depo', code: 'MD' },
    { name: 'Halkalı Depo', code: 'UD' }
  ];
  createOfficeWarehouseForm() {


  }
  selectOfficeAndWarehosue() {

    this.selectedOfficeAndWarehosue = [
      { office: "M", warehouse: "MD" }
    ];

  }
  //----------------------------------------------------
  //---------------------------------------------------- TEXT OKUMA
  extractedText: string = null;
  imageData: string | ArrayBuffer | null = null;


  onFileSelected(event: any) {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      this.imageData = e.target?.result;
    };
    reader.readAsDataURL(file);
  }

  extractText() {
    if (this.imageData) {
      this.extractTextFromImage(this.imageData.toString())
        .then(text => {
          this.extractedText = text;
        })
        .catch(error => {
          console.error('Error extracting text:', error);
        });
    }
  }


  extractTextFromImage(imageData: string): Promise<string> {
    return Tesseract.recognize(
      imageData,
      'eng', // English language
      { logger: m => console.log(m) } // Optional logger
    ).then(({ data: { text } }) => {
      return text;
    });
  }

  //----------------------------------------------------
  //----------------------------------------------------

  scrollToPreview(state: number) {
    if (state === 0) {
      if (this.findCustomer) {
        this.findCustomer.nativeElement.scrollIntoView({ behavior: 'smooth' });
      }
    } else if (state === 1) {
      if (this.findAddress) {
        this.findAddress.nativeElement.scrollIntoView({ behavior: 'smooth' });
      }
    } else if (state === 2) {
      if (this.findProducts) {
        this.findProducts.nativeElement.scrollIntoView({ behavior: 'smooth' });
      }
    } else if (state === 3) {
      if (this.preview) {
        this.preview.nativeElement.scrollIntoView({ behavior: 'smooth' });
      }
    }

  }
  //----------------------------------------------------
  //---------------------------------------------------- Dialog değişkenleri ve metodları
  getCustomerDialog: boolean = false;
  findProductDialog: boolean = false;
  selectAddressDialog: boolean = false;
  openDialog(dialogName: string) {
    if (dialogName === "getCustomerDialog") {
      this.getCustomerDialog = !this.getCustomerDialog
    }
    if (dialogName === "findProductDialog") {
      this.findProductDialog = !this.findProductDialog
    }
  }
  //----------------------------------------------------

  //---------------------------------------------------- CUSTOMER
  getCustomerForm: FormGroup;
  customers: CustomerList_VM[] = []
  createCustomerForm: FormGroup;
  _activeIndex = 0;
  async submitAddressForm(formValue: any) {
    if (this.createCustomerForm.valid) {
      var request: CreateCustomer_CM = new CreateCustomer_CM();
      request.currAccDescription = formValue.currAccDescription; //++
      request.mail = formValue.mail;
      request.phoneNumber = formValue.phoneNumber;
      request.firmDescription = formValue.firmDescription;
      request.stampPhotoUrl = formValue.stampPhotoUrl;
      request.bussinesCardPhotoUrl = formValue.bussinesCardPhotoUrl;
      request.officeCode = 'M'
      request.warehouseCode = 'MD'

      if (!formValue.address_country) {
        request.address = null
      } else {
        request.address.country = formValue.address_country;
        request.address.province = formValue.address_province;
        request.address.district = formValue.address_district;
        request.address.region = formValue.address_region;
        request.address.taxOffice = formValue.address_taxOffice;
        request.address.description = formValue.address_description;
        request.address.postalCode = formValue.address_postalCode;
      }


      console.log(request)

      if (true) {
        var response = await this.orderService.createCustomer(request);
        if (response.currAccCode) {
          var clientCustomer_request = new ClientCustomer();
          clientCustomer_request.currAccCode = response.currAccCode;
          clientCustomer_request.description = formValue.currAccDescription
          clientCustomer_request.stampPhotoUrl = formValue.stampPhotoUrl;
          clientCustomer_request.bussinesCardPhotoUrl = formValue.bussinesCardPhotoUrl;
          clientCustomer_request.addedSellerCode = localStorage.getItem('salesPersonCode');
          var clientCustomer_response = await this.orderService.editClientCustomer(clientCustomer_request)
          if (clientCustomer_response) {
            this.toasterService.success(this.currAccCode);
            this.currAccCode = response.currAccCode;
            this.getCustomerDialog = true;
            this.getCustomerForm.get("currAccCode").setValue(this.currAccCode);
            this.getCustomers(this.getCustomerForm.value);
            this._activeIndex = 0;
          }

        }
      }
    } else {
      this.generalService.whichRowIsInvalid(this.createCustomerForm)
    }

  }

  createCustomerFormMethod() {
    this.createCustomerForm = this.formBuilder.group({

      office: [null],
      warehouse: [null],
      salesPersonCode: [null],
      currAccDescription: [null, Validators.required],
      mail: [null, Validators.required],
      phoneNumber: [null, Validators.required],
      stampPhotoUrl: [null, Validators.required],
      bussinesCardPhotoUrl: [null, Validators.required],
      address_country: [null],
      address_province: [null],
      address_district: [null],
      address_region: [null],
      taxNumber: [null],
      address_description: [null],
      address_postalCode: [null],
      address_taxOffice: [null]
    });

    this.createCustomerForm.get('address_region').valueChanges.subscribe(async (value) => { //illeri getir
      var _value = this.createCustomerForm.get('address_region').value;
      var response = await this.addressService.getAddress(3, _value)
      this.provinces = response

      this._provinces = [];
      this.provinces.forEach((b) => {
        var provinces: any = { name: b.description, code: b.code };
        this._provinces.push(provinces);
      });
    });

    this.createCustomerForm.get('address_province').valueChanges.subscribe(async (value) => { //ilçeleri getir
      var _value = this.createCustomerForm.get('address_province').value;

      var response = await this.addressService.getAddress(4, _value)
      this.districts = response

      this._districts = [];
      this.districts.forEach((b) => {
        var district: any = { name: b.description, code: b.code };
        this._districts.push(district);
      });


      var _value = this.createCustomerForm.get('address_province').value;

      var response = await this.addressService.getAddress(5, _value)
      this.taxOffices = response

      this._taxOffices = [];
      this.taxOffices.forEach((b) => {
        var taxOffice: any = { name: b.description, code: b.code };
        this._taxOffices.push(taxOffice);
      });


    });

  }

  createGetCustomerForm() {
    this.getCustomerForm = this.formBuilder.group({
      mail: [null],
      phone: [null],
      currAccCode: [null],
    });
  }
  createCustomerForm_Submit(value: any) {
    if (this.selectCurrentAddress.length > 0) {

    } else {
      this.toasterService.error("Adres Bulunamadı");
    }
    console.log(value)
  }

  async getCustomers(request: GetCustomerList_CM) {
    this.customers = await this.orderService.getCustomerList_2(request)
    console.log(this.customers);
  }
  selectCurrentCustomer(request: CustomerList_VM) {
    this.selectedCustomers = [];
    this.selectedCustomers.push(request);
    this.currAccCode = request.currAccCode
    this.openDialog("getCustomerDialog");
    this.toasterService.success("Müşteri Seçildi")

    this.generalService.beep();
    var _request: GetCustomerAddress_CM = new GetCustomerAddress_CM();
    _request.currAccCode = request.currAccCode;
    this.getCustomerAddresses(_request);
    this.selectAddressDialog = true;
  }
  deleteCurrentCustomer() {
    this.selectedCustomers = [];
    this.toasterService.success("Müşteri Silindi")
    this.deleteCurrentAddress();
  }
  //----------------------------------------------------ADDRESS
  addresses: CustomerAddress_VM[] = []
  async getCustomerAddresses(request: GetCustomerAddress_CM) {
    this.addresses = await this.orderService.getCustomerAddress(request)
    if (this.addresses.length === 1) {
      this.selectCurrentAddress(this.addresses[0])
      this.selectAddressDialog = false;
    }
    console.log(this.customers);
  }

  selectCurrentAddress(request: CustomerAddress_VM) {
    this.selectedAddresses = [];
    this.selectedAddresses.push(request);
    this.toasterService.success("Adres Eklendi")
    this.activeIndex = 1;
    this.generalService.beep()

  }
  deleteCurrentAddress() {
    this.selectedAddresses = [];
    this.toasterService.success("Adres Silindi")
  }
  //----------------------------------------------------
  //---------------------------------------------------- PRODUCTS
  getTotalPrice() {
    return this.selectedProducts.reduce((acc, product) => acc + (product.quantity * product.price), 0);
  }


  sizes!: any[];

  selectedSize: any = '';

  discountRate: number;
  cashDiscountRate: number;

  _discountRate: number;
  getProductsForm: FormGroup;
  products: ProductList_VM[] = [];
  discount(discountRate: number) {

    if (discountRate > 0 && discountRate <= 100) {
      this.selectedProducts.forEach(p => {
        p.price = ((100 - discountRate) / 100) * (p.price);
      });
      this._discountRate = discountRate
    }

  }

  cashDiscount(discountAmount: number) {

    var value = discountAmount / this.selectedProducts.length
    this.selectedProducts.forEach(p => {
      p.price = p.price - (value / p.quantity)
    });

  }
  createGetProductForm() {
    this.getProductsForm = this.formBuilder.group({
      barcode: [null],
      // stockCode: [null],
    });
  }

  async getProducts(request: BarcodeSearch_RM) {
    try {

      const response = await this.productService.searchProduct(request);
      this.products = response;
      return response;
    } catch (error: any) {
      console.log(error.message);
      return null;
    }
  }


  async addCurrentProducts(request: ProductList_VM) {
    // this.selectedProducts.push(request);

    //bu id ye ait bir clientOrder var mı bak
    var order_request = this.createClientOrder_RM()
    var order_response = await this.orderService.createClientOrder(order_request)
    if (order_response) {


      var line_request = this.createClientOrderBasketItem_RM(request);
      var line_response = await this.orderService.createClientOrderBasketItem(line_request);
      if (line_response) {
        this.toasterService.success("Ürün Eklendi")
        this.generalService.beep()
        this.getClientOrder(1);

      }
    }


  }
  deleteProduct(product: ProductList_VM) {
    this.selectedProducts = this.selectedProducts.filter(p => p.lineId != product.lineId);
    this.toasterService.success("Ürün Silindi")
  }
  clonedProducts: { [s: string]: ProductList_VM } = {};
  onRowEditInit(product: ProductList_VM) {
    this.clonedProducts[product.lineId as string] = { ...product };
  }

  async onRowEditSave(product: ProductList_VM) {
    if (product.price > 0) {
      this.toasterService.success(product.quantity.toString());
      var response = await this.orderService.updateClientOrderBasketItem(this.id, product.lineId, product.quantity, product.price)
      if (response) {
        this.toasterService.success("Ürün Güncellendi")
        this.getClientOrder(1);
      }
      delete this.clonedProducts[product.lineId as string];
    } else {
    }
  }

  onRowEditCancel(product: ProductList_VM, index: number) {
    this.products[index] = this.clonedProducts[product.lineId as string];
    delete this.clonedProducts[product.lineId as string];
  }

  //----------------------------------------------------

  //---------------------------------------------------- SİPARİŞ

  generateRandomNumber(): string {
    let result = '';
    const characters = '0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < 10; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return "MSG-" + result;
  }
  async createPayment(state: number) {
    this.activeIndex = 6;
    var payment: Payment = new Payment();

    // return null;
    if (state === 1) {
      //PAYTR İŞLEMLERİ
      var response = await this.orderService.updateClientOrderPayment(this.id, "PAYTR IFRAME")
      if (response) {
        await this.getPaymentPage();
        payment.currencyCode = "TRY";
        payment.code = "";
        payment.installmentCount = 0;
        payment.paymentType = "2";
        payment.creditCardTypeCode = "PAYTR IFRAME"
        payment.amount = this.selectedProducts.reduce((total, product) => total + product.price, 0);
        this.payment = payment;
      }

    } else if (state === 2) {
      //NAKİT İŞLEMLERİ
      var response = await this.orderService.updateClientOrderPayment(this.id, "NAKİT")
      if (response) {

        payment.currencyCode = "TRY";
        payment.code = "";
        payment.installmentCount = 0;
        payment.paymentType = "2";
        payment.creditCardTypeCode = "NAKİT"
        payment.amount = this.selectedProducts.reduce((total, product) => total + product.price, 0);
        this.payment = payment;
      }
      return null;
    }
    else if (state === 3) {
      //HAVALE İŞLEMLERİ
      var response = await this.orderService.updateClientOrderPayment(this.id, "HAVALE")
      if (response) {

        payment.currencyCode = "TRY";
        payment.code = "";
        payment.installmentCount = 0;
        payment.paymentType = "2";
        payment.creditCardTypeCode = "HAVALE"
        payment.amount = this.selectedProducts.reduce((total, product) => total + product.price, 0);
        this.payment = payment;
      }
      return null;
    }
    else if (state === 4) {
      //HAVALE İŞLEMLERİ
      var response = await this.orderService.updateClientOrderPayment(this.id, "VADE")
      if (response) {

        payment.currencyCode = "TRY";
        payment.code = "";
        payment.installmentCount = 0;
        payment.paymentType = "2";
        payment.creditCardTypeCode = "VADE"
        payment.amount = this.selectedProducts.reduce((total, product) => total + product.price, 0);
        this.payment = payment;
      }
      return null;
    }
    else if (state === 5) {
      //HAVALE İŞLEMLERİ
      var response = await this.orderService.updateClientOrderPayment(this.id, "POS")
      if (response) {

        payment.currencyCode = "TRY";
        payment.code = "";
        payment.installmentCount = 0;
        payment.paymentType = "2";
        payment.creditCardTypeCode = "POS"
        payment.amount = this.selectedProducts.reduce((total, product) => total + product.price, 0);
        this.payment = payment;
      }
      return null;
    }
    else if (state === 6) {
      //HAVALE İŞLEMLERİ
      var response = await this.orderService.updateClientOrderPayment(this.id, "PAYTRSMS")
      if (response) {
        await this.sendPaymentPage();
        payment.currencyCode = "TRY";
        payment.code = "";
        payment.installmentCount = 0;
        payment.paymentType = "2";
        payment.creditCardTypeCode = "PAYTRSMS"
        payment.amount = this.selectedProducts.reduce((total, product) => total + product.price, 0);
        this.payment = payment;
      }
      return null;
    }
    this.payment = payment;
    this.generalService.beep();

    this.toasterService.success("Ödeme Onaylandı")
  }
  async createOrder() {
    if (!this.taxTypeCode) {
      this.toasterService.error("Vergi Tipi Seçiniz");
      return;
    }
    var formValue = this.createCustomerForm.value;
    if (!this.currAccCode) {
      this.toasterService.error("Müşteri Seçiniz");
      return;
    }
    if (!this.salesPersonCode) {
      this.toasterService.error("Satış Elemanı Seçiniz");
      return;
    }
    // if (!this.payment) {
    //   this.toasterService.error("Ödeme Seçilmedi Elemanı Seçiniz");
    //   return;
    // }
    if (this.selectedProducts.length <= 0) {
      this.toasterService.error("Ürün Ekleyiniz");
      return;
    }



    var request: NebimOrder = new NebimOrder(this.currAccCode, this.orderNo, formValue, this.selectedProducts, this.salesPersonCode, this.taxTypeCode);

    var response = await this.orderService.createOrder(request);
    if (response) {

      this.generalService.waitAndNavigate("Sipariş Oluşturuldu", "orders-managament")

    }


  }

  //----------------------------------------------------

  //---------------------------------------------------- PAYMENTS

  paymentMethods = [
    { id: 1, name: 'PayTr IFRAME', icon: 'fas fa-globe' },
    { id: 6, name: 'PayTr SMS/MAIL', icon: 'fas fa-envelope' },
    { id: 5, name: 'POS İle Öde', icon: 'fas fa-credit-card' },
    { id: 3, name: 'Havale İle Öde', icon: 'fas fa-university' },
    { id: 2, name: 'Nakit İle Öde', icon: 'fas fa-wallet' },
    { id: 4, name: 'Cari Ödeme', icon: 'fas fa-file-invoice-dollar' }
  ];


  async getPaymentCommandModel(): Promise<Payment_CM> {

    var model: Payment_CM = new Payment_CM();
    let totalPrice = 0;
    for (const product of this.selectedProducts) {
      totalPrice += product.price * product.quantity;
    }

    if (this.orderNo) {
      model.orderNo = this.orderNo;
      model.basketItems = this.selectedProducts;
      model.totalValue = totalPrice.toString();

      model.user = this.selectedCustomers[0];
      model.address = this.selectedAddresses[0];

      return model;
    }

    else {
      return null;
    }
  }



  async getPaymentPage() {

    var request: Payment_CM = await this.getPaymentCommandModel();
    var response: Payment_CR = await this.paymentService.getPaymentPage(request)
    window.open(response.pageUrl);

  }

  async sendPaymentPage() {

    var request: Payment_CM = await this.getPaymentCommandModel();
    var response: Payment_CR = await this.paymentService.sendPaymentPage(request)
    window.open(response.pageUrl);

  }


  //----------------------------------------------------
}
