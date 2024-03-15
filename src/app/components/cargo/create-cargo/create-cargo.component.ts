import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { CustomerAddress_VM, CustomerList_VM, GetCustomerAddress_CM } from 'src/app/models/model/order/getCustomerList_CM';
import { GeneralService } from 'src/app/services/admin/general.service';
import { OrderService } from 'src/app/services/admin/order.service';
import { HttpClientService } from 'src/app/services/http-client.service';
import { ToasterService } from 'src/app/services/ui/toaster.service';
import { CargoSetting, CreateBarcode_MNG_Request, CreatePackage_MNG_RR, CreatePackage_MNG_Request, OrderDetail, OrderPieceListMNG } from './models/models';
import { Address_VM } from 'src/app/models/model/order/ViewModel/provinceVM';
import { AddressService } from 'src/app/services/admin/address.service';
import { PostalAddress } from '../../../models/nebim/customer/nebimCustomer';
import { CargoService } from 'src/app/services/admin/cargo.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { AddCustomerAddress_CM } from '../../Order/create-order/models/createCustomer_CM';

@Component({
  selector: 'app-create-cargo',
  templateUrl: './create-cargo.component.html',
  styleUrls: ['./create-cargo.component.css']
})
export class CreateCargoComponent implements OnInit {

  activeIndex: number = 0;

  selectedAddresses: CustomerAddress_VM[] = []
  constructor(private cargoService: CargoService, private addressService: AddressService, private httpClient: HttpClientService, private toasterService: ToasterService, private orderService: OrderService,
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
  addresses: CustomerList_VM[] = []
  async getCustomerAddresses(request: GetCustomerAddress_CM) {
    this.addresses = await this.orderService.getCustomerAddress(request)
    this.toasterService.success("Adresler Getirildi")

  }
  selectCurrentAddress(request: CustomerAddress_VM) {
    this.selectedAddresses = [];
    this.selectedAddresses.push(request);
    this.toasterService.success("Adres Eklendi")
    this.activeIndex = 1;
    this.generalService.beep()

  }
  //----------------------------------------------------
  //----------------------------------------------------KARGO
  cargoForm: FormGroup
  packagingTypes: any[] = [{ name: 'DOSYA', code: '1' }, { name: 'PAKET', code: '3' }, { name: 'KOLİ', code: '4' }]
  shipmentServiceTypes: any[] = [{ name: 'GÖNDERİCİ ÖDEMELİ', code: '1' }, { name: 'ALICI ÖDEMELİ', code: '2' }]


  generateRandomNumber(): number {
    // 335 ile başlayan bir sayı üretir ve geri kalan 7 hanesini rastgele doldurur
    const prefix = 335; // Sabit başlangıç
    const min = Math.pow(10, 6); // Rastgele sayının minimum değeri (1 ile başlaması için)
    const max = Math.pow(10, 7) - 1; // Rastgele sayının maksimum değeri
    const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min; // 7 haneli rastgele sayı

    return Number(`${prefix}${randomNumber}`);
  }

  createCargoForm() {
    this.cargoForm = this.formBuilder.group({
      packagingType: [null, Validators.required], //select
      shipmentServiceType: [null, Validators.required], //select
      isCOD: [false],
      kg: [1],
      desi: [1]
    })
  }

  cargoResponse: CreatePackage_MNG_RR;
  async submitCargo(formValue: any) {
    //console.log(this.cargoForm.value);
    var content = this.orderDetail.products.length.toString() + "Adet Ürün";
    var cargoSetting: CargoSetting = new CargoSetting(formValue.isCOD === false ? 0 : 1, Number(formValue.packagingType.code), Number(formValue.shipmentServiceType.code), content,
      this.orderDetail);
    var referenceId = this.generateRandomNumber();
    var request: CreatePackage_MNG_Request = new CreatePackage_MNG_Request(referenceId.toString(), this.orderDetail, cargoSetting)
    var response = await this.cargoService.createCargo(request);
    if (response) {
      this.spinnerService.show();
      setTimeout(() => {
        this.toasterService.success("Barkod Bastırabilirsiniz");
        this.spinnerService.hide()
        this.cargoResponse = response;
      }, 15000);

    }
    //console.log(response);
  }

  async printBarcode() {
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
      orderPiece.desi = this.cargoForm.get('desi').value
      orderPiece.kg = this.cargoForm.get('kg').value
      orderPieces.push(orderPiece);


      request.orderPieceList = orderPieces;

      var response = await this.cargoService.printBarcode(request)
      if (response) {
        this.toasterService.success("Barkod Yazıcıya Gönderildi")

      }
    }
  }
  //---------------------------------------------------- KARGO FYATI (İLÇELER ÇEKİLMİYOR!!!) -> MAİL ATILDI

  //-- https://testapi.mngkargo.com.tr/mngapi/api/cbsinfoapi/getcities --şehirler
  //-- https://testapi.mngkargo.com.tr/mngapi/api/cbsinfoapi/getdistricts/{cityCode}


  //---------------------------------------------------- SİPARİŞ
  orderDetail: OrderDetail;

  async getOrderDetail(orderNumber: string) {
    this.orderDetail = await this.orderService.getOrderDetail(orderNumber);

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
    postalAddress.countryCode = values.address_country;
    postalAddress.stateCode = values.address_region;
    postalAddress.cityCode = values.address_province;
    postalAddress.districtCode = values.address_district;
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
