import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { OverlayOptions } from 'primeng/api';
import { Dropdown } from 'primeng/dropdown';
import { Table } from 'primeng/table';
import { SubCustomerList_VM } from 'src/app/models/model/customer/subCustomerList_VM';
import { Address_VM } from 'src/app/models/model/order/ViewModel/provinceVM';
import { ExchangeRate } from 'src/app/models/model/order/exchangeRate';
import { GetCustomerAddress_CM } from 'src/app/models/model/order/getCustomerList_CM';
import { SalesPersonModel } from 'src/app/models/model/order/salesPersonModel';
import { SuggestedProduct } from 'src/app/models/model/order/suggestedProduct';
import { Payment_CM, Payment_CR } from 'src/app/models/model/payment/payment_CR';
import { ProductList_VM } from 'src/app/models/model/product/productList_VM';
import { QrOperationModel } from 'src/app/models/model/product/qrOperationModel';
import { ProductCountModel } from 'src/app/models/model/shelfNameModel';
import { PostalAddress } from 'src/app/models/nebim/customer/nebimCustomer';
import { AddressService } from 'src/app/services/admin/address.service';
import { GeneralService } from 'src/app/services/admin/general.service';
import { HeaderService } from 'src/app/services/admin/header.service';
import { PaymentService } from 'src/app/services/admin/payment.service';
import { BarcodeSearch_RM, ProductService } from 'src/app/services/admin/product.service';
import { WarehouseService } from 'src/app/services/admin/warehouse.service';
import { HttpClientService } from 'src/app/services/http-client.service';
import { ToasterService } from 'src/app/services/ui/toaster.service';
import { AddCustomerAddress_CM, ClientCustomer, CreateCustomer_CM } from '../../../../models/model/order/createCustomer_CM';
import { CustomerAddress_VM, CustomerList_VM, GetCustomerList_CM } from '../../../../models/model/order/getCustomerList_CM';
import { ClientOrder, ClientOrderBasketItem, NebimInvoice, NebimOrder, Payment } from '../../../../models/model/order/nebimOrder';
import { FastTransfer_VM } from '../../../../models/model/warehouse/transferRequestListModel';
import { OrderService } from '../../../../services/admin/order.service';
import { GoogleDriveService } from '../../../../services/common/google-drive.service';
import { CreatePackage_MNG_RR, OrderDetail } from '../../../cargo/create-cargo/models/models';

@Component({
  selector: 'app-create-order',
  templateUrl: './create-order.component.html',
  styleUrls: ['./create-order.component.css']
})
export class CreateOrderComponent implements OnInit {
  @ViewChild('findCustomer', { static: false }) findCustomer: ElementRef;
  @ViewChild('findAddress', { static: false }) findAddress: ElementRef;
  @ViewChild('findProducts', { static: false }) findProducts: ElementRef;
  @ViewChild('preview', { static: false }) preview: ElementRef;
  [x: string]: any;
  selectedCustomers: CustomerList_VM[] = []
  selectedProducts: ClientOrderBasketItem[] = []
  selectedAddresses: CustomerAddress_VM[] = []
  selectedOfficeAndWarehosue: any[] = [];
  selectedSubCustomers: SubCustomerList_VM[] = [];
  currAccCode: string;
  salesPersonCode: string;
  payment: Payment = new Payment();
  activeIndex = 0;
  true: boolean = true;
  orderNo: string;
  id: string;
  orderType: boolean;
  pageTitle: string;
  exchangeRate: ExchangeRate;
  isCollapsed: boolean = false;
  isCollapsed_2: boolean = false;
  constructor(private headerService: HeaderService,
    private warehouseService: WarehouseService,
    private paymentService: PaymentService,
    private toasterService: ToasterService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private httpClientService: HttpClientService,
    private generalService: GeneralService,
    private addressService: AddressService,
    private googleDriveService: GoogleDriveService,
    private productService: ProductService,
    private formBuilder: FormBuilder,
    private orderService: OrderService) { }

  async ngOnInit() {
    this.createGetCustomerForm();
    this.createGetProductForm();
    this.createUpdateProductForm()
    this.createsubCustomerForm();
    this.createCargoForm_2()
    this.createPaymentForm();
    this.createCustomerFormMethod();
    this.createDiscountForm();
    this._createCustomerFormMethod();
    await this.getSalesPersonModels();

    this.activatedRoute.params.subscribe(async (params) => {
      if (params['id']) {

        if (params['orderType'] === 'quick-order') {
          this.orderType = true;
          this.pageTitle = "Sipariş Ver"
        } else {

          this.pageTitle = "Perakende Satış"
          this.orderType = false;
        }
        this.id = params['id']
        await this.getClientOrder(0);


        this.headerService.updatePageTitle(this.pageTitle);
      }

      await this.setCustomer();
      await this.getAllCustomers();
      await this.getAddresses();
    })

    var spc = localStorage.getItem('salesPersonCode');
    if (!spc) {
      this.router.navigate(["/pages-loginv2"])
    } else {
      this.salesPersonCode = spc;
    }
    this.exchangeRate = await this.orderService.getExchangeRates();
    this.generatedCargoNumber = this._generateRandomNumber();
    this.paymentForm.get('paymentType').setValue(this.paymentMethods[5])
    this.paymentForm.get('taxTypeCode').setValue(this.stateOptions[1])
    this.console();
  }



  console() {
    this.focusNextInput('barcode_product')
    // this.toasterService.info(this.isCompleted.toString());
    // console.clear();
    // console.log('payment:', this.payment);
    // console.log('selectedCustomers:', this.selectedCustomers);
    // console.log('selectedProducts:', this.selectedProducts);
    // console.log('selectedAddresses:', this.selectedAddresses);
    // console.log('selectedOfficeAndWarehosue:', this.selectedOfficeAndWarehosue);
    // console.log('selectedSubCustomers:', this.selectedSubCustomers);
  }
  //--------------------------------------------------------------------------- KAMERA

  printValue(ev: any) {
    this.toasterService.info("Okutma Başarılı :" + ev);
    //this.generalService.beep()2();
    this.getProductsForm.get('barcode').setValue(ev);
    this.getProducts(this.getProductsForm.value, this.orderType);
  }

  //---------------------------------------------------------------------------
  //---------------------------------------------------- TOTAL FUNCS

  findVatRate(vatRate: number): boolean {
    return this.selectedProducts.some(p => p.taxRate == vatRate)
  }
  calculateVatAmount(vatRate: number): number {
    // First, calculate the total discount rate to apply to each product
    const totalDiscountRate = this.discountRate1 || 0; // percentage discount
    const cashDiscount = this.discountRate2 || 0; // cash discount

    return Number(this.selectedProducts
      .filter(p => p.taxRate === vatRate) // Filter products with the specified VAT rate
      .reduce((total, product) => {
        // Apply percentage discount
        let discountedPrice = product.totalPrice * (1 - totalDiscountRate / 100);

        // Apply cash discount proportionally based on product price
        discountedPrice -= cashDiscount * (product.totalPrice / this.getUntaxedTotal());

        // Calculate VAT based on the final discounted price
        return total + (discountedPrice * product.taxRate / 100);
      }, 0).toFixed(2)); // Sum the VAT amounts and round to 2 decimal places sadas
  }

  //vergisiz tutarların iskontodan sonraki hali
  getUnTaxedTotalAfterDiscount() {
    var number = this.selectedProducts.reduce((acc, product) => acc + product.totalPrice, 0);
    number = ((number * ((100 - this.discountRate1) / 100)) - this.discountRate2)
    if (number.toString().includes('.')) {
      return Number(number)
    } else {
      return number
    }
  }

  //vergisiz tutarların toplamı
  getUntaxedTotal() {
    var number = this.selectedProducts.reduce((acc, product) => acc + product.totalPrice, 0);
    if (number.toString().includes('.')) {
      return Number(number)
    } else {
      return number
    }
  }
  //dip iskonto uygulandıktan sonraki fiyatı çeker
  getTaxedTotalAfterDiscount() {
    return this.selectedProducts.reduce((acc, product) => acc + product.totalTaxedPrice, 0) * ((100 - this.discountRate1) / 100) - this.discountRate2;

  } getTotalQuantity(): number {
    return this.selectedProducts.reduce((acc, product) => acc + product.quantity, 0);
  }

  calculateNetTaxedPrice(product: ClientOrderBasketItem, proposal: ClientOrder): number {
    const lineDiscountedPrice = (product.price || 0) * (1 - product.discountRate1 / 100) - product.discountRate2;
    const generalDiscountedPrice = lineDiscountedPrice * (1 - (proposal.discountRate1 || 0) / 100) - (proposal.discountRate2 || 0);
    const totalPrice = generalDiscountedPrice * product.quantity;
    const totalTaxedPrice = totalPrice * (1 + product.taxRate / 100);
    return parseFloat(totalTaxedPrice.toFixed(2));
  }


  getTotalTax_2(): number {
    return this.selectedProducts.reduce((acc, product) => acc + ((product.totalPrice * (product.taxRate / 100))), 0);
  }

  getTotalTax(): number {


    return this.getTaxedTotalAfterDiscount() - this.getUnTaxedTotalAfterDiscount();
    return this.selectedProducts.reduce((acc, product) => acc + (product.totalPrice * (product.taxRate / 100)), 0);
  }
  getTotal(): number {
    return this.selectedProducts.reduce((acc, product) => acc + product.totalPrice, 0);
  }
  //dip iskonto uygulanmadan önceki fiyatı çeker
  getTotalTaxedPrice(): number {
    var total = this.selectedProducts.reduce((acc, product) => acc + product.totalTaxedPrice, 0);
    return parseFloat(total.toFixed(2));
  }
  getUntaxedTotalWithTax() {

    var number = this.selectedProducts.reduce((acc, product) => acc + (product.quantity * product.discountedPrice * (product.taxRate / 100)), 0);
    if (number.toString().includes('.')) {
      return Number(number.toString().split('.')[0])
    } else {
      return number
    }
  }

  //--------------------------------------------------------------------------- CLIENT ORDER
  stateOptions: any[] = [{ label: 'Standart', value: '0' }, { label: 'Vergisiz', value: '4' }, { label: 'Standart Kdv Düş', value: '5' }];
  taxTypeCode: any;
  isCompleted: boolean = false;
  isCancelled: boolean = false;
  orderNumber: string = "";
  orderDescription: string = "burak demir"  
  discountRate1: number = 0;
  discountRate2: number = 0;
  createdDate: Date;
  async getClientOrder(state: number) {
    var response = await this.orderService.getClientOrder(this.id);

    try {
      if (state === 0) {
        if (response.clientOrder) {
          var order = response;
          this.createdDate = order.clientOrder.createdDate;
          this.discountRate1 = order.clientOrder.discountRate1;
          this.discountForm.get('percentDiscountRate').setValue(this.discountRate2)
          this.discountForm.get('cashDiscountRate').setValue(this.discountRate2)
          this.discountRate2 = order.clientOrder.discountRate2
          this.updateProductForm.get('discountRate1').setValue(order.clientOrder.discountRate1);
          this.updateProductForm.get('discountRate2').setValue(order.clientOrder.discountRate2);

          this.orderNo = order.clientOrder.orderNo
          this.isCompleted = order.clientOrder.isCompleted != null ? order.clientOrder.isCompleted : false;
          this.isCancelled = order.clientOrder.isCancelled != null ? order.clientOrder.isCancelled : false;
          this.currAccCode = order.clientOrder.customerCode;
          this.orderNumber = order.clientOrder.orderNumber
          var customer_request = new GetCustomerList_CM();
          customer_request.currAccCode = this.currAccCode;
          if (customer_request.currAccCode != null) {
            var customerResponse = await this.orderService.getCustomerList_2(customer_request)
            if (customerResponse) {
              var findedCustomer = customerResponse.find(c => c.currAccCode == this.currAccCode);
              this.selectedCustomers.push(findedCustomer);

              console.log("Müşteri Eklendi")
            }
          } else {
            //this.toasterService.error("Eklenecek Müşteri Bulunamadı")

          }

          var request_address = new GetCustomerAddress_CM();
          request_address.currAccCode = this.currAccCode;
          var response = await this.orderService.getCustomerAddress(request_address)
          if (response) {
            var findedAddress = response.find((x: { postalAddressID: any; }) => x.postalAddressID === order.clientOrder.shippingPostalAddressId);
            if (findedAddress) {
              this.selectedAddresses.push(findedAddress);

            } else {
              //this.toasterService.error("Eklenecek Adres Bulunamadı")
            }

          }
          if (order.clientOrder.paymentDescription) {
            this.payment = new Payment();
            this.payment.currencyCode = "TRY";
            this.payment.code = "";
            this.payment.installmentCount = 0;
            this.payment.paymentType = "2";
            this.payment.creditCardTypeCode = order.clientOrder.paymentDescription;
            var finded_payment = this.paymentMethods.find(p => p.name.includes(order.clientOrder.paymentDescription))
            this.paymentForm.get('paymentType').setValue(finded_payment)
            console.log("Ödeme Eklendi")
          }

          //ALT MÜŞTERİ EKLENDİ
          this.createCustomerForm.value.sc_Mode = true;
          if (!this.generalService.isNullOrEmpty(order.clientOrder.subCurrAccId)) {

            var scRequest = new SubCustomerList_VM();
            scRequest.subCurrAccId = order.clientOrder.subCurrAccId;
            var scResponse = await this.orderService.getSubCustomerList(scRequest);
            if (scResponse) {
              this.createCustomerForm.value.sc_Description = scResponse[0]?.companyName;
              this.selectedSubCustomers.push(scResponse[0]);
              console.log("Alt Müşteri Eklendi")
            }

          } else {

          }
          this.payment.amount = this.selectedProducts.reduce((total, product) => total + product.price, 0);
          // this.selectedAddresses = []; burası
          this.orderNo = order.clientOrder.orderNo;


          this.cargoForm_2.get('address_recepient_name').setValue(order.clientOrder.recepientName);
          this.cargoForm_2.get('address_phoneNumber').setValue(order.clientOrder.recepientPhone);
          this.orderDescription = order.clientOrder.description;
          if (order.clientOrderBasketItems.length > 0) {
            this.selectedProducts = [];
            order.clientOrderBasketItems.reverse();
            order.clientOrderBasketItems.forEach((basketItem: ClientOrderBasketItem) => {
              // var object = this.convertLineToObject(basketItem);
              this.selectedProducts.push(basketItem);
            });
          }



        } else {
          this.orderNo = this.generateRandomNumber();
          // this.toasterService.success("Yeni Sipariş : " + this.orderNo)
        }
      } else {
        this.createdDate = response.clientOrder.createdDate;
        if (response.clientOrder) {
          var order = response;
          this.selectedProducts = [];

          if (order.clientOrderBasketItems.length > 0) {
            this.selectedProducts = order.clientOrderBasketItems;
            // order.clientOrderBasketItems.forEach((basketItem: ClientOrderBasketItem) => {
            //   var object = this.convertLineToObject(basketItem);
            //  .push(object);
            // });

            console.log("Ürünler Eklendi")
          }


        } else {
          this.toasterService.error("Yanıt Yok")
        }
      }

    } catch (error) {
      this.toasterService.error(error.message)
    }

  }
  async deleteClientOrder() {
    var response = await this.orderService.deleteClientOrder(this.id);
    if (response) {
      this.toasterService.success("Sipariş Silindi");
      if (this.orderNumber) {
        await this.orderService.deleteNebimOrder(this.orderNumber);
      }

      this.createNewOrder();
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
    object.basePrice = line.basePrice;
    object.discountedPrice = line.discountedPrice;
    object.taxRate = line.taxRate;
    object.priceWs = line.priceWs;
    object.discountRate1 = line.discountRate1;
    object.discountRate2 = line.discountRate2;
    object.totalPrice = line.totalPrice;
    object.totalTaxedPrice = line.totalTaxedPrice;
    return object;
  }

  createClientOrder_RM(): ClientOrder {
    try {

      var request: ClientOrder = new ClientOrder()
      const currentTime = new Date();

      // 3 saat çıkararak yeni bir Date nesnesi oluşturun
      const threeHoursAgo = new Date(currentTime.getTime() + 3 * 60 * 60 * 1000);
      request.createdDate = this.createdDate == undefined ? threeHoursAgo : this.createdDate;
      request.customerCode = this.currAccCode
      request.id = this.id;
      request.orderNo = this.orderNo;
      request.orderNumber = this.orderNumber;
      request.customerDescription = this.selectedCustomers[0]?.currAccDescription || null;
      request.shippingPostalAddressId = this.selectedAddresses[0]?.postalAddressID;
      request.recepientName = this.cargoForm_2.value.address_recepient_name;
      request.recepientPhone = this.cargoForm_2.value.address_phoneNumber;
      request.orderDescription = this.orderDescription;
      request.cargoStatus = "KARGO YOK";
      request.orderDescription = this.paymentForm.get('orderDescription').value;
      request.paymentDescription = this.payment.creditCardTypeCode;
      request.subCurrAccId = this.selectedSubCustomers[0]?.subCurrAccId;
      request.subCustomerDescription = this.selectedSubCustomers[0]?.companyName;
      request.isCancelled = false;
      request.discountRate1 = this.discountRate1
      request.discountRate2 = this.discountRate2
      request.salesPersonCode = localStorage.getItem('salesPersonCode');
      request.salesPersonDescription = this.salesPersonModelList.find(s => s.code == request.salesPersonCode).name;
      if (this.payment) {
        request.paymentType = this.payment.creditCardTypeCode;
      } else {
        request.paymentType = null;
      }



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
      request.quantity = newLine.quantity2;
      request.warehouseCode = newLine.warehouseCode;
      request.brandDescription = newLine.brandDescription;
      request.uD_Stock = newLine.uD_Stock;
      request.mD_Stock = newLine.mD_Stock;
      request.basePrice = newLine.basePrice;
      request.discountedPrice = newLine.discountedPrice;
      request.priceWs = newLine.priceWs
      request.discountRate1 = 0;
      request.discountRate2 = 0;
      request.taxRate = newLine.taxRate;
      request.totalPrice = newLine.quantity * newLine.discountedPrice;
      request.totalTaxedPrice = (newLine.quantity * newLine.discountedPrice) * (1 + (newLine.taxRate / 100));

      return request;
    } catch (error) {
      this.toasterService.error(error.message)
      return null;
    }

  }
  async sendInvoiceToPrinter(orderNumber: string) {

    var response = await this.orderService.sendInvoiceToPrinter(orderNumber);
    if (response) {
      this.toasterService.success("Yazıcıya Gönderildi")
    }

  }

  //---------------------------------------------------------------------------
  //--------------------------------------------------------------------------- SATIŞ ELEMANI
  salesPersonModels: SalesPersonModel[] = [];
  salesPersonModelList: any[] = [];
  selectedPerson: any;
  selectSalesPerson() {
    this.activeIndex = 1;
    //this.generalService.beep()();
    this.toasterService.success("Satış Elemanı Seçildi")
  }
  async getSalesPersonModels(): Promise<any> {
    try {
      this.salesPersonModels = await this.httpClientService
        .get<SalesPersonModel>({
          controller: 'Order/GetSalesPersonModels',
        })
        .toPromise();

      this.salesPersonModels.forEach((c) => {
        var color: any = { name: c.firstLastName, code: c.salespersonCode };
        this.salesPersonModelList.push(color);
      });

      //this.toasterService.success("Başarıyla "+this.salesPersonModels.length+" Adet Çekildi")
    } catch (error: any) {
      this.toasterService.error(error.message);
      return null;
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
      this.toasterService.success(response.currAccCode);
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
      address_taxOffice: [null],
      address_postalCode: [' ']
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
    // Ülkelerin adres bilgilerini al
    var countries = await this.addressService.getAddress(1);
    // Ülkeleri döngüye alarak dönüştür ve _countries dizisine ekle
    this._countries = countries.map((b) => {
      return { name: b.description, code: b.code };
    });

    // Region'ların adres bilgilerini al (örneğin Türkiye)
    var regions = await this.addressService.getAddress(2, "TR");
    // Region'ları döngüye alarak dönüştür ve _regions dizisine ekle
    this._regions = regions.map((b) => {
      return { name: b.description, code: b.code };
    });
  }


  //-------------------------------------------------------------------------
  //------------------------------------------------------------------------- UPLOAD
  selectedFiles: File[] = [];

  async onUpload(event: any, to: string) {
    this.selectedFiles = [];
    // this.toasterService.info(to);
    const files: FileList = event.target.files;
    for (let i = 0; i < files.length; i++) {
      const selectedFile: File = files[i];
      this.selectedFiles.push(selectedFile);
      this.toasterService.success("İşlem Başarılı");
      await this.addPicture(selectedFile, to);
    }
    event.target.value = "";
  }

  async addPicture(file: File, to: string) {
    var response = await this.googleDriveService.addPicture(file);

    if (to === "bussinesCardPhotoUrl") {

      this.addSubCustomerForm.get("bussinesCardPhotoUrl").setValue(response.url);
      this.createCustomerForm.get("bussinesCardPhotoUrl").setValue(response.url);

    } if (to === "stampPhotoUrl") {

      this.addSubCustomerForm.get("stampPhotoUrl").setValue(response.url);
      this.createCustomerForm.get("stampPhotoUrl").setValue(response.url);

    }
    if (to === "cargoAddressPhotoUrl") {

      this.addSubCustomerForm.get("cargoAddressPhotoUrl").setValue(response.url);
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


  @ViewChild('subCurrAccDescription_dropdown') dropdown_3: Dropdown;
  @ViewChild('currAccDescription_dropdown') dropdown: Dropdown;
  @ViewChild('phoneNumber_dropdown') dropdown_2: Dropdown;

  showPanel(type: Number) {

    if (this.selectedCustomers.length == 0) {
      if (type == 1) {
        if (this.dropdown) {
          this.dropdown.show();
        }
      }
      else if (type == 2) {
        if (this.dropdown_2) {
          this.dropdown_2.show();
        }
      }


    }
    else if (type == 3) {
      if (this.dropdown_3) {
        this.dropdown_3.show();
      }
    }

  }
  createCustomerDialog: boolean = false;
  updateProductDialog: boolean = false;
  suggestedProductsDialog: boolean = false;
  getCustomerDialog: boolean = false;
  findProductDialog: boolean = false;
  selectAddressDialog: boolean = false;
  subCustomerDialog: boolean = false;
  addSubCustomerDialog: boolean = false;
  quantityListDialog: boolean = false;
  openDialog(dialogName: string) {
    if (dialogName === "getCustomerDialog") {
      this.getCustomerDialog = !this.getCustomerDialog
    }
    if (dialogName === "findProductDialog") {
      this.findProductDialog = !this.findProductDialog
    }
    if (dialogName === "addSubCustomerDialog") {
      this.addSubCustomerDialog = !this.addSubCustomerDialog
    }
    if (dialogName === "quantityListDialog") {
      this.quantityListDialog = !this.quantityListDialog
    }
    if (dialogName === "suggestedProductsDialog") {
      this.suggestedProductsDialog = !this.suggestedProductsDialog
    }
    if (dialogName === "updateProductDialog") {
      this.updateProductDialog = !this.updateProductDialog
    }
    if (dialogName === "createCustomerDialog") {
      this.createCustomerDialog = !this.createCustomerDialog
    }
  }
  goToPage(index: number) {
    this.activeIndex = index;
    // this.toasterService.info(this.activeIndex.toString())
  }
  //----------------------------------------------------

  //---------------------------------------------------- CUSTOMER
  getCustomerForm: FormGroup;
  customers: CustomerList_VM[] = []
  createCustomerForm: FormGroup;
  _activeIndex = 0;
  selectableCustomers: any[] = [];
  _selectableCustomers: any[] = [];
  selectableSubCustomers: any[] = [];
  subCustomers: SubCustomerList_VM[] = [];
  invoiceType: boolean;
  changeInvoiceType(type: boolean) {
    //bireysel ise
    if (this.invoiceType) {
      this.invoiceType = type;
    }
    //doktora kesilcek ise
    else {
      this.invoiceType = type

    }
  }
  async setCustomer() {
    //ilk önce tüm müşterileri çekkk;
    if (this.selectedCustomers.length == 0) {
      var salesPersonCode = localStorage.getItem('currAccCode');
      if (salesPersonCode) {
        var request: GetCustomerList_CM = new GetCustomerList_CM();
        request.currAccCode = salesPersonCode;
        var response = await this.orderService.getCustomerList_2(request)
        if (response) {
          var findedCustomer = response.find(c => c.currAccCode == salesPersonCode);

          this.selectableCustomers.push({ name: findedCustomer.currAccDescription, value: findedCustomer.phone, currAccCode: findedCustomer.currAccCode })
          this.createCustomerForm.get('currAccDescription').setValue(findedCustomer.currAccDescription);
          await this.selectCurrentCustomer(findedCustomer);
        }
      } else {
        this.toasterService.error('Kullanıcıya Ait Müşteri Bulunamadı')
        return;
      }

    }

  }
  async getCustomersAutomaticaly(field: string) {
    if (field.length > 3) {
      var request: GetCustomerList_CM = new GetCustomerList_CM();
      request.currAccCode = field;
      request.mail = null;
      request.phone = null;

      var response = await this.orderService.getCustomerList_2(request)
      if (response) {
        this.selectableCustomers = [];
        response.forEach(c => {
          this.selectableCustomers.push({ name: c.currAccDescription, value: c.phone, currAccCode: c.currAccCode })
        });
      }
    }


  }
  async submitAddressForm(formValue: any) {


    //kotnrol isteği atılıyor **
    var check_request = new GetCustomerAddress_CM();
    check_request.currAccCode = formValue.currAccDescription.currAccCode;
    var check_response = await this.orderService.getCustomerList_2(check_request);
    if (check_response.length > 0 && check_request.currAccCode != undefined) {
      var _findedCustomer = check_response.find(c => c.currAccCode == formValue.currAccDescription.currAccCode);
      if (_findedCustomer) {
        this.getCustomerForm.get("currAccCode").setValue(check_response[0].currAccCode);
        await this.selectCurrentCustomer(_findedCustomer)
      }
      return;
    }

    // eğer form geçerli ise **
    if (this.createCustomerForm.valid) {
      var request: CreateCustomer_CM = new CreateCustomer_CM();
      request.currAccDescription = formValue.currAccDescription; //++
      request.mail = formValue.mail;
      request.phoneNumber = formValue.phoneNumber;
      request.firmDescription = formValue.currAccDescription;
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




      if (true) {
        var response = await this.orderService.createCustomer(request);
        if (response.currAccCode) {
          this.createCustomerDialog = false;
          var clientCustomer_request = new ClientCustomer();
          clientCustomer_request.cargoAddressPhotoUrl = formValue.cargoAddressPhotoUrl;
          clientCustomer_request.currAccCode = response.currAccCode;
          clientCustomer_request.description = formValue.currAccDescription.value;
          clientCustomer_request.stampPhotoUrl = formValue.stampPhotoUrl;
          clientCustomer_request.bussinesCardPhotoUrl = formValue.bussinesCardPhotoUrl;
          clientCustomer_request.addedSellerCode = localStorage.getItem('salesPersonCode');
          var clientCustomer_response = await this.orderService.editClientCustomer(clientCustomer_request)
          if (clientCustomer_response) {
            this.toasterService.success(this.currAccCode);
            this.currAccCode = response.currAccCode;
            this.getCustomerDialog = true;
            this.getCustomerForm.get("currAccCode").setValue(this.currAccCode);
            await this.getCustomers(this.getCustomerForm.value);
            if (this.customers.length > 0) {
              await this.selectCurrentCustomer(this.customers[0])
              await this.getCustomerAddresses(this.customers[0]);
            }
            // this.activeIndex = 2;
          }

        }
      }
    } else {
      this.generalService.whichRowIsInvalid(this.createCustomerForm)
    }

  }


  addSubCustomerForm: FormGroup;
  createsubCustomerForm() {
    this.addSubCustomerForm = this.formBuilder.group({
      currAccCode: [null],
      subCurrAccDesc: [null],
      mail: [null],
      phone: [null],
      country: [null],
      region: [null],
      province: [null],
      taxOffice: [null],
      district: [null],
      address: [null],
      stampPhotoUrl: [null],
      bussinesCardPhotoUrl: [null],
      cargoAddressPhotoUrl: [null],
    });



    this.addSubCustomerForm.get('region').valueChanges.subscribe(async (value) => { //illeri getir
      var _value = this.addSubCustomerForm.get('region').value.code;
      var response = await this.addressService.getAddress(3, _value)
      this.provinces = response

      this._provinces = [];
      this.provinces.forEach((b) => {
        var provinces: any = { name: b.description, code: b.code };
        this._provinces.push(provinces);
      });
    });

    this.addSubCustomerForm.get('province').valueChanges.subscribe(async (value) => { //ilçeleri getir
      var _value = this.addSubCustomerForm.get('province').value.code;

      var response = await this.addressService.getAddress(4, _value)
      this.districts = response

      this._districts = [];
      this.districts.forEach((b) => {
        var district: any = { name: b.description, code: b.code };
        this._districts.push(district);
      });


      var _value = this.addSubCustomerForm.get('province').value.code;

      var response = await this.addressService.getAddress(5, _value)
      this.taxOffices = response

      this._taxOffices = [];
      this.taxOffices.forEach((b) => {
        var taxOffice: any = { name: b.description, code: b.code };
        this._taxOffices.push(taxOffice);
      });


    });



  }

  async onDropdownChange(value: any) {
    var request: GetCustomerList_CM = new GetCustomerList_CM();
    request.currAccCode = value.currAccCode;
    var response = await this.orderService.getCustomerList_2(request)
    if (response) {
      var findedCustomer = response.find(c => c.currAccCode == request.currAccCode);
      this.createCustomerForm.get('currAccDescription').setValue(findedCustomer.currAccDescription);
      this.selectCurrentCustomer(findedCustomer);
    }
  }

  createCustomerFormMethod() {
    this.createCustomerForm = this.formBuilder.group({
      office: [null],
      warehouse: [null],
      salesPersonCode: [null],
      currAccDescription: [null, Validators.required],
      mail: [' ', Validators.required],
      phoneNumber: ['05', [Validators.required]],
      stampPhotoUrl: [null],
      bussinesCardPhotoUrl: [null],
      cargoAddressPhotoUrl: [null],
      address_country: [null],
      address_province: [null],
      address_district: [null],
      address_region: [null],
      taxNumber: [null],
      address_description: [null],
      address_postalCode: [' '],
      address_taxOffice: [null],
      sc_Description: [null],
      sc_mode: [false],
    });


    this.createCustomerForm.get('sc_Description').valueChanges.subscribe(async (value) => { //alt müşteri olayını
      if (!this.generalService.isNullOrEmpty(value?.name)) {
        var subCustomer: SubCustomerList_VM = new SubCustomerList_VM();
        subCustomer = this.subCustomers.find(p => p.subCurrAccId == value.value);
        if (subCustomer) {
          await this.selectCurrentSubCustomer(subCustomer);
        }

      }

    });


    // this.createCustomerForm.get('phoneNumber').valueChanges.subscribe(async (value) => { //illeri getir
    //   if (this.generalService.isNullOrEmpty(value)) {
    //     this.createCustomerForm.get('phoneNumber').setValue('05')
    //   }
    // });


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


  customFilter = (options: any[], filter: string): any[] => {
    const filterValue = filter.toLowerCase();
    return options.filter(option => option.name.toLowerCase().includes(filterValue));
  }
  async getAllCustomers() {
    try {
      var _request: GetCustomerList_CM = new GetCustomerList_CM();
      _request.currAccCode = null;
      _request.mail = null;
      _request.phone = null;
      var _response = await this.orderService.getCustomerList_2(_request)
      _response.forEach(c => {
        this._selectableCustomers.push({ name: c.currAccDescription, value: c.phone, currAccCode: c.currAccCode })
      });;
    } catch (error) {
      this.toasterService.error(error.message);
    }

  }
  createGetCustomerForm() {
    this.getCustomerForm = this.formBuilder.group({
      mail: [null],
      phone: [null],
      currAccCode: [null],
    });
    this.getCustomerForm.get('currAccCode').valueChanges.subscribe((value) => {
      if (value != null && value != "") {

      }

    });

  }
  createCustomerForm_Submit(value: any) {
    if (this.selectCurrentAddress.length > 0) {

    } else {
      this.toasterService.error("Adres Bulunamadı");
    }

  }

  async getCustomers(request: any) {
    this.customers = await this.orderService.getCustomerList_2(request)
  }
  async selectCurrentCustomer(request: CustomerList_VM) {

    this.selectedCustomers = [];
    this.selectedCustomers.push(request);
    this.currAccCode = request.currAccCode
    this.openDialog("getCustomerDialog");
    // this.toasterService.success("Müşteri Seçildi")
    //this.generalService.beep()();
    var _request: GetCustomerAddress_CM = new GetCustomerAddress_CM();
    _request.currAccCode = request.currAccCode;
    await this.getCustomerAddresses(_request);
  }
  deleteCurrentCustomer() {
    this.selectedCustomers = [];
    this.toasterService.success("Müşteri Silindi")
    this.deleteCurrentAddress();
  }


  async getSubCustomers() {


    if (this.createCustomerForm.value.sc_Description != null ||
      (typeof this.createCustomerForm.value.sc_Description === 'object' &&
        this.generalService.isNullOrEmpty(this.createCustomerForm.value.sc_Description.name))) {

      if (typeof this.createCustomerForm.value.sc_Description === 'object') {
        var request: SubCustomerList_VM = new SubCustomerList_VM();
        request.currAccCode = this.createCustomerForm.value.sc_Description.name;
        var response = await this.orderService.getSubCustomerList(request);
        if (response) {
          this.subCustomers = [];
          this.subCustomers = response;

        }
      }

      else {
        var request: SubCustomerList_VM = new SubCustomerList_VM();
        request.currAccCode = this.createCustomerForm.value.sc_Description;
        var response = await this.orderService.getSubCustomerList(request);
        if (response) {
          this.subCustomers = [];
          this.subCustomers = response;

        }
      }

    } else {

    }




    this.subCustomerDialog = !this.subCustomerDialog;
  }


  async selectCurrentSubCustomer(request: SubCustomerList_VM) {

    this.selectedSubCustomers = [];
    this.selectedSubCustomers.push(request);
    var order_request = this.createClientOrder_RM()
    var order_response = await this.orderService.createClientOrder(order_request)
    if (order_response) {
      this.toasterService.success("Alt Müşteri Seçildi")
      //this.generalService.beep()()
      this.subCustomerDialog = false;
      this.activeIndex = 2;
    }


  }
  log(style) {
    console.log(style)
  }
  async addSubCustomer() {
    console.log(this.addSubCustomerForm.value);
    if (this.selectedCustomers.length === 0) {
      this.toasterService.error("Müşteri Seçiniz");
      return;
    } else {


      var request: SubCustomerList_VM = new SubCustomerList_VM();
      request.currAccCode = this.selectedCustomers[0].currAccCode;
      request.companyName = this.addSubCustomerForm.value.subCurrAccDesc?.name ? this.addSubCustomerForm.value.subCurrAccDesc?.name : this.addSubCustomerForm.value?.subCurrAccDesc;
      request.mail = this.addSubCustomerForm.value.mail;
      request.phone = this.addSubCustomerForm.value.phone;
      request.city = this.generalService.isNullOrEmpty(this.addSubCustomerForm.value.province?.name) ? 'İSTANBUL' : this.addSubCustomerForm.value.province?.name;
      request.district = this.generalService.isNullOrEmpty(this.addSubCustomerForm.value.district?.name) ? 'FATİH' : this.addSubCustomerForm.value.district?.name;
      request.address = this.addSubCustomerForm.value.address;
      request.stampPhotoUrl = this.addSubCustomerForm.value.stampPhotoUrl;
      request.bussinesCardPhotoUrl = this.addSubCustomerForm.value.bussinesCardPhotoUrl;
      request.cargoAddressPhotoUrl = this.addSubCustomerForm.value.cargoAddressPhotoUrl;
      if (this.selectableSubCustomers.some(c => c.name == request.companyName)) {
        this.toasterService.info("Bu Şirkete Ait Kayıt Zaten Açılmıştır");
        this.addSubCustomerDialog = false;
        this.createCustomerForm.get('sc_Description').setValue(this.selectableSubCustomers.find(c => c.name == request.companyName))
        return;
      }



      //var mı diye kontrol et
      var response = await this.orderService.addSubCustomer(request);
      if (response) {
        this.toasterService.success("Alt Müşteri Eklendi")
        this.selectableSubCustomers.push({ name: response[0].companyName, value: response[0].subCurrAccId })
        this.createCustomerForm.get('sc_Description').setValue(response[0].companyName)
        this.selectCurrentSubCustomer(response[0])
        this.openDialog("addSubCustomerDialog")
      } else {
        this.toasterService.error("Alt Müşteri Eklenemedi")
      }
    }



  }
  //----------------------------------------------------ADDRESS
  addresses: CustomerAddress_VM[] = []
  async getCustomerAddresses(request: GetCustomerAddress_CM) {
    this.addresses = await this.orderService.getCustomerAddress(request)
    if (this.addresses.length > 0) {
      await this.selectCurrentAddress(this.addresses[0])
      this.selectAddressDialog = false;

      //alt müşteri sorgusu atılcak

      var subCustomer_request = new SubCustomerList_VM();
      subCustomer_request.currAccCode = this.selectedCustomers[0].currAccCode;

      var subCustomer_response = await this.orderService.getSubCustomerList(subCustomer_request)
      this.subCustomers = [];
      this.subCustomers = subCustomer_response;
      if (subCustomer_response) {

        subCustomer_response.forEach(c => {
          this.selectableSubCustomers.push({ name: c.companyName, value: c.subCurrAccId })
        });

      }
      // this.activeIndex = 2;
    }

    if (this.addresses.length === 0) {

      this._activeIndex = 1;
      this.toasterService.error("Adres Bulunamadı Adres Ekleyiniz")
    }
    this.selectAddressDialog = true;

  }

  async selectCurrentAddress(request: CustomerAddress_VM) {

    this.selectedAddresses = [];
    this.selectedAddresses.push(request);
    var order_request = this.createClientOrder_RM()
    var order_response = await this.orderService.createClientOrder(order_request)
    if (order_response) {

      this.selectAddressDialog = false;
      // this.toasterService.success("Adres Eklendi")
      // this.activeIndex = 2;
      //this.getCustomerForm.reset();
      this.customers = [];
      //this.generalService.beep()()
    }


  }
  deleteCurrentAddress() {
    this.selectedAddresses = [];
    this.toasterService.success("Adres Silindi")
  }
  //----------------------------------------------------
  //---------------------------------------------------- PRODUCTS


  selectedProduct: ClientOrderBasketItem;
  selectedIndex: number;
  updateProductForm: FormGroup
  allProducts: FastTransfer_VM[] = [];


  brands: any[] = []
  itemCodes: any[] = []
  shelfNos: any[] = []
  // targetShelfs: any[] = []
  descriptions: any[] = []
  productHierarchyLevel01s: any[] = []
  productHierarchyLevel02s: any[] = []
  productHierarchyLevel03s: any[] = []

  logFilteredData(event: any) {

    try {
      if (event.filteredValue) {
        console.log('Filtered data:', event.filteredValue);
        var list: FastTransfer_VM[] = event.filteredValue;
        this.mapProducts(list)

        this.toasterService.info("Dinamik Search Güncellendi")
      }

    } catch (error) {
      this.toasterService.error(error.message)
    }

  }
  async addProduct(product: FastTransfer_VM) {


    this.getProductsForm.get('barcode').setValue(product.barcode);
    this.getProductsForm.get('shelfNo').setValue(null);
    this.findProductDialog = false;
    await this.getProducts(this.getProductsForm.value, this.orderType);
  }
  async getAllProducts() {
    if (this.allProducts.length == 0) {
      this.allProducts = await this.productService.searchProduct5();

    }
    this.toasterService.success('Tüm Ürünler Getirildi')
    this.mapProducts(this.allProducts);
    this.openDialog('findProductDialog');
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

    this.shelfNos = uniqueMap(data, 'shelfNo');
    this.brands = uniqueMap(data, 'brand');
    this.itemCodes = uniqueMap(data, 'itemCode');
    // this.targetShelfs = uniqueMap(this.__transferProducts, 'targetShelf');
    this.descriptions = uniqueMap(data, 'description');
    this.productHierarchyLevel01s = uniqueMap(data, 'productHierarchyLevel01');
    this.productHierarchyLevel02s = uniqueMap(data, 'productHierarchyLevel02');
    this.productHierarchyLevel03s = uniqueMap(data, 'productHierarchyLevel03');
  }
  createUpdateProductForm() {
    this.updateProductForm = this.formBuilder.group({
      discountedPrice: [null, Validators.required],
      quantity: [null, Validators.required],
      discountRate1: [null, Validators.required],
      discountRate2: [null, Validators.required],
    });
  }
  openUpdateDialog(product: ClientOrderBasketItem, index: number) {
    this.selectedProduct = product;
    this.selectedIndex = index;

    this.updateProductForm.get('discountedPrice').setValue(this.selectedProduct.discountedPrice)
    this.updateProductForm.get('quantity').setValue(this.selectedProduct.quantity)
    this.updateProductForm.get('discountRate1').setValue(this.selectedProduct.discountRate1)
    this.updateProductForm.get('discountRate2').setValue(this.selectedProduct.discountRate2)


    this.openDialog('updateProductDialog');

  }
  discountForm: FormGroup;
  resetProductForm() {
    this.getProductsForm.reset();
    this.toasterService.success("Form Sıfırlandı")
  }
  createDiscountForm() {

    this.discountForm = this.formBuilder.group({
      cashDiscountRate: [null, Validators.required],
      percentDiscountRate: [null, Validators.required]
    });
  }
  getTotalPrice() {
    var number = this.selectedProducts.reduce((acc, product) => acc + (product.quantity * product.discountedPrice), 0);
    if (number.toString().includes('.')) {
      return Number(number.toString().split('.')[0])
    } else {
      return number
    }
  }
  getTotalPriceWithTax() {

    var number = this.selectedProducts.reduce((acc, product) => acc + (product.quantity * product.discountedPrice * (product.taxRate / 100)), 0);
    if (number.toString().includes('.')) {
      return Number(number.toString().split('.')[0])
    } else {
      return number
    }
  }


  sizes!: any[];

  selectedSize: any = '';

  percentDiscountRate: number;
  cashDiscountRate: number;

  _discountRate: number;
  getProductsForm: FormGroup;
  products: ProductList_VM[] = [];

  currentDiscountRate: number = 0;
  async discount(discountAmount: number) {

    if (discountAmount >= 0 && discountAmount <= 100) {

      this.discountRate1 = discountAmount;
      var r = this.createClientOrder_RM();
      var response: ClientOrder = await this.orderService.createClientOrder(r);
      if (response) {
        this.getClientOrder(0);
        this.toasterService.success('Güncellendi')
      } else {
        this.toasterService.error('Güncellenmedi')
      }
    } else {
      this.toasterService.error('1 ile 100 arasında bir değer giriniz.')
    }


  }
  currentCashdiscountRate: number = 0;
  async cashDiscount(discountAmount: number) {

    this.discountRate2 = discountAmount;
    var r = this.createClientOrder_RM();
    var response: ClientOrder = await this.orderService.createClientOrder(r);
    if (response) {
      await this.getClientOrder(0);
      this.getTaxedTotalAfterDiscount();
      this.toasterService.success('Güncellendi')
    } else {
      this.toasterService.error('Güncellenmedi')
    }
  }

  async resetDiscount() {
    this.discountRate1 = 0;

    this.discountRate2 = 0;
    var r = this.createClientOrder_RM();
    var response: ClientOrder = await this.orderService.createClientOrder(r);
    if (response) {
      await this.getClientOrder(0);
      this.getTaxedTotalAfterDiscount();
      this.toasterService.success('Güncellendi')
    } else {
      this.toasterService.error('Güncellenmedi')
    }

  }

  createGetProductForm() {
    this.getProductsForm = this.formBuilder.group({
      barcode: [null],
      shelfNo: [null]
      // stockCode: [null],
    });
  }
  shelfNumbers: string = 'RAFLAR:'
  qrBarcodeUrl: string = null;
  qrOperationModels: QrOperationModel[] = [];
  async getProducts(request: any, pageType: boolean) {

    if (pageType) { //HIZLI SATIŞ
      try {

        if (request.barcode.includes('http') || this.generalService.isGuid(request.barcode)) {

          var result: string[] = await this.productService.countProductByBarcode3(
            request.barcode

          );
          if (result == null) {
            this.toasterService.error("Qr Sorgusu Hatalı");
            return;
          }

          this.getProductsForm.get('barcode').setValue(result[3]);
          request.barcode = result[3];
          this.getProducts(request, this.orderType);
          this.toasterService.success("Form Verileri Güncellendi")
          return;


        }


        var _request = new BarcodeSearch_RM(request.barcode);


        const response = await this.productService.searchProduct(_request);

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
              // if (this.products.length > 1) {
              //   _product.description += ` (SK: ${request.barcode})`;
              // }
              await this.addCurrentProducts(_product);
            }
            this.getProductsForm.get('barcode').setValue(null);
            this.products = [];
          }
        } else {
          this.toasterService.error("Ürün Bulunamadı")
        }
        this.getProductsForm.get('barcode').setValue(null);
        return response;
      } catch (error: any) {

        return null;
      }
    } else {  //PERAKENDE SATIŞ
      if (!request.shelfNo) {

        if (request.barcode.includes('http') || this.generalService.isGuid(request.barcode)) {

          var result: string[] = await this.productService.countProductByBarcode3(
            request.barcode

          );
          if (result == null) {
            this.toasterService.error("Qr Sorgusu Hatalı");
            this.getProductsForm.get('barcode').setValue(null);
            return;
          }

          this.getProductsForm.get('barcode').setValue(result[3]);
          request.barcode = result[3];
          this.toasterService.success("Form Verileri Güncellendi")


        }
        var result: string[] = await this.productService.countProductByBarcode(
          request.barcode
        );
        this.shelfNumbers += result[0];

        this.generalService.focusNextInput('shelfNo')
        this.toasterService.info("Raf Numarası Giriniz");

        return;
      }

      //↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓

      if (request.barcode.includes('http') || this.generalService.isGuid(request.barcode)) {

        var result: string[] = await this.productService.countProductByBarcode3(
          request.barcode

        );
        if (result == null) {
          this.toasterService.error("Qr Sorgusu Hatalı");
          return;
        }

        this.getProductsForm.get('barcode').setValue(result[3]);
        this.getProductsForm.get('barcode').setValue(null);

        return;


      } else {
        //↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓
        var check_response = await this.warehouseService.countProductRequest(
          request.barcode,
          request.shelfNo,
          1
          ,
          '',
          '',
          '',
          'Order/CountProductControl',
          this.orderNo,
          ''
        );


        if (check_response != undefined) {
          var data: ProductCountModel = check_response;

          if (data.status != 'RAF') {
            this.getProductsForm.get('barcode').setValue(check_response.description);
          }

          //↑ ↑ ↑ ↑ ↑ ↑ ↑ ↑ ↑ ↑ ↑ ↑ ↑ ↑ ↑ ↑ ↑ ↑ ↑ ↑ ↑ ↑ ↑ ↑ ↑ ↑ ↑ ↑ ↑ ↑ ↑ ↑ ↑ ↑ ↑ ↑ ↑ ↑ ↑ ↑

          const response = await this.productService.searchProduct3(check_response.description, check_response.batchCode, this.getProductsForm.value.shelfNo);
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

            if (this.products[0].shelfNo != this.getProductsForm.get('shelfNo').value) {
              this.products[0].shelfNo = this.getProductsForm.get('shelfNo').value
              this.toasterService.info("RAF NUMARASI EŞLEŞTRİLDİ")
            }
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
              this.getProductsForm.get('barcode').setValue(null);
              this.getProductsForm.get('shelfNo').setValue(null);

              for (const _product of this.products) {
                // if (this.products.length > 1) {
                //   _product.description += ` (SK: ${request.barcode})`;
                // }
                await this.addCurrentProducts(_product);

              }
              this.focusNextInput('barcode_product');
              this.getProductsForm.get('barcode').setValue(null);
              this.products = [];
              this.shelfNumbers = 'RAFLAR:'

            }



          }
          return response;


        }

      }
    }

  }

  suggestedProducts: SuggestedProduct[] = [];

  async routeGetProduct(request: string) {
    this.getProductsForm.get('barcode').setValue(request);
    await this.getProducts(this.getProductsForm.value, this.orderType)
    // this.suggestedProductsDialog = false;
  }
  async getsuggestedProducts(itemCode: string, openDialog: boolean) {
    if (!this.generalService.isNullOrEmpty(itemCode)) {
      this.suggestedProducts = []
      var response: SuggestedProduct[] = await this.orderService.getSuggestedProducts(itemCode);
      this.suggestedProducts = response
      if (openDialog) {
        this.openDialog("suggestedProductsDialog");
      }
    } else {
      this.toasterService.error("Barkod Giriniz")
    }

  }

  async addCurrentProducts(request: ProductList_VM): Promise<boolean> {

    if (request.quantity > 0) {
      var order_request = this.createClientOrder_RM()
      var order_response = await this.orderService.createClientOrder(order_request) //sipariş oluşturuldu varsa güncellendi
      if (order_response) {


        var line_request = this.createClientOrderBasketItem_RM(request);
        if (line_request.itemCode.startsWith('FG')) {
          line_request.quantity = 5;
        }
        var line_response = await this.orderService.createClientOrderBasketItem(line_request); //sipariş ürünü oluşturuldu
        if (line_response) {
          this.toasterService.success("Ürün Eklendi")
          //this.generalService.beep()()
          await this.getClientOrder(1);
          return true;
        } else {
          return false;
        }
      } else {
        return false;
      }
    } else {
      this.toasterService.error('Stok Hatası');
      return false;
    }



  }

  async deleteAllPRoduct() {
    if (confirm("Tüm Ürünleri Silmek İstediğinize Emin Misiniz?")) {
      this.selectedProducts.forEach(async p => {
        await this.deleteProduct(p);
      });
    }

  }
  async deleteProduct(product: ClientOrderBasketItem) {
    var response = await this.orderService.deleteClientOrderBasketItem(this.id, product.lineId);
    if (response) {
      this.toasterService.success("Ürün Silindi")
      await this.getClientOrder(1);
    }
  }

  clonedProducts: { [s: string]: ProductList_VM } = {};
  onRowEditInit(product: ProductList_VM) {
    // this.clonedProducts[product.lineId as string] = { ...product };
  }


  async updateQuantity(qty: number, product: ClientOrderBasketItem) {
    if (product.itemCode.startsWith('FG')) {
      qty = qty * 5
    }
    product.quantity += qty
    var response = await this.orderService.updateClientOrderBasketItem(product)
    if (response) {
      this.toasterService.success("Ürün Güncellendi")
      this.getClientOrder(1);
    }
  }

  @ViewChild('dt1') myTable: Table;
  quantityList: number[] = []

  async selectQuantity(product: ClientOrderBasketItem, index: number, quantity: number) {
    // this.toasterService.success(product.quantity.toString());
    product.quantity = quantity;
    var response = await this.orderService.updateClientOrderBasketItem(product);
    if (response) {
      this.toasterService.success("Ürün Güncellendi")
      this.focusNextInput('barcode_product')
      this.resetDiscount();
      this.getClientOrder(1);
    }

    this.closeDialog(index)
    this.updateProductDialog = false;
    delete this.clonedProducts[product.lineId as string];
  }
  async onRowEditSave(product: ClientOrderBasketItem, index: number) {
    product.discountedPrice = this.updateProductForm.get('discountedPrice').value;
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
    this.quantityList = [];
    if (product.price > 0) {

      var findedProduct = this.selectedProducts
        .find(p => p.itemCode == product.itemCode)

      this.quantityList.push((Number(product.uD_Stock) + Number(product.mD_Stock)));
      this.quantityList.push(product.quantity);
      if (Number(findedProduct.quantity) > (Number(product.uD_Stock) + Number(product.mD_Stock))) {
        await this.getsuggestedProducts(product.itemCode, false)
        this.visibleDialogs[index] = true;
        // Sadece ilgili ri için dialog'u açar
        // this.openDialog('quantityListDialog');
        return;
      }

      var response = await this.orderService.updateClientOrderBasketItem(product)
      if (response) {
        this.toasterService.success("Ürün Güncellendi")
        this.focusNextInput('barcode_product')
        this.getClientOrder(1);
      }
      delete this.clonedProducts[product.lineId as string];

    }
    this.updateProductDialog = false;
  }



  onRowEditCancel(product: ClientOrderBasketItem, index: number) {
    this.products[index] = this.clonedProducts[product.lineId as string];
    delete this.clonedProducts[product.lineId as string];
  }



  focusNextInput(nextInputId: string) {
    const nextInput = document.getElementById(nextInputId) as HTMLInputElement;
    if (nextInput) {
      nextInput.focus();
    }
  } //general service


  //----------------------------------------------------
  //---------------------------------------------------- KARGO


  cargoPrices: any[] = [{ name: 'DOSYA (₺90)', code: 90 }, { name: 'PAKET (₺80) ', code: 80 }, { name: 'K.KOLİ (₺115)', code: 115 }
    , { name: 'O.KOLİ (₺140)', code: 140 },
  { name: 'B.KOLİ (₺180)', code: 180 }]



  packagingTypes: any[] = [{ name: 'DOSYA', code: '1' }, { name: 'PAKET', code: '3' }, { name: 'KOLİ', code: '4' }]
  shipmentServiceTypes: any[] = [{ name: 'GÖNDERİCİ ÖDEMELİ', code: '1' }, { name: 'ALICI ÖDEMELİ', code: '2' }]
  cargoFirms: any[] = [{ name: 'Mng', code: 1 }, { name: 'Aras', code: 2 }]

  orderDetail: OrderDetail;

  arasCargoBarcode: string = null;
  getBase64(base64: string) {
    this.arasCargoBarcode = base64;
    this.toasterService.success("Barkod Oluşturuldu")
    this.goToPage(2);
  }
  async getOrderDetail() {
    this.orderDetail = await this.orderService.getOrderDetail(this.orderNumber);

    if (this.orderDetail) {
      var request: GetCustomerAddress_CM = new GetCustomerAddress_CM();
      request.currAccCode = this.orderDetail.currAccCode;
      this.getCustomerAddresses(request);
    }


  }
  generatedCargoNumber: number = 0;
  _generateRandomNumber(): number {
    // 335 ile başlayan bir sayı üretir ve geri kalan 7 hanesini rastgele doldurur
    const prefix = 335; // Sabit başlangıç
    const min = Math.pow(10, 6); // Rastgele sayının minimum değeri (1 ile başlaması için)
    const max = Math.pow(10, 7) - 1; // Rastgele sayının maksimum değeri
    const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min; // 7 haneli rastgele sayı

    return Number(`${prefix}${randomNumber}`);
  }

  paymentForm: FormGroup;
  async createPaymentForm() {
    this.paymentForm = this.formBuilder.group({
      taxTypeCode: [null, Validators.required],
      paymentType: [null, Validators.required],
      orderDescription: [null],
    });

    this.paymentForm.get('taxTypeCode').valueChanges.subscribe((value) => {
      if (value != null) {
        // this.toasterService.success(value.label)
      }

    })
    this.paymentForm.get('paymentType').valueChanges.subscribe((value) => {
      if (value != null) {

        this.createPayment(value.id)
        // this.toasterService.success(value.name)
      }

    })
  }
  cargoForm_2: FormGroup;
  async createCargoForm_2() {
    this.cargoForm_2 = this.formBuilder.group({
      address_recepient_name: [null],
      address_phoneNumber: [null]
    })
  }

  desiErrorMessage = '';
  kgErrorMessage = '';
  cargoResponse: CreatePackage_MNG_RR;





  showCargo: boolean = false;
  showCargo2: boolean = false;
  goBack() {
    this.showCargo2 = false
  }
  showCargoForm(state: boolean) {
    if (state === false) {
      this.activeIndex = 3;
      this.toasterService.success("Kargo Bilgileri Güncellendi")

    } else {
      this.showCargo2 = true
    }


  }
  //----------------------------------------------------

  //---------------------------------------------------- SİPARİŞ

  sidebarVisible4 = true;


  async createNewOrder() {

    var response = window.confirm("Yeni Sipariş Oluşturulacak. Devam Etmek İstiyor musunuz?");
    if (response) {
      var orderNo = await this.generalService.generateGUID();
      if (this.orderType) {
        var Url = location.origin + "/create-order/quick-order/" + orderNo;
        location.href = Url
      } else {
        var Url = location.origin + "/create-order/retail-order/" + orderNo;
        location.href = Url
      }
    }



  }
  async updateClientOrderCancelStatus(id: string, status: boolean) {
    status = status == null ? false : status;
    var response = await this.orderService.updateClientOrderCancelStatus(id, status);
    if (response) {
      this.toasterService.success("Sipariş İptal Edildi")
      this.getClientOrder(0)
    }
    await this.orderService.deleteNebimOrder(this.orderNumber);

  }

  generateRandomNumber(): string {
    let result = '';
    const characters = '0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < 10; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    if (this.orderType == true) {
      return "MSG-" + result;
    } else {
      return "MSG-P-" + result;
    }

  }
  async createPayment(state: number): Promise<boolean> {
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


        return true;

      }
      else {
        return false;
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

        return this.true;
      }
      else {
        return false;
      }
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

        return this.true;
      }
      else {
        return false;
      }
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
      else {
        return false;
      }
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


      } else {
        return false;
      }

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
      else {
        return false;
      }
    }
    this.payment = payment;
    //this.generalService.beep()();

    // this.toasterService.success("Ödeme Onaylandı")
    return true;
  }

  calculateDiscountPercent(products: ProductList_VM[]): number {
    var totalPrice = 0;
    var discountedTotalPrice = 0;
    products.forEach(p => {
      totalPrice += p.basePrice * p.quantity;
      discountedTotalPrice += p.discountedPrice * p.quantity;
    });
    var totalDiscount = ((totalPrice - discountedTotalPrice) / totalPrice) * 100;
    return parseFloat(totalDiscount.toFixed(2));
  }
  async createOrder() {
    // if (!this.cargoForm.valid) {
    //   this.toasterService.error("Kargo Formu Hatalı");
    //   return;
    // }

    if (!this.payment.creditCardTypeCode) {
      if (this.paymentForm.get("paymentType").value) {

        var payment_response = await this.createPayment(this.paymentForm.get("paymentType").value.id);

        if (!payment_response) {
          this.toasterService.error("Ödeme Tipi Seçiniz");
          return;
        }

      }


    }

    if (!this.paymentForm.value.taxTypeCode?.value) {
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

    if (this.selectedProducts.length <= 0) {
      this.toasterService.error("Ürün Ekleyiniz");
      return;
    }



    var exchangeRate: number = 0;
    if (this.selectedCustomers[0].docCurrencyCode === 'TRY') {
      exchangeRate = 1;
    } else if (this.selectedCustomers[0].docCurrencyCode === 'USD') {
      exchangeRate = this.exchangeRate.usd
    }
    else if (this.selectedCustomers[0].docCurrencyCode === 'EUR') {
      exchangeRate = this.exchangeRate.eur
    }
    if (exchangeRate === 0) {
      this.toasterService.error("EXCHANGE RATE ERROR")
      return
    }
    var order_request = this.createClientOrder_RM()
    var order_response = await this.orderService.createClientOrder(order_request) //son sipariş güncellendi

    // var discountPercent: number = this.calculateDiscountPercent(this.selectedProducts);
    var addedOrderNumber = null;
    if (this.orderType) {
      const batchSize = 50;
      const totalProducts = this.selectedProducts.length;
      let batchStart = 0;

      while (batchStart < totalProducts) {
        // Determine the end of the current batch
        let batchEnd = Math.min(batchStart + batchSize, totalProducts);

        // Create a batch of products
        let productBatch = this.selectedProducts.slice(batchStart, batchEnd);

        // Create a new NebimOrder object for the current batch
        var _request = new NebimOrder(
          (addedOrderNumber != undefined || addedOrderNumber != null) ? addedOrderNumber : null,
          exchangeRate,
          this.discountRate1,
          this.discountRate2,
          this.paymentForm.get('orderDescription').value,
          this.currAccCode,
          this.orderNo,
          formValue,  // Ensure this variable supports being split if necessary
          productBatch,
          this.salesPersonCode,
          this.paymentForm.value.taxTypeCode.value,
          this.selectedSubCustomers[0]?.subCurrAccId
        );

        // Call the service to create an order for the batch

        var response = await this.orderService.createOrder(_request);
        this.orderNumber = response.orderNumber;
        addedOrderNumber = response.orderNumber;


        // Update the start index for the next batch
        batchStart += batchSize;
      }
      if (response && response.status === true) {
        addedOrderNumber = response.orderNumber;



        var addedOrder: OrderDetail = await this.orderService.getOrderDetail(this.orderNumber);
        if (addedOrder.orderNumber) {
          this.sendInvoiceToPrinter(addedOrder.orderNumber);

        }
        this.generalService.waitAndNavigate("Sipariş Oluşturuldu", "client-orders/true");
      }
    } else {


      const batchSize = 50;
      const totalProducts = this.selectedProducts.length;
      let batchStart = 0;

      while (batchStart < totalProducts) {
        // Determine the end of the current batch
        let batchEnd = Math.min(batchStart + batchSize, totalProducts);

        // Create a batch of products
        let productBatch = this.selectedProducts.slice(batchStart, batchEnd);

        // Create a new NebimOrder object for the current batch
        var _request = new NebimOrder(
          (addedOrderNumber != undefined || addedOrderNumber != null) ? addedOrderNumber : null,
          exchangeRate,
          this.discountRate1,
          this.discountRate2,
          this.cargoForm_2.get("address_recepient_name").value,
          this.currAccCode,
          this.orderNo,
          formValue,  // Ensure this variable supports being split if necessary
          productBatch,
          this.salesPersonCode,
          this.paymentForm.value.taxTypeCode.value,
          this.selectedSubCustomers[0]?.subCurrAccId
        );

        // Call the service to create an order for the batch

        var response = await this.orderService.createOrder(_request);
        addedOrderNumber = response.orderNumber;
        this.orderNumber = response.orderNumber;


        // Update the start index for the next batch
        batchStart += batchSize;
      }
      if (response && response.status === true) {
        addedOrderNumber = response.orderNumber;


      }

      const _batchSize = 50;
      const _totalProducts = this.selectedProducts.length;
      let _batchStart = 0;
      let invoiceNumber = "";
      while (_batchStart < _totalProducts) {
        // Determine the end of the current batch
        let _batchEnd = Math.min(_batchStart + _batchSize, totalProducts);

        // Create a batch of products
        let _productBatch = this.selectedProducts.slice(_batchStart, _batchEnd);

        var __request: NebimInvoice = new NebimInvoice(
          this.discountRate1,
          this.discountRate2,
          exchangeRate,
          this.selectedCustomers[0].docCurrencyCode,
          this.cargoForm_2.get("address_recepient_name").value,
          this.currAccCode,
          this.orderNo,
          formValue,
          _productBatch,
          this.salesPersonCode,
          this.paymentForm.value.taxTypeCode.value,
          this.selectedAddresses[0].postalAddressID,
          this.selectedSubCustomers[0]?.subCurrAccId,
          invoiceNumber
        );

        __request.lines.forEach(l1 => {
          var fp = response.lines.find((p: { itemCode: string; usedBarcode: string; qty1: number; }) =>
            p.itemCode === l1.itemCode && p.usedBarcode === l1.usedBarcode && p.qty1 === l1.qty1
          );

          if (fp) {
            l1.currencyCode = this.selectedCustomers[0].docCurrencyCode;
            l1.orderLineId = fp.orderLineId;

          }
        });

        var __response = await this.orderService.createInvoice(__request);
        if (__response.status) {
          invoiceNumber = __response.invoiceNumber;

        } else {
          this.toasterService.error("Faturalaştırma Sırasında Hata Alındı")
          break;
        }
        _batchStart += _batchSize;
      }





      if (__response) {
        var addedOrder: OrderDetail = await this.orderService.getOrderDetail(this.orderNumber);
        if (addedOrder.orderNumber) {
          this.sendInvoiceToPrinter(addedOrder.orderNumber);

        }

        this.generalService.waitAndNavigate("Sipariş Oluşturuldu & Faturalaştırıdı", "orders-managament/1/1");
      }
    }
  }

  //----------------------------------------------------

  //---------------------------------------------------- PAYMENTS

  paymentMethods = [
    { id: 1, name: 'PayTr IFRAME' },
    { id: 6, name: 'PayTr SMS/MAIL' },
    { id: 5, name: 'POS İle Öde' },
    { id: 3, name: 'Havale İle Öde' },
    { id: 2, name: 'Nakit İle Öde' },
    { id: 4, name: 'Cari Ödeme' }
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
  visibleDialogs: { [key: number]: boolean } = {}; // ri'ye göre dialog görünürlük durumu


  closeDialog(ri: number): void {
    this.visibleDialogs[ri] = false; // Dialog'u kapatır
  }
  overlayOptions: OverlayOptions = {
    appendTo: 'body',  // Example of setting where the overlay should be appended
    autoZIndex: true,
    baseZIndex: 1000,
    style: { 'min-width': '100%' },  // Custom styles
    styleClass: 'custom-overlay-class' // Custom CSS class
  };


}
