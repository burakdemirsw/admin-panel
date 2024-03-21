import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Address_VM } from 'src/app/models/model/order/ViewModel/provinceVM';
import { AddressService } from 'src/app/services/admin/address.service';
import { CargoService } from 'src/app/services/admin/cargo.service';
import { GeneralService } from 'src/app/services/admin/general.service';
import { OrderService } from 'src/app/services/admin/order.service';
import { HttpClientService } from 'src/app/services/http-client.service';
import { ToasterService } from 'src/app/services/ui/toaster.service';
import { CreateCustomer_CM } from '../../Order/create-order/models/createCustomer_CM';
import { ClientCustomer } from '../customer-list/customer-list.component';
import { GoogleDriveService } from 'src/app/services/common/google-drive.service';
import { CustomerList_VM, GetCustomerList_CM } from 'src/app/models/model/order/getCustomerList_CM';

@Component({
  selector: 'app-add-customer',
  templateUrl: './add-customer.component.html',
  styleUrls: ['./add-customer.component.css']
})
export class AddCustomerComponent implements OnInit {

  ngOnInit(): void {
    this.createCustomerFormMethod();
    this.getAddresses();
  }


  createCustomerForm: FormGroup;
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

  constructor(private router: Router, private cargoService: CargoService, private addressService: AddressService, private httpClient: HttpClientService, private toasterService: ToasterService, private orderService: OrderService,
    private activatedRoute: ActivatedRoute, private generalService: GeneralService, private formBuilder: FormBuilder,
    private spinnerService: NgxSpinnerService, private googleDriveService: GoogleDriveService) { }


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
            this.toasterService.success("Kullanıcı Eklendi")
            this.router.navigate(["/customer-list"])
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
      stampPhotoUrl: [null],
      bussinesCardPhotoUrl: [null],
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


}
