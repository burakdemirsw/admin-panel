import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Dropdown } from 'primeng/dropdown';
import { Table, TableModule } from 'primeng/table';
import { SubCustomerList_VM } from 'src/app/models/model/customer/subCustomerList_VM';
import { AddCustomerAddress_CM, CreateCustomer_CM } from 'src/app/models/model/order/createCustomer_CM';
import { ExchangeRate } from 'src/app/models/model/order/exchangeRate';
import { CustomerAddress_VM, CustomerList_VM, GetCustomerAddress_CM, GetCustomerList_CM } from 'src/app/models/model/order/getCustomerList_CM';
import { ClientOrder, ClientOrderBasketItem, NebimInvoice, NebimOrder, Payment } from 'src/app/models/model/order/nebimOrder';
import { SalesPersonModel } from 'src/app/models/model/order/salesPersonModel';
import { SuggestedProduct } from 'src/app/models/model/order/suggestedProduct';
import { Address_VM } from 'src/app/models/model/order/ViewModel/provinceVM';
import { Payment_CM, Payment_CR } from 'src/app/models/model/payment/payment_CR';
import { ProductList_VM } from 'src/app/models/model/product/productList_VM';
import { QrOperationModel } from 'src/app/models/model/product/qrOperationModel';
import { ProductCountModel } from 'src/app/models/model/shelfNameModel';
import { FastTransfer_VM } from 'src/app/models/model/warehouse/transferRequestListModel';
import { PostalAddress } from 'src/app/models/nebim/customer/nebimCustomer';
import { AddressService } from 'src/app/services/admin/address.service';
import { CargoService } from 'src/app/services/admin/cargo.service';
import { GeneralService } from 'src/app/services/admin/general.service';
import { HeaderService } from 'src/app/services/admin/header.service';
import { OrderService } from 'src/app/services/admin/order.service';
import { PaymentService } from 'src/app/services/admin/payment.service';
import { BarcodeSearch_RM, ProductService } from 'src/app/services/admin/product.service';
import { WarehouseService } from 'src/app/services/admin/warehouse.service';
import { GoogleDriveService } from 'src/app/services/common/google-drive.service';
import { HttpClientService } from 'src/app/services/http-client.service';
import { ToasterService } from 'src/app/services/ui/toaster.service';
import { CargoSetting, CreateBarcode_MNG_Request, CreatePackage_MNG_Request, CreatePackage_MNG_RM, CreatePackage_MNG_RR, OrderDetail, OrderPieceListMNG } from '../../cargo/create-cargo/models/models';
import { ClientCustomer } from '../../Customer/customer-list/customer-list.component';
import { ZTMSG_Proposal, ZTMSG_ProposalProduct } from 'src/app/models/model/product/proposalProduct';
import { borderTopRightRadius } from 'html2canvas/dist/types/css/property-descriptors/border-radius';
import { Product } from '../../../models/model/product/product';

@Component({
  selector: 'app-create-proposal',
  templateUrl: './create-proposal.component.html',
  styleUrl: './create-proposal.component.css'
})
export class CreateProposalComponent implements OnInit {



  [x: string]: any;
  selectedCustomers: CustomerList_VM[] = []
  selectedProducts: ProductList_VM[] = []
  selectedAddresses: CustomerAddress_VM[] = []
  selectedOfficeAndWarehosue: any[] = [];
  selectedSubCustomers: SubCustomerList_VM[] = [];
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
  orderType: boolean;
  pageTitle: string;
  exchangeRate: ExchangeRate;
  isCollapsed: boolean = false;
  isCollapsed_2: boolean = false;
  constructor(private headerService: HeaderService, private warehouseService: WarehouseService, private paymentService: PaymentService, private toasterService: ToasterService, private activatedRoute: ActivatedRoute,
    private router: Router, private httpClientService: HttpClientService,
    private generalService: GeneralService, private addressService: AddressService,
    private googleDriveService: GoogleDriveService, private productService: ProductService,
    private formBuilder: FormBuilder, private orderService: OrderService,
    private cargoService: CargoService) { }

  async ngOnInit() {
    this.createUpdateProductForm()
    // this.createGetCustomerForm();
    // this.createGetProductForm();

    this.orderType = true;
    this.pageTitle = "Teklif Oluştur"

    await this.getProposalProducts();

    this.activatedRoute.params.subscribe(async (params) => {
      if (params['id']) {
        this.proposalId = params['id']
        await this.addProposal();
        await this.getProposalProducts();
      } else {
        await this.addProposal();
      }
    })
    this.headerService.updatePageTitle(this.pageTitle);
    // this.setCustomer();
    // this.createCargoForm();
    // this.createCargoForm_2()
    // this.createsubCustomerForm();
    // this.createPaymentForm();
    // this.createCustomerFormMethod();
    this.createDiscountForm();
    // this.createOfficeWarehouseForm();
    // this._createCustomerFormMethod();
    // this.getAddresses();
    // this.selectOfficeAndWarehosue();


    // var spc = localStorage.getItem('salesPersonCode');
    // if (!spc) {
    //   this.router.navigate(["/pages-loginv2"])
    // } else {
    //   this.salesPersonCode = spc;
    // }
    // this.exchangeRate = await this.orderService.getExchangeRates();
    // this.generatedCargoNumber = this._generateRandomNumber();
    // this.paymentForm.get('paymentType').setValue(this.paymentMethods[5])
    // this.paymentForm.get('taxTypeCode').setValue(this.stateOptions[1])

  }

  //--------------------------------------------------------------------------- KAMERA

  printValue(ev: any) {
    this.toasterService.info("Okutma Başarılı :" + ev);
    //this.generalService.beep()2();
    this.getProductsForm.get('barcode').setValue(ev);
    this.getProducts(this.getProductsForm.value, this.orderType);
  }
  //--------------------------------------------------------------------------- CLIENT ORDER
  stateOptions: any[] = [{ label: 'Standart', value: '0' }, { label: 'Vergisiz', value: '4' }, { label: 'Standart Kdv Düş', value: '5' }];
  taxTypeCode: any;
  isCompleted: boolean = false;
  orderNumber: string = "";
  orderDescription: string = "burak demir"
  async getClientOrder(state: number) {
    var response = await this.orderService.getClientOrder(this.id);

    if (state === 0) {
      if (response.clientOrder) {
        var order = response;
        this.orderNo = order.clientOrder.orderNo
        this.isCompleted = order.clientOrder.isCompleted
        this.currAccCode = order.clientOrder.customerCode;
        this.orderNumber = order.clientOrder.orderNumber
        var customer_request = new GetCustomerList_CM();
        customer_request.currAccCode = this.currAccCode;
        if (customer_request.currAccCode != null) {
          var customerResponse = await this.orderService.getCustomerList_2(customer_request)
          if (customerResponse) {
            this.selectedCustomers.push(customerResponse[0]);
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
            var object = this.convertLineToObject(basketItem);
            this.selectedProducts.push(object);
          });
        }



      } else {
        this.orderNo = this.generateRandomNumber();
        this.toasterService.success("Yeni Sipariş : " + this.orderNo)
      }
    } else {
      if (response.clientOrder) {
        var order = response;
        this.selectedProducts = [];

        if (order.clientOrderBasketItems.length > 0) {
          order.clientOrderBasketItems.forEach((basketItem: ClientOrderBasketItem) => {
            var object = this.convertLineToObject(basketItem);
            this.selectedProducts.push(object);
          });

          console.log("Ürünler Eklendi")
        }


      } else {
        this.toasterService.error("Yanıt Yok")
      }
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
    return object;
  }

  createClientOrder_RM(): ClientOrder {
    try {

      var request: ClientOrder = new ClientOrder()
      request.customerCode = this.currAccCode
      request.id = this.id;
      request.orderNo = this.orderNo;
      request.orderNumber = this.orderNumber;
      request.customerDescription = this.selectedCustomers[0]?.currAccDescription || null;
      request.shippingPostalAddressId = this.selectedAddresses[0]?.postalAddressID;
      request.recepientName = this.cargoForm_2.value.address_recepient_name;
      request.recepientPhone = this.cargoForm_2.value.address_phoneNumber;
      request.orderDescription = this.orderDescription;
      request.cargoStatus = this.cargoForm.get('isActive').value == true ? "KARGO VAR" : "KARGO YOK"
      request.orderDescription = this.paymentForm.get('orderDescription').value;
      request.paymentDescription = this.payment.creditCardTypeCode;
      request.subCurrAccId = this.selectedSubCustomers[0]?.subCurrAccId;
      request.subCustomerDescription = this.selectedSubCustomers[0]?.companyName;

      if (this.payment) {
        request.paymentType = this.payment.creditCardTypeCode;
      } else {
        request.paymentType = null;
      }

      request.createdDate = new Date(3);

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
      request.taxRate = newLine.taxRate;
      request.priceWs = newLine.priceWs
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

    } if (to === "stampPhotoUrl") {

      this.addSubCustomerForm.get("stampPhotoUrl").setValue(response.url);

    }
    if (to === "cargoAddressPhotoUrl") {

      this.addSubCustomerForm.get("cargoAddressPhotoUrl").setValue(response.url);

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
    //ilk önce tüm müşterileri çek;
    var salesPersonCode = localStorage.getItem('currAccCode');
    var request: GetCustomerList_CM = new GetCustomerList_CM();
    request.currAccCode = salesPersonCode;
    var response = await this.orderService.getCustomerList_2(request)
    if (response) {
      var findedCustomer = response.find(c => c.currAccCode == salesPersonCode);

      this.selectableCustomers.push({ name: findedCustomer.currAccDescription, value: findedCustomer.phone, currAccCode: findedCustomer.currAccCode })
      this.createCustomerForm.get('currAccDescription').setValue(findedCustomer.currAccDescription);
      this.selectCurrentCustomer(findedCustomer);
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


    // var customerResponse = await await this.orderService.getCustomerList_2(customer_request)
    // if (customerResponse) {
    //   this.selectedCustomers.push(customerResponse[0]);
    //   console.log("Müşteri Eklendi")
    // }
    // this.createCustomerForm.get('sc_mode').valueChanges.subscribe(async (value) => { //illeri getir
    //   if (value==true) {
    //     this.
    //   }
    // });

    this.createCustomerForm.get('sc_Description').valueChanges.subscribe(async (value) => { //alt müşteri olayını
      if (!this.generalService.isNullOrEmpty(value?.name)) {
        var subCustomer: SubCustomerList_VM = new SubCustomerList_VM();
        subCustomer = this.subCustomers.find(p => p.subCurrAccId == value.value);
        if (subCustomer) {
          await this.selectCurrentSubCustomer(subCustomer);
        }

      }

    });


    this.createCustomerForm.get('phoneNumber').valueChanges.subscribe(async (value) => { //illeri getir
      if (this.generalService.isNullOrEmpty(value)) {
        this.createCustomerForm.get('phoneNumber').setValue('05')
      }
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


  customFilter = (options: any[], filter: string): any[] => {
    const filterValue = filter.toLowerCase();
    return options.filter(option => option.name.toLowerCase().includes(filterValue));
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
    this.toasterService.success("Müşteri Seçildi")
    //this.generalService.beep()();
    var _request: GetCustomerAddress_CM = new GetCustomerAddress_CM();
    _request.currAccCode = request.currAccCode;
    this.getCustomerAddresses(_request);
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

  async addSubCustomer() {
    console.log(this.addSubCustomerForm.value);
    if (this.selectedCustomers.length === 0) {
      this.toasterService.error("Müşteri Seçiniz");
      return;
    } else {
      var request: SubCustomerList_VM = new SubCustomerList_VM();
      request.currAccCode = this.selectedCustomers[0].currAccCode;
      request.companyName = this.addSubCustomerForm.value.subCurrAccDesc;
      request.mail = this.addSubCustomerForm.value.mail;
      request.phone = this.addSubCustomerForm.value.phone;
      request.city = this.generalService.isNullOrEmpty(this.addSubCustomerForm.value.province?.name) ? 'İSTANBUL' : this.addSubCustomerForm.value.province?.name;
      request.district = this.generalService.isNullOrEmpty(this.addSubCustomerForm.value.district?.name) ? 'FATİH' : this.addSubCustomerForm.value.district?.name;
      request.address = this.addSubCustomerForm.value.address;
      request.stampPhotoUrl = this.addSubCustomerForm.value.stampPhotoUrl;
      request.bussinesCardPhotoUrl = this.addSubCustomerForm.value.bussinesCardPhotoUrl;
      request.cargoAddressPhotoUrl = this.addSubCustomerForm.value.cargoAddressPhotoUrl;

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
      this.selectCurrentAddress(this.addresses[0])
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

  //--------------------------------------------------------------------------- TEKLİF KODLAR

  proposalId: number;
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

  addedProducts: ZTMSG_ProposalProduct[] = []
  proposal: ZTMSG_Proposal = new ZTMSG_Proposal();
  async addProposal() {


    var request: ZTMSG_Proposal = new ZTMSG_Proposal();
    request.id = this.proposalId;
    request.discountRate1 = 0;
    request.discountRate2 = 0;
    request.userId = Number(localStorage.getItem('userId'));


    var response: ZTMSG_Proposal = await this.productService.addProposal(request);

    if (response) {
      this.proposal = response;
      this.proposalId = response.id;
      // await this.getProposalProducts();
      this.toasterService.success('Oluşturuldu')
      this.generalService.beep();
    } else {
      this.toasterService.error('Oluşturulamadı')
    }

  }
  async deleteProposal(id: number) {
    const confirmed = window.confirm('Bu teklifi silmek istediğinizden emin misiniz?');
    if (confirmed) {
      try {
        const response = await this.productService.deleteProposal(id);
        if (response) {
          this.toasterService.success('Silindi');
          this.router.navigate(['/proposal-list']);
        } else {
          this.toasterService.error('Silinemedi');
        }
      } catch (error) {
        console.error('Error deleting proposal', error);
        this.toasterService.error('Silinemedi');
      }
    }
  }

  async updatePropoosal(request: ZTMSG_Proposal) {
    var response: ZTMSG_Proposal = await this.productService.updateProposal(request);

    if (response) {

      this.proposal = response;
      this.proposalId = response.id;
      // await this.getProposalProducts();
      this.toasterService.success('Güncelleştirildi')
      this.generalService.beep();
    } else {
      this.toasterService.error('Güncelleştirilemedi')
    }
  }
  async addProduct(product: FastTransfer_VM) {
    //toptan fiyat ve tr giyat alıncak
    //buradada db ye ekle sonra çek
    var request: BarcodeSearch_RM = new BarcodeSearch_RM(product.barcode);
    const productDetail = await this.productService.searchProduct(request);
    if (productDetail) {
      product.price = productDetail[0].basePrice;
      const proposalProduct = new ZTMSG_ProposalProduct();
      proposalProduct.id = 0; // Varsayılan bir değer, ya da uygun bir değer belirleyin
      proposalProduct.proposalId = this.proposalId; // Uygun bir GUID değeri be  lirleyin
      proposalProduct.photoUrl = product.photoUrl;
      proposalProduct.barcode = product.barcode;
      proposalProduct.itemCode = product.itemCode;
      proposalProduct.quantity = 1;
      proposalProduct.brand = product.brand;
      proposalProduct.inventory = product.inventory;
      proposalProduct.price = product.price ? parseFloat(product.price) : null;
      proposalProduct.discountedPrice = product.price ? parseFloat(product.price) : null;
      proposalProduct.description = product.description;
      proposalProduct.discountRate1 = 0;
      proposalProduct.discountRate2 = 0;

      proposalProduct.taxRate = 10;
      var taxed_price = (proposalProduct.discountedPrice * (1 + (proposalProduct.taxRate / 100)));
      proposalProduct.totalTaxedPrice = proposalProduct.quantity * taxed_price;
      proposalProduct.totalPrice = proposalProduct.quantity *
        (
          (proposalProduct.discountedPrice * ((100 - proposalProduct.discountRate1) / 100)) - proposalProduct.discountRate2
        )

      proposalProduct.totalTaxedPrice = proposalProduct.quantity *
        (
          (proposalProduct.totalTaxedPrice * ((100 - proposalProduct.discountRate1) / 100)) - proposalProduct.discountRate2
        )


      var response = await this.productService.addProposalProduct(proposalProduct);
    }

    if (response) {
      await this.getProposalProducts();
      this.toasterService.success('Eklendi')
      this.generalService.beep();
    } else {
      this.toasterService.error('Eklenmedi')
    }


  }

  async deleteProposalProduct(id: number) {

    var response = await this.productService.deleteProposalProduct(id);
    if (response) {
      await this.getProposalProducts();
      this.toasterService.success('Silindi')
      this.generalService.beep();
    } else {
      this.toasterService.error('Silinemedi')
    }
  }
  async updateProposalProduct(product: ZTMSG_ProposalProduct) {
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
    var response = await this.productService.updateProposalProduct(product);
    if (response) {
      this.getTotalPrice2();
      await this.getProposalProducts();
      this.toasterService.success('Güncellendi')
      this.generalService.beep();
      this.updateProductDialog = false
    } else {
      this.toasterService.error('Güncellenmedi')
    }
  }

  async refreshProposalProduct(product: ZTMSG_ProposalProduct) {
    product.discountedPrice = product.price;
    product.quantity = product.quantity;
    product.discountRate1 = 0;
    product.discountRate2 = 0;

    product.totalPrice = (product.quantity * ((product.discountedPrice * ((100 - product.discountRate1) / 100)) - product.discountRate2))
    var response = await this.productService.updateProposalProduct(product);
    if (response) {
      await this.getProposalProducts();
      this.toasterService.success('Güncellendi')
      this.generalService.beep();
    } else {
      this.toasterService.error('Güncellenmedi')
    }
  }
  async getProposalProducts() {
    if (this.proposal.id) {
      this.addedProducts = await this.productService.getProposalProducts(this.proposalId?.toString());
      if (this.addedProducts.length == 0) {
        this.proposal.discountRate1 = 0;
        this.proposal.discountRate2 = 0;
        await this.updatePropoosal(this.proposal);
      }
    }

  }

  selectedProduct: ZTMSG_ProposalProduct;
  openUpdateDialog(product: ZTMSG_ProposalProduct) {
    this.selectedProduct = product;
    this.updateProductForm.get('price').setValue(this.selectedProduct.discountedPrice)
    this.updateProductForm.get('quantity').setValue(this.selectedProduct.quantity)
    this.updateProductForm.get('discountRate1').setValue(this.selectedProduct.discountRate1)
    this.updateProductForm.get('discountRate2').setValue(this.selectedProduct.discountRate2)

    this.openDialog('updateProductDialog');
    this.getTotalPrice();
    this.getTotalPrice2();
  }

  currentDiscountRate: number = 0;
  selectedSize: any = '';

  percentDiscountRate: number;
  cashDiscountRate: number;
  async discount(discountAmount: number) {

    if (discountAmount >= 0 && discountAmount <= 100) {
      this.proposal.discountRate1 = discountAmount;
      var response: ZTMSG_Proposal = await this.productService.updateProposal(this.proposal);
      if (response) {
        this.proposal = response;

        // await this.getProposalProducts();
        // await this.getProposalProducts();
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

    this.proposal.discountRate2 = discountAmount;
    var response: ZTMSG_Proposal = await this.productService.updateProposal(this.proposal);
    if (response) {
      this.proposal = response;

      // await this.getProposalProducts();
      this.getTotalPrice2();
      this.toasterService.success('Güncellendi')
      this.generalService.beep();
    } else {
      this.toasterService.error('Güncellenmedi')
    }
  }

  async resetDiscount() {
    this.proposal.discountRate2 = 0;
    this.proposal.discountRate1 = 0
    var response: ZTMSG_Proposal = await this.productService.updateProposal(this.proposal);
    if (response) {
      this.proposal = response;

      this.getTotalPrice2();
      this.toasterService.success('Güncellendi')
      this.generalService.beep();
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

  async createProposalReport() {

    if (window.confirm("Teklifi Oluşturmak İstediğinize Emin Misiniz?")) {
      var data = await this.warehouseService.createProposalReport(this.proposal.id);
      if (data) {


        const file = new Blob([data], { type: 'application/pdf' });
        const fileURL = URL.createObjectURL(file);

        // Create a temporary link element
        const downloadLink = document.createElement('a');
        downloadLink.href = fileURL;
        downloadLink.download = "marketplace-order-cargo-barcode.pdf";  // Set the filename for the download
        document.body.appendChild(downloadLink); // Append to body
        downloadLink.click();  // Trigger the download
        document.body.removeChild(downloadLink); // Remove the link after triggering the download
        URL.revokeObjectURL(fileURL); // Clean up the URL object



        const _file = new Blob([data], { type: 'application/pdf' });
        const _fileURL = URL.createObjectURL(_file);

        // Create an iframe element
        const iframe = document.createElement('iframe');
        iframe.style.display = 'none';  // Hide the iframe
        iframe.src = _fileURL;

        // Append the iframe to the body
        document.body.appendChild(iframe);

        // Wait until the iframe is loaded, then call print
        iframe.onload = () => {
          iframe.contentWindow?.print();
        };

        this.toasterService.success("Teklif YAZDIRILDI");

      } else {
        this.toasterService.error("Teklif YAZDIRILAMADI");
      }

    }
  }
  async deleteAllPRoduct() {
    if (confirm("Tüm Ürünleri Silmek İstediğinize Emin Misiniz?")) {
      this.addedProducts.forEach(async p => {
        await this.deleteProposalProduct(p.id);
      });
    }
    this.getTotalPrice();
    this.getTotalPrice2();

  }
  findCustomerDialog = false;
  customerNames: any[] = [];
  emails: any[] = [];
  phones: any[] = [];
  _descriptions: any[] = [];
  docCurrencyCodes: any[] = [];

  mapCustomers(data: CustomerList_VM[]) {
    const uniqueMap = (array, key) => {
      const map = new Map();
      array.forEach(item => {
        if (!map.has(item[key])) {
          map.set(item[key], { label: item[key], value: item[key] });
        }
      });
      return Array.from(map.values()).sort((a, b) => a.label.localeCompare(b.label));
    };

    this.customerNames = uniqueMap(data, 'currAccCode');
    this._descriptions = uniqueMap(data, 'currAccDescription');
    this.emails = uniqueMap(data, 'mail');
    this.phones = uniqueMap(data, 'phone');
    this.docCurrencyCodes = uniqueMap(data, 'docCurrencyCode');
  }


  async getAllCustomers() {
    if (this._selectableCustomers.length > 0) {
      this.findCustomerDialog = true;
    } else {
      var _request: GetCustomerList_CM = new GetCustomerList_CM();
      _request.currAccCode = null;
      _request.mail = null;
      _request.phone = null;
      this._selectableCustomers = await this.orderService.getCustomerList_2(_request)
      this.mapCustomers(this._selectableCustomers);
      this.findCustomerDialog = true;
    }
  }
  async addCustomer(customer: CustomerList_VM) {
    this.proposal.currAccDescription = customer.currAccDescription;
    await this.updatePropoosal(this.proposal);
    this.findCustomerDialog = false;
  }
  logFilteredData2(event: any) {

    // try {
    //   if (event.filteredValue) {

    //     var list: CustomerList_VM[] = event.filteredValue;
    //     this.mapCustomers(list)

    //     this.toasterService.info("Dinamik Search Güncellendi")
    //   }

    // } catch (error) {
    //   this.toasterService.error(error.message)
    // }

  }

  //---------------------------------------------------- TOTAL FUNCS

  getTotalPrice() {
    var number = this.addedProducts.reduce((acc, product) => acc + product.totalPrice, 0);
    if (number.toString().includes('.')) {
      return Number(number.toString().split('.')[0])
    } else {
      return number
    }
  }
  //dip iskonto uygulandıktan sonraki fiyatı çeker
  getTotalPrice2() {
    return this.addedProducts.reduce((acc, product) => acc + product.totalTaxedPrice, 0) * ((100 - this.proposal.discountRate1) / 100) - this.proposal.discountRate2;

  } getTotalQuantity(): number {
    return this.addedProducts.reduce((acc, product) => acc + product.quantity, 0);
  }

  getTotalTax(): number {
    return this.addedProducts.reduce((acc, product) => acc + (product.totalPrice * (product.taxRate / 100)), 0);
  }
  getTotal(): number {
    return this.addedProducts.reduce((acc, product) => acc + product.totalPrice, 0);
  }
  //dip iskonto uygulanmadan önceki fiyatı çeker
  getTotalTaxedPrice(): number {
    var total = this.addedProducts.reduce((acc, product) => acc + product.totalTaxedPrice, 0);
    return parseFloat(total.toFixed(2));
  }
  getTotalPriceWithTax() {

    var number = this.selectedProducts.reduce((acc, product) => acc + (product.quantity * product.discountedPrice * (product.taxRate / 100)), 0);
    if (number.toString().includes('.')) {
      return Number(number.toString().split('.')[0])
    } else {
      return number
    }
  }
  //---------------------------------------------------- PRODUCTS



  selectedIndex: number;
  updateProductForm: FormGroup
  allProducts: FastTransfer_VM[] = [];

  createUpdateProductForm() {
    this.updateProductForm = this.formBuilder.group({
      price: [null, Validators.required],
      quantity: [null, Validators.required],
      discountRate1: [null, Validators.required],
      discountRate2: [null, Validators.required],
    });
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



  sizes!: any[];



  _discountRate: number;
  getProductsForm: FormGroup;
  products: ProductList_VM[] = [];


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
    this.suggestedProductsDialog = false;
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


  async deleteProduct(product: ProductList_VM) {
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


  async updateQuantity(qty: number, product: ProductList_VM) {
    if (product.itemCode.startsWith('FG')) {
      qty = qty * 5
    }
    product.quantity += qty
    var response = await this.orderService.updateClientOrderBasketItem(this.id, product.lineId, product.quantity, product.price,
      product.discountedPrice, product.basePrice, product.priceWs)
    if (response) {
      this.toasterService.success("Ürün Güncellendi")
      this.getClientOrder(1);
    }
  }

  @ViewChild('dt1') myTable: Table;
  quantityList: number[] = []

  async selectQuantity(product: ProductList_VM, index: number, quantity: number) {
    // this.toasterService.success(product.quantity.toString());
    product.quantity = quantity;
    var response = await this.orderService.updateClientOrderBasketItem(this.id, product.lineId, product.quantity, product.price, product.discountedPrice,
      product.basePrice, product.priceWs);
    if (response) {
      this.toasterService.success("Ürün Güncellendi")
      this.focusNextInput('barcode_product')
      this.resetDiscount();
      this.getClientOrder(1);
    }

    this.quantityListDialog = false;

    delete this.clonedProducts[product.lineId as string];
    this.cancelRowEdit(product, 0);
  }
  async onRowEditSave(product: ProductList_VM, index: number) {
    product.discountedPrice = this.updateProductForm.value.price;
    product.quantity = this.updateProductForm.value.quantity;

    this.quantityList = [];
    if (product.price > 0) {

      var findedProduct = this.selectedProducts
        .find(p => p.itemCode == product.itemCode)

      this.quantityList.push(product.quantity);
      this.quantityList.push((Number(product.uD_Stock) + Number(product.mD_Stock)));
      if (Number(findedProduct.quantity) > (Number(product.uD_Stock) + Number(product.mD_Stock))) {
        await this.getsuggestedProducts(product.itemCode, false)
        this.openDialog('quantityListDialog');
        return;
      }

      this.toasterService.success(product.quantity.toString());
      var response = await this.orderService.updateClientOrderBasketItem(this.id, product.lineId, product.quantity, product.price,
        product.discountedPrice, product.basePrice, product.priceWs)
      if (response) {
        this.toasterService.success("Ürün Güncellendi")
        this.focusNextInput('barcode_product')
        this.resetDiscount();
        this.getClientOrder(1);
      }
      delete this.clonedProducts[product.lineId as string];

    }
    this.cancelRowEdit(product, 0);
    this.updateProductDialog = false;
  }


  cancelRowEdit(product: ProductList_VM, index: number) {

    this.selectedProducts.forEach(product => {
      this.myTable.cancelRowEdit(product);

    });


  }
  onRowEditCancel(product: ProductList_VM, index: number) {
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
  cargoForm: FormGroup

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

  async createCargoForm() {
    this.cargoForm = this.formBuilder.group({
      address_recepient_name: [null],
      address_phoneNumber: [null],
      packagingType: [null],
      shipmentServiceType: [null],
      isCOD: [false],
      kg: [1],
      desi: [1],
      isActive: [false],
      cargoFirm: [null],
      address_package_count: [1, Validators.min(1)],
      cargoPrice: [null]
    })


    this.cargoForm.get('cargoFirm').valueChanges.subscribe((value) => {
      if (value != null) {
        this.cargoForm.get('isActive').setValue(true);
      }

    })
    this.cargoForm.get('isActive').valueChanges.subscribe((value) => {
      if (value === false) {
        this.cargoForm.get('packagingType').clearValidators();
        this.cargoForm.get('packagingType').updateValueAndValidity();
        this.cargoForm.get('shipmentServiceType').clearValidators();
        this.cargoForm.get('shipmentServiceType').updateValueAndValidity();
        this.cargoForm.get('address_recepient_name').clearValidators();
        this.cargoForm.get('address_recepient_name').updateValueAndValidity();
        this.cargoForm.get('isCOD').clearValidators();
        this.cargoForm.get('address_phoneNumber').clearValidators();
        this.cargoForm.get('cargoPrice').clearValidators();

        this.cargoForm.get('kg').clearValidators();
        this.cargoForm.get('desi').clearValidators();

      } else {
        this.cargoForm.get('packagingType').setValidators(Validators.required);
        this.cargoForm.get('packagingType').updateValueAndValidity();
        this.cargoForm.get('shipmentServiceType').setValidators(Validators.required);
        this.cargoForm.get('shipmentServiceType').updateValueAndValidity();
        this.cargoForm.get('address_recepient_name').setValidators(Validators.required);
        this.cargoForm.get('address_recepient_name').updateValueAndValidity();
        this.cargoForm.get('isCOD').setValidators(Validators.required);
        this.cargoForm.get('address_phoneNumber').setValidators(Validators.required);
        this.cargoForm.get('cargoPrice').setValidators(Validators.required);
        this.cargoForm.get('kg').setValidators(Validators.required);
        this.cargoForm.get('desi').setValidators(Validators.required);

      }
    });
    this.cargoForm.get('cargoPrice').valueChanges.subscribe(async (value) => {
      if (this.cargoForm.get('packagingType').value.code === '1') {

      }
      var _product: ProductList_VM = this.selectedProducts.find(p => p.itemCode == 'KARGO');
      {
        if (!_product) {

          if (this.orderType) {
            this.getProductsForm.get('barcode').setValue('KARGO');
            await this.getProducts(this.getProductsForm.value, this.orderType);

          } else {
            this.getProductsForm.get('barcode').setValue('KARGO');
            this.getProductsForm.get('shelfNo').setValue('KARGO04');

            await this.getProducts(this.getProductsForm.value, this.orderType);

          }

          var __product: ProductList_VM = this.selectedProducts.find(p => p.itemCode == 'KARGO');

          __product.price = value.code;
          __product.basePrice = value.code;
          __product.discountedPrice = value.code;
          await this.orderService.updateClientOrderBasketItem(this.id, __product.lineId, __product.quantity,
            __product.price, __product.discountedPrice, __product.discountedPrice, __product.priceWs);

        } else {
          _product.price = value.code;
          _product.basePrice = value.code;

          _product.discountedPrice = value.code;
          await this.orderService.updateClientOrderBasketItem(this.id, _product.lineId, _product.quantity,
            _product.price, _product.discountedPrice, _product.basePrice, _product.priceWs);
        }

      }


    })
    this.cargoForm.get('packagingType').valueChanges.subscribe((value) => {
      if (value.code === '3') {
        this.cargoForm.get('kg').setValue(2)
        this.cargoForm.get('desi').setValue(2)
        this.cargoForm.get('kg').setValidators([Validators.required, Validators.min(2)]);
        this.cargoForm.get('desi').setValidators([Validators.required, Validators.min(2)]);
      } else if (value.code === '4') {
        this.cargoForm.get('kg').setValue(1)
        this.cargoForm.get('desi').setValue(1)
        this.cargoForm.get('kg').setValidators([Validators.required, Validators.min(1)]);
        this.cargoForm.get('desi').setValidators([Validators.required, Validators.min(1)]);
      } else {
        this.cargoForm.get('kg').setValue(0)
        this.cargoForm.get('desi').setValue(0)
        this.cargoForm.get('kg').setValidators([Validators.required, Validators.min(0)]);
        this.cargoForm.get('desi').setValidators([Validators.required, Validators.min(0)]);
      }
      this.cargoForm.get('kg').updateValueAndValidity();
      this.cargoForm.get('desi').updateValueAndValidity();
    });

    this.cargoForm.get('kg').valueChanges.subscribe((value) => {
      if (this.cargoForm.get('packagingType').value.code === '3') { //paket
        if (value < 2) {
          this.kgErrorMessage = 'Paket gönderimlerinde KG değeri 2 den büyük olmalıdır'
        } else {
          this.kgErrorMessage = ''
        }
      } else if (this.cargoForm.get('packagingType').value.code === '4') { //koli
        if (value < 1) {
          this.kgErrorMessage = 'Koli gönderimlerinde KG değeri 1 den büyük olmalıdır'
        } else {
          this.kgErrorMessage = ''
        }
      }
    });
    this.cargoForm.get('desi').valueChanges.subscribe((value) => {
      if (this.cargoForm.get('packagingType').value.code === '3') {
        if (value < 2) {
          this.desiErrorMessage = 'Paket gönderimlerinde DESİ değeri 2 den büyük olmalıdır'
        } else {
          this.desiErrorMessage = ''
        }
      } else if (this.cargoForm.get('packagingType').value.code === '4') {
        if (value < 1) {
          this.desiErrorMessage = 'Koli gönderimlerinde DESİ değeri 1 den büyük olmalıdır'
        } else {
          this.desiErrorMessage = ''
        }
      }
    });


  }
  desiErrorMessage = '';
  kgErrorMessage = '';
  cargoResponse: CreatePackage_MNG_RR;

  async submitCargo(formValue: any) {
    await this.getOrderDetail();
    var cargoFirmId: number = this.cargoForm.get('cargoFirm').value.code;
    if (this.orderDetail) {
      //console.log(this.cargoForm.value);

      var recepient_name = formValue.address_recepient_name;
      var phoneNumber = formValue.address_phoneNumber;

      if (recepient_name != null && recepient_name != '') {
        this.orderDetail.customer = recepient_name;
        this.toasterService.info('Alıcı Adı Değişikliği Algılandı')
      }
      if (phoneNumber != null && phoneNumber != '') {
        this.orderDetail.phone = phoneNumber;
        this.toasterService.info('Telefon Değişikliği Algılandı')
      }

      if (this.selectedAddresses.length > 0) {
        this.orderDetail.address = this.selectedAddresses[0].address;
        this.orderDetail.city = this.selectedAddresses[0].cityDescription;
        this.orderDetail.district = this.selectedAddresses[0].districtDescription;
      }

      var content = this.selectedProducts.length.toString() + "Adet Ürün";
      var cargoSetting: CargoSetting = new CargoSetting(formValue.isCOD === false ? 0 : 1, Number(formValue.packagingType.code), Number(formValue.shipmentServiceType.code), content,
        this.orderDetail);
      var referenceId = this.generatedCargoNumber;
      var orderRequest: CreatePackage_MNG_Request = new CreatePackage_MNG_Request(referenceId.toString(), this.orderDetail, cargoSetting)

      //---barcode requesst
      var barcodeRequest: CreateBarcode_MNG_Request = new CreateBarcode_MNG_Request();
      barcodeRequest.referenceId = orderRequest.order.referenceId;
      barcodeRequest.billOfLandingId = orderRequest.order.billOfLandingId;
      barcodeRequest.isCOD = orderRequest.order.isCod;
      barcodeRequest.codAmount = orderRequest.order.codAmount;
      barcodeRequest.packagingType = orderRequest.order.packagingType;

      var totalProductQuantity = this.selectedProducts.reduce((total, product) => total + product.quantity, 0);
      var content = totalProductQuantity.toString() + " Adet Ürün";
      var orderPieces: OrderPieceListMNG[] = []


      if (formValue.address_package_count > 1) {

        for (let index = 1; index <= formValue.address_package_count; index++) {
          var orderPiece: OrderPieceListMNG = new OrderPieceListMNG();
          orderPiece.barcode = orderRequest.order.barcode + "0" + index.toString();
          orderPiece.content = (totalProductQuantity / formValue.address_package_count).toString() + " Adet Ürün";
          orderPiece.desi = orderRequest.order.packagingType === 1 ? 1 : orderRequest.order.packagingType === 3 ? 2 : this.cargoForm.get('desi').value
          orderPiece.kg = orderRequest.order.packagingType === 1 ? 1 : orderRequest.order.packagingType === 3 ? 2 : this.cargoForm.get('kg').value
          orderPieces.push(orderPiece);
        }
        barcodeRequest.orderPieceList = orderPieces;
      } else if (formValue.address_package_count === 1) {
        var _orderPiece: OrderPieceListMNG = new OrderPieceListMNG();
        _orderPiece.barcode = orderRequest.order.barcode;
        _orderPiece.content = content
        _orderPiece.desi = orderRequest.order.packagingType === 1 ? 1 : orderRequest.order.packagingType === 3 ? 2 : this.cargoForm.get('desi').value
        _orderPiece.kg = orderRequest.order.packagingType === 1 ? 1 : orderRequest.order.packagingType === 3 ? 2 : this.cargoForm.get('kg').value
        orderPieces.push(_orderPiece);
        barcodeRequest.orderPieceList = orderPieces;
      } else {
        this.toasterService.error("Paket Adedi 1 den küçük olamaz");
        return;
      }



      //---

      var _request: CreatePackage_MNG_RM = new CreatePackage_MNG_RM();
      _request.orderRequest = orderRequest;
      _request.barcodeRequest = barcodeRequest;
      if (cargoFirmId === 2) {
        _request.barcodeBase64 = this.arasCargoBarcode;
        _request.cargoFirmId = 2;
      } else {
        _request.barcodeBase64 = null;
        _request.cargoFirmId = 1;
      }

      var response = await this.cargoService.createCargo(_request, cargoFirmId);
      if (response) {
        this.cargoResponse = response;
        this.toasterService.success("Kargo Siparişi Oluturuldu (BARKOD BASILABİLİR)");
      }
      //console.log(response);
    }

  }

  async CreateBarcode_RM(): Promise<CreateBarcode_MNG_Request> {
    if (this.cargoResponse) {
      var request: CreateBarcode_MNG_Request = new CreateBarcode_MNG_Request();
      request.referenceId = this.cargoResponse.request.order.referenceId;
      request.billOfLandingId = this.cargoResponse.request.order.billOfLandingId;
      request.isCOD = this.cargoResponse.request.order.isCod;
      request.codAmount = this.cargoResponse.request.order.codAmount;
      request.packagingType = this.cargoResponse.request.order.packagingType;
      request.response = this.cargoResponse;
      var content = this.cargoResponse.request.orderPieceList.length.toString() + " Adet Ürün";
      var orderPieces: OrderPieceListMNG[] = []
      var orderPiece: OrderPieceListMNG = new OrderPieceListMNG();
      orderPiece.barcode = this.cargoResponse.request.order.barcode;
      orderPiece.content = content
      orderPiece.desi = this.cargoResponse.request.order.packagingType === 1 ? 0 : this.cargoForm.get('desi').value
      orderPiece.kg = this.cargoResponse.request.order.packagingType === 1 ? 0 : this.cargoForm.get('kg').value
      orderPieces.push(orderPiece);


      request.orderPieceList = orderPieces;
      return request;

    } else {
      return null;
    }
  }

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
    this.cargoForm.get('isActive').setValue(state);


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

    //---------------------------------------------------- DISCOUNT CALCULATION
    var totalPrice = 0;
    var discountedPrice = 0
    for (const _product of this.selectedProducts) {
      totalPrice += _product.price * _product.quantity;
      discountedPrice += _product.discountedPrice * _product.quantity;
    }
    var after_discountPrice = totalPrice - (totalPrice * this.currentDiscountRate / 100) - this.currentCashdiscountRate;
    var dif = 0;
    if (discountedPrice < after_discountPrice) {
      dif = after_discountPrice - discountedPrice;
      this.currentCashdiscountRate += dif;
    }
    //----------------------------------------------------
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
          this.currentDiscountRate,
          this.currentCashdiscountRate,
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

        if (this.cargoForm.get('isActive').value === true) {
          await this.submitCargo(this.cargoForm.value);
        } else {
          this.toasterService.info('KARGO OLUŞTURULMADI');
        }

        var addedOrder: OrderDetail = await this.orderService.getOrderDetail(this.orderNumber);
        if (addedOrder.orderNumber) {
          this.sendInvoiceToPrinter(addedOrder.orderNumber);

        }
        this.generalService.waitAndNavigate("Sipariş Oluşturuldu", "orders-managament/1/2");
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
          this.currentDiscountRate,
          this.currentCashdiscountRate,
          this.cargoForm.get("address_recepient_name").value,
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

        if (this.cargoForm.get('isActive').value === true) {
          await this.submitCargo(this.cargoForm.value);
        } else {
          this.toasterService.info('KARGO OLUŞTURULMADI');
        }
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
          this.currentDiscountRate,
          this.currentCashdiscountRate,
          exchangeRate,
          this.selectedCustomers[0].docCurrencyCode,
          this.cargoForm.get("address_recepient_name").value,
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

}
