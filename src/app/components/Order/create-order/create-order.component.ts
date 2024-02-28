import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomerAddress_VM, CustomerList_VM, GetCustomerList_CM } from '../../../models/model/order/getCustomerList_CM';
import { OrderService } from '../../../services/admin/order.service';
import { AlertifyService } from 'src/app/services/ui/alertify.service';
import { GetCustomerAddress_CM } from 'src/app/models/model/order/getCustomerList_CM';
import { BarcodeSearch_RM, ProductService } from 'src/app/services/admin/product.service';
import { ProductList_VM } from 'src/app/models/model/product/productList_VM';
import * as Tesseract from 'tesseract.js';
import { GoogleDriveService } from '../../../services/common/google-drive.service';
import { AddressService } from 'src/app/services/admin/address.service';
import { Address_VM } from 'src/app/models/model/order/ViewModel/provinceVM';
import { CreateCustomer_CM } from './models/createCustomer_CM';
import { Line, NebimOrder, Payment } from './models/nebimOrder';
import { GeneralService } from 'src/app/services/admin/general.service';
import { SalesPersonModel } from 'src/app/models/model/order/salesPersonModel';
import { HttpClientService } from 'src/app/services/http-client.service';

@Component({
  selector: 'app-create-order',
  templateUrl: './create-order.component.html',
  styleUrls: ['./create-order.component.css']
})
export class CreateOrderComponent implements OnInit {
  selectedCustomers: CustomerList_VM[] = [] //kadir abi sp yazıcak
  selectedProducts: ProductList_VM[] = [] //kadir abi sp yazıcak
  selectedAddresses: CustomerAddress_VM[] = [] //kadir abi sp yazıcak
  selectedOfficeAndWarehosue: any[] = [];
  currAccCode: string;
  salesPersonCode: string;
  payment: Payment
  @ViewChild('findCustomer', { static: false }) findCustomer: ElementRef;
  @ViewChild('findAddress', { static: false }) findAddress: ElementRef;
  @ViewChild('findProducts', { static: false }) findProducts: ElementRef;
  @ViewChild('preview', { static: false }) preview: ElementRef;



  constructor(private httpClientService: HttpClientService, private generalService: GeneralService, private addressService: AddressService, private googleDriveService: GoogleDriveService, private productService: ProductService, private formBuilder: FormBuilder, private orderService: OrderService, private alertifyService: AlertifyService) { }

  ngOnInit(): void {
    this.createGetCustomerForm();
    this.createCustomerFormMethod();
    this.createGetProductForm();
    this.createOfficeWarehouseForm();
    this.getAddresses();
    this.getSalesPersonModels();
  }
  //--------------------------------------------------------------------------- SATIŞ ELEMANI
  salesPersonModels: SalesPersonModel[] = [];
  salesPersonModelList: any[] = [];
  selectedPerson: any;
  async getSalesPersonModels(): Promise<any> {
    try {
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

        //this.alertifyService.success("Başarıyla "+this.salesPersonModels.length+" Adet Çekildi")
      } catch (error: any) {
        this.alertifyService.error(error.message);
        return null;
      }
    } catch (error: any) {
      this.alertifyService.error(error.message);
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
      this.alertifyService.success("İşlem Başarılı");
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
    { name: 'M', code: 'M' },
    { name: 'U', code: 'U' }
  ];
  warehouses: any[] | undefined = [
    { name: 'Gerçek Depo', code: 'MD' },
    { name: 'Halkalı Depo', code: 'UD' }
  ];
  createOfficeWarehouseForm() {


  }
  selectOfficeAndWarehosue(formValue: any) {
    this.selectedOfficeAndWarehosue = [
      { office: formValue.office, warehouse: formValue.warehouse }
    ];
    this.alertifyService.success("Ofis ve Depo Seçildi")
    this.generalService.beep()
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

  async submitAddressForm(formValue: any) {
    var request: CreateCustomer_CM = new CreateCustomer_CM();
    request.name = formValue.name;
    request.surname = formValue.surname;
    request.mail = formValue.mail;
    request.phoneNumber = formValue.phoneNumber;
    request.taxNumber = formValue.taxNumber;
    request.firmDescription = formValue.firmDescription;
    request.stampPhotoUrl = formValue.stampPhotoUrl;
    request.bussinesCardPhotoUrl = formValue.bussinesCardPhotoUrl;
    request.officeCode = formValue.office
    request.warehouseCode = formValue.warehouse

    request.address.country = formValue.address_country;
    request.address.province = formValue.address_province;
    request.address.district = formValue.address_district;
    request.address.region = formValue.address_region;
    request.address.taxOffice = formValue.address_taxOffice;
    request.address.description = formValue.address_description;
    request.address.postalCode = formValue.address_postalCode;

    console.log(request)

    if (this.createCustomerForm.valid) {
      var response = await this.orderService.createCustomer(request);
      if (response) {

        this.currAccCode = response.currAccCode;
        this.alertifyService.success(this.currAccCode);
        this.getCustomerDialog = true;
        this.getCustomerForm.get("currAccCode").setValue(this.currAccCode);
        this.getCustomers(this.getCustomerForm.value);
      }
    }
  }

  createCustomerFormMethod() {
    this.createCustomerForm = this.formBuilder.group({
      office: [null, Validators.required],
      warehouse: [null, Validators.required],
      salesPersonCode: [null],
      name: ["Burak", Validators.required],
      surname: ["Demir", Validators.required],
      mail: ["demir.burock96@gmail.com"],
      phoneNumber: ["05393465584"],
      firmDescription: ["MISIGO"],
      stampPhotoUrl: [null],
      bussinesCardPhotoUrl: [null],
      address_country: [null],
      address_province: [null],
      address_district: [null],
      address_region: [null],
      address_taxNo: [null],
      address_description: [null],
      address_postalCode: [null],
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
      this.alertifyService.error("Adres Bulunamadı");
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
    this.openDialog("getCustomerDialog");
    this.alertifyService.success("Müşteri Seçildi")
    this.generalService.beep();
    var _request: GetCustomerAddress_CM = new GetCustomerAddress_CM();
    _request.currAccCode = request.currAccCode;
    this.getCustomerAddresses(_request);
  }
  deleteCurrentCustomer() {
    this.selectedCustomers = [];
    this.alertifyService.success("Müşteri Silindi")
    this.deleteCurrentAddress();
  }
  //----------------------------------------------------ADDRESS
  addresses: CustomerList_VM[] = []
  async getCustomerAddresses(request: GetCustomerAddress_CM) {
    this.addresses = await this.orderService.getCustomerAddress(request)
    // this.alertifyService.success("Adresler Getirildi")
    console.log(this.customers);
  }

  selectCurrentAddress(request: CustomerAddress_VM) {
    this.selectedAddresses = [];
    this.selectedAddresses.push(request);
    this.alertifyService.success("Adres Eklendi")
    this.generalService.beep()

  }
  deleteCurrentAddress() {
    this.selectedAddresses = [];
    this.alertifyService.success("Adres Silindi")
  }
  //----------------------------------------------------
  //---------------------------------------------------- PRODUCTS

  getProductsForm: FormGroup;
  products: ProductList_VM[] = [];
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

  addCurrentProducts(request: ProductList_VM) {
    this.selectedProducts.push(request);
    this.alertifyService.success("Ürün Eklendi")
    this.generalService.beep()

  }
  deleteProduct(product: ProductList_VM) {
    this.selectedProducts = this.selectedProducts.filter(p => p.barcode != product.barcode);
    this.alertifyService.success("Ürün Siilindi")
  }
  clonedProducts: { [s: string]: ProductList_VM } = {};
  onRowEditInit(product: ProductList_VM) {
    this.clonedProducts[product.barcode as string] = { ...product };
  }

  onRowEditSave(product: ProductList_VM) {
    if (product.price > 0) {
      delete this.clonedProducts[product.barcode as string];
    } else {
    }
  }

  onRowEditCancel(product: ProductList_VM, index: number) {
    this.products[index] = this.clonedProducts[product.barcode as string];
    delete this.clonedProducts[product.barcode as string];
  }

  //----------------------------------------------------

  //---------------------------------------------------- Sipariş
  generateRandomNumber(): string {
    let result = '';
    const characters = '0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < 10; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }
  createPayment(state: number) {
    var payment: Payment = new Payment();
    if (state === 1) {
      //PAYTR İŞLEMLERİ
    } else if (state === 2) {
      //NAKİT İŞLEMLERİ
    }
  }
  createOrder() {
    var request: NebimOrder = new NebimOrder();
    if (!this.currAccCode) {
      this.alertifyService.error("Müşteri Seçiniz");
      return;
    }
    if (!this.salesPersonCode) {
      this.alertifyService.error("Satış Elemanı Seçiniz");
      return;
    }
    if (!this.payment) {
      this.alertifyService.error("Ödeme Seçilmedi Elemanı Seçiniz");
      return;
    }
    if (this.selectedProducts.length <= 0) {
      this.alertifyService.error("Ürün Ekleyiniz");
      return;
    }
    var formValue = this.createCustomerForm.value;
    var orderNo = this.generateRandomNumber();
    request.customerCode = this.currAccCode;
    request.internalDescription = orderNo;
    request.orderDate = new Date();

    request.officeCode = formValue.office;
    request.storeCode = "M1"
    request.warehouseCode = formValue.warehouse;
    request.deliveryCompanyCode = "";
    request.shipmentMethodCode = 2;
    request.posTerminalID = 1;
    request.isCompleted = true;
    request.isSalesViaInternet = true;
    request.documentNumber = orderNo;
    request.description = orderNo;
    this.selectedProducts.forEach(p => {
      var line: Line = new Line();
      line.barcode = p.barcode;
      line.salesPersonCode = this.salesPersonCode;
      line.priceVI = p.price;
      line.qty1 = p.quantity;
      line.itemCode = p.itemCode;
      request.lines.push(line);
    });
    console.log(request);

  }

  //----------------------------------------------------
}
