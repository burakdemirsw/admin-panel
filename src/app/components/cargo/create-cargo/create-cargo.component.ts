import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Address_VM } from 'src/app/models/model/order/ViewModel/provinceVM';
import { CustomerAddress_VM, GetCustomerAddress_CM } from 'src/app/models/model/order/getCustomerList_CM';
import { AddressService } from 'src/app/services/admin/address.service';
import { CargoService } from 'src/app/services/admin/cargo.service';
import { GeneralService } from 'src/app/services/admin/general.service';
import { OrderService } from 'src/app/services/admin/order.service';
import { HttpClientService } from 'src/app/services/http-client.service';
import { ToasterService } from 'src/app/services/ui/toaster.service';
import { AddCustomerAddress_CM } from '../../../models/model/order/createCustomer_CM';
import { PostalAddress } from '../../../models/nebim/customer/nebimCustomer';
import { CargoSetting, CreateBarcode_MNG_Request, CreatePackage_MNG_RM, CreatePackage_MNG_RR, CreatePackage_MNG_Request, OrderDetail, OrderPieceListMNG } from './models/models';

@Component({
  selector: 'app-create-cargo',
  templateUrl: './create-cargo.component.html',
  styleUrls: ['./create-cargo.component.css']
})
export class CreateCargoComponent implements OnInit {

  activeIndex: number = 0;

  selectedAddresses: CustomerAddress_VM[] = []
  constructor(private router: Router, private cargoService: CargoService, private addressService: AddressService, private httpClient: HttpClientService, private toasterService: ToasterService, private orderService: OrderService,
    private activatedRoute: ActivatedRoute, private generalService: GeneralService, private formBuilder: FormBuilder,
    private spinnerService: NgxSpinnerService) { }

  ngOnInit(): void {

    this.createCustomerFormMethod();
    this.getAddresses()
    this.createCargoForm();
    this.activatedRoute.params.subscribe(p => {
      if (p["orderNumber"]) {

        this.getOrderDetail(p["orderNumber"]);

      }
    })
  }

  //----------------------------------------------------ADDRESS
  addresses: CustomerAddress_VM[] = []
  async getCustomerAddresses(request: GetCustomerAddress_CM) {
    this.addresses = await this.orderService.getCustomerAddress(request)

    this.toasterService.success("Adresler Getirildi")

  }
  selectCurrentAddress(request: CustomerAddress_VM) {
    this.selectedAddresses = [];
    this.selectedAddresses.push(request);
    this.toasterService.success("Adres Eklendi")
    this.orderDetail.address = request.address;
    this.orderDetail.city = request.cityDescription;
    this.orderDetail.district = request.districtDescription;
    this.activeIndex = 1;
    this.generalService.beep()

  }
  //----------------------------------------------------
  //----------------------------------------------------KARGO
  cargoForm: FormGroup
  packagingTypes: any[] = [{ name: 'DOSYA', code: '1' }, { name: 'PAKET', code: '3' }, { name: 'KOLİ', code: '4' }]
  shipmentServiceTypes: any[] = [{ name: 'GÖNDERİCİ ÖDEMELİ', code: '1' }, { name: 'ALICI ÖDEMELİ', code: '2' }]
  cargoFirms: any[] = [{ name: 'Mng', code: 1 }, { name: 'Aras', code: 2 }]


  generateRandomNumber(): number {
    // 335 ile başlayan bir sayı üretir ve geri kalan 7 hanesini rastgele doldurur
    const prefix = 335; // Sabit başlangıç
    const min = Math.pow(10, 6); // Rastgele sayının minimum değeri (1 ile başlaması için)
    const max = Math.pow(10, 7) - 1; // Rastgele sayının maksimum değeri
    const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min; // 7 haneli rastgele sayı

    return Number(`${prefix}${randomNumber}`);
  }
  desiErrorMessage = '';
  kgErrorMessage = '';


  async createCargoForm() {
    this.cargoForm = this.formBuilder.group({
      address_phoneNumber: [null],
      packagingType: [null], //select
      shipmentServiceType: [null], //select
      isCOD: [false],
      kg: [1],
      desi: [1],
      address_recepient_name: [null],
      isActive: [false],
      cargoFirm: [null],
      address_package_count: [1, Validators.min(1)]
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
  cargoResponse: CreatePackage_MNG_RR;
  async submitCargo(formValue: any) {

    var cargoFirmId: number = this.cargoForm.get('cargoFirm').value.code;


    var recepient_name = formValue.address_recepient_name;
    if (recepient_name != null && recepient_name != '') {
      this.orderDetail.customer = recepient_name;
      this.toasterService.info('Alıcı Adı Değişikliği Algılandı')
    }
    if (this.selectedAddresses.length > 0) {
      this.orderDetail.address = this.selectedAddresses[0].address;
      this.orderDetail.city = this.selectedAddresses[0].cityDescription;
      this.orderDetail.district = this.selectedAddresses[0].districtDescription;
    }

    //console.log(this.cargoForm.value);
    var content = this.orderDetail.products.length.toString() + "Adet Ürün";
    var cargoSetting: CargoSetting = new CargoSetting(formValue.isCOD === false ? 0 : 1, Number(formValue.packagingType.code), Number(formValue.shipmentServiceType.code), content,
      this.orderDetail);
    var referenceId = this.generateRandomNumber();
    var orderRequest: CreatePackage_MNG_Request = new CreatePackage_MNG_Request(referenceId.toString(), this.orderDetail, cargoSetting)


    var barcodeRequest: CreateBarcode_MNG_Request = new CreateBarcode_MNG_Request();
    barcodeRequest.referenceId = orderRequest.order.referenceId;
    barcodeRequest.billOfLandingId = orderRequest.order.billOfLandingId;
    barcodeRequest.isCOD = orderRequest.order.isCod;
    barcodeRequest.codAmount = orderRequest.order.codAmount;
    barcodeRequest.packagingType = orderRequest.order.packagingType;
    barcodeRequest.response = this.cargoResponse;
    var totalProductQuantity = this.orderDetail.products.reduce((total, product) => total + product.quantity, 0);
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

    var request: CreatePackage_MNG_RM = new CreatePackage_MNG_RM();
    request.orderRequest = orderRequest;
    request.barcodeRequest = barcodeRequest;



    if (cargoFirmId === 2) {
      request.cargoFirmId = 2;
    } else {
      request.barcodeBase64 = null;
      request.cargoFirmId = 1;
    }


    var response = await this.cargoService.createCargo(request, request.cargoFirmId);
    if (response) {
      this.cargoResponse = response;
      this.router.navigate(['/cargo-list']);

    }
    //console.log(response);
  }


  async printBarcode() {
    var response = await this.cargoService.createBarcode(this.cargoResponse.request.order.referenceId);
    if (response) {
      this.toasterService.success("BARKOD YAZDIRILDI");


    }
  }
  //---------------------------------------------------- KARGO FYATI (İLÇELER ÇEKİLMİYOR!!!) -> MAİL ATILDI

  //-- https://testapi.mngkargo.com.tr/mngapi/api/cbsinfoapi/getcities --şehirler
  //-- https://testapi.mngkargo.com.tr/mngapi/api/cbsinfoapi/getdistricts/{cityCode}


  //---------------------------------------------------- SİPARİŞ
  orderDetail: OrderDetail;

  async getOrderDetail(orderNumber: string) {
    this.orderDetail = await this.orderService.getOrderDetail(orderNumber);
    this.cargoForm.get('address_recepient_name').setValue(this.orderDetail.customer)
    if (this.orderDetail) {
      var request: GetCustomerAddress_CM = new GetCustomerAddress_CM();
      request.currAccCode = this.orderDetail.currAccCode;
      this.getCustomerAddresses(request);
    }


  }
  //----------------------------------------------------
  //---------------------------------------------------- ADRES
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
  createCustomerForm: FormGroup;


  changeCurrentAddress(address: CustomerAddress_VM) {
    this.orderDetail.address = address.address
    this.orderDetail.city = address.cityDescription
    this.orderDetail.district = address.districtDescription
    this.generalService.beep()
    this.toasterService.success("Adres Değiştirildi")
    this.activeIndex = 1;

  }


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

    ////console.log(countries);
    ////console.log(provinces);
  }


  createCustomerFormMethod() {
    this.createCustomerForm = this.formBuilder.group({
      address_country: [null],
      address_province: [null],
      address_district: [null],
      address_region: [null],
      address_description: [null],



    });

    this.createCustomerForm.get('address_region').valueChanges.subscribe(async (value) => { //illeri getir
      var _value = this.createCustomerForm.get('address_region').value;
      var response = await this.addressService.getAddress(3, _value.code)
      this.provinces = response

      this._provinces = [];
      this.provinces.forEach((b) => {
        var provinces: any = { name: b.description, code: b.code };
        this._provinces.push(provinces);
      });
    });

    this.createCustomerForm.get('address_province').valueChanges.subscribe(async (value) => { //ilçeleri getir
      var _value = this.createCustomerForm.get('address_province').value;

      var response = await this.addressService.getAddress(4, _value.code)
      this.districts = response

      this._districts = [];
      this.districts.forEach((b) => {
        var district: any = { name: b.description, code: b.code };
        this._districts.push(district);
      });


      var _value = this.createCustomerForm.get('address_province').value;

      var response = await this.addressService.getAddress(5, _value.code)
      this.taxOffices = response

      this._taxOffices = [];
      this.taxOffices.forEach((b) => {
        var taxOffice: any = { name: b.description, code: b.code };
        this._taxOffices.push(taxOffice);
      });


    });
    //----------------------------------------------------
  }
  async submitAddressForm(values: any) {
    var postalAddress: PostalAddress = new PostalAddress();
    postalAddress.countryCode = values.address_country.code;
    postalAddress.stateCode = values.address_region.code;
    postalAddress.cityCode = values.address_province.code;
    postalAddress.districtCode = values.address_district.code;
    postalAddress.address = values.address_description;
    postalAddress.addressTypeCode = "1";
    var request: AddCustomerAddress_CM = new AddCustomerAddress_CM(this.orderDetail.currAccCode, postalAddress);
    var response = await this.orderService.addCustomerAddress(request)
    if (response) {
      var _request: GetCustomerAddress_CM = new GetCustomerAddress_CM();
      _request.currAccCode = this.orderDetail.currAccCode;
      this.getCustomerAddresses(_request);
    }

  }
}
