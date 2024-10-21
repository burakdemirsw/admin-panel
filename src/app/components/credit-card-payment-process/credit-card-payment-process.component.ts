import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CustomerModel } from 'src/app/models/model/customer/customerModel';
import { NebimResponse } from 'src/app/models/model/invoice/CashLine';
import { cdBankDesc } from 'src/app/models/model/invoice/cdBankDesc';
import { CreditCardPaymentHeader, CreditCardPaymentLine } from 'src/app/models/model/invoice/CreditCardPaymentHeader';

import { UserClientInfoResponse } from 'src/app/models/model/user/userRegister_VM';
import { OfficeModel } from 'src/app/models/model/warehouse/officeModel';
import { WarehouseOfficeModel } from 'src/app/models/model/warehouse/warehouseOfficeModel';
import { CreditCardPaymentService } from 'src/app/services/admin/credit-card-payment.service';
import { CustomerService } from 'src/app/services/admin/customer.service';
import { GeneralService } from 'src/app/services/admin/general.service';
import { HeaderService } from 'src/app/services/admin/header.service';
import { InfoService } from 'src/app/services/admin/info.service';
import { UserService } from 'src/app/services/admin/user.service';
import { WarehouseService } from 'src/app/services/admin/warehouse.service';
import { ToasterService } from 'src/app/services/ui/toaster.service';
import { CreditCardPaymentType } from '../../models/model/invoice/CreditCardPaymentType';
import { cdCreditCardTypeDesc } from 'src/app/models/model/nebim/cdCreditCardTypeDesc';
import { bsCurrAccTypeDesc } from 'src/app/models/model/nebim/bsCurrAccTypeDesc';

@Component({
  selector: 'app-credit-card-payment-process',
  templateUrl: './credit-card-payment-process.component.html',
  styleUrl: './credit-card-payment-process.component.css'
})
export class CreditCardPaymentProcessComponent {

  constructor(
    private formBuilder: FormBuilder,
    private toasterService: ToasterService,
    private creditCardPaymentService: CreditCardPaymentService,
    private warehouseService: WarehouseService,
    private generalService: GeneralService,
    private activatedRoute: ActivatedRoute,
    private headerService: HeaderService,
    private routerService: Router,
    private userService: UserService,
    private infoService: InfoService,
    private customerService: CustomerService
  ) { }

  officeModels: OfficeModel[] = [];
  warehouseModels: WarehouseOfficeModel[] = [];
  offices: any[] = []
  warehouses: any[] = []
  //-----------------------
  user: UserClientInfoResponse;
  applicationCode: string;
  currAccTypeCode: number;
  creditCardPaymentTypeCode: number;
  creditCardPaymentHeader: CreditCardPaymentHeader;
  creditCardPaymentLines: CreditCardPaymentLine[] = [];
  activeIndex: number = 0;
  id: string;
  //creditCardPayment-process/creditCardPayment/
  async ngOnInit() {

    this.activatedRoute.params.subscribe(async (params) => {
      if (params["creditCardPaymentTypeCode"] && params["applicationCode"]) {
        this.creditCardPaymentTypeCode = params["creditCardPaymentTypeCode"];
        // this.currAccTypeCode = params["currAccTypeCode"];
        this.applicationCode = params["applicationCode"];
        await this.getAllDatas();
        this.user = this.userService.getUserClientInfoResponse()
        this.headerService.updatePageTitle("Kredi Kartı İle Ödeme Al");
      }

      if (params['id']) {
        this.id = params['id'];
        await this.getHeader();
        if (this.creditCardPaymentHeader) {
          await this.getLinesOfHeader();
        }
      } else {
        this.setFormValueFromUser()
      }
      if (params["activeIndex"]) {
        this.activeIndex = Number(params["activeIndex"]);
        if (this.creditCardPaymentHeader.isCompleted == true) {
          this.activeIndex = 1;
        }
      }


    })

  }

  trackChanges(e: any) {
    this.activeIndex = e.index
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


  bsCurrAccTypeDescs: bsCurrAccTypeDesc[] = [];
  cdBankDescs: cdBankDesc[] = [];
  creditCardPaymentTypes: CreditCardPaymentType[] = [];
  creditCardTypeCodes: cdCreditCardTypeDesc[] = [];
  async getAllDatas() {
    this.headerFormGenerator();
    this.lineFormGenerator();
    this.updatelineFormGenerator();
    await this.getWarehouseAndOffices();
    await this.getCustomerList('3');//toptan müşterileri çeker
    this.bsCurrAccTypeDescs = await this.infoService.getCurrAccTypeDesc();
    this.cdBankDescs = await this.infoService.getBankDesc();
    this.creditCardPaymentTypes = await this.infoService.getCreditCardPaymentType();
    this.creditCardTypeCodes = await this.infoService.getCreditCardTypes();
  }

  headerForm: FormGroup;
  headerFormGenerator() {
    this.headerForm = this.formBuilder.group({
      officeCode: [null, [Validators.required]],
      currAccCode: [null, [Validators.required]],
      description: [null],

    });
  }


  lineForm: FormGroup;
  updateLineForm: FormGroup;
  displayDialog: boolean = false;;
  lineFormGenerator() {
    this.lineForm = this.formBuilder.group({
      creditCardTypeCode: [null, [Validators.required]],
      currAccAmount: [null, [Validators.required]],
      issuerBankCode: [null, [Validators.required]],
      acquirerBankCode: [null, [Validators.required]],
      lineDescription: [null],

    });

    this.lineForm.get('creditCardTypeCode')?.valueChanges.subscribe(value => {
      var _value = this.creditCardTypeCodes.find(pt => pt.creditCardTypeCode == value);
      var _bankValue = this.cdBankDescs.find(b => b.bankCode == _value.bankCode);
      this.lineForm.get('issuerBankCode').setValue(_bankValue.bankCode);
      this.lineForm.get('acquirerBankCode').setValue(_bankValue.bankCode);
    });
  }
  selectedCreditCardPaymentLine: CreditCardPaymentLine;
  async openUpdateDialog(line: CreditCardPaymentLine) {
    this.selectedCreditCardPaymentLine = line;
    this.updateLineForm.get("creditCardTypeCode").setValue(line.creditCardTypeCode);
    this.updateLineForm.get("currAccAmount").setValue(line.currAccAmount);
    this.updateLineForm.get("issuerBankCode").setValue(line.issuerBankCode);
    this.updateLineForm.get("acquirerBankCode").setValue(line.acquirerBankCode);
    this.updateLineForm.get("lineDescription").setValue(line.lineDescription);
    this.displayDialog = true;
  }

  async updatelineFormGenerator() {
    this.updateLineForm = this.formBuilder.group({
      creditCardTypeCode: [null, [Validators.required]],
      currAccAmount: [null, [Validators.required]],
      issuerBankCode: [null, [Validators.required]],
      acquirerBankCode: [null, [Validators.required]],
      lineDescription: [null],

    });

    this.updateLineForm.get('creditCardTypeCode')?.valueChanges.subscribe(value => {
      var _value = this.creditCardTypeCodes.find(pt => pt.creditCardTypeCode == value);
      var _bankValue = this.cdBankDescs.find(b => b.bankCode == _value.bankCode);
      this.updateLineForm.get('issuerBankCode').setValue(_bankValue.bankCode);
      this.updateLineForm.get('acquirerBankCode').setValue(_bankValue.bankCode);
    });
    // // Subscribe to changes on currAccTypeCode
    // this.updateLineForm.get('currAccTypeCode')?.valueChanges.subscribe(async (value) => {
    //   await this.getCustomerList(value);
    // });
  }

  setFormValueFromProcess() {
    this.headerForm.get("officeCode").setValue(this.creditCardPaymentHeader.officeCode);
    var c = this.customerList2.find(c => c.code == this.creditCardPaymentHeader.currAccCode)
    this.headerForm.get("currAccCode").setValue(c);
    this.headerForm.get("description").setValue(this.creditCardPaymentHeader.description);

  }

  setFormValueFromUser() {
    this.headerForm.get("officeCode").setValue(this.user.officeCode);
  }
  async getLinesOfHeader() {
    try {
      const response = await this.creditCardPaymentService.getCreditCardPaymentLinesByHeaderId(
        this.id
      );
      this.creditCardPaymentLines = response;

      this.calculateTotalQty();
    } catch (error: any) {
      this.toasterService.warn(error.message);
    }
  }
  totalCount;
  calculateTotalQty() {
    // //toplanan ürünler yazısı için
    // let totalQty = 0;
    // this.creditCardPaymentLines.forEach((item) => {
    //   totalQty += item.currAccAmount;
    // });
    // this.totalCount = totalQty;
  }


  async getHeader() {
    if (this.generalService.isGuid(this.id)) {
      var response = await this.creditCardPaymentService.getCreditCardPaymentHeaderById(this.id);
      if (response != null) {
        this.creditCardPaymentHeader = response;

        this.setFormValueFromProcess();
      } else {
        this.routerService.navigate([`/create-credit-cart-payment-process/${this.applicationCode}/${this.currAccTypeCode}/${this.creditCardPaymentTypeCode}/0`]);
        this.toasterService.error("İşlem Bulunamadı")
      }
    } else {
      this.routerService.navigate([`/create-credit-cart-payment-process/${this.applicationCode}/${this.currAccTypeCode}/${this.creditCardPaymentTypeCode}/0`]);
    }

  }
  async updateHeader() {
    if (this.headerForm.valid) {
      if (!this.creditCardPaymentHeader) {
        await this.addHeader();
      }
      var _v = this.headerForm.value;
      var header: CreditCardPaymentHeader = new CreditCardPaymentHeader();
      header.id = this.creditCardPaymentHeader.id;
      header.applicationCode = this.creditCardPaymentHeader.applicationCode;
      header.creditCardPaymentTypeCode = this.creditCardPaymentHeader.creditCardPaymentTypeCode;
      header.officeCode = _v.officeCode;
      header.currAccTypeCode = this.currAccTypeCode;
      header.currAccCode = _v.currAccCode.code;
      header.storeTypeCode = this.creditCardPaymentHeader.storeTypeCode;
      header.description = _v.description;
      header.userId = this.user.userId

      var response = await this.creditCardPaymentService.editCreditCardPaymentHeader(header);
      if (response) {
        this.creditCardPaymentHeader = response;
        this.responseHandler(true, "Güncellendi")
        this.setFormValueFromProcess();
        return;
      } else {
        this.responseHandler(false, "Güncellenmedi")
        return;
      }
    } else {
      this.generalService.whichRowIsInvalid(this.headerForm);
    }
  }
  async addHeader() {
    if (this.headerForm.valid) {
      var _v = this.headerForm.value;
      var header: CreditCardPaymentHeader = new CreditCardPaymentHeader();
      header.applicationCode = this.applicationCode;
      header.creditCardPaymentTypeCode = this.creditCardPaymentTypeCode;

      header.officeCode = _v.officeCode;
      header.currAccTypeCode = this.currAccTypeCode;
      header.currAccCode = _v.currAccCode.code;
      header.storeTypeCode = 5;
      header.description = _v.description;
      header.userId = this.user.userId

      var response = await this.creditCardPaymentService.editCreditCardPaymentHeader(header);
      if (response) {
        this.responseHandler(true, "Eklendi");
        this.routerService.navigate([`/create-credit-cart-payment-process/${this.applicationCode}/${this.creditCardPaymentTypeCode}/0/${response.id}`]);
        return;
      } else {
        // Handle failure response
        this.responseHandler(false, "Eklenmedi");
        return;
      }

    } else {
      this.generalService.whichRowIsInvalid(this.headerForm);
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

  //--------------------------------------------------
  customerList: CustomerModel[] = [];
  customerList2: any[] = [];
  async getCustomerList(request: string): Promise<void> {
    this.customerList = await this.customerService.getCustomerList(request);

    // customerList2'yi Set yapısını kullanarak güncelliyoruz
    const updatedCustomerList = new Set(this.customerList.map(c => ({
      name: c.currAccDescription,
      code: c.currAccCode
    })));

    // updatedCustomerList'i array'e çevirerek customerList2'ye atıyoruz
    this.customerList2 = Array.from(updatedCustomerList);
  }


  async addLine() {
    if (this.lineForm.valid) {
      var _v = this.lineForm.value;
      var line: CreditCardPaymentLine = new CreditCardPaymentLine();
      line.creditCardPaymentHeaderId = this.creditCardPaymentHeader.id;
      line.currAccAmount = _v.currAccAmount;
      line.issuerBankCode = _v.issuerBankCode;
      line.acquirerBankCode = _v.acquirerBankCode;
      line.creditCardTypeCode = _v.creditCardTypeCode
      line.lineDescription = _v.lineDescription;
      var response = await this.creditCardPaymentService.addCreditCardPaymentLine(line);
      if (response) {
        await this.getLinesOfHeader();
        this.responseHandler(true, "Eklendi")
        this.lineForm.reset();
        return;
      } else {
        this.responseHandler(false, "Eklenmedi")
        return;
      }


    } else {
      this.generalService.whichRowIsInvalid(this.lineForm);
    }

  }

  async updateLine() {
    if (this.updateLineForm.valid) {
      var _v = this.updateLineForm.value;
      var line: CreditCardPaymentLine = new CreditCardPaymentLine();
      line.id = this.selectedCreditCardPaymentLine.id;
      line.creditCardPaymentHeaderId = this.creditCardPaymentHeader.id;
      line.currAccAmount = _v.currAccAmount;
      line.issuerBankCode = _v.issuerBankCode;
      line.acquirerBankCode = _v.acquirerBankCode;
      line.creditCardTypeCode = _v.creditCardTypeCode
      line.lineDescription = _v.lineDescription;
      var response = await this.creditCardPaymentService.updateCreditCardPaymentLine(line);
      if (response) {
        await this.getLinesOfHeader();
        this.responseHandler(true, "Güncellendi")
        this.updateLineForm.reset();
        this.displayDialog = false;
        this.selectedCreditCardPaymentLine = null;
        return;
      } else {
        this.responseHandler(false, "Güncellenmedi")
        return;
      }
    } else {
      this.generalService.whichRowIsInvalid(this.lineForm);
    }
  }

  async deleteLine(id: string) {
    var response = await this.creditCardPaymentService.deleteCreditCardPaymentLine(id);
    if (response) {
      await this.getLinesOfHeader();
      this.responseHandler(true, "Silindi")

      return;
    } else {
      this.responseHandler(false, "Silinemedi")
      return;
    }
  }
  async completeCreditCardPaymentPayment() {
    if (window.confirm("İşlem Tamamlanacakdır. Devam edilsin mi?")) {
      var response: NebimResponse = await this.creditCardPaymentService.completeCreditCardPayment(this.creditCardPaymentHeader.id);
      if (response) {
        this.responseHandler(true, "Tamamlandı");
        this.routerService.navigate([`/create-credit-cart-payment-process/${this.applicationCode}/${this.currAccTypeCode}/${this.creditCardPaymentTypeCode}/0/${this.creditCardPaymentHeader.id}`]);
      }
    }

  }


}
