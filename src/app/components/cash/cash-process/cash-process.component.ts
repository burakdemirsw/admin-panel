import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { descriptors } from 'chart.js/dist/core/core.defaults';
import { CustomerModel } from 'src/app/models/model/customer/customerModel';
import { CashLine, NebimResponse } from "src/app/models/model/invoice/CashLine";
import { CashHeader } from "src/app/models/model/invoice/CashHeader";
import { bsCashTransTypeDesc, bsCurrAccTypeDesc, CashAccount } from 'src/app/models/model/nebim/cdShipmentMethodDesc ';
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
import { CashService } from 'src/app/services/admin/cash.service';

@Component({
  selector: 'app-cash-process',

  templateUrl: './cash-process.component.html',
  styleUrl: './cash-process.component.css'
})
export class CashProcessComponent implements OnInit {

  constructor(
    private formBuilder: FormBuilder,
    private toasterService: ToasterService,
    private orderService: OrderService,
    private productService: ProductService,
    private warehouseService: WarehouseService,
    private generalService: GeneralService,
    private activatedRoute: ActivatedRoute,
    private headerService: HeaderService,
    private routerService: Router,
    private userService: UserService,
    private infoService: InfoService,
    private cashService: CashService
  ) { }

  officeModels: OfficeModel[] = [];
  warehouseModels: WarehouseOfficeModel[] = [];
  offices: any[] = []
  warehouses: any[] = []
  //-----------------------
  user: UserClientInfoResponse;
  applicationCode: string;
  cashTransTypeCode: number;
  cashHeader: CashHeader;
  cashLines: CashLine[] = [];
  activeIndex: number = 0;
  id: string;
  //cash-process/cash/
  async ngOnInit() {
    await this.getAllDatas();
    this.user = this.userService.getUserClientInfoResponse()
    this.headerService.updatePageTitle("Kasa Hareketi");
    this.activatedRoute.params.subscribe(async (params) => {
      if (params["cashTransTypeCode"] && params["applicationCode"]) {

        this.cashTransTypeCode = params["cashTransTypeCode"];
        this.applicationCode = params["applicationCode"];
      }

      if (params['id']) {
        this.id = params['id'];
        await this.getHeader();
        if (this.cashHeader) {
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


  bsCashTransTypeDescs: bsCashTransTypeDesc[] = []
  bsCurrAccTypeDescs: bsCurrAccTypeDesc[] = [];
  cashAccounts: CashAccount[] = [];
  async getAllDatas() {
    this.headerFormGenerator();
    this.lineFormGenerator();
    this.updatelineFormGenerator();
    await this.getWarehouseAndOffices();
    this.bsCashTransTypeDescs = await this.infoService.getCashTransTypeDesc();
    this.bsCurrAccTypeDescs = await this.infoService.getCurrAccTypeDesc();
    this.cashAccounts = await this.infoService.getCashAccounts();
  }

  headerForm: FormGroup;
  headerFormGenerator() {
    this.headerForm = this.formBuilder.group({
      officeCode: [null, [Validators.required]],
      cashTransTypeCode: [null, [Validators.required]],
      cashCurrAccCode: [null, Validators.required],
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
  selectedCashLine: CashLine;
  async openUpdateDialog(line: CashLine) {
    this.selectedCashLine = line;
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
    this.headerForm.get("officeCode").setValue(this.cashHeader.officeCode);
    this.headerForm.get("cashTransTypeCode").setValue(this.cashHeader.cashTransTypeCode);
    this.headerForm.get("cashCurrAccCode").setValue(this.cashHeader.cashCurrAccCode);
    this.headerForm.get("description").setValue(this.cashHeader.description);

  }

  setFormValueFromUser() {
    this.headerForm.get("officeCode").setValue(this.user.officeCode);
  }
  async getLinesOfHeader() {
    try {
      const response = await this.cashService.getCashLinesByHeaderId(
        this.id
      );
      this.cashLines = response;

      this.calculateTotalQty();
    } catch (error: any) {
      this.toasterService.warn(error.message);
    }
  }
  totalCount;
  calculateTotalQty() {
    //toplanan ürünler yazısı için
    let totalQty = 0;
    this.cashLines.forEach((item) => {
      totalQty += item.currAccAmount;
    });
    this.totalCount = totalQty;
  }


  async getHeader() {
    if (this.generalService.isGuid(this.id)) {
      var response = await this.cashService.getCashHeadersById(this.id);
      if (response != null) {
        this.cashHeader = response;
        this.setFormValueFromProcess();
      } else {
        this.routerService.navigate([`/create-cash-process/${this.applicationCode}/${this.cashTransTypeCode}`]);
        this.toasterService.error("İşlem Bulunamadı")
      }
    } else {
      this.routerService.navigate([`/create-cash-process/${this.applicationCode}/${this.cashTransTypeCode}`]);
    }

  }
  async updateHeader() {
    if (this.headerForm.valid) {
      if (!this.cashHeader) {
        await this.addHeader();
      }
      var _v = this.headerForm.value;
      var header: CashHeader = new CashHeader();
      header.id = this.cashHeader.id;
      header.applicationCode = this.cashHeader.applicationCode;
      header.officeCode = _v.officeCode;
      header.cashTransTypeCode = _v.cashTransTypeCode;
      header.cashCurrAccCode = _v.cashCurrAccCode;
      header.storeTypeCode = this.cashHeader.storeTypeCode;
      header.posTerminalId = this.cashHeader.posTerminalId;
      header.description = _v.description;
      header.userId = this.user.userId

      var response = await this.cashService.editCashHeader(header);
      if (response) {
        this.cashHeader = response;
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
      var header: CashHeader = new CashHeader();
      header.applicationCode = this.applicationCode;
      header.officeCode = _v.officeCode;
      header.cashTransTypeCode = _v.cashTransTypeCode;
      header.cashCurrAccCode = _v.cashCurrAccCode;
      header.storeTypeCode = 5;
      header.posTerminalId = 0;
      header.description = _v.description;
      header.userId = this.user.userId

      var response = await this.cashService.editCashHeader(header);
      if (response) {
        this.responseHandler(true, "Eklendi");
        this.routerService.navigate([`/create-cash-process/${this.applicationCode}/${this.cashTransTypeCode}/1/${response.id}`]);
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
      var line: CashLine = new CashLine();
      line.cashHeaderId = this.cashHeader.id;
      line.currAccTypeCode = _v.currAccTypeCode;
      line.currAccCode = _v.currAccCode.code;
      line.currAccAmount = _v.currAccAmount;
      line.lineDescription = _v.lineDescription;
      var response = await this.cashService.addCashLine(line);
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
      var line: CashLine = new CashLine();
      line.id = this.selectedCashLine.id;
      line.cashHeaderId = this.cashHeader.id;
      line.currAccTypeCode = _v.currAccTypeCode;
      line.currAccCode = _v.currAccCode.code;
      line.currAccAmount = _v.currAccAmount;
      line.lineDescription = _v.lineDescription;
      var response = await this.cashService.updateCashLine(line);
      if (response) {
        await this.getLinesOfHeader();
        this.responseHandler(true, "Güncellendi")
        this.displayDialog = false;
        this.selectedCashLine = null;
        return;
      } else {
        this.responseHandler(false, "Güncellenmedi")
        return;
      }
    } else {
      this.generalService.whichRowIsInvalid(this.lineForm);
    }
  }

  async completeCashPayment() {
    if (window.confirm("İşlem Tamamlanacakdır. Devam edilsin mi?")) {
      var response: NebimResponse = await this.cashService.completeCashPayment(this.cashHeader.id);
      if (response) {
        this.responseHandler(true, "Tamamlandı");
        this.routerService.navigate([`/create-cash-process/${this.applicationCode}/${this.cashTransTypeCode}/0/${this.cashHeader.id}`]);
      }
    }

  }
}
