import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { ProcessDefinitionConstants } from "src/app/models/const/processDefinitionConstants";
import { cdCurrencyDesc } from "src/app/models/model/nebim/cdShipmentMethodDesc ";
import { DirectRequest } from "src/app/models/model/nebim/directRequest";
import {
  Address,
  Communication,
  NebimCustomerDto
} from "src/app/models/model/order/getCustomerList_CM";
import { Address_VM } from "src/app/models/model/order/ViewModel/provinceVM";
import { AddressService } from "src/app/services/admin/address.service";
import { DirectRequestService } from "src/app/services/admin/direct-request.service";
import { GeneralService } from "src/app/services/admin/general.service";
import { HeaderService } from "src/app/services/admin/header.service";
import { OrderService } from "src/app/services/admin/order.service";
import { GoogleDriveService } from "src/app/services/common/google-drive.service";
import { ToasterService } from "src/app/services/ui/toaster.service";
import { InfoService } from '../../../services/admin/info.service';
import { UserService } from '../../../services/admin/user.service';
import { ClientCustomer } from "../customer-list/customer-list.component";
import { CustomerService } from "src/app/services/admin/customer.service";

@Component({
  selector: "app-add-customer",
  templateUrl: "./add-customer.component.html",
  styleUrls: ["./add-customer.component.css"],
})
export class AddCustomerComponent implements OnInit {
  @Output() customerAdded: EventEmitter<boolean> = new EventEmitter<boolean>(); // EventEmitter tanımlıyoruz.

  createCustomerForm: FormGroup;
  addressForm: FormGroup;
  countries: Address_VM[] = [];
  provinces: Address_VM[] = [];
  districts: Address_VM[] = [];
  regions: Address_VM[] = [];
  taxOffices: Address_VM[] = [];
  updated_districts: Address_VM[] = [];
  _regions: any[] = [];
  _taxOffices: any = [];
  _countries: any[] = [];
  _provinces: any[] = [];
  _districts: any[] = [];
  _neighborhoods: any[] = [];
  currAccCode: string;
  addressId: string;
  pageType: boolean;
  postalAddressId: string;
  findedCustomer: ClientCustomer;
  modelType = 0;
  type: string;
  response: NebimCustomerDto;
  constructor(
    private router: Router,
    private addressService: AddressService,
    private toasterService: ToasterService,
    private orderService: OrderService,
    private headerService: HeaderService,
    private generalService: GeneralService,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private infoService: InfoService,
    private userService: UserService,
    private googleDriveService: GoogleDriveService,
    private directRequestService: DirectRequestService,
    private customerService: CustomerService
  ) { }

  @Input() _type: string;
  @Input() _currAccCode: string;
  @Input() _isInnerPage: string;
  _pageType: boolean;
  async ngOnInit() {
    this.activatedRoute.params.subscribe(async (params) => {
      if (params["type"] && params["currAccCode"]) {
        this._pageType = true;
        this._type = params["type"];
        this._currAccCode = params["currAccCode"];
      } else if (params["type"]) {
        this._type = params["type"];
        this._pageType = false;

      } else {
        this._pageType = false;
      }
      await this.createCustomerFormMethod();
      await this.getAddresses();
      await this.getCurrencyDesc();
      if (this._type == "whosale") { //toptan müşteri oluşturma
        this.type = this._type;
        this.modelType = 2;
        if (this._currAccCode) {
          var curr_acc_code: string = this._currAccCode;

          if (curr_acc_code.includes("1-4")) {
            this.toasterService.error("Hatalı Sayfa");
            this.router.navigate(["add-customer/r", curr_acc_code]);
          }
        }
      } else if (this._type == "retail") { //perakende müşteri oluşturma
        this.type = this._type;
        this.modelType = 3;
        if (this._currAccCode) {
          var curr_acc_code: string = this._currAccCode;

          if (curr_acc_code.includes("1-3")) {
            this.toasterService.error("Hatalı Sayfa");
            this.router.navigate(["add-customer/ws", curr_acc_code]);
          }
        }
        this.modelType = 3;
      }
      else if (this._type == "vendor") { //tedarikçi oluşturma
        this.type = this._type;
        this.modelType = 69;
      } else {
        if (!this._isInnerPage) {
          this.router.navigate(["/customers", this.type]);
        }

      }
      if (this._currAccCode) {
        this.createUpdateCommunicationForm();
        this.createAddressForm();
        this.pageType = true;
        if (!this._isInnerPage) {
          if (this._type == "whosale") {
            this.headerService.updatePageTitle("Toptan Müşteri Güncelle");
          } else if (this._type == "retail") {
            this.headerService.updatePageTitle("Perakende Müşteri Güncelle");
          }
          else if (this._type == "vendor") {
            this.headerService.updatePageTitle("Tedarikçi Güncelle");
          }
        }

        this.currAccCode = this._currAccCode;
        this.addressId = params["addressId"];
        await this.reload();
      } else {
        this.pageType = false;
        if (!this._isInnerPage) {
          if (this._type == "whosale") {
            this.headerService.updatePageTitle("Toptan Müşteri Oluştur");
          } else if (this._type == "retail") {
            this.headerService.updatePageTitle("Perakende Müşteri Oluştur");
          }
          else if (this._type == "vendor") {
            this.headerService.updatePageTitle("Tedarikçi Oluştur");
          }
        }


      }
      if (this.modelType == 0) {
        this.toasterService.error("Sayfa Yüklenirken Hata Meydana Geldi");
      }
    });

  }

  async submitAddressForm(formValue: any) {
    var user = this.userService.getUserClientInfoResponse();
    if (!this.pageType) {
      if (this.createCustomerForm.valid) {
        let request: any = {};
        request.ModelType = this.modelType;
        if (this.modelType != 69) {
          request.CurrAccCode = "";

        } else {
          request.CurrAccCode = formValue.phoneNumber;
        }
        request.OfficeCode = user.officeCode;
        request.CurrAccDescription = formValue.currAccDescription;
        request.TaxNumber = formValue.tax_number;
        request.IdentityNum = formValue.identity_number;
        request.IsBlocked = formValue.isBlocked;
        if (this.modelType != 69) {
          request.IsVIP = formValue.isVIP;

        }

        // Initialize PostalAddresses object if address_country exists
        if (formValue.address_country) {
          request.postalAddresses = [{
            AddressTypeCode: 1,
            CountryCode: formValue.address_country?.code,
            StateCode: formValue.address_region?.code,
            CityCode: formValue.address_province?.code,
            DistrictCode: formValue.address_district?.code,
            TaxOfficeCode: formValue.address_taxOffice?.code,
            Address: formValue.address_description,
            ZipCode: formValue.address_postalCode
          }];
        }

        // Initialize Communications object if phoneNumber exists
        if (formValue.phoneNumber) {
          request.Communications = [
            {
              CommunicationTypeCode: 7, // Should this be the phone number country code instead?
              CommAddress: formValue.phoneNumber // Corrected to use phoneNumber, not province
            }
          ];
        }

        if (formValue.mail) {
          request.Communications.push({
            CommunicationTypeCode: 3, // Should this be the phone number country code instead?
            CommAddress: formValue.mail // Corrected to use phoneNumber, not province
          });
        }

        // Construct DirectRequest object
        let _request: DirectRequest = new DirectRequest(JSON.stringify(request), ProcessDefinitionConstants.MÜŞTERİ, 1);

        try {
          // Await response from directRequestService
          let response = await this.directRequestService.directRequest(_request);

          if (response) {
            this.toasterService.success("Kullanıcı Eklendi");
            // Müşteri başarıyla eklendiğinde bu event'i yayımlıyoruz.
            this.customerAdded.emit(true);

            if (!this._isInnerPage) {
              this.router.navigate(["/customers", this.type]);
            }
          }
        } catch (error) {
          this.toasterService.error("Bir hata oluştu. Lütfen tekrar deneyin.");
          console.error("Request failed: ", error);
        }

      } else {
        this.generalService.whichRowIsInvalid(this.createCustomerForm);
      }

    }
  }
  async fillForm(response: NebimCustomerDto) {
    this.postalAddressId = response.addresses[0].postalAddressID;
    this.createCustomerForm
      .get("currAccDescription")
      .setValue(response.customer.currAccDescription);
    this.createCustomerForm.get("currencyCode").setValue(response.customer.currencyCode);
    this.createCustomerForm.get("isVIP").setValue(response.customer.isVIP);
    this.createCustomerForm.get("isBlocked").setValue(response.customer.isBlocked);
    this.createCustomerForm.get("identity_number").setValue(response.customer.identityNumber);
    this.createCustomerForm.get("tax_number").setValue(response.customer.taxNumber);

    this.createCustomerForm.get("mail").setValue(response.communications.find(c => c.communicationTypeCode == 3).commAddress);
    this.createCustomerForm.get("phoneNumber").setValue(response.communications.find(c => c.communicationTypeCode == 7).commAddress);


    this.createCustomerForm.get("address_description").setValue(response.addresses[0].address);
    this.createCustomerForm.get("address_country").setValue(this._countries[0]);

    var region = this._regions.find((r) => r.code == response.addresses[0].stateCode);
    this.createCustomerForm.get("address_region").setValue(region);

    var _response = await this.addressService.getAddress(3, region.code);
    this.provinces = _response;
    this._provinces = [];
    this._provinces = this.provinces.map((b: any) => {
      return { name: b.description, code: b.code };
    });

    var province = this._provinces.find((r) => r.code == response.addresses[0].cityCode);
    this.createCustomerForm.get("address_province").setValue(province);

    var _response = await this.addressService.getAddress(4, province.code);
    this.districts = _response;

    this._districts = [];
    this._districts = this.districts.map((b: any) => {
      return { name: b.description, code: b.code };
    });

    var _response = await this.addressService.getAddress(5, province.code);
    this.taxOffices = _response;

    this._taxOffices = [];
    this._taxOffices = this.taxOffices.map((b: any) => {
      return { name: b.description, code: b.code };
    });

    var district = this._districts.find((r) => r.code == response.addresses[0].districtCode);
    this.createCustomerForm.get("address_district").setValue(district);

    var taxOffice = this._taxOffices.find((r) => r.code == response.addresses[0].taxOfficeCode);
    this.createCustomerForm.get("address_taxOffice").setValue(taxOffice);
  }
  async createCustomerFormMethod() {
    this.createCustomerForm = this.formBuilder.group({
      office: [null],
      warehouse: [null],
      salesPersonCode: [null],
      currAccDescription: [null, Validators.required],
      mail: [null, Validators.required],
      phoneNumber: [null, Validators.required],
      stampPhotoUrl: [null],
      bussinesCardPhotoUrl: [null],
      identity_number: [null],
      tax_number: [null],
      address_country: [null, Validators.required],
      address_region: [null, Validators.required],
      address_province: [null, Validators.required],
      address_taxOffice: [null, Validators.required],
      address_district: [null, Validators.required],
      address_description: [null, Validators.required],
      address_postalCode: [null],
      isVIP: [false],
      isBlocked: [false],
      currencyCode: [null],
      //-eksikler var !!
    });

    this.createCustomerForm
      .get("phoneNumber")
      .valueChanges.subscribe(async (value) => {
        //illeri getir
        var _value = this.generalService.formatPhoneNumber(value);
        this.createCustomerForm.get("phoneNumber").setValue(_value);

      });


    this.createCustomerForm
      .get("address_region")
      .valueChanges.subscribe(async (value) => {
        //illeri getir
        var _value = this.createCustomerForm.get("address_region").value;
        var response = await this.addressService.getAddress(3, _value.code);
        this.provinces = response;

        this._provinces = [];
        this.provinces.forEach((b) => {
          var provinces: any = { name: b.description, code: b.code };
          this._provinces.push(provinces);
        });
      });

    this.createCustomerForm
      .get("address_province")
      .valueChanges.subscribe(async (value) => {
        //ilçeleri getir
        var _value = this.createCustomerForm.get("address_province").value;

        var response = await this.addressService.getAddress(4, _value.code);
        this.districts = response;

        this._districts = [];
        this.districts.forEach((b) => {
          var district: any = { name: b.description, code: b.code };
          this._districts.push(district);
        });

        var _value = this.createCustomerForm.get("address_province").value;

        var response = await this.addressService.getAddress(5, _value.code);
        this.taxOffices = response;

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
      this.createCustomerForm
        .get("bussinesCardPhotoUrl")
        .setValue(response.url);
    }
    if (to === "stampPhotoUrl") {
      this.createCustomerForm.get("stampPhotoUrl").setValue(response.url);
    }
  }

  //-------------------------------------------------------------------------

  //-------------------------------

  cdCurrencyDescriptions: cdCurrencyDesc[] = [];
  async getCurrencyDesc() {
    this.cdCurrencyDescriptions = await this.infoService.getCurrencyDesc()
    this.createCustomerForm.get('currencyCode').setValue(this.cdCurrencyDescriptions.find(c => c.currencyCode == "TRY").currencyCode)
  }
  async getAddresses() {
    // Fetch countries and map the results
    var countries = await this.addressService.getAddress(1);
    this._countries = countries.map((b: any) => {
      return { name: b.description, code: b.code };
    });
    // Fetch regions and map the results
    var regions = await this.addressService.getAddress(2, "TR");
    this._regions = regions.map((b: any) => {
      return { name: b.description, code: b.code };
    });
  }


  //------------------------------------------------------------------------
  async updateCustomer() {
    var user = this.userService.getUserClientInfoResponse();
    const updatedAddress = {
      ModelType: this.modelType,
      CurrAccCode: this.currAccCode,
      OfficeCode: user.officeCode,
      CurrAccDescription: this.createCustomerForm.value.currAccDescription,
      TaxNumber: this.createCustomerForm.value.tax_number,
      IdentityNum: this.createCustomerForm.value.identity_number,
      CurrencyCode: this.createCustomerForm.value.currencyCode,
      IsVIP: this.createCustomerForm.value.isVIP,
      IsBlocked: this.createCustomerForm.value.isBlocked

    };
    var json = JSON.stringify(updatedAddress);
    var request: DirectRequest = new DirectRequest(json, ProcessDefinitionConstants.MÜŞTERİ, 1);
    var response = await this.directRequestService.directRequest(request);
    if (response) {
      this.toasterService.success("Güncellendi")
      await this.reload();
    }
    this.closeDialog(); // Close the dialog after the operation
  }


  //-------------------------------------------------------------------------
  displayDialog: boolean = false;
  isEditing: boolean = false;
  selectedCommunication: Communication; // Replace with your actual type
  selectedCommunicationTypeCode: number;
  selectedCommunicationCommAddress: string;
  updateCommunicationForm: FormGroup;
  createUpdateCommunicationForm() {
    this.updateCommunicationForm = this.formBuilder.group({
      communicationID: [null],
      communicationTypeCode: [null],
      commAddress: [null],
    });

    this.updateCommunicationForm
      .get("commAddress")
      .valueChanges.subscribe(async (value) => {
        if (!value.includes("@")) {
          var _value = this.generalService.formatPhoneNumber(value);
          this.updateCommunicationForm.get("commAddress").setValue(_value);
        }
      });

  }

  communicationTypeOptions = [
    { label: 'Mail', value: 3 },
    { label: 'Telefon', value: 7 }
  ];


  openDialogForAdd() {
    this.isEditing = false;
    this.selectedCommunicationCommAddress = '';
    this.selectedCommunicationTypeCode = null; // Reset the type codeforeach
    this.updateCommunicationForm.reset();
    this.displayDialog = true;
  }

  openDialogForEdit(communication: Communication) { // Replace with your actual type
    this.isEditing = true;
    this.selectedCommunication = communication;
    this.updateCommunicationForm.patchValue(this.selectedCommunication);
    // this.selectedCommunicationCommAddress = communication.commAddress;
    // this.selectedCommunicationTypeCode = communication.communicationTypeCode; // Assuming it exists
    this.displayDialog = true;
  }

  async updateCommunication() {
    // Construct the JSON object
    const updatedCommunication = {
      ModelType: this.modelType, // Assuming this.modelType is defined in your component
      CurrAccCode: this.currAccCode, // Replace with actual field if necessary
      Communications: [
        {
          CommunicationID: this.updateCommunicationForm.value.communicationID, // ID of the selected communication
          CommAddress: this.updateCommunicationForm.value.commAddress, // Value from the input
          CommunicationTypeCode: this.updateCommunicationForm.value.communicationTypeCode // Value from the dropdown
        }
      ]
    };
    var json = JSON.stringify(updatedCommunication);
    var request: DirectRequest = new DirectRequest(json, ProcessDefinitionConstants.MÜŞTERİ, 1);
    var response = await this.directRequestService.directRequest(request);
    if (response) {
      this.toasterService.success("Güncellendi")
      await this.reload();
    }
    this.closeDialog(); // Close the dialog after the operation
  }


  async addCommunication() {
    const updatedCommunication = {
      ModelType: this.modelType, // Assuming this.modelType is defined in your component
      CurrAccCode: this.currAccCode, // Replace with actual field if necessary
      Communications: [
        {
          CommAddress: this.updateCommunicationForm.value.commAddress, // Value from the input
          CommunicationTypeCode: this.updateCommunicationForm.value.communicationTypeCode // Value from the dropdown
        }
      ]
    };
    var json = JSON.stringify(updatedCommunication);
    var request: DirectRequest = new DirectRequest(json, ProcessDefinitionConstants.MÜŞTERİ, 1);
    var response = await this.directRequestService.directRequest(request);
    if (response) {
      this.toasterService.success("Eklendi")
      await this.reload();
    }
    this.closeDialog(); // Close the dialog after the operation
  }


  async deleteCustomerCommunication(communicationID: string) {
    var response = await this.customerService.deleteCustomerCommunication(communicationID);
    if (response) {
      this.toasterService.success("Silindi")
      await this.reload();
    }
  }
  closeDialog() {
    this.displayDialog = false;
    this.displayDialog2 = false;
  }

  //--------------------------------------------------------------
  displayDialog2: boolean = false;
  updateAddressForm: FormGroup
  isEditing2: boolean;
  selectedAddress: Address

  openDialogForAddAddress() {
    this.isEditing2 = false;
    this.selectedAddress = null; // Reset the type code
    this.updateAddressForm.reset();
    this.displayDialog2 = true;
  }

  async openDialogForEdit2(address: Address) { // Replace with your actual type
    this.isEditing2 = true;
    this.selectedAddress = address;
    this.updateAddressForm.get("postalAddressID").setValue(address.postalAddressID);
    this.updateAddressForm.get("address").setValue(address.address);
    this.updateAddressForm.get("country").setValue(this._countries[0]);

    var region = this._regions.find((r) => r.code == address.stateCode);
    this.updateAddressForm.get("region").setValue(region);

    var _response = await this.addressService.getAddress(3, region.code);
    this.provinces = _response;
    this._provinces = [];
    this._provinces = this.provinces.map((b: any) => {
      return { name: b.description, code: b.code };
    });

    var province = this._provinces.find((r) => r.code == address.cityCode);
    this.updateAddressForm.get("province").setValue(province);

    var _response = await this.addressService.getAddress(4, province.code);
    this.districts = _response;

    this._districts = [];
    this._districts = this.districts.map((b: any) => {
      return { name: b.description, code: b.code };
    });

    var _response = await this.addressService.getAddress(5, province.code);
    this.taxOffices = _response;

    this._taxOffices = [];
    this._taxOffices = this.taxOffices.map((b: any) => {
      return { name: b.description, code: b.code };
    });

    var district = this._districts.find((r) => r.code == address.districtCode);
    this.updateAddressForm.get("district").setValue(district);

    var taxOffice = this._taxOffices.find((r) => r.code == address.taxOfficeCode);
    this.updateAddressForm.get("taxOffice").setValue(taxOffice);


    this.displayDialog2 = true;
    console.log(this.updateAddressForm.value);
  }


  async createAddressForm() {
    this.updateAddressForm = this.formBuilder.group({
      postalAddressID: [null],
      country: [null],
      region: [null],
      province: [null],
      taxOffice: [null],
      district: [null],
      address: [null],
      postalCode: [null],
    });




    this.updateAddressForm
      .get("region")
      .valueChanges.subscribe(async (value) => {
        //illeri getir
        var _value = this.updateAddressForm.get("region").value;
        var response = await this.addressService.getAddress(3, _value.code);
        this.provinces = response;

        this._provinces = [];
        this.provinces.forEach((b) => {
          var provinces: any = { name: b.description, code: b.code };
          this._provinces.push(provinces);
        });
      });

    this.updateAddressForm
      .get("province")
      .valueChanges.subscribe(async (value) => {
        //ilçeleri getir
        var _value = this.updateAddressForm.get("province").value;

        var response = await this.addressService.getAddress(4, _value.code);
        this.districts = response;

        this._districts = [];
        this.districts.forEach((b) => {
          var district: any = { name: b.description, code: b.code };
          this._districts.push(district);
        });

        var _value = this.updateAddressForm.get("province").value;

        var response = await this.addressService.getAddress(5, _value.code);
        this.taxOffices = response;

        this._taxOffices = [];
        this.taxOffices.forEach((b) => {
          var taxOffice: any = { name: b.description, code: b.code };
          this._taxOffices.push(taxOffice);
        });
      });
  }


  async updateAddress() {

    const updatedAddress = {
      ModelType: this.modelType,
      CurrAccCode: this.currAccCode,
      PostalAddresses: [
        {
          AddressTypeCode: 1,
          PostalAddressId: this.updateAddressForm.value.postalAddressID,
          CountryCode: this.updateAddressForm.value.country.code,
          StateCode: this.updateAddressForm.value.region.code,
          CityCode: this.updateAddressForm.value.province.code,
          DistrictCode: this.updateAddressForm.value.district.code,
          Address: this.updateAddressForm.value.address
        }
      ]
    };
    var json = JSON.stringify(updatedAddress);
    var request: DirectRequest = new DirectRequest(json, ProcessDefinitionConstants.MÜŞTERİ, 1);
    var response = await this.directRequestService.directRequest(request);
    if (response) {
      this.toasterService.success("Güncellendi")
      await this.reload();
    }
    this.closeDialog(); // Close the dialog after the operation
  }


  async addAddress() {
    const updatedAddress = {
      ModelType: this.modelType,
      CurrAccCode: this.currAccCode,
      PostalAddresses: [
        {
          AddressTypeCode: 1,
          // PostalAddressId: this.updateAddressForm.value.postalAddressID,
          CountryCode: this.updateAddressForm.value.country.code,
          StateCode: this.updateAddressForm.value.region.code,
          CityCode: this.updateAddressForm.value.province.code,
          DistrictCode: this.updateAddressForm.value.district.code,
          Address: this.updateAddressForm.value.address
        }
      ]
    };
    var json = JSON.stringify(updatedAddress);
    var request: DirectRequest = new DirectRequest(json, ProcessDefinitionConstants.MÜŞTERİ, 1);
    var response = await this.directRequestService.directRequest(request);
    if (response) {
      this.toasterService.success("Güncellendi")
      await this.reload();
    }
    this.closeDialog(); // Close the dialog after the operation
  }


  async deleteCustomerAddress(postallAddressID: string) {
    var response = await this.customerService.deleteCustomerAddress(postallAddressID);
    if (response) {
      this.toasterService.success("Silindi")
      await this.reload();
    }
  }

  //--------------------------------------------------------------
  async reload() {
    var response: NebimCustomerDto =
      await this.customerService.getCustomerDetail(this.currAccCode);
    this.response = response;
    if (response.addresses.length > 0) {

      this.fillForm(response);
    }
  }
}
