import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CustomerModel } from 'src/app/models/model/customer/customerModel';
import { NebimResponse } from "src/app/models/model/invoice/CashLine";
import { DebitHeader } from "src/app/models/model/invoice/DebitHeader";
import { DebitLine } from "src/app/models/model/invoice/DebitLine";
import { bsCurrAccTypeDesc, cdDebitReasonDesc } from 'src/app/models/model/nebim/cdShipmentMethodDesc ';
import { UserClientInfoResponse } from 'src/app/models/model/user/userRegister_VM';
import { OfficeModel } from 'src/app/models/model/warehouse/officeModel';
import { WarehouseOfficeModel } from 'src/app/models/model/warehouse/warehouseOfficeModel';
import { CustomerService } from 'src/app/services/admin/customer.service';
import { DebitService } from 'src/app/services/admin/debit.service';
import { GeneralService } from 'src/app/services/admin/general.service';
import { HeaderService } from 'src/app/services/admin/header.service';
import { InfoService } from 'src/app/services/admin/info.service';
import { UserService } from 'src/app/services/admin/user.service';
import { WarehouseService } from 'src/app/services/admin/warehouse.service';
import { ToasterService } from 'src/app/services/ui/toaster.service';

@Component({
  selector: 'app-debit-process',
  templateUrl: './debit-process.component.html',
  styleUrl: './debit-process.component.css'
})
export class DebitProcessComponent {

  constructor(
    private formBuilder: FormBuilder,
    private toasterService: ToasterService,
    private debitService: DebitService,
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
  debitTypeCode: number;
  debitHeader: DebitHeader;
  debitLines: DebitLine[] = [];
  activeIndex: number = 0;
  id: string;
  //debit-process/debit/
  async ngOnInit() {

    this.activatedRoute.params.subscribe(async (params) => {
      if (params["debitTypeCode"] & params["currAccTypeCode"] && params["applicationCode"]) {
        this.debitTypeCode = params["debitTypeCode"];
        this.currAccTypeCode = params["currAccTypeCode"];
        this.applicationCode = params["applicationCode"];
        await this.getAllDatas();
        this.user = this.userService.getUserClientInfoResponse()
        this.headerService.updatePageTitle("Borç Girişi");
      }

      if (params['id']) {
        this.id = params['id'];
        await this.getHeader();
        if (this.debitHeader) {
          await this.getLinesOfHeader();
        }
      } else {
        this.setFormValueFromUser()
      }
      if (params["activeIndex"]) {
        this.activeIndex = Number(params["activeIndex"]);
        if (this.debitHeader.isCompleted == true) {
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


  // bsDebitTransTypeDescs: bsDebitTransTypeDesc[] = []
  bsCurrAccTypeDescs: bsCurrAccTypeDesc[] = [];
  cdDebitReasonDescs: cdDebitReasonDesc[] = []
  // debitAccounts: DebitAccount[] = [];
  async getAllDatas() {
    this.headerFormGenerator();
    this.lineFormGenerator();
    this.updatelineFormGenerator();
    await this.getWarehouseAndOffices();
    await this.getCustomerList(this.currAccTypeCode.toString());
    this.cdDebitReasonDescs = await this.infoService.getDebitReasonDesc();
    this.bsCurrAccTypeDescs = await this.infoService.getCurrAccTypeDesc();
    // this.debitAccounts = await this.infoService.getDebitAccounts();
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
      creditAmount: [null], //number
      debitAmount: [null],//number
      dueDate: [null, Validators.required], //date
      debitReasonCode: [null, Validators.required],
      lineDescription: [null],
    });

    // creditAmount değiştiğinde debitAmount'u sıfırla
    this.lineForm.get('creditAmount')?.valueChanges.subscribe((value) => {
      if (value) {
        this.lineForm.get('debitAmount')?.setValue(null); // Sıfırlama
      }
    });

    // debitAmount değiştiğinde creditAmount'u sıfırla
    this.lineForm.get('debitAmount')?.valueChanges.subscribe((value) => {
      if (value) {
        this.lineForm.get('creditAmount')?.setValue(null); // Sıfırlama
      }
    });
  }
  selectedDebitLine: DebitLine;
  async openUpdateDialog(line: DebitLine) {
    this.selectedDebitLine = line;
    this.updateLineForm.get("creditAmount").setValue(line.creditAmount);
    this.updateLineForm.get("debitAmount").setValue(line.debitAmount);
    this.updateLineForm.get("dueDate").setValue(line.dueDate);
    this.updateLineForm.get("lineDescription").setValue(line.lineDescription);
    this.updateLineForm.get("debitReasonCode").setValue(line.debitReasonCode);
    this.displayDialog = true;
  }

  async updatelineFormGenerator() {
    this.updateLineForm = this.formBuilder.group({
      creditAmount: [null],
      debitAmount: [null],
      dueDate: [null, Validators.required],
      debitReasonCode: [null, Validators.required],
      lineDescription: [null],
    });
    // creditAmount değiştiğinde debitAmount'u sıfırla
    this.updateLineForm.get('creditAmount')?.valueChanges.subscribe((value) => {
      if (value) {
        this.updateLineForm.get('debitAmount')?.setValue(null); // Sıfırlama
      }
    });

    // debitAmount değiştiğinde creditAmount'u sıfırla
    this.updateLineForm.get('debitAmount')?.valueChanges.subscribe((value) => {
      if (value) {
        this.updateLineForm.get('creditAmount')?.setValue(null); // Sıfırlama
      }
    });
    // // Subscribe to changes on currAccTypeCode
    // this.updateLineForm.get('currAccTypeCode')?.valueChanges.subscribe(async (value) => {
    //   await this.getCustomerList(value);
    // });
  }

  setFormValueFromProcess() {
    this.headerForm.get("officeCode").setValue(this.debitHeader.officeCode);
    var c = this.customerList2.find(c => c.code == this.debitHeader.currAccCode)
    this.headerForm.get("currAccCode").setValue(c);
    this.headerForm.get("description").setValue(this.debitHeader.description);

  }

  setFormValueFromUser() {
    this.headerForm.get("officeCode").setValue(this.user.officeCode);
  }
  async getLinesOfHeader() {
    try {
      const response = await this.debitService.getDebitLinesByHeaderId(
        this.id
      );
      this.debitLines = response;

      this.calculateTotalQty();
    } catch (error: any) {
      this.toasterService.warn(error.message);
    }
  }
  totalCount;
  calculateTotalQty() {
    // //toplanan ürünler yazısı için
    // let totalQty = 0;
    // this.debitLines.forEach((item) => {
    //   totalQty += item.currAccAmount;
    // });
    // this.totalCount = totalQty;
  }


  async getHeader() {
    if (this.generalService.isGuid(this.id)) {
      var response = await this.debitService.getDebitHeaderById(this.id);
      if (response != null) {
        this.debitHeader = response;

        this.setFormValueFromProcess();
      } else {
        this.routerService.navigate([`/create-debit-process/${this.applicationCode}/${this.currAccTypeCode}/${this.debitTypeCode}/0`]);
        this.toasterService.error("İşlem Bulunamadı")
      }
    } else {
      this.routerService.navigate([`/create-debit-process/${this.applicationCode}/${this.currAccTypeCode}/${this.debitTypeCode}/0`]);
    }

  }
  async updateHeader() {
    if (this.headerForm.valid) {
      if (!this.debitHeader) {
        await this.addHeader();
      }
      var _v = this.headerForm.value;
      var header: DebitHeader = new DebitHeader();
      header.id = this.debitHeader.id;
      header.applicationCode = this.debitHeader.applicationCode;
      header.debitTypeCode = this.debitHeader.debitTypeCode;
      header.officeCode = _v.officeCode;
      header.currAccTypeCode = this.currAccTypeCode;
      header.currAccCode = _v.currAccCode.code;
      header.storeTypeCode = this.debitHeader.storeTypeCode;
      header.description = _v.description;
      header.userId = this.user.userId

      var response = await this.debitService.editDebitHeader(header);
      if (response) {
        this.debitHeader = response;
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
      var header: DebitHeader = new DebitHeader();
      header.applicationCode = this.applicationCode;
      header.debitTypeCode = this.debitTypeCode;

      header.officeCode = _v.officeCode;
      header.currAccTypeCode = this.currAccTypeCode;
      header.currAccCode = _v.currAccCode.code;
      header.storeTypeCode = 5;
      header.description = _v.description;
      header.userId = this.user.userId

      var response = await this.debitService.editDebitHeader(header);
      if (response) {
        this.responseHandler(true, "Eklendi");
        this.routerService.navigate([`/create-debit-process/${this.applicationCode}/${this.currAccTypeCode}/${this.debitTypeCode}/0/${response.id}`]);
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
      var line: DebitLine = new DebitLine();
      line.debitHeaderId = this.debitHeader.id;
      line.creditAmount = _v.creditAmount;
      line.debitAmount = _v.debitAmount;
      line.dueDate = _v.dueDate;
      line.lineDescription = _v.lineDescription;
      line.debitReasonCode = _v.debitReasonCode
      var response = await this.debitService.addDebitLine(line);
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
      var line: DebitLine = new DebitLine();
      line.id = this.selectedDebitLine.id;
      line.debitHeaderId = this.debitHeader.id;
      line.creditAmount = _v.creditAmount;
      line.debitAmount = _v.debitAmount;
      line.dueDate = _v.dueDate;
      line.lineDescription = _v.lineDescription;
      line.debitReasonCode = _v.debitReasonCode;
      var response = await this.debitService.updateDebitLine(line);
      if (response) {
        await this.getLinesOfHeader();
        this.responseHandler(true, "Güncellendi")
        this.displayDialog = false;
        this.selectedDebitLine = null;
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
    var response = await this.debitService.deleteDebitLine(id);
    if (response) {
      await this.getLinesOfHeader();
      this.responseHandler(true, "Silindi")

      return;
    } else {
      this.responseHandler(false, "Silinemedi")
      return;
    }
  }
  async completeDebitPayment() {
    if (window.confirm("İşlem Tamamlanacakdır. Devam edilsin mi?")) {
      var response: NebimResponse = await this.debitService.completeDebitPayment(this.debitHeader.id);
      if (response) {
        this.responseHandler(true, "Tamamlandı");
        this.routerService.navigate([`/create-debit-process/${this.applicationCode}/${this.currAccTypeCode}/${this.debitTypeCode}/0/${this.debitHeader.id}`]);
      }
    }

  }

  getDebitReasonDesc(code: string) {
    return this.cdDebitReasonDescs.find(d => d.debitReasonCode == code).debitReasonDescription

  }
}
