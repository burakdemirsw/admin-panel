import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { CustomerModel } from 'src/app/models/model/customer/customerModel';
import { BankLine } from "src/app/models/model/invoice/BankLine";
import { BankHeader } from "src/app/models/model/invoice/BankHeader";
import { BankAccount } from "src/app/models/model/invoice/BankAccount";
import { NebimResponse } from "src/app/models/model/invoice/CashLine";
import { bsBankTransTypeDesc, bsCurrAccTypeDesc } from 'src/app/models/model/nebim/cdShipmentMethodDesc ';
import { UserClientInfoResponse } from 'src/app/models/model/user/userRegister_VM';
import { OfficeModel } from 'src/app/models/model/warehouse/officeModel';
import { WarehouseOfficeModel } from 'src/app/models/model/warehouse/warehouseOfficeModel';
import { GeneralService } from 'src/app/services/admin/general.service';
import { HeaderService } from 'src/app/services/admin/header.service';
import { InfoService } from 'src/app/services/admin/info.service';
import { OrderService } from 'src/app/services/admin/order.service';
import { ProductService } from 'src/app/services/admin/product.service';
import { UserService } from 'src/app/services/admin/user.service';
import { WarehouseService } from 'src/app/services/admin/warehouse.service';
import { ToasterService } from 'src/app/services/ui/toaster.service';
import { BankService } from 'src/app/services/admin/bank.service';

@Component({
  selector: 'app-bank-process',
  templateUrl: './bank-process.component.html',
  styleUrl: './bank-process.component.css'
})
export class BankProcessComponent {

  constructor(
    private formBuilder: FormBuilder,
    private toasterService: ToasterService,
    private warehouseService: WarehouseService,
    private generalService: GeneralService,
    private activatedRoute: ActivatedRoute,
    private headerService: HeaderService,
    private routerService: Router,
    private userService: UserService,
    private infoService: InfoService,
    private bankService: BankService
  ) { }

  officeModels: OfficeModel[] = [];
  warehouseModels: WarehouseOfficeModel[] = [];
  offices: any[] = []
  warehouses: any[] = []
  //-----------------------
  user: UserClientInfoResponse;
  applicationCode: string;
  bankTransTypeCode: number;
  bankHeader: BankHeader;
  bankLines: BankLine[] = [];
  activeIndex: number = 0;
  id: string;
  //bank-process/bank/
  async ngOnInit() {

    this.activatedRoute.params.subscribe(async (params) => {
      if (params["bankTransTypeCode"] && params["applicationCode"]) {

        this.bankTransTypeCode = Number(params["bankTransTypeCode"]);
        this.applicationCode = params["applicationCode"];
        console.log(this.bankTransTypeCode, this.applicationCode);
      }
      await this.getAllDatas();
      this.user = this.userService.getUserClientInfoResponse()

      if (params['id']) {
        this.id = params['id'];
        await this.getHeader();
        if (this.bankHeader) {
          await this.getLinesOfHeader();
        }
      } else {
        this.setFormValueFromUser()
      }
      if (params["activeIndex"]) {
        this.activeIndex = Number(params["activeIndex"]);
      }


    })

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


  bsBankTransTypeDescs: bsBankTransTypeDesc[] = []
  bsCurrAccTypeDescs: bsCurrAccTypeDesc[] = [];
  bankAccounts: BankAccount[] = [];
  async getAllDatas() {
    this.headerFormGenerator();
    this.lineFormGenerator();
    this.updatelineFormGenerator();
    await this.getWarehouseAndOffices();
    this.bsBankTransTypeDescs = await this.infoService.getBankTransTypeDesc();
    for (var element of this.bsBankTransTypeDescs) {
      if (this.bankTransTypeCode == element.bankTransTypeCode) {
        this.headerService.updatePageTitle(element.bankTransTypeDescription);
        this.headerForm.get('bankTransTypeCode').setValue(element.bankTransTypeCode);
      }
    }
    this.bsCurrAccTypeDescs = await this.infoService.getCurrAccTypeDesc();
    this.bankAccounts = await this.infoService.getBankAccounts();
  }

  headerForm: FormGroup;
  headerFormGenerator() {
    this.headerForm = this.formBuilder.group({
      officeCode: [null, [Validators.required]],
      bankTransTypeCode: [null, [Validators.required]],
      bankCurrAccCode: [null, Validators.required],
      description: [null],

    });
  }

  lineForm: FormGroup;
  updateLineForm: FormGroup;
  displayDialog: boolean = false;;
  lineFormGenerator() {
    this.lineForm = this.formBuilder.group({
      currAccTypeCode: [null, [Validators.required]],
      currAccCode: [null, [Validators.required]],
      currAccAmount: [null, Validators.required],
      lineDescription: [null]
    });

    // Subscribe to changes on currAccTypeCode
    this.lineForm.get('currAccTypeCode')?.valueChanges.subscribe(async (value) => {
      await this.getCustomerList(value);
    });
  }
  selectedBankLine: BankLine;
  async openUpdateDialog(line: BankLine) {
    this.selectedBankLine = line;
    this.updateLineForm.get("currAccTypeCode").setValue(line.currAccTypeCode);

    // Wait for customer list to be fetched
    await this.getCustomerList(line.currAccTypeCode.toString()); //hem formda hemde burada çağırıyorsun bunu iki kere çekmemenin yolunu bul!!!!
    var _c = this.customerList2.find(c => c.code == line.currAccCode);
    this.updateLineForm.get("currAccCode").setValue(_c); // Set currAccCode after getting the customer list
    this.updateLineForm.get("currAccAmount").setValue(line.currAccAmount);
    this.updateLineForm.get("lineDescription").setValue(line.lineDescription);
    this.displayDialog = true;
  }

  async updatelineFormGenerator() {
    this.updateLineForm = this.formBuilder.group({
      currAccTypeCode: [null, [Validators.required]],
      currAccCode: [null, [Validators.required]],
      currAccAmount: [null, Validators.required],
      lineDescription: [null]
    });

    // Subscribe to changes on currAccTypeCode
    this.updateLineForm.get('currAccTypeCode')?.valueChanges.subscribe(async (value) => {
      await this.getCustomerList(value);
    });
  }

  setFormValueFromProcess() {
    this.headerForm.get("officeCode").setValue(this.bankHeader.officeCode);
    this.headerForm.get("bankTransTypeCode").setValue(this.bankHeader.bankTransTypeCode);
    // this.headerForm.get("bankCurrAccCode").setValue(this.bankHeader.bankCurrAccCode);
    this.headerForm.get("description").setValue(this.bankHeader.description);

  }

  setFormValueFromUser() {
    this.headerForm.get("officeCode").setValue(this.user.officeCode);
  }
  async getLinesOfHeader() {
    try {
      const response = await this.bankService.getBankLinesByHeaderId(
        this.id
      );
      this.bankLines = response;

      this.calculateTotalQty();
    } catch (error: any) {
      this.toasterService.warn(error.message);
    }
  }
  totalCount;
  calculateTotalQty() {
    //toplanan ürünler yazısı için
    let totalQty = 0;
    this.bankLines.forEach((item) => {
      totalQty += item.currAccAmount;
    });
    this.totalCount = totalQty;
  }


  async getHeader() {
    if (this.generalService.isGuid(this.id)) {
      var response = await this.bankService.getBankHeaderById(this.id);
      if (response != null) {
        this.bankHeader = response;
        this.setFormValueFromProcess();
      } else {
        this.routerService.navigate([`/create-bank-process/${this.applicationCode}/${this.bankTransTypeCode}`]);
        this.toasterService.error("İşlem Bulunamadı")
      }
    } else {
      this.routerService.navigate([`/create-bank-process/${this.applicationCode}/${this.bankTransTypeCode}`]);
    }

  }
  async updateHeader() {
    if (this.headerForm.valid) {
      if (!this.bankHeader) {
        await this.addHeader();
      }
      var _v = this.headerForm.value;
      var header: BankHeader = new BankHeader();
      header.id = this.bankHeader.id;
      header.applicationCode = this.bankHeader.applicationCode;
      header.officeCode = _v.officeCode;
      header.bankTransTypeCode = _v.bankTransTypeCode;
      header.bankCurrAccCode = _v.bankCurrAccCode;
      header.bankCurrAccTypeCode = 6;
      header.storeTypeCode = this.bankHeader.storeTypeCode;
      header.posTerminalId = this.bankHeader.posTerminalId;
      header.description = _v.description;
      header.userId = this.user.userId

      var response = await this.bankService.editBankHeader(header);
      if (response) {
        this.bankHeader = response;
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
      var header: BankHeader = new BankHeader();
      header.applicationCode = this.applicationCode;
      header.officeCode = _v.officeCode;
      header.bankTransTypeCode = _v.bankTransTypeCode;
      header.bankCurrAccCode = _v.bankCurrAccCode;
      header.bankCurrAccTypeCode = 6;
      header.storeTypeCode = 5;
      header.posTerminalId = 0;
      header.description = _v.description;
      header.userId = this.user.userId

      var response = await this.bankService.editBankHeader(header);
      if (response) {
        this.responseHandler(true, "Eklendi");
        this.routerService.navigate([`/create-bank-process/${this.applicationCode}/${this.bankTransTypeCode}/1/${response.id}`]);
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
    this.customerList = await this.warehouseService.getCustomerList(request);

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
      var line: BankLine = new BankLine();
      line.bankHeaderId = this.bankHeader.id;
      line.currAccTypeCode = _v.currAccTypeCode;
      line.currAccCode = _v.currAccCode.code;
      line.currAccAmount = _v.currAccAmount;
      line.lineDescription = _v.lineDescription;
      var response = await this.bankService.addBankLine(line);
      if (response) {
        await this.getLinesOfHeader();
        this.responseHandler(true, "Eklendi")
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
      var line: BankLine = new BankLine();
      line.id = this.selectedBankLine.id;
      line.bankHeaderId = this.bankHeader.id;
      line.currAccTypeCode = _v.currAccTypeCode;
      line.currAccCode = _v.currAccCode.code;
      line.currAccAmount = _v.currAccAmount;
      line.lineDescription = _v.lineDescription;
      var response = await this.bankService.updateBankLine(line);
      if (response) {
        await this.getLinesOfHeader();
        this.responseHandler(true, "Güncellendi")
        this.displayDialog = false;
        this.selectedBankLine = null;
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
    var response = await this.bankService.deleteBankLine(id);
    if (response) {
      await this.getLinesOfHeader();
      this.responseHandler(true, "Silindi")

      return;
    } else {
      this.responseHandler(false, "Silinemedi")
      return;
    }
  }
  async completeBankPayment() {
    if (window.confirm("İşlem Tamamlanacakdır. Devam edilsin mi?")) {
      var response: NebimResponse = await this.bankService.completeBankPayment(this.bankHeader.id);
      if (response) {
        this.responseHandler(true, "Tamamlandı");
        this.routerService.navigate([`/create-bank-process/${this.applicationCode}/${this.bankTransTypeCode}/0/${this.bankHeader.id}`]);
      }
    }
  }

  trackChanges(e: any) {
    this.activeIndex = e.index
  }
}

