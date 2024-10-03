import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import {
  CustomerAddress_VM,
  GetCustomerList_CM,
} from "src/app/models/model/order/getCustomerList_CM";
import { Address_VM } from "src/app/models/model/order/ViewModel/provinceVM";
import { AddressService } from "src/app/services/admin/address.service";
import { GeneralService } from "src/app/services/admin/general.service";
import { HeaderService } from "src/app/services/admin/header.service";
import { OrderService } from "src/app/services/admin/order.service";
import { GoogleDriveService } from "src/app/services/common/google-drive.service";
import { ToasterService } from "src/app/services/ui/toaster.service";
import { CreateCustomer_CM } from "../../../models/model/order/createCustomer_CM";
import { ClientCustomer } from "../customer-list/customer-list.component";

@Component({
  selector: "app-add-customer",
  templateUrl: "./add-customer.component.html",
  styleUrls: ["./add-customer.component.css"],
})
export class AddCustomerComponent implements OnInit {
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
  constructor(
    private router: Router,
    private addressService: AddressService,
    private toasterService: ToasterService,
    private orderService: OrderService,
    private headerService: HeaderService,
    private generalService: GeneralService,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private googleDriveService: GoogleDriveService
  ) { }

  async ngOnInit() {
    this.activatedRoute.params.subscribe(async (params) => {
      await this.createCustomerFormMethod();
      await this.getAddresses();

      if (params["type"] == "ws") {
        this.modelType = 2;
        if (params["currAccCode"]) {
          var curr_acc_code: string = params["currAccCode"];

          if (curr_acc_code.includes("1-4")) {
            this.toasterService.error("Hatalı Sayfa");
            this.router.navigate(["add-customer/r", curr_acc_code]);
          }
        }
      } else {
        this.modelType = 3;
        if (params["currAccCode"]) {
          var curr_acc_code: string = params["currAccCode"];

          if (curr_acc_code.includes("1-3")) {
            this.toasterService.error("Hatalı Sayfa");
            this.router.navigate(["add-customer/ws", curr_acc_code]);
          }
        }
        this.modelType = 3;
      }

      if (params["currAccCode"]) {
        this.pageType = true;

        if (params["type"] == "ws") {
          this.headerService.updatePageTitle("Toptan Müşteri Güncelle");

        } else {

          this.headerService.updatePageTitle("Perakende Müşteri Güncelle");

        }
        this.currAccCode = params["currAccCode"];

        this.addressId = params["addressId"];
        // var response = await this.orderService.getClientCustomerById(this.currAccCode);
        // if (response) {

        //   this.findedCustomer = response[0];
        // } else {
        //   this.toasterService.error("Müşteriye Ait Bilgi Bulunamadı")
        // }
        var r: GetCustomerList_CM = new GetCustomerList_CM();
        r.currAccCode = this.currAccCode;
        var address_response: CustomerAddress_VM[] =
          await this.orderService.getCustomerAddress(r);
        if (address_response.length > 0) {
          this.toasterService.info(address_response.length.toString());
          this.postalAddressId = address_response[0].postalAddressID;
          this.fillForm(address_response[0]);
        }
      } else {
        this.pageType = false;

        if (params["type"] == "ws") {
          this.headerService.updatePageTitle("Toptan Müşteri Oluştur");

        } else {

          this.headerService.updatePageTitle("Perakende Müşteri Oluştur");

        }


      }
    });
  }

  async submitAddressForm(formValue: any) {
    if (!this.pageType) {
      if (this.createCustomerForm.valid) {
        var request: CreateCustomer_CM = new CreateCustomer_CM();
        request.modelType = this.modelType;
        request.currAccDescription = formValue.currAccDescription; //++
        request.mail = formValue.mail;
        request.phoneNumber = formValue.phoneNumber;
        request.firmDescription = formValue.firmDescription;
        request.stampPhotoUrl = formValue.stampPhotoUrl;
        request.bussinesCardPhotoUrl = formValue.bussinesCardPhotoUrl;
        request.officeCode = "M";
        request.warehouseCode = "MD";
        request.taxNumber = formValue.tax_number;
        request.identityNumber = formValue.identity_number;
        if (!formValue.address_country) {
          request.address = null;
        } else {
          request.address.country = formValue.address_country?.code;
          request.address.province = formValue.address_province?.code;
          request.address.district = formValue.address_district?.code;
          request.address.region = formValue.address_region?.code;
          request.address.taxOffice = formValue.address_taxOffice?.code;
          request.address.description = formValue.address_description;
          request.address.postalCode = formValue.address_postalCode;
        }

        if (true) {
          var response = await this.orderService.createCustomer(request);
          if (response.currAccCode) {
            var clientCustomer_request = new ClientCustomer();
            clientCustomer_request.currAccCode = response.currAccCode;
            clientCustomer_request.description = formValue.currAccDescription;
            clientCustomer_request.stampPhotoUrl = formValue.stampPhotoUrl;
            clientCustomer_request.bussinesCardPhotoUrl =
              formValue.bussinesCardPhotoUrl;
            clientCustomer_request.addedSellerCode =
              localStorage.getItem("salesPersonCode");
            var clientCustomer_response =
              await this.orderService.editClientCustomer(
                clientCustomer_request
              );
            if (clientCustomer_response) {
              this.toasterService.success("Kullanıcı Eklendi");
              this.router.navigate(["/customer-list"]);
            }
          }
        }
      } else {
        this.generalService.whichRowIsInvalid(this.createCustomerForm);
      }
    } else {
      if (this.createCustomerForm.valid) {
        var request: CreateCustomer_CM = new CreateCustomer_CM();
        request.modelType = this.modelType;
        request.currAccCode = this.currAccCode;
        request.currAccDescription = formValue.currAccDescription; //++
        request.mail = formValue.mail;
        request.phoneNumber = formValue.phoneNumber;
        request.firmDescription = formValue.firmDescription;
        request.stampPhotoUrl = formValue.stampPhotoUrl;
        request.bussinesCardPhotoUrl = formValue.bussinesCardPhotoUrl;
        request.officeCode = "M";
        request.warehouseCode = "MD";
        request.taxNumber = formValue.tax_number;
        request.taxOfficeCode = formValue.address_taxOffice?.code;
        request.identityNumber = formValue.identity_number;
        if (!formValue.address_country) {
          request.address = null;
        } else {
          request.address.country = formValue.address_country?.code;
          request.address.province = formValue.address_province?.code;
          request.address.district = formValue.address_district?.code;
          request.address.region = formValue.address_region?.code;
          request.address.taxOffice = formValue.address_taxOffice?.code;
          request.address.description = formValue.address_description;
          request.address.postalCode = formValue.address_postalCode;
          request.address.postalAddressId = this.postalAddressId;
        }

        if (true) {
          var response = await this.orderService.updateCustomer(request);
          if (response.currAccCode) {
            var clientCustomer_request = new ClientCustomer();
            clientCustomer_request.currAccCode = response.currAccCode;
            clientCustomer_request.description = formValue.currAccDescription;
            clientCustomer_request.stampPhotoUrl = formValue.stampPhotoUrl;
            clientCustomer_request.bussinesCardPhotoUrl =
              formValue.bussinesCardPhotoUrl;
            clientCustomer_request.addedSellerCode =
              localStorage.getItem("salesPersonCode");
            var clientCustomer_response =
              await this.orderService.editClientCustomer(
                clientCustomer_request
              );
            if (clientCustomer_response) {
              this.toasterService.success("Kullanıcı Eklendi");
              this.router.navigate(["/customer-list"]);
            }
          }
        }
      } else {
        this.generalService.whichRowIsInvalid(this.createCustomerForm);
      }
    }
  }
  async fillForm(v: CustomerAddress_VM) {
    this.createCustomerForm
      .get("currAccDescription")
      .setValue(v.currAccDescription);
    this.createCustomerForm.get("mail").setValue(v.mail);
    this.createCustomerForm.get("phoneNumber").setValue(v.phoneNumber);
    this.createCustomerForm.get("identity_number").setValue(v.identityNumber);
    this.createCustomerForm.get("tax_number").setValue(v.taxNumber);
    this.createCustomerForm.get("address_description").setValue(v.address);
    //asdsa
    console.log(this._countries);
    this.createCustomerForm.get("address_country").setValue(this._countries[0]);

    var region = this._regions.find((r) => r.code == v.stateCode);
    this.createCustomerForm.get("address_region").setValue(region);

    var response = await this.addressService.getAddress(3, region.code);
    this.provinces = response;
    this._provinces = [];
    this._provinces = this.provinces.map((b: any) => {
      return { name: b.description, code: b.code };
    });

    var province = this._provinces.find((r) => r.code == v.cityCode);
    this.createCustomerForm.get("address_province").setValue(province);

    var response = await this.addressService.getAddress(4, province.code);
    this.districts = response;

    this._districts = [];
    this._districts = this.districts.map((b: any) => {
      return { name: b.description, code: b.code };
    });

    var response = await this.addressService.getAddress(5, province.code);
    this.taxOffices = response;

    this._taxOffices = [];
    this._taxOffices = this.taxOffices.map((b: any) => {
      return { name: b.description, code: b.code };
    });

    var district = this._districts.find((r) => r.code == v.districtCode);
    this.createCustomerForm.get("address_district").setValue(district);

    var taxOffice = this._taxOffices.find((r) => r.code == v.taxOfficeCode);
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
      address_country: [null],
      address_region: [null],
      address_province: [null],
      address_taxOffice: [null],
      address_district: [null],
      address_description: [null],
      address_postalCode: [null],
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

  //-------------------------------------------------------------------------
}
