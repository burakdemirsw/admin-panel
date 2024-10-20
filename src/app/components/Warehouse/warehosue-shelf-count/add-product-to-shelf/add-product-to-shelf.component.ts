import { HttpClient } from "@angular/common/http";
import { Component, Input } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { Exception } from "@zxing/library";
import { OrderDetail } from "src/app/components/cargo/create-cargo/models/models";
import { ClientUrls } from "src/app/models/const/ClientUrls";
import { CreatePurchaseInvoice } from "src/app/models/model/invoice/CreatePurchaseInvoice.1";
import { OrderBillingListModel } from "src/app/models/model/order/orderBillingListModel";
import { ProductOfOrder } from "src/app/models/model/order/productOfOrders";
import { CountProduct3 } from "src/app/models/model/product/countProduct";
import { UserClientInfoResponse } from "src/app/models/model/user/userRegister_VM";
import { AvailableShelf } from "src/app/models/model/warehouse/availableShelf";
import { CompleteCountOperation_CM } from "src/app/models/model/warehouse/completeCount_CM";
import { WarehouseItem } from "src/app/models/model/warehouse/warehouseItem";
import { WarehouseOfficeModel_V1 } from "src/app/models/model/warehouse/warehouseOfficeModel";
import { InnerHeader, InnerLine } from "src/app/models/model/warehouse/ztmsg_CountedProduct";
import { GeneralService } from "src/app/services/admin/general.service";
import { HeaderService } from "src/app/services/admin/header.service";
import { OrderService } from "src/app/services/admin/order.service";
import { ProductService } from "src/app/services/admin/product.service";
import { UserService } from "src/app/services/admin/user.service";
import { WarehouseService } from "src/app/services/admin/warehouse.service";
import { ToasterService } from "src/app/services/ui/toaster.service";
declare var window: any;
@Component({
  selector: "app-add-product-to-shelf",

  templateUrl: "./add-product-to-shelf.component.html",
  styleUrl: "./add-product-to-shelf.component.css",
})
export class AddProductToShelfComponent {
  //#region params
  activeIndex = 0;
  @Input() infoProducts: CreatePurchaseInvoice[] = [];
  [x: string]: any;

  innerProcessCode: string;
  productsToCollect: ProductOfOrder[];
  collectedProducts: ProductOfOrder[] = [];
  checkForm: FormGroup;
  _checkForm: FormGroup;
  transferForm: FormGroup;
  currentOrderNo: string;
  isCompleted: boolean;
  isReturn: boolean;
  formModal: any;
  orderNo: string = "";
  warehouseModels: WarehouseOfficeModel_V1[] = [];
  currentQrCode: string = "";
  orderBillingModel: OrderBillingListModel;
  shelfNumbers: string = "RAFLAR:";
  location = location.href;
  photoUrl: string = ClientUrls.photoUrl;
  offices: any[] = [];
  warehouses: any[] = [];
  _warehouses: any[] = [];
  _offices: any[] = [];
  shelves: AvailableShelf[] = [];
  shelves2: AvailableShelf[] = [];
  totalCount: number = 0;
  isFirstBarcode: boolean = false;
  currentbarcode: string;
  controlMessage = "";
  tableHeaders: string[] = [
    "Fotoğraf",
    "Raf",
    "Ürün Kodu",
    "Miktar",
    "Parti",
    "Barkod",
    "Müşteri Kodu",
    "Depo",
    "Ofis",
  ];
  _tableHeaders: string[] = [
    "Ürün Kodu",
    "Barkod",
    "Raf",
    "Miktar",
    "İşlem",
  ];

  _tableHeaders2: string[] = ["Ürün Kodu", "Durum"];
  //#endregion

  constructor(
    private formBuilder: FormBuilder,
    private toasterService: ToasterService,
    private productService: ProductService,
    private generalService: GeneralService,
    private warehouseService: WarehouseService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private headerService: HeaderService,
    private userService: UserService,
    private httpClient: HttpClient,
    private orderService: OrderService
  ) { }
  isShelfBased: boolean
  userInfo: UserClientInfoResponse;
  async ngOnInit() {
    this.activatedRoute.queryParamMap.subscribe(async (queries) => {
      if (queries.get("isShelfBased")) {
        this.isShelfBased = false;
        this.toasterService.info("Bu panelde yapılan işlemler raf harektlerine yansımayacaktır");

      } else {
        this.isShelfBased = true;
      }

    });
    this.userInfo = this.userService.getUserClientInfoResponse();

    this.activatedRoute.params.subscribe((params) => {
      if (params["id"]) {
        this.currentOrderNo = params["id"];
      }
      if (params["isCompleted"]) {
        this.isCompleted = params["isCompleted"] == "true" ? true : false;
        console.log(this.isCompleted);
      }

      if (params["isReturn"]) {
        this.isReturn = params["isReturn"] == "true" ? true : false;
        console.log(this.isReturn);
      }
      if (params["innerProcessCode"]) {
        this.innerProcessCode = params["innerProcessCode"];
      }
      this.activatedRoute.queryParamMap.subscribe(async (queries) => {
        if (queries.get("isReturn") == 'true') {
          this.isReturn = true

        }
      });
    });


    this.formGenerator();
    this.formGenerator2();
    this.formGenerator3();


    if (this.innerProcessCode == "CI") {
      await this.getWarehouseAndOffices();
      this.headerService.updatePageTitle("Rafa Ürün Ekle");
    } else if (this.innerProcessCode == "CO") {
      await this.getWarehouseAndOffices();
      this.headerService.updatePageTitle("Raftan Ürün Çıkar");
    } else if (this.innerProcessCode == "C") {
      await this.getWarehouseAndOffices();
      this.headerService.updatePageTitle("Sayım");
    } else if (this.innerProcessCode == "WT") {
      await this.getWarehouseAndOffices_2()
      this.headerService.updatePageTitle("Mağazanın Depoları Arası Transfer");
    }
    else if (this.innerProcessCode == "WT-O") {
      await this.getWarehouseAndOffices_2()
      this.headerService.updatePageTitle("Ofis Depoları Arası Transfer");
    }
    else if (this.innerProcessCode == "S") {
      await this.getWarehouseAndOffices_2();
    } else if (this.innerProcessCode == "ST") {
      this.checkForm.get('toShelfNo').setValidators([Validators.required]);
      this.checkForm.get('toShelfNo').updateValueAndValidity(); // Zorunlu durumu güncelle
      await this.getWarehouseAndOffices();
      this.headerService.updatePageTitle("Raflar Arası Transfer");
    } else if (this.innerProcessCode == "ES") {
      this.headerService.updatePageTitle("İhracat Detay");
      await this.getWarehouseAndOffices();
    } else if (this.innerProcessCode == "WS" || this.innerProcessCode == "R") {
      this.headerService.updatePageTitle("Sipariş Faturalaştırma");
      await this.getWarehouseAndOffices();
    }


    if (this.innerProcessCode != "WS" && this.innerProcessCode != "R") {
      if (this.currentOrderNo) {
        await this.getInnerHeaderById(this.currentOrderNo)
      }
    } else {
      if (this.currentOrderNo) {
        await this.getInnerHeaderById(this.currentOrderNo)
      }

    }

    this.activatedRoute.queryParamMap.subscribe(async (queries) => {
      if (queries.get("orderNumber")) {
        try {
          var orderNumber = queries.get("orderNumber");
          this.toasterService.info("Sipariş Detayları Alınıyor")
          var orderDetail: OrderDetail = await this.orderService.getOrderDetail(orderNumber);
          if (orderDetail == null) {
            throw new Exception('Sipariş Detayı Alınamadı')
          }
          var wscode = orderDetail.warehouseCode;
          var officeCode = orderDetail.officeCode

          this._checkForm.get('officeCode').setValue(officeCode);
          this._checkForm.get('warehouseCode').setValue(this.warehouses.find(w => w.code == wscode));
          this._checkForm.get('description').setValue(orderNumber);
          console.log(this._checkForm.value);
          if (this._checkForm.valid) {
            this.updateInnerHeader(this._checkForm.value)
          } else {
            this.toasterService.error("Form Geçerli Değil");
          }
        } catch (error) {
          this.toasterService.error("Sipariş Detayları Alınırken Hata Meydana Geldi")
        }
      }

    });
    this.activatedRoute.queryParamMap.subscribe((queries) => {
      if (this.innerProcessCode == "S") {
        var isReturn = queries.get("isReturn") == 'true' ? true : false;
        if (isReturn || this.innerHeader?.isReturn) {
          this.transferForm.get('isReturn').setValue(true);
          this.headerService.updatePageTitle("Merkeze İade");
          if (queries.get("invoiceNumber")) {
            try {
              this.toasterService.info("İhracat Detayları Alınıyor")
              var wscode = queries.get("warehouseCode")
              var invcode = queries.get("invoiceNumber")
              var officeCode = this.warehouses.find(w => w.code == wscode).officeCode
              var towsCode = "1-0-5"
              var toOfficeCode = this._warehouses.find(w => w.code == towsCode).officeCode

              this.transferForm.get('officeCode').setValue(officeCode);
              this.transferForm.get('warehouseCode').setValue(this.warehouses.find(w => w.code == queries.get("warehouseCode")));
              this.transferForm.get('toOfficeCode').setValue(toOfficeCode);
              this.transferForm.get('toWarehouseCode').setValue(this._warehouses.find(w => w.code == towsCode));
              this.transferForm.get('description').setValue(queries.get("invoiceNumber") + " Numaralı lu Faturaya İstinaden Merkeze İade İşlemi");

              if (this.transferForm.valid) {
                this.updateInnerHeader(this.transferForm.value)
              } else {
                this.toasterService.error("Form Geçerli Değil");

              }

            } catch (error) {
              this.toasterService.error("İhracat Detayları Alınırken Hata Meydana Geldi")
            }

          }

        } else {
          this.transferForm.get('isReturn').setValue(false);
          this.headerService.updatePageTitle("Mağaza Transfer İrsaliyesi");
        }
      }
    });
  }

  innerHeader: InnerHeader;
  async getInnerHeaderById(id: string) {
    var response = await this.warehouseService.getInnerHeaderById(id);
    if (response) {
      this.innerHeader = response;
      this.activeIndex = 1
      this.setInnerHeaderForm();
      if (this.innerHeader.innerNumber) {
        this._checkForm.get('officeCode')?.disable();
        this._checkForm.get('warehouseCode')?.disable();
        this._checkForm.get('description')?.disable();
      }

      if (this.innerHeader.isShelfBased == false) {
        this.isShelfBased = false;
        this.toasterService.info("Bu panelde yapılan işlemler raf harektlerine yansımayacaktır");
        this.formGenerator();
      } else {
        this.isShelfBased = true;
      }
      await this.getProductOfCount(this.currentOrderNo);
    } else {
      this.toasterService.error("Kayıt bulunamadı");
      this.router.navigate([
        "add-product-to-shelf",
        this.innerProcessCode,
        "false",
      ]);

    }
  }

  async getInnerHeaderByDescription(id: string) {
    var response = await this.warehouseService.getInnerHeaderByDescription(id);
    if (response) {
      this.innerHeader = response;
      this.activeIndex = 1
      this.setInnerHeaderForm();
      if (this.innerHeader.innerNumber) {
        this._checkForm.get('officeCode')?.disable();
        this._checkForm.get('warehouseCode')?.disable();
        this._checkForm.get('description')?.disable();
      }
      await this.getProductOfCount(this.currentOrderNo);
    } else {
      this.toasterService.error("Kayıt bulunamadı");
      this.router.navigate([
        "add-product-to-shelf",
        this.innerProcessCode,
        "false",
      ]);

    }
  }
  async deleteInnerHeader() {

  }

  async updateInnerHeader(values: any) {


    if (!this.innerHeader) {
      await this.addInnerHeader(values);
      return;
    }
    var status: boolean;
    if (this.innerProcessCode == 'CI'
      || this.innerProcessCode == 'CO'
      || this.innerProcessCode == 'C'
      || this.innerProcessCode == 'ST'
      || this.innerProcessCode == 'WS'
      || this.innerProcessCode == 'R'
    ) {
      status = true;
    }


    var request: InnerHeader = new InnerHeader();
    request.id = this.innerHeader.id;
    request.officeCode = values.officeCode;
    request.warehouseCode = values.warehouseCode.code;
    request.description = values.description;
    request.applicationCode = this.innerHeader.applicationCode;
    request.innerNumber = this.innerHeader.innerNumber;
    request.innerProcessType = this.innerHeader.innerProcessType;
    request.isCompleted = this.innerHeader.isCompleted;
    request.toOfficeCode = status == true ? null : values.toOfficeCode;
    request.toWarehouseCode = status == true ? null : values.toWarehouseCode.code;
    request.isReturn = status == true ? null : values.isReturn;
    request.userId = this.userInfo.userId;
    request.innerProcessCode = this.innerProcessCode;
    request.isTransferApproved = false;

    var response = await this.warehouseService.updateInnerHeader(request);
    if (response) {
      this.toasterService.success("İşlem Başarılı");
      this.router.navigate([
        "add-product-to-shelf",
        this.innerProcessCode,
        "false",
        response.id,
      ]);

    } else {
      this.toasterService.error("İşlem Başarısız");
    }

  }

  async addInnerHeader(values: any) {

    var status: boolean;
    if (this.innerProcessCode == 'CI'
      || this.innerProcessCode == 'CO'
      || this.innerProcessCode == 'C'
      || this.innerProcessCode == 'ST'
      || this.innerProcessCode == 'WS'
      || this.innerProcessCode == 'R'
    ) {
      status = true;
    }


    var request: InnerHeader = new InnerHeader();
    request.officeCode = values.officeCode;
    request.warehouseCode = values.warehouseCode.code;
    request.description = values.description;
    request.applicationCode = 'Inner';
    request.innerNumber = null;
    request.innerProcessType = this.innerProcessCode == 'CI' ? 2 : 3;
    request.isCompleted = false;
    request.toOfficeCode = status == true ? null : values.toOfficeCode;
    request.toWarehouseCode = status == true ? null : values.toWarehouseCode.code;
    request.isReturn = status == true ? false : values.isReturn;
    request.userId = this.userInfo.userId;
    request.innerProcessCode = this.innerProcessCode;
    request.isShelfBased = this.isShelfBased;
    request.isTransferApproved = false;
    var response = await this.warehouseService.addInnerHeader(request);
    if (response) {
      this.toasterService.success("İşlem Başarılı");

      if (this.innerProcessCode == 'WS'
        || this.innerProcessCode == 'R') {

        this.router.navigate([
          "add-product-to-shelf",
          this.innerProcessCode,
          "false",
          response.id,
        ], {
          queryParams: { orderNumber: response.description }, // Yeniden yükleme gibi bir etkisi olur
        });

      } else {
        this.router.navigate([
          "add-product-to-shelf",
          this.innerProcessCode,
          "false",
          response.isReturn,
          response.isShelfBased,
          response.id,
        ]);
      }
    } else {
      this.toasterService.error("İşlem Başarısız");
    }
  }

  async setInnerHeaderForm() {

    if (this.innerProcessCode == 'CI'
      || this.innerProcessCode == 'CO'
      || this.innerProcessCode == 'C'
      || this.innerProcessCode == 'ST'
      || this.innerProcessCode == 'WS'
      || this.innerProcessCode == 'R'
    ) {
      this._checkForm.get('officeCode').setValue(this.innerHeader.officeCode);
      this._checkForm.get('warehouseCode').setValue(this.warehouses.find(w => w.code == this.innerHeader.warehouseCode));
      this._checkForm.get('description').setValue(this.innerHeader.description);
      this._checkForm.get('innerNumber').setValue(this.innerHeader.innerNumber);
      this._checkForm.disable()
    } else if (this.innerProcessCode == 'WT' || this.innerProcessCode == 'WT-O'
      || this.innerProcessCode == 'S') {
      this.transferForm.get('officeCode').setValue(this.innerHeader.officeCode);
      this.transferForm.get('toOfficeCode').setValue(this.innerHeader.toOfficeCode);

      console.log(this.warehouses)
      console.log(this._warehouses)

      this.transferForm.get('warehouseCode').setValue(this.warehouses.find(w => w.code == this.innerHeader.warehouseCode));
      this.transferForm.get('toWarehouseCode').setValue(this._warehouses.find(w => w.code == this.innerHeader.toWarehouseCode));
      this.transferForm.get('description').setValue(this.innerHeader.description);
      this.transferForm.get('innerNumber').setValue(this.innerHeader.innerNumber);
      this.transferForm.get('isReturn').setValue(this.innerHeader.isReturn);
      this.transferForm.disable()
    }



  }
  async getWarehouseAndOffices() {
    var response = await this.warehouseService.getWarehouseAndOffices_V1();
    this.warehouseModels = response;

    const officeSet = new Set();
    const warehouseSet = new Set();

    this.warehouseModels.forEach((model) => {
      officeSet.add(model.officeCode);
      warehouseSet.add(model.warehouseCode);
    });

    this.offices = Array.from(officeSet);
    this.warehouses = Array.from(warehouseSet).map((code) => {
      const model = this.warehouseModels.find(
        (warehouse) => warehouse.warehouseCode === code
      );
      return {
        code: model.warehouseCode,
        name: model.warehouseDescription,
      };
    });
  }
  async getWarehouseAndOffices_2() {
    var response = await this.warehouseService.getWarehouseAndOffices_V1();
    this.warehouseModels = response;

    const officeSet = new Set();
    const warehouseSet = new Set();
    const isOfficeWarehouse = new Set();

    const _officeSet = new Set();
    const _warehouseSet = new Set();
    const _isOfficeWarehouse = new Set();


    var isReturn: boolean;
    if (this.innerHeader) {
      isReturn = this.innerHeader.isReturn;
    } else {
      this.activatedRoute.queryParamMap.subscribe((queries) => {
        if (queries.get("isReturn") == 'true') {
          isReturn = true;
        } else {
          isReturn = false
        }
      });
    }

    try {
      if (location.href.includes('/WT/')) {
        // this.pageStatus = 'Mağaza Depoları Arası Transfer';
        // this.currentDataType = '-1';
        var nw = this.warehouseModels.filter(p => p.isOfficeWarehouse == false);

        nw.forEach(model => {
          officeSet.add(model.officeCode);
          warehouseSet.add(model.warehouseCode);
          isOfficeWarehouse.add(model.isOfficeWarehouse);
        });

        console.log(this.warehouseModels);
        this.offices = Array.from(officeSet);

        this.warehouses = Array.from(warehouseSet).map(code => {
          const model = nw.find(warehouse => warehouse.warehouseCode === code);
          if (!model) {
            return null;  // Eşleşme yoksa null döndür
          }
          return {
            code: model.warehouseCode,
            name: model.warehouseDescription,
            officeCode: model.officeCode,
            isOfficeWarehouse: model.isOfficeWarehouse
          };
        }).filter(warehouse => warehouse !== null);  // null olanları filtrele

        var nw_1 = this.warehouseModels.filter(p => p.isOfficeWarehouse == false);

        nw_1.forEach(model => {
          _officeSet.add(model.officeCode);
          _warehouseSet.add(model.warehouseCode);
          _isOfficeWarehouse.add(model.isOfficeWarehouse);
        });

        console.log(this.warehouseModels);
        this._offices = Array.from(_officeSet);


        this._warehouses = Array.from(warehouseSet).map(code => {
          const model = nw_1.find(warehouse => warehouse.warehouseCode === code);
          if (!model) {
            return null;  // Eşleşme yoksa null döndür
          }
          return {
            code: model.warehouseCode,
            name: model.warehouseDescription,
            officeCode: model.officeCode,
            isOfficeWarehouse: model.isOfficeWarehouse
          };
        }).filter(warehouse => warehouse !== null);  // null olanları filtrele

      }

      else if (location.href.includes('/WT-O/')) {
        // this.pageStatus = 'Mağaza Depoları Arası Transfer';
        // this.currentDataType = '-1';
        var nw = this.warehouseModels.filter(p => p.isOfficeWarehouse == true);

        nw.forEach(model => {
          officeSet.add(model.officeCode);
          warehouseSet.add(model.warehouseCode);
          isOfficeWarehouse.add(model.isOfficeWarehouse);
        });

        console.log(this.warehouseModels);
        this.offices = Array.from(officeSet);

        this.warehouses = Array.from(warehouseSet).map(code => {
          const model = nw.find(warehouse => warehouse.warehouseCode === code);
          if (!model) {
            return null;  // Eşleşme yoksa null döndür
          }
          return {
            code: model.warehouseCode,
            name: model.warehouseDescription,
            officeCode: model.officeCode,
            isOfficeWarehouse: model.isOfficeWarehouse
          };
        }).filter(warehouse => warehouse !== null);  // null olanları filtrele

        var nw_1 = this.warehouseModels.filter(p => p.isOfficeWarehouse == true);

        nw_1.forEach(model => {
          _officeSet.add(model.officeCode);
          _warehouseSet.add(model.warehouseCode);
          _isOfficeWarehouse.add(model.isOfficeWarehouse);
        });

        console.log(this.warehouseModels);
        this._offices = Array.from(_officeSet);


        this._warehouses = Array.from(warehouseSet).map(code => {
          const model = nw_1.find(warehouse => warehouse.warehouseCode === code);
          if (!model) {
            return null;  // Eşleşme yoksa null döndür
          }
          return {
            code: model.warehouseCode,
            name: model.warehouseDescription,
            officeCode: model.officeCode,
            isOfficeWarehouse: model.isOfficeWarehouse
          };
        }).filter(warehouse => warehouse !== null);  // null olanları filtrele
      }
      else if (location.href.includes('/S/') && this.isReturn) {
        // this.pageStatus = 'Merkeze İade';
        // this.currentDataType = '-1';

        var nw = this.warehouseModels.filter(p => p.isOfficeWarehouse == false);

        nw.forEach(model => {
          officeSet.add(model.officeCode);
          warehouseSet.add(model.warehouseCode);
          isOfficeWarehouse.add(model.isOfficeWarehouse);
        });

        this.offices = Array.from(officeSet);

        this.warehouses = Array.from(warehouseSet).map(code => {
          const model = nw.find(warehouse => warehouse.warehouseCode === code);
          if (!model) {
            return null;  // Eşleşme yoksa null döndür
          }
          return {
            code: model.warehouseCode,
            name: model.warehouseDescription,
            officeCode: model.officeCode,
            isOfficeWarehouse: model.isOfficeWarehouse
          };
        }).filter(warehouse => warehouse !== null);  // null olanları filtrele

        //---------------------------------------------------------------
        var nw_1 = this.warehouseModels.filter(p => p.isOfficeWarehouse == true);
        nw_1.forEach(model => {
          _officeSet.add(model.officeCode);
          _warehouseSet.add(model.warehouseCode);
          _isOfficeWarehouse.add(model.isOfficeWarehouse);
        });


        this._offices = Array.from(_officeSet);
        this._warehouses = Array.from(_warehouseSet).map(code => {
          const model = nw_1.find(warehouse => warehouse.warehouseCode === code);
          if (!model) {
            return null;  // Eşleşme yoksa null döndür
          }
          return {
            code: model.warehouseCode,
            name: model.warehouseDescription,
            officeCode: model.officeCode,
            isOfficeWarehouse: model.isOfficeWarehouse
          };
        }).filter(warehouse => warehouse !== null);  // null olanları filtrele

      }
      else {
        // this.pageStatus = 'Mağaza Transfer İrsaliyesi';
        // this.currentDataType = '-1';

        var nw = this.warehouseModels.filter(p => p.isOfficeWarehouse == true);
        nw.forEach(model => {
          officeSet.add(model.officeCode);
          warehouseSet.add(model.warehouseCode);
          isOfficeWarehouse.add(model.isOfficeWarehouse);
        });

        this.offices = Array.from(officeSet);

        this.warehouses = Array.from(warehouseSet).map(code => {
          const model = nw.find(warehouse => warehouse.warehouseCode === code);
          if (!model) {
            return null;  // Eşleşme yoksa null döndür
          }
          return {
            code: model.warehouseCode,
            name: model.warehouseDescription,
            isOfficeWarehouse: model.isOfficeWarehouse
          };
        }).filter(warehouse => warehouse !== null);  // null olanları filtrele

        var nw_1 = this.warehouseModels.filter(p => p.isOfficeWarehouse == false);

        nw_1.forEach(model => {
          _officeSet.add(model.officeCode);
          _warehouseSet.add(model.warehouseCode);
          _isOfficeWarehouse.add(model.isOfficeWarehouse);
        });


        this._offices = Array.from(_officeSet);

        this._warehouses = Array.from(warehouseSet).map(code => {
          const model = nw_1.find(warehouse => warehouse.warehouseCode === code);
          if (!model) {
            return null;  // Eşleşme yoksa null döndür
          }
          return {
            code: model.warehouseCode,
            name: model.warehouseDescription,
            isOfficeWarehouse: model.isOfficeWarehouse
          };
        }).filter(warehouse => warehouse !== null);  // null olanları filtrele


      }
    } catch (error) {
      this.toasterService.error("Ofis ve Depolar Alınırken Hata Meydana Geldi")
    }


  }

  goDown2(desc: string) {
    // packageNo'ya eşleşen ProductOfOrder'ı bulun
    const matchinShelf = this.shelves.find(
      (shelve) => shelve.description === desc
    );

    if (matchinShelf) {
      // Ürünü diziden çıkarın
      const index = this.shelves.indexOf(matchinShelf);
      if (index !== -1) {
        this.shelves2 = [];
        if (this.shelves.length - 1 >= index + 1) {
          this.shelves2.push(this.shelves[index + 1]);
        } else {
          this.shelves2.push(this.shelves[0]);
        }
      }
    }
  }

  focusNextInput(nextInputId: string) {
    const nextInput = document.getElementById(nextInputId) as HTMLInputElement;
    if (nextInput) {
      nextInput.focus();
    }
  }

  formGenerator() {
    if (!this.isShelfBased) {
      this.checkForm = this.formBuilder.group({
        barcode: [null, Validators.required],
        quantity: [null, Validators.required],
        toShelfNo: [null],
        batchCode: [null],
      });
    } else {
      this.checkForm = this.formBuilder.group({
        barcode: [null, Validators.required],
        shelfNo: [null, Validators.required],
        quantity: [null, Validators.required],
        toShelfNo: [null],
        batchCode: [null],
      });
    }

  }

  formGenerator2() {
    this._checkForm = this.formBuilder.group({
      officeCode: [null, Validators.required],
      warehouseCode: [null, Validators.required],
      description: [null],
      innerNumber: [{ value: null, disabled: true }], // innerNumber devre dışı
    });
  }

  formGenerator3() {
    this.transferForm = this.formBuilder.group({
      officeCode: [null, Validators.required],
      toOfficeCode: [null, Validators.required],
      warehouseCode: [null, Validators.required],
      toWarehouseCode: [null, Validators.required],
      description: [null], // innerNumber devre dışı
      innerNumber: [{ value: null, disabled: true }], // innerNumber devre dışı
      isReturn: [false]
    });
    var isReturn: boolean;
    if (this.innerHeader) {
      isReturn = this.innerHeader.isReturn;
    } else {
      this.activatedRoute.queryParamMap.subscribe((queries) => {
        if (queries.get("isReturn") == 'true') {
          isReturn = true;
        } else {
          isReturn = false
        }
      });
    }

    if (location.href.includes('/WT/')) {
      // this.pageStatus = 'Mağaza Depoları Arası Transfer';
      // this.currentDataType = '-1';

      this.transferForm.get('officeCode')?.valueChanges.subscribe(value => {
        if (value) {
          // Ofis seçildiyse warehouse alanlarını etkinleş  tir
          this.transferForm.get('warehouseCode').enable();
          this.transferForm.get('toWarehouseCode').enable();

          // Seçilen ofise göre warehouse'ları filtrele
          const filteredWarehouses = this.warehouseModels.filter(w => w.officeCode === value && w.isOfficeWarehouse === false);

          // warehouseSet'i güncelle
          const warehouseSet = new Set(filteredWarehouses.map(w => w.warehouseCode));

          // warehouse'ları mapleyerek güncelle
          this.warehouses = Array.from(warehouseSet).map(code => {
            const model = filteredWarehouses.find(warehouse => warehouse.warehouseCode === code);
            if (!model) {
              return null;  // Eşleşme yoksa null döndür
            }
            return {
              code: model.warehouseCode,
              name: model.warehouseDescription,
              officeCode: model.officeCode,
              isOfficeWarehouse: model.isOfficeWarehouse
            };
          }).filter(warehouse => warehouse !== null);  // null olanları filtrele

          // Office değiştiğinde toOffice Code otomatik olarak aynı olacak
          this.transferForm.get('toOfficeCode').setValue(value);
        } else if (value == null) {
          // Ofis seçilmediyse warehouse alanlarını devre dışı bırak
          this.transferForm.get('warehouseCode').disable();
          this.transferForm.get('toWarehouseCode').disable();
        }
      });

      this.transferForm.get('toOfficeCode')?.valueChanges.subscribe(value => {
        if (value) {
          // Ofis seçildiyse warehouse alanlarını etkinleştir
          this.transferForm.get('warehouseCode').enable();
          this.transferForm.get('toWarehouseCode').enable();

          if (this.transferForm.get('officeCode').value != value) {
            this.toasterService.error("Ofisler Aynı Olmalıdır");
            setTimeout(() => {
              this.transferForm.get('toOfficeCode').setValue(null);
            }, 1);

          }


          // Seçilen ofise göre warehouse'ları filtrele
          const filteredWarehouses = this.warehouseModels.filter(w => w.officeCode === value && w.isOfficeWarehouse === false);

          // warehouseSet'i güncelle
          const warehouseSet = new Set(filteredWarehouses.map(w => w.warehouseCode));

          // warehouse'ları mapleyerek güncelle
          this._warehouses = Array.from(warehouseSet).map(code => {
            const model = filteredWarehouses.find(warehouse => warehouse.warehouseCode === code);
            if (!model) {
              return null;  // Eşleşme yoksa null döndür
            }
            return {
              code: model.warehouseCode,
              name: model.warehouseDescription,
              officeCode: model.officeCode,
              isOfficeWarehouse: model.isOfficeWarehouse
            };
          }).filter(warehouse => warehouse !== null);  // null olanları filtrele

          // Office değiştiğinde office alanı ile aynı olacak
          this.transferForm.get('officeCode').setValue(value);



        } else if (value == null) {
          // Ofis seçilmediyse warehouse alanlarını devre dışı bırak
          this.transferForm.get('warehouseCode').disable();
          this.transferForm.get('toWarehouseCode').disable();
        }
      });

    }
    else if (location.href.includes('/WT-O/')) {
      // this.pageStatus = 'Mağaza Depoları Arası Transfer';
      // this.currentDataType = '-1';

      this.transferForm.get('officeCode')?.valueChanges.subscribe(value => {
        if (value) {
          // Ofis seçildiyse warehouse alanlarını etkinleş  tir
          this.transferForm.get('warehouseCode').enable();
          this.transferForm.get('toWarehouseCode').enable();

          // Seçilen ofise göre warehouse'ları filtrele
          const filteredWarehouses = this.warehouseModels.filter(w => w.officeCode === value && w.isOfficeWarehouse === true);

          // warehouseSet'i güncelle
          const warehouseSet = new Set(filteredWarehouses.map(w => w.warehouseCode));

          // warehouse'ları mapleyerek güncelle
          this.warehouses = Array.from(warehouseSet).map(code => {
            const model = filteredWarehouses.find(warehouse => warehouse.warehouseCode === code);
            if (!model) {
              return null;  // Eşleşme yoksa null döndür
            }
            return {
              code: model.warehouseCode,
              name: model.warehouseDescription,
              officeCode: model.officeCode,
              isOfficeWarehouse: model.isOfficeWarehouse
            };
          }).filter(warehouse => warehouse !== null);  // null olanları filtrele

          // Office değiştiğinde toOffice Code otomatik olarak aynı olacak
          // this.transferForm.get('toOfficeCode').setValue(value);
        } else if (value == null) {
          // Ofis seçilmediyse warehouse alanlarını devre dışı bırak
          this.transferForm.get('warehouseCode').disable();
          this.transferForm.get('toWarehouseCode').disable();
        }
      });

      this.transferForm.get('toOfficeCode')?.valueChanges.subscribe(value => {
        if (value) {
          // Ofis seçildiyse warehouse alanlarını etkinleştir
          this.transferForm.get('warehouseCode').enable();
          this.transferForm.get('toWarehouseCode').enable();

          // if (this.transferForm.get('officeCode').value == value) {
          //   this.toasterService.error("Ofisler Farklı Olmalıdır");
          //   setTimeout(() => {
          //     this.transferForm.get('toOfficeCode').setValue(null);
          //   }, 1);

          // }


          // Seçilen ofise göre warehouse'ları filtrele
          const filteredWarehouses = this.warehouseModels.filter(w => w.officeCode === value && w.isOfficeWarehouse === true);

          // warehouseSet'i güncelle
          const warehouseSet = new Set(filteredWarehouses.map(w => w.warehouseCode));

          // warehouse'ları mapleyerek güncelle
          this._warehouses = Array.from(warehouseSet).map(code => {
            const model = filteredWarehouses.find(warehouse => warehouse.warehouseCode === code);
            if (!model) {
              return null;  // Eşleşme yoksa null döndür
            }
            return {
              code: model.warehouseCode,
              name: model.warehouseDescription,
              officeCode: model.officeCode,
              isOfficeWarehouse: model.isOfficeWarehouse
            };
          }).filter(warehouse => warehouse !== null);  // null olanları filtrele

          // Office değiştiğinde office alanı ile aynı olacak
          // this.transferForm.get('officeCode').setValue(value);



        } else if (value == null) {
          // Ofis seçilmediyse warehouse alanlarını devre dışı bırak
          this.transferForm.get('warehouseCode').disable();
          this.transferForm.get('toWarehouseCode').disable();
        }
      });

    }
    else if (location.href.includes('/S/') && this.isReturn) {
      // this.pageStatus = 'Merkeze İade';
      // this.currentDataType = '-1';

      this.transferForm.get('office')?.valueChanges.subscribe(value => {
        if (value) {
          // Ofis seçildiyse warehouse alanlarını etkinleştir
          this.transferForm.get('warehouseCode').enable();
          this.transferForm.get('toWarehouseCode').enable();

          // Seçilen ofise göre warehouse'ları filtrele
          const filteredWarehouses = this.warehouseModels.filter(w => w.officeCode === value && w.isOfficeWarehouse === false);

          // warehouseSet'i güncelle
          const warehouseSet = new Set(filteredWarehouses.map(w => w.warehouseCode));

          // warehouse'ları mapleyerek güncelle
          this.warehouses = Array.from(warehouseSet).map(code => {
            const model = filteredWarehouses.find(warehouse => warehouse.warehouseCode === code);
            if (!model) {
              return null;  // Eşleşme yoksa null döndür
            }
            return {
              code: model.warehouseCode,
              name: model.warehouseDescription,
              officeCode: model.officeCode,
              isOfficeWarehouse: model.isOfficeWarehouse
            };
          }).filter(warehouse => warehouse !== null);  // null olanları filtrele


          // Office değiştiğinde toOffice Code otomatik olarak aynı olacak
          this.transferForm.get('toOfficeCode').setValue(value);
        } else if (value == null) {
          // Ofis seçilmediyse warehouse alanlarını devre dışı bırak
          this.transferForm.get('warehouseCode').disable();
          this.transferForm.get('toWarehouseCode').disable();
        }
      });

      this.transferForm.get('toOfficeCode')?.valueChanges.subscribe(value => {
        if (value) {
          // Ofis seçildiyse warehouse alanlarını etkinleştir
          this.transferForm.get('warehouseCode').enable();
          this.transferForm.get('toWarehouseCode').enable();


          if (this.transferForm.get('officeCode').value != value) {
            this.toasterService.error("Ofisler Aynı Olmalıdır");
            setTimeout(() => {
              this.transferForm.get('toOfficeCode').setValue(null);
            }, 1);
            return;

          }
          // Seçilen ofise göre warehouse'ları filtrele
          const filteredWarehouses = this.warehouseModels.filter(w => w.officeCode === value && w.isOfficeWarehouse === true);

          // warehouseSet'i güncelle
          const warehouseSet = new Set(filteredWarehouses.map(w => w.warehouseCode));

          // warehouse'ları mapleyerek güncelle
          this._warehouses = Array.from(warehouseSet).map(code => {
            const model = filteredWarehouses.find(warehouse => warehouse.warehouseCode === code);
            if (!model) {
              return null;  // Eşleşme yoksa null döndür
            }
            return {
              code: model.warehouseCode,
              name: model.warehouseDescription,
              officeCode: model.officeCode,
              isOfficeWarehouse: model.isOfficeWarehouse
            };
          }).filter(warehouse => warehouse !== null);  // null olanları filtrele

          // Office değiştiğinde office alanı ile aynı olacak
          this.transferForm.get('officeCode').setValue(value);
        } else if (value == null) {
          // Ofis seçilmediyse warehouse alanlarını devre dışı bırak
          this.transferForm.get('warehouseCode').disable();
          this.transferForm.get('toWarehouseCode').disable();
        }
      });

    }

    else {
      // this.pageStatus = 'Mağaza Transfer İrsaliyesi';
      // this.currentDataType = '-1';

      this.transferForm.get('officeCode')?.valueChanges.subscribe(value => {
        if (value) {
          // Ofis seçildiyse warehouse alanlarını etkinleştir
          this.transferForm.get('warehouseCode').enable();
          this.transferForm.get('toWarehouseCode').enable();

          // Seçilen ofise göre warehouse'ları filtrele
          const filteredWarehouses = this.warehouseModels.filter(w => w.officeCode === value && w.isOfficeWarehouse === true);


          // warehouseSet'i güncelle

          const warehouseSet = new Set(filteredWarehouses.map(w => w.warehouseCode));

          // warehouse'ları mapleyerek güncelle
          this.warehouses = Array.from(warehouseSet).map(code => {
            const model = filteredWarehouses.find(warehouse => warehouse.warehouseCode === code);
            if (!model) {
              return null;  // Eşleşme yoksa null döndür
            }
            return {
              code: model.warehouseCode,
              name: model.warehouseDescription,
              officeCode: model.officeCode,
              isOfficeWarehouse: model.isOfficeWarehouse
            };
          }).filter(warehouse => warehouse !== null);  // null olanları filtrele

          // Office değiştiğinde toOffice Code otomatik olarak aynı olacak
          this.transferForm.get('toOfficeCode').setValue(value);
        } else if (value == null) {
          // Ofis seçilmediyse warehouse alanlarını devre dışı bırak
          this.transferForm.get('warehouseCode').disable();
          this.transferForm.get('toWarehouseCode').disable();
        }
      });

      this.transferForm.get('toOfficeCode')?.valueChanges.subscribe(value => {
        if (value) {
          // Ofis seçildiyse warehouse alanlarını etkinleştir
          this.transferForm.get('warehouseCode').enable();
          this.transferForm.get('toWarehouseCode').enable();



          // Seçilen ofise göre warehouse'ları filtrele
          const filteredWarehouses = this.warehouseModels.filter(w => w.officeCode === value && w.isOfficeWarehouse === false);

          // warehouseSet'i güncelle
          const warehouseSet = new Set(filteredWarehouses.map(w => w.warehouseCode));

          // warehouse'ları mapleyerek güncelle
          this._warehouses = Array.from(warehouseSet).map(code => {
            const model = filteredWarehouses.find(warehouse => warehouse.warehouseCode === code);
            if (!model) {
              return null;  // Eşleşme yoksa null döndür
            }
            return {
              code: model.warehouseCode,
              name: model.warehouseDescription,
              officeCode: model.officeCode,
              isOfficeWarehouse: model.isOfficeWarehouse
            };
          }).filter(warehouse => warehouse !== null);  // null olanları filtrele


          if (this.transferForm.get('officeCode').value != value) {
            this.toasterService.error("Ofisler Aynı Olmalıdır");
            setTimeout(() => {
              this.transferForm.get('toOfficeCode').setValue(null);
            }, 1);


          }

          // // Office değiştiğinde office alanı ile aynı olacak
          this.transferForm.get('officeCode').setValue(value);
        } else if (value == null) {
          // Ofis seçilmediyse warehouse alanlarını devre dışı bırak
          this.transferForm.get('warehouseCode').disable();
          this.transferForm.get('toWarehouseCode').disable();
        }
      });

    }



    this.transferForm.get('warehouseCode')?.valueChanges.subscribe(value => {
      if (value != null) {
        const warehouseValue = this.transferForm.get('toWarehouseCode').value.code;
        //console.log(warehouseValue)
        // Aynı depoyu seçmişse warehouseCode'u boşalt
        if (value.code == warehouseValue) {
          setTimeout(() => {
            this.transferForm.get('warehouseCode').setValue(null);
          }, 1);
          this.toasterService.error('Aynı depoları seçemezsiniz. Lütfen farklı bir depo seçiniz.');
          return;
        }

      }

    });

    // toWarehouseCode değiştiğinde:
    this.transferForm.get('toWarehouseCode')?.valueChanges.subscribe(value => {
      if (value != null) {
        const warehouseValue = this.transferForm.get('warehouseCode').value.code;
        //console.log(warehouseValue)
        // Aynı depoyu seçmişse warehouseCode'u boşalt
        if (value.code == warehouseValue) {
          setTimeout(() => {
            this.transferForm.get('toWarehouseCode').setValue(null);
          }, 1);
          this.toasterService.error('Aynı depoları seçemezsiniz. Lütfen farklı bir depo seçiniz.');
          return;
        }

      }

    });

  }

  calculateTotalQty() {
    let totalQty = 0;

    this.lastCollectedProducts?.forEach((item) => {
      totalQty += item.quantity;
    });
    this.totalCount = totalQty;
  }
  lastCollectedProducts: InnerLine[] = [];
  async getProductOfCount(orderNo: string): Promise<any> {
    this.lastCollectedProducts = await this.warehouseService.getInnerLines(
      orderNo
    );
    if (this.lastCollectedProducts.length > 0) {
      this.activeIndex = 1
    }
    this.calculateTotalQty();
  }

  async setFormValues(product: CountProduct3): Promise<CountProduct3> {
    try {
      var result: string[] = await this.productService.getShelvesOfProduct(
        product.barcode
      );
      if (result) {
        this.shelfNumbers = result[0];
        this.checkForm.get("batchCode").setValue(result[2]?.toString());
        this.checkForm.get("barcode").setValue(result[3]);
        this.checkForm.get("quantity").setValue(Number(result[1]));


        var updated_product: CountProduct3 = product;
        if (this.innerProcessCode == 'ST') {
          updated_product.toShelfNo = this.checkForm.value.toShelfNo;
        }
        updated_product.quantity = Number(result[1]);
        updated_product.batchCode = result[2];
        updated_product.barcode = result[3];
        return updated_product;
      } else {
        throw new Exception("Ürün Doğrulaması Başarısız");
      }
    } catch (error) {
      this.toasterService.error(error.message);
      return null;
    }
  }

  async getQuantity(barcode: string): Promise<string> {
    var result: string[] = await this.productService.getShelvesOfProduct(
      barcode
    );

    return result[1];
  }
  state: boolean = true;

  clearShelfNumbers() {
    this.checkForm.get("shelfNo").setValue(null);
    this.checkForm.get("barcode").setValue(null);
    this.focusNextInput("shelfNo");
    this.shelfNumbers = "Raf No";

    this.checkForm.get("quantity").setValue(null);
    this.checkForm.get("batchCode").setValue(null);
  }
  clearQrAndBatchCode() {
    this.checkForm.get("barcode").setValue(null);
    this.checkForm.get("batchCode").setValue(null);
    this.checkForm.get("quantity").setValue(null);
    this.focusNextInput("countPageBarcode");
    this.shelfNumbers = "Raf No";

    this.calculateTotalQty();
  }
  // confirm() {
  //   this.confirmationService.confirm({
  //     header: 'Confirmation',
  //     message: 'Please confirm to proceed moving forward.',
  //     acceptIcon: 'pi pi-check mr-2',
  //     rejectIcon: 'pi pi-times mr-2',
  //     rejectButtonStyleClass: 'p-button-sm',
  //     acceptButtonStyleClass: 'p-button-outlined p-button-sm',
  //     accept: () => {
  //       this.toasterService.success("Kabul Edildi");
  //     },
  //     reject: () => {
  //       this.toasterService.error("Kabul Edilmedi");
  //     }
  //   });
  // }




  async deleteOrderProduct(id: string): Promise<boolean> {
    const confirmDelete = window.confirm(
      "Bu hareketi silmek istediğinizden emin misiniz?"
    );

    if (confirmDelete) {
      const response: boolean =
        await this.warehouseService.deleteInnerLine(id);

      if (response) {
        this.calculateTotalQty();
        await this.getProductOfCount(this.currentOrderNo);
        this.toasterService.success("Silme İşlemi Başarılı.");
      } else {
        this.toasterService.error("Silme İşlemi Başarısız.");
      }
      return response;
    } else {
      return false;
    }
  }
  goBack() {
    window.history.back();
  }
  edit() {
    this.router.navigate([
      "add-product-to-shelf",
      this.innerProcessCode,
      "false",
      this.currentOrderNo,
    ]);
  }

  async onSubmit(formValue: CountProduct3): Promise<any> {
    if (!this.innerHeader) {
      this.toasterService.error("Başlık Bulunamadı");
      return;
    }

    // EĞER BARKODTA = VARSA - İLE DEĞİŞTİR
    if (formValue.barcode.includes("=")) {
      formValue.barcode = formValue.barcode.replace(/=/g, "-");
    }

    if (!this.checkForm.valid) {
      var updated_product = await this.setFormValues(formValue);
      if (updated_product) {
        if (this.checkForm.valid) {
          this.onSubmit(updated_product);
        }
        formValue = updated_product;
        this.toasterService.success("Form Verileri Güncellendi");
      }

      return;
    }

    if (this.checkForm.valid) {
      try {
        var request: InnerLine = new InnerLine();
        request.barcode = formValue.barcode;
        request.shelfNo = formValue.shelfNo;
        request.quantity = formValue.quantity;
        request.batchCode = formValue.batchCode;
        request.innerHeaderId = this.innerHeader.id;

        if (this.isShelfBased) {
          // request.shelfNo = this.innerProcessCode == 'ST' ? formValue.shelfNo : null;
          request.shelfNo = formValue.shelfNo

        } else {
          request.shelfNo = "1";
        }
        request.toShelfNo = this.innerProcessCode == 'ST' ? formValue.toShelfNo : null;
        var _response = await this.warehouseService.addInnerLine(request);

        if (_response)
          // SAYIM YAPILDI -------------------------------------------
          this.generalService.beep();
        await this.getProductOfCount(this.currentOrderNo); //this.list.push(formValue);
        this.clearQrAndBatchCode();
        this.state = true;

        // EĞER GİRİLEN RAF  RAFLARDA YOKSA SORAR
      } catch (error: any) {
        this.toasterService.error(error.message);
        this.state = true;
      }
    }
  }
  async completeCountFromService(orderNo: string) {
    try {

      if (window.confirm("İşlem Tamamlanacaktır Onaylıyor Musunuz?")) {
        if (window.confirm("İşlemi Nebime Sayım Olarak Göndermek İstiyor Musunuz")) {
          var response =
            await this.warehouseService.completeInnerHeader(
              this.currentOrderNo, true
            );
          if (response) {
            this.toasterService.success("İşlem Başarılı");
            await this.getInnerHeaderById(this.currentOrderNo);

          } else {
            this.toasterService.error("İşlem Başarısız");
          }
        }
        else {
          var response =
            await this.warehouseService.completeInnerHeader(
              this.currentOrderNo, false
            );
          if (response) {
            this.toasterService.success("İşlem Başarılı");
          } else {
            this.toasterService.error("İşlem Başarısız  ");
          }
        }
      }

    } catch (error: any) { }
  }
  //------------------SAYIM KODLARI (C)
  dialog: boolean = false;


  async complete_C(isShelfBased: boolean): Promise<boolean> {
    try {
      // İşlem öncesi kullanıcıya onay iletilisi göster
      const userConfirmed = window.confirm(
        'Sayım Gönderilecektir Onaylıyor Musunuz?'
      );

      if (!userConfirmed) {
        // Kullanıcı işlemi onaylamadıysa işlemi iptal et
        return false;
      }

      //YENI KODLAR-------------- 29.08
      var request: CompleteCountOperation_CM
      request = new CompleteCountOperation_CM();
      request.countType = isShelfBased === true ? 0 : 1; //0-> raf bazında dayım | 1-> ürün bazında ürün sayım
      request.operationNo = this.currentOrderNo;
      const response = await this.warehouseService.completeCountOperation(request)

      if (response === true) {

        this.toasterService.success("İşlem Başarılı")
        await this.getInnerHeaderById(this.currentOrderNo);
        return true;
      } else {

        this.toasterService.error('İşlem Başarısız');
        return false;
      }
    } catch (error: any) {
      this.toasterService.error('İşlem Başarısız');
      return false;
    }
  }

  //------------------TRNASFER KODLARI
  handleTransfer() {
    if (location.href.includes('/WT/') || location.href.includes('/WT-O/')) {
      this.transferBetweenStoreWarehouses(this.currentOrderNo);
    } else if (location.href.includes('/S/')) {
      this.refundToCenter(this.currentOrderNo);
    } else {
      this.toasterService.error("BOŞ")
    }
  }
  async refundToCenter(currentOrderNo: string) {
    if (currentOrderNo != null && currentOrderNo !== '') {
      const userConfirmed = window.confirm(
        this.currentOrderNo +
        ' numaralı transfer için İşlemi başlatmak istediğinize emin misiniz?'
      );

      if (userConfirmed) {
        try {

          const data = await this.httpClient
            .get<WarehouseItem | any>(
              ClientUrls.baseUrl +
              '/warehouse/create-shipping/' +
              currentOrderNo
            )
            .toPromise();

          if (data === true) {
            if (this.transferForm.get('isReturn').value == true) {
              this.toasterService.success('Merkeze İade İşlemi Başarıyla Gerçekleşti.');
              await this.getInnerHeaderById(this.currentOrderNo);
            } else {

              this.toasterService.success('Mağaza Transfer İrsaliyesi İşlemi Başarıyla Gerçekleşti.');

              await this.getInnerHeaderById(this.currentOrderNo);
            }

          } else {
            this.toasterService.error('İşlem Başarısız');
          }
        } catch (error: any) {

        }
      } else {
        this.toasterService.warn('İşlem iptal edildi.');
      }
    } else {
      this.toasterService.warn('Sipariş No Boş Geliyor.');
    }

  }
  async transferBetweenStoreWarehouses(currentOrderNo: string) {
    if (currentOrderNo != null && currentOrderNo !== '') {
      const userConfirmed = window.confirm(
        this.currentOrderNo +
        ' numaralı transfer için İşlemi başlatmak istediğinize emin misiniz?'
      );

      if (userConfirmed) {
        try {

          const data = await this.httpClient
            .get<WarehouseItem | any>(
              ClientUrls.baseUrl +
              '/warehouse/transfer-between-store-warehouses-v2/' +
              currentOrderNo
            )
            .toPromise();

          if (data === true) {
            this.toasterService.success('İşlem Başarılı');

            await this.getInnerHeaderById(this.currentOrderNo)
          } else {
            this.toasterService.error('İşlem Başarısız');
          }
        } catch (error: any) {

        }
      } else {
        this.toasterService.warn('İşlem iptal edildi.');
      }
    } else {
      this.toasterService.warn('Sipariş No Boş Geliyor.');
    }

  }

  async transferToNebim(currentOrderNo: string) {
    if (currentOrderNo != null && currentOrderNo !== '') {
      const userConfirmed = window.confirm(
        this.currentOrderNo +
        ' numaralı transfer için İşlemi başlatmak istediğinize emin misiniz?'
      );

      if (userConfirmed) {
        try {

          const data = await this.httpClient
            .get<WarehouseItem | any>(
              ClientUrls.baseUrl +
              '/warehouse/TransferProducts/' +
              currentOrderNo
            )
            .toPromise();

          if (data === true) {
            this.generalService.waitAndNavigate(
              'Transfer İşlemi Başarıyla Gerçekleşti.',
              'warehouse-operation-list'
            );
          } else {
            this.toasterService.error('İşlem Başarısız');
          }
        } catch (error: any) {

        }
      } else {
        this.toasterService.warn('İşlem iptal edildi.');
      }
    } else {
      this.toasterService.warn('Sipariş No Boş Geliyor.');
    }

  }


  //----------------------------------------------RAFLAR ARASI TRANSFER KODLARI
  async create_st() {
    if (this.currentOrderNo != null && this.currentOrderNo !== '') {
      const userConfirmed = window.confirm(
        this.currentOrderNo +
        ' numaralı transfer için İşlemi başlatmak istediğinize emin misiniz?'
      );

      if (userConfirmed) {
        try {

          const data = await this.httpClient
            .get<WarehouseItem | any>(
              ClientUrls.baseUrl +
              '/warehouse/create-shelf-transfer/' +
              this.currentOrderNo
            )
            .toPromise();

          if (data === true) {

            await this.getInnerHeaderById(this.currentOrderNo);

          } else {
            this.toasterService.error('İşlem Başarısız');
          }
        } catch (error: any) {

        }
      } else {
        this.toasterService.warn('İşlem iptal edildi.');
      }
    } else {
      this.toasterService.warn('Sipariş No Boş Geliyor.');
    }

  }

}
