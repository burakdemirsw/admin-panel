import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CargoCompanyInfo, CargoInfo, InvoiceIntegratorInfo, MailInfo, MarketplaceCompanyInfo, MarketPlaceInfo, MenuInfo, MenuItem, NebimInfo, NebimInvoiceInfo, NebimUserInfo, PaymentInfo } from 'src/app/models/model/company/companyInfo';
import { InfoService } from 'src/app/services/admin/info.service';
import { ToasterService } from 'src/app/services/ui/toaster.service';
import { ProductPriceList_VM } from '../../models/model/company/companyInfo';
import { HeaderService } from 'src/app/services/admin/header.service';
import { cdShipmentMethodDesc } from "src/app/models/model/nebim/cdShipmentMethodDesc";
import { cdColorDesc } from "src/app/models/model/nebim/cdColorDesc";
import { cdPOSTerminal } from "src/app/models/model/nebim/cdPOSTerminal";
import { cdItemDim1Desc } from "src/app/models/model/nebim/cdItemDim1Desc";
import { cdDeliveryCompanyDesc } from "src/app/models/model/nebim/cdDeliveryCompanyDesc";
import { cdCreditCardTypeDesc } from "src/app/models/model/nebim/cdCreditCardTypeDesc";
import { WarehouseOfficeModel } from 'src/app/models/model/warehouse/warehouseOfficeModel';
import { _capitalize } from 'chart.js/dist/helpers/helpers.core';

@Component({
  selector: 'app-pages-info',
  templateUrl: './pages-info.component.html',
  styleUrls: ['./pages-info.component.css']
})



export class PagesInfoComponent implements OnInit {
  constructor(
    private fb: FormBuilder,
    private infoService: InfoService,
    private toasterService: ToasterService,
    private headerService: HeaderService
  ) { }



  ngOnInit(): void {
    this.headerService.updatePageTitle("Genel Ayarlar")
    this.createCompanyInfoForm();
    this.createNebimInfoForm();
    this.createNebimInvoiceInfoForm();
    this.createMailInfoForm();
    this.createReportInfoForm();
    this.createDatabaseInfoForm();
    this.createMarketPlaceInfoForm();
    this.createPaymentInfoForm();
    this.createCargoInfoForm();
    this.createNebimUserInfoForm();
    this.createMenuInfoForm();
    this.createCargoCompanyInfoForm();
    this.createMarketPlaceCompanyInfoForm();
    this.createInvoiceEntegratorInfoForm();

    this.loadMarketPlaceCompanyInfos();
    this.loadCompanyInfo();
    this.loadNebimInfos();
    this.loadNebimInvoiceInfos();
    this.loadMailInfos();
    this.loadDatabaseInfo();
    this.loadMarketPlaceInfos();
    this.loadPaymentInfos();
    this.loadCargoInfos();
    this.loadNebimUserInfos();
    this.createTestMailForm();
    this.loadCargoCompanyInfos();
    this.loadInvoiceEntegratorInfos();
    this.loadAllData()
    this.loadMenuInfos();
  }


  companyInfoForm: FormGroup;
  nebimInfoForm: FormGroup;
  nebimInvoiceInfoForm: FormGroup;

  mailInfoForm: FormGroup;
  reportInfoForm: FormGroup;
  databaseInfoForm: FormGroup;
  marketPlaceInfoForm: FormGroup;
  paymentInfoForm: FormGroup;
  cargoInfoForm: FormGroup;
  nebimUserInfoForm: FormGroup;
  menuInfoForm: FormGroup;
  cargoCompanyInfoForm: FormGroup;
  marketPlaceCompanyInfoForm: FormGroup;
  invoiceEntegratorInfoForm: FormGroup;

  invoiceEntegratorInfos: InvoiceIntegratorInfo[] = [];
  updatedInvoiceEntegratorInfo: InvoiceIntegratorInfo;

  marketPlaceCompanies: MarketplaceCompanyInfo[] = [];
  menuInfos: MenuInfo[] = [];
  nebimInfos: NebimInfo[] = [];
  nebimInvoiceInfos: NebimInvoiceInfo[] = [];

  marketPlaceInfos: MarketPlaceInfo[] = [];
  cargoInfos: CargoInfo[] = [];
  nebimUserInfos: NebimUserInfo[] = [];
  cargoCompanies: CargoCompanyInfo[] = [];
  paymentInfos: PaymentInfo[] = [];
  mailInfos: MailInfo[] = [];
  testMailDialog: boolean = false;
  testMailForm: FormGroup;

  integrators: string[] = [
    "E-Finans E-Arşiv",
    "E-Finans E-Fatura",
    "Doğan E-Arşiv",
    "Doğam E-Fatura"
  ]
  createTestMailForm() {
    this.testMailForm = this.fb.group({
      mail: ['', [Validators.required, Validators.email]],
      nameSurname: ['Peter Parker', Validators.required],
      body: ['This is a test mail from RTS.', Validators.required]
    });
  }

  productPriceList: ProductPriceList_VM[] = []
  cdShipmentMethodDescs: cdShipmentMethodDesc[] = []
  cdDeliveryCompanyDescs: cdDeliveryCompanyDesc[] = []
  cdColorDescs: cdColorDesc[] = []
  cdItemDim1Descs: cdItemDim1Desc[] = []
  cdCreditCardTypeDescs: cdCreditCardTypeDesc[] = []
  cdPOSTerminals: cdPOSTerminal[] = []

  async loadBasePriceCodes() {
    this.productPriceList = await this.infoService.getProductPriceList();
  }
  async getShipmentMethods() {
    this.cdShipmentMethodDescs = await this.infoService.getShipmentMethods();
  }

  async getDeliveryCompanies() {
    this.cdDeliveryCompanyDescs = await this.infoService.getDeliveryCompanies();
  }

  async getColors() {
    this.cdColorDescs = await this.infoService.getColors();
  }

  async getItemDimensions() {
    this.cdItemDim1Descs = await this.infoService.getItemDimensions();
  }

  async getCreditCardTypes() {
    this.cdCreditCardTypeDescs = await this.infoService.getCreditCardTypes();
  }

  async getPosTerminals() {
    this.cdPOSTerminals = await this.infoService.getPosTerminals();
  }
  warehouseOfficeModels: WarehouseOfficeModel[] = []
  async getWarehouseAndOffices() {
    var response = await this.infoService.getWarehouseAndOffices();
    this.warehouseOfficeModels = response;
  }
  async loadAllData() {
    await this.loadBasePriceCodes();
    await this.getShipmentMethods();
    await this.getDeliveryCompanies();
    await this.getColors();
    await this.getItemDimensions();
    await this.getCreditCardTypes();
    await this.getPosTerminals();
    await this.getWarehouseAndOffices();
  }
  createMarketPlaceCompanyInfoForm() {
    this.marketPlaceCompanyInfoForm = this.fb.group({
      companyName: [null, Validators.required],
      id: [0]
    });
  }
  createCargoCompanyInfoForm() {
    this.cargoCompanyInfoForm = this.fb.group({
      id: [0],
      companyName: [null, Validators.required]
    });
  }
  createCompanyInfoForm() {
    this.companyInfoForm = this.fb.group({
      companyName: [null, Validators.required],
      logoUrl: [null],
      serviceSector: [null],
      authorizedPerson: [null],
      phone: [null],
      fax: [null],
      taxOffice: [null],
      taxNumber: [null],
      tradeRegistryNo: [null],
      mersisNo: [null],
      email: [null, [Validators.required, Validators.email]],
      address: [null],
      postalCode: [null],
      companyCountry: [null],
      companyCity: [null],
      companyDistrict: [null],
      passwordResetUrl: [null],
      webSiteUrl: [null],
      printerName1: [null],
      printerName2: [null],
      documentsFolderPath: [null],
      invoiceFolderPath: [null],
      nebimInnerIp: [null],
      nebimOuterIp: [null],
      isOrderBase: [null],
      isCreditSale: [null],
      warehouseCode: [null],
      photoFolderUrl: [null],
      googleDriveFolderId: [null],
      useShelfWhenPickingOrders: [null]
    });
  }
  createNebimInfoForm() {
    this.nebimInfoForm = this.fb.group({
      id: [0],
      processCode: [null],
      storeCode: [null],
      posTerminalID: [null],
      shipmentMethodCode: [null],
      deliveryCompanyCode: [null],
      basePriceCode: [null],
      applicationCode: [null],
      sendAutoMail: [null],
      // warehouseCode: [null],
      // officeCode: [null],
      // isOrderBase: [null],
      // isShipmentBase: [null]
    });
  }

  createNebimInvoiceInfoForm() {
    this.nebimInvoiceInfoForm = this.fb.group({
      id: [0],
      processCode: [null],
      officeCode: [null],
      storeCode: [null],
      warehouseCode: [null],
      posTerminalID: [null],
      shipmentMethodCode: [null],
      deliveryCompanyCode: [null],
      basePriceCode: [null],
      applicationCode: [null],
      sendAutoMail: [false],
      isOrderBase: [false],
      isShipmentBase: [false]
    });
  }
  createMailInfoForm() {
    this.mailInfoForm = this.fb.group({
      id: [0],
      isFirst: [false],
      userName: [null],
      password: [null],
      smtpAddress: [null],
      smtpPort: [null],
      applicationPassword: [null]
    });
  }
  createReportInfoForm() {
    this.reportInfoForm = this.fb.group({
      description: [null],
      filePath: [null]
    });
  }
  createDatabaseInfoForm() {
    this.databaseInfoForm = this.fb.group({
      dataSource: [null],
      initialCatalog: [null],
      userID: [null],
      password: [null],
      trustServerCertificate: [false]
    });
  }
  createMarketPlaceInfoForm() {
    this.marketPlaceInfoForm = this.fb.group({
      id: [0],
      description: [null],
      clientId: [null],
      clientSecret: [null],
      redirectUri: [null],
      baseUrl: [null],
      sellerId: [null],
      officeCode: [null],
      storeCode: [null],
      warehouseCode: [null],
      posTerminalID: [null],
      shipmentMethodCode: [null],
      deliveryCompanyCode: [null],
      creditCardTypeCode: [null],
      cargoItemCode: [null],
      bankCommisionItemCode: [null],
      paymentAtDoorItemCode: [null],
      giftVoucherItemCode: [null],
    });
  }
  createPaymentInfoForm() {
    this.paymentInfoForm = this.fb.group({
      id: [0],
      merchantId: [null, Validators.required],
      description: [null, Validators.required],
      apiKey: [null, Validators.required],
      apiSecretKey: [null, Validators.required],
      okUrl: [null, Validators.required],
      failUrl: [null, Validators.required]
    });
  }
  createCargoInfoForm() {
    this.cargoInfoForm = this.fb.group({
      id: [0],
      description: [null, Validators.required],
      userName: [null, Validators.required],
      password: [null, Validators.required],
      customerCode: [null],
      apiKey: [null],
      apiSecret: [null]
    });
  }
  createNebimUserInfoForm() {
    this.nebimUserInfoForm = this.fb.group({
      id: [0],
      description: [null, Validators.required],
      userGroupCode: [null],
      userName: [null, Validators.required],
      password: [null, Validators.required]
    });
  }


  createMenuInfoForm() {
    this.menuInfoForm = this.fb.group({
      id: [0],
      label: [null, Validators.required],
      route: [null],
      action: [null],
      icon: [null],
      parentId: [null],
      isActive: [true],
      order: [0, Validators.required],
    });
  }
  createInvoiceEntegratorInfoForm() {
    this.invoiceEntegratorInfoForm = this.fb.group({
      id: [0],
      description: [null, Validators.required],
      userName: [null, Validators.required],
      password: [null, Validators.required]
    });
  }

  async loadCompanyInfo() {
    try {
      const data = await this.infoService.getCompanyInfos();
      if (data) {
        this.companyInfoForm.patchValue(data);
      }
    } catch (error) {
      this.toasterService.error('Şirket bilgileri yüklenirken bir hata oluştu');
    }
  }

  async loadNebimInfos() {
    try {
      const data = await this.infoService.getNebimInfos();
      if (data) {
        this.nebimInfos = data;
      }
    } catch (error) {
      this.toasterService.error('Nebim bilgileri yüklenirken bir hata oluştu');
    }
  }
  async loadNebimInvoiceInfos() {
    try {
      const data = await this.infoService.getNebimInvoiceInfos();
      if (data) {
        this.nebimInvoiceInfos = data;
      }
    } catch (error) {
      this.toasterService.error('Nebim  Fatura bilgileri yüklenirken bir hata oluştu');
    }
  }
  async loadMailInfos() {
    try {
      const data = await this.infoService.getMailInfos();
      if (data) {
        this.mailInfos = data;
        // this.mailInfoForm.patchValue(data);
      }
    } catch (error) {
      this.toasterService.error('Mail bilgileri yüklenirken bir hata oluştu');
    }
  }

  async loadDatabaseInfo() {
    try {
      const data = await this.infoService.getDatabaseInfos();
      if (data) {
        this.databaseInfoForm.patchValue(data);
      }
    } catch (error) {
      this.toasterService.error('Veritabanı bilgileri yüklenirken bir hata oluştu');
    }
  }
  async loadMarketPlaceInfos() {
    try {
      const data = await this.infoService.getMarketPlaceInfos();
      if (data) {
        this.marketPlaceInfos = data;
      }
    } catch (error) {
      this.toasterService.error('Pazar yeri bilgileri yüklenirken bir hata oluştu');
    }
  }
  async loadPaymentInfos() {
    try {
      const data = await this.infoService.getPaymentInfos();
      if (data.length > 0) {
        this.paymentInfos = data;
      }
    } catch (error) {
      this.toasterService.error('Payment infos could not be loaded');
    }
  }
  async loadCargoInfos() {
    try {
      const data = await this.infoService.getCargoInfos();
      if (data) {
        this.cargoInfos = data;
      }
    } catch (error) {
      this.toasterService.error('Cargo infos could not be loaded');
    }
  }
  async loadNebimUserInfos() {
    try {
      const data = await this.infoService.getNebimUserInfos();
      if (data) {
        this.nebimUserInfos = data;
      }
    } catch (error) {
      this.toasterService.error('Nebim user infos could not be loaded');
    }
  }
  async loadMenuInfos() {
    try {
      const data = await this.infoService.getMenuInfos(false);
      this.menuInfos = data;
    } catch (error) {
      this.toasterService.error('Menü bilgileri yüklenirken bir hata oluştu');
    }
  }
  async onSubmitCompanyInfo() {
    if (this.companyInfoForm.invalid) {
      this.toasterService.error('Lütfen tüm gerekli alanları doldurun');
      return;
    }

    try {
      const result = await this.infoService.addCompanyInfo(this.companyInfoForm.value);
      if (result) {
        this.toasterService.success('Şirket bilgileri başarıyla kaydedildi');
        // this.companyInfoForm.reset();
      } else {
        this.toasterService.error('Şirket bilgileri kaydedilemedi');
      }
    } catch (error) {
      this.toasterService.error('Şirket bilgileri kaydedilirken bir hata oluştu');
    }
  }
  //-------------------------------------------------------------------------------NEBIM

  updatedNebimInfo: NebimInfo;
  async onEditNebimInfo(nebim: NebimInfo) {
    this.updatedNebimInfo = nebim;
    this.nebimInfoForm.patchValue(nebim);
  }

  async onDeleteNebimInfo(id: number) {
    try {
      const result = await this.infoService.deleteNebimInfo(id);
      if (result) {
        this.toasterService.success('Nebim bilgileri başarıyla silindi');
        await this.loadNebimInfos(); // Refresh the list after deletion
      } else {
        this.toasterService.error('Nebim bilgileri silinemedi');
      }
    } catch (error) {
      this.toasterService.error('Nebim bilgileri silinirken bir hata oluştu');
    }
  }


  async onSubmitNebimInfo() {
    if (this.nebimInfoForm.invalid) {
      this.toasterService.error('Lütfen tüm gerekli alanları doldurun');
      return;
    }

    try {
      if (this.updatedNebimInfo) {
        var result = await this.infoService.updateNebimInfo(this.nebimInfoForm.value);

      } else {
        this.nebimInfoForm.value.id = 0;
        var result = await this.infoService.addNebimInfo(this.nebimInfoForm.value);

      }
      if (result) {
        await this.loadNebimInfos();
        this.toasterService.success('Nebim bilgileri başarıyla kaydedildi');
        this.updatedNebimInfo = null;
        this.nebimInfoForm.reset();
      } else {
        this.toasterService.error('Nebim bilgileri kaydedilemedi');
      }
    } catch (error) {
      this.toasterService.error('Nebim bilgileri kaydedilirken bir hata oluştu');
    }
  }

  //-------------------------------------------------------------------------------NEBIMINVOİCE

  updatedNebimInvoiceInfo: NebimInfo;
  async onEditNebimInvoiceInfo(nebim: NebimInfo) {
    this.updatedNebimInvoiceInfo = nebim;
    this.nebimInvoiceInfoForm.patchValue(nebim);
  }

  async onDeleteNebimInvoiceInfo(id: number) {
    try {
      const result = await this.infoService.deleteNebimInvoiceInfo(id);
      if (result) {
        this.toasterService.success('Nebim Fatura bilgileri başarıyla silindi');
        await this.loadNebimInvoiceInfos(); // Refresh the list after deletion
      } else {
        this.toasterService.error('Nebim Fatura bilgileri silinemedi');
      }
    } catch (error) {
      this.toasterService.error('Nebim Fatura bilgileri silinirken bir hata oluştu');
    }
  }


  async onSubmitNebimInvoiceInfo() {
    if (this.nebimInvoiceInfoForm.invalid) {
      this.toasterService.error('Lütfen tüm gerekli alanları doldurun');
      return;
    }

    try {
      if (this.updatedNebimInvoiceInfo) {
        var result = await this.infoService.updateNebimInvoiceInfo(this.nebimInvoiceInfoForm.value);

      } else {
        console.log(this.nebimInvoiceInfos);
        console.log(this.nebimInvoiceInfoForm.value);

        var r = this.nebimInvoiceInfos.some(p => p.processCode == this.nebimInvoiceInfoForm.value.processCode && p.applicationCode == this.nebimInvoiceInfoForm.value.applicationCode)
        if (r) {
          this.toasterService.error('Daha Önce Bu Süreç Tanımlandı');
          return;
        }
        this.nebimInvoiceInfoForm.value.id = 0;
        var result = await this.infoService.addNebimInvoiceInfo(this.nebimInvoiceInfoForm.value);

      }
      if (result) {
        await this.loadNebimInvoiceInfos();
        this.toasterService.success('Nebim Fatura bilgileri başarıyla kaydedildi');
        this.updatedNebimInvoiceInfo = null;
        this.nebimInfoForm.reset();
      } else {
        this.toasterService.error('Nebim Fatura bilgileri kaydedilemedi');
      }
    } catch (error) {
      this.toasterService.error('Nebim Fatura bilgileri kaydedilirken bir hata oluştu');
    }
  }
  //----------------------------------------------------------------------------------MAIL
  updatedmailInfo: MailInfo;
  async onSubmitMailInfo() {
    if (this.mailInfoForm.invalid) {
      this.toasterService.error('Please fill all required fields');
      return;
    }

    try {

      if (this.updatedmailInfo) {
        var result = await this.infoService.updateMailInfo(this.mailInfoForm.value);

      } else {
        this.mailInfoForm.value.id = 0;
        var result = await this.infoService.addMailInfo(this.mailInfoForm.value);

      }
      if (result) {
        this.toasterService.success('Mail info successfully saved');
        this.loadMailInfos();
        this.updatedmailInfo = null;
        this.mailInfoForm.reset();
      } else {
        this.toasterService.error('Payment info could not be saved');
      }
    } catch (error) {
      this.toasterService.error('An error occurred while saving payment info');
    }
  }
  async onEditMailInfo(mailInfo: MailInfo) {
    this.updatedmailInfo = mailInfo;
    this.mailInfoForm.patchValue(mailInfo);
  }

  async onDeleteMailInfo(id: number) {
    try {
      const result = await this.infoService.deleteMailInfo(id);
      if (result) {
        this.toasterService.success('Mail info successfully deleted');
        this.loadMailInfos();
      } else {
        this.toasterService.error('Mail info could not be deleted');
      }
    } catch (error) {
      this.toasterService.error('An error occurred while deleting payment info');
    }
  }

  async onSubmitReportInfo() {
    if (this.reportInfoForm.invalid) {
      this.toasterService.error('Lütfen tüm gerekli alanları doldurun');
      return;
    }

    try {
      const result = await this.infoService.addReportInfo(this.reportInfoForm.value);
      if (result) {

        this.toasterService.success('Rapor bilgileri başarıyla kaydedildi');
        this.reportInfoForm.reset();
      } else {
        this.toasterService.error('Rapor bilgileri kaydedilemedi');
      }
    } catch (error) {
      this.toasterService.error('Rapor bilgileri kaydedilirken bir hata oluştu');
    }
  }

  async onSubmitDatabaseInfo() {
    if (this.databaseInfoForm.invalid) {
      this.toasterService.error('Lütfen tüm gerekli alanları doldurun');
      return;
    }

    try {
      const result = await this.infoService.addDatabaseInfo(this.databaseInfoForm.value);
      if (result) {
        await this.loadDatabaseInfo()
        this.toasterService.success('Veritabanı bilgileri başarıyla kaydedildi');
        // this.databaseInfoForm.reset();
      } else {
        this.toasterService.error('Veritabanı bilgileri kaydedilemedi');
      }
    } catch (error) {
      this.toasterService.error('Veritabanı bilgileri kaydedilirken bir hata oluştu');
    }
  }

  //---------------------------------------------MARKETPLACE
  updatedMarketPlaceInfo: MarketPlaceInfo;
  async onSubmitMarketPlaceInfo() {
    if (this.marketPlaceInfoForm.invalid) {
      this.toasterService.error('Lütfen tüm gerekli alanları doldurun');
      return;
    }

    try {
      if (this.updatedMarketPlaceInfo) {
        var result = await this.infoService.updateMarketPlaceInfo(this.marketPlaceInfoForm.value);
      } else {
        this.marketPlaceInfoForm.value.id = 0;
        var result = await this.infoService.addMarketPlaceInfo(this.marketPlaceInfoForm.value);
      }

      if (result) {
        this.toasterService.success('Pazar yeri bilgileri başarıyla kaydedildi');
        this.updatedMarketPlaceInfo = null;
        this.marketPlaceInfoForm.reset();
        this.loadMarketPlaceInfos();
      } else {
        this.toasterService.error('Pazar yeri bilgileri kaydedilemedi');
      }
    } catch (error) {
      this.toasterService.error('Pazar yeri bilgileri kaydedilirken bir hata oluştu');
    }
  }

  async onEditMarketPlaceInfo(marketPlace: MarketPlaceInfo) {
    this.updatedMarketPlaceInfo = marketPlace;
    this.marketPlaceInfoForm.patchValue(marketPlace);
  }

  async onDeleteMarketPlaceInfo(id: number) {
    try {
      const result = await this.infoService.deleteMarketPlaceInfo(id);
      if (result) {
        this.toasterService.success('Pazar yeri bilgileri başarıyla silindi');
        this.loadMarketPlaceInfos();
      } else {
        this.toasterService.error('Pazar yeri bilgileri silinemedi');
      }
    } catch (error) {
      this.toasterService.error('Pazar yeri bilgileri silinirken bir hata oluştu');
    }
  }
  //---------------------------------------------PAYMENT
  updatedPaymentInfo: PaymentInfo;
  async onSubmitPaymentInfo() {
    if (this.paymentInfoForm.invalid) {
      this.toasterService.error('Please fill all required fields');
      return;
    }

    try {

      if (this.updatedPaymentInfo) {
        var result = await this.infoService.updatePaymentInfo(this.paymentInfoForm.value);

      } else {
        this.paymentInfoForm.value.id = 0;
        var result = await this.infoService.addPaymentInfo(this.paymentInfoForm.value);

      }
      if (result) {
        this.toasterService.success('Payment info successfully saved');
        this.loadPaymentInfos();
        this.updatedNebimInfo = null;
        this.paymentInfoForm.reset();
      } else {
        this.toasterService.error('Payment info could not be saved');
      }
    } catch (error) {
      this.toasterService.error('An error occurred while saving payment info');
    }
  }
  async onEditPaymentInfo(paymentInfo: PaymentInfo) {
    this.updatedPaymentInfo = paymentInfo;
    this.paymentInfoForm.patchValue(paymentInfo);
  }

  async onDeletePaymentInfo(merchantId: string) {
    try {
      const result = await this.infoService.deletePaymentInfo(merchantId);
      if (result) {
        this.toasterService.success('Payment info successfully deleted');
        this.loadPaymentInfos();
      } else {
        this.toasterService.error('Payment info could not be deleted');
      }
    } catch (error) {
      this.toasterService.error('An error occurred while deleting payment info');
    }
  }
  //----------------------------------------------------------------CARGO
  updatedCargoInfo: CargoInfo;
  async onSubmitCargoInfo() {
    if (this.cargoInfoForm.invalid) {
      this.toasterService.error('Please fill all required fields');
      return;
    }

    try {
      let result;
      if (this.updatedCargoInfo) {
        result = await this.infoService.updateCargoInfo(this.cargoInfoForm.value);
      } else {
        this.cargoInfoForm.value.id = 0;
        result = await this.infoService.addCargoInfo(this.cargoInfoForm.value);
      }

      if (result) {
        this.toasterService.success('Cargo info successfully saved');
        this.loadCargoInfos();
        this.updatedCargoInfo = null;
        this.cargoInfoForm.reset();
      } else {
        this.toasterService.error('Cargo info could not be saved');
      }
    } catch (error) {
      this.toasterService.error('An error occurred while saving cargo info');
    }
  }

  async onEditCargoInfo(cargoInfo: CargoInfo) {
    this.updatedCargoInfo = cargoInfo;
    this.cargoInfoForm.patchValue(cargoInfo);
  }

  async onDeleteCargoInfo(id: number) {
    try {
      const result = await this.infoService.deleteCargoInfo(id);
      if (result) {
        this.toasterService.success('Cargo info successfully deleted');
        this.loadCargoInfos();
      } else {
        this.toasterService.error('Cargo info could not be deleted');
      }
    } catch (error) {
      this.toasterService.error('An error occurred while deleting cargo info');
    }
  }
  //-----------------------------------------------------NEBIM USER INFO
  updatedNebimUserInfo: NebimUserInfo;
  async onSubmitNebimUserInfo() {
    if (this.nebimUserInfoForm.invalid) {
      this.toasterService.error('Please fill all required fields');
      return;
    }

    try {
      let result;
      if (this.updatedNebimUserInfo) {
        result = await this.infoService.updateNebimUserInfo(this.nebimUserInfoForm.value);
      } else {
        this.nebimUserInfoForm.value.id = 0;
        result = await this.infoService.addNebimUserInfo(this.nebimUserInfoForm.value);
      }

      if (result) {
        this.toasterService.success('Nebim user info successfully saved');
        this.loadNebimUserInfos();
        this.updatedNebimUserInfo = null;
        this.nebimUserInfoForm.reset();
      } else {
        this.toasterService.error('Nebim user info could not be saved');
      }
    } catch (error) {
      this.toasterService.error('An error occurred while saving Nebim user info');
    }
  }

  async onEditNebimUserInfo(nebimUserInfo: NebimUserInfo) {
    this.updatedNebimUserInfo = nebimUserInfo;
    this.nebimUserInfoForm.patchValue(nebimUserInfo);
  }

  async onDeleteNebimUserInfo(id: number) {
    try {
      const result = await this.infoService.deleteNebimUserInfo(id);
      if (result) {
        this.toasterService.success('Nebim user info successfully deleted');
        this.loadNebimUserInfos();
      } else {
        this.toasterService.error('Nebim user info could not be deleted');
      }
    } catch (error) {
      this.toasterService.error('An error occurred while deleting Nebim user info');
    }
  }
  //-----------------------------------------------------------------------------
  updatedMenuInfo: MenuInfo; selectedMenus: any[] = [];
  async onSubmitMenuInfo() {
    if (this.menuInfoForm.invalid) {
      this.toasterService.error('Lütfen tüm gerekli alanları doldurun');
      return;
    }

    try {
      if (this.updatedMenuInfo) {

        const existingMenuWithSameOrder = this.menuInfos
          .filter(mi => mi.parentId === this.menuInfoForm.value.parentId)
          .find(mi => mi.order === this.menuInfoForm.value.order && mi.id !== this.updatedMenuInfo.id);
        if (true) {
          if (this.menuInfoForm.value.order >= 0) {
            const result = await this.infoService.updateMenuInfo(this.menuInfoForm.value)
            if (result) {
              this.toasterService.success('Menü bilgileri başarıyla güncellendi');
              this.loadMenuInfos();
              this.updatedMenuInfo = null;
              this.menuInfoForm.reset();
            } else {
              this.toasterService.error('Menü bilgileri güncellenemedi');
            }
          }
        } else {
          this.toasterService.warn("Bu sıra ilgili kategoride daha önce kullanıldı")

        }
      } else {

        const existingMenuWithSameOrder = this.menuInfos
          .filter(mi => mi.parentId === this.menuInfoForm.value.parentId);
        if (true) {
          this.menuInfoForm.value.id = 0;
          const result = await this.infoService.addMenuInfo(this.menuInfoForm.value)
          if (result) {
            this.toasterService.success('Menü bilgileri başarıyla kaydedildi');
            this.loadMenuInfos();
            this.menuInfoForm.reset();
          } else {
            this.toasterService.error('Menü bilgileri kaydedilemedi');
          }
        }
      }
    } catch (error) {
      this.toasterService.error('Menü bilgileri kaydedilirken bir hata oluştu');
    }
  }

  async onEditMenuInfo(menuInfo: MenuInfo) {

    this.updatedMenuInfo = menuInfo;
    this.menuInfoForm.patchValue(menuInfo);
  }

  async onDeleteMenuInfo(id: number) {
    try {
      const result = await this.infoService.deleteMenuInfo(id)
      if (result) {
        this.toasterService.success('Menü bilgileri başarıyla silindi');
        this.loadMenuInfos();
      } else {
        this.toasterService.error('Menü bilgileri silinemedi');
      }
    } catch (error) {
      this.toasterService.error('Menü bilgileri silinirken bir hata oluştu');
    }
  }
  async onToggleActive(menuInfo: MenuInfo) {
    try {
      menuInfo.isActive = !menuInfo.isActive;
      const result = await this.infoService.updateMenuInfo(menuInfo);
      if (result) {
        this.toasterService.success('Menü durumu güncellendi');
        this.loadMenuInfos();
      } else {
        this.toasterService.error('Menü durumu güncellenemedi');
      }
    } catch (error) {
      this.toasterService.error('Menü durumu güncellenirken bir hata oluştu');
    }
  }

  //-------------------------------------;

  updatedCargoCompanyInfo: CargoCompanyInfo;


  async loadCargoCompanyInfos() {
    try {
      const data = await this.infoService.getCargoCompanyInfos();
      this.cargoCompanies = data;
    } catch (error) {
      this.toasterService.error('Kargo şirketleri yüklenirken bir hata oluştu');
    }
  }

  async onSubmitCargoCompanyInfo() {
    if (this.cargoCompanyInfoForm.invalid) {
      this.toasterService.error('Lütfen tüm gerekli alanları doldurun');
      return;
    }

    try {
      if (this.updatedCargoCompanyInfo) {
        var result = await this.infoService.updateCargoCompanyInfo(this.cargoCompanyInfoForm.value);
      } else {
        this.cargoCompanyInfoForm.value.id = 0;
        var result = await this.infoService.addCargoCompanyInfo(this.cargoCompanyInfoForm.value);
      }

      if (result) {
        this.toasterService.success('Kargo şirketi başarıyla kaydedildi');
        this.loadCargoCompanyInfos();
        this.updatedCargoCompanyInfo = null;
        this.cargoCompanyInfoForm.reset();
      } else {
        this.toasterService.error('Kargo şirketi kaydedilemedi');
      }
    } catch (error) {
      this.toasterService.error('Kargo şirketi kaydedilirken bir hata oluştu');
    }
  }

  onEditCargoCompanyInfo(cargoCompany: CargoCompanyInfo) {
    this.updatedCargoCompanyInfo = cargoCompany;
    this.cargoCompanyInfoForm.patchValue(cargoCompany);
  }

  async onDeleteCargoCompanyInfo(id: number) {
    try {
      const result = await this.infoService.deleteCargoCompanyInfo(id);
      if (result) {
        this.toasterService.success('Kargo şirketi başarıyla silindi');
        this.loadCargoCompanyInfos();
      } else {
        this.toasterService.error('Kargo şirketi silinemedi');
      }
    } catch (error) {
      this.toasterService.error('Kargo şirketi silinirken bir hata oluştu');
    }
  }

  async onToggleCargoCompanyStatus(cargoCompany: CargoCompanyInfo) {
    try {
      const result = await this.infoService.updateCargoCompanyInfo(cargoCompany);
      if (result) {
        this.toasterService.success('Kargo şirketi durumu başarıyla güncellendi');
        this.loadCargoCompanyInfos();
      } else {
        this.toasterService.error('Kargo şirketi durumu güncellenemedi');
      }
    } catch (error) {
      this.toasterService.error('Kargo şirketi durumu güncellenirken bir hata oluştu');
    }
  }
  //---------------------------------------;
  updatedMarketPlaceCompanyInfo: MarketplaceCompanyInfo;
  async loadMarketPlaceCompanyInfos() {
    try {
      const data = await this.infoService.getMarketPlaceCompanyInfos(false);
      this.marketPlaceCompanies = data;
    } catch (error) {
      this.toasterService.error('Pazar yeri şirketleri yüklenirken bir hata oluştu');
    }
  }

  async onSubmitMarketPlaceCompanyInfo() {
    if (this.marketPlaceCompanyInfoForm.invalid) {
      this.toasterService.error('Lütfen tüm gerekli alanları doldurun');
      return;
    }

    try {
      let result;
      if (this.updatedMarketPlaceCompanyInfo) {
        result = await this.infoService.updateMarketPlaceCompanyInfo(this.marketPlaceCompanyInfoForm.value);
      } else {
        this.marketPlaceCompanyInfoForm.value.id = 0;
        result = await this.infoService.addMarketPlaceCompanyInfo(this.marketPlaceCompanyInfoForm.value);
      }

      if (result) {
        this.toasterService.success('Pazar yeri şirketi başarıyla kaydedildi');
        this.loadMarketPlaceCompanyInfos();
        this.updatedMarketPlaceCompanyInfo = null;
        this.marketPlaceCompanyInfoForm.reset();
      } else {
        this.toasterService.error('Pazar yeri şirketi kaydedilemedi');
      }
    } catch (error) {
      this.toasterService.error('Pazar yeri şirketi kaydedilirken bir hata oluştu');
    }
  }

  onEditMarketPlaceCompanyInfo(marketPlaceCompany: MarketplaceCompanyInfo) {
    this.updatedMarketPlaceCompanyInfo = marketPlaceCompany;
    this.marketPlaceCompanyInfoForm.patchValue(marketPlaceCompany);
  }

  async onDeleteMarketPlaceCompanyInfo(id: number) {
    try {
      const result = await this.infoService.deleteMarketPlaceCompanyInfo(id);
      if (result) {
        this.toasterService.success('Pazar yeri şirketi başarıyla silindi');
        this.loadMarketPlaceCompanyInfos();
      } else {
        this.toasterService.error('Pazar yeri şirketi silinemedi');
      }
    } catch (error) {
      this.toasterService.error('Pazar yeri şirketi silinirken bir hata oluştu');
    }
  }

  async onToggleMarketPlaceCompanyStatus(marketPlaceCompany: MarketplaceCompanyInfo) {
    try {
      const result = await this.infoService.updateMarketPlaceCompanyInfo(marketPlaceCompany);
      if (result) {
        this.toasterService.success('Pazar yeri şirketi durumu başarıyla güncellendi');
        this.loadMarketPlaceCompanyInfos();
      } else {
        this.toasterService.error('Pazar yeri şirketi durumu güncellenemedi');
      }
    } catch (error) {
      this.toasterService.error('Pazar yeri şirketi durumu güncellenirken bir hata oluştu');
    }
  }
  //-------------------------------------------;

  async loadInvoiceEntegratorInfos() {
    try {
      this.invoiceEntegratorInfos = await this.infoService.getInvoiceEntegratorInfos();
    } catch (error) {
      this.toasterService.error('Fatura entegratör bilgileri yüklenirken bir hata oluştu');
    }
  }

  async onSubmitInvoiceEntegratorInfo() {
    if (this.invoiceEntegratorInfoForm.invalid) {
      this.toasterService.error('Lütfen tüm gerekli alanları doldurun');
      return;
    }

    try {
      let result;
      if (this.updatedInvoiceEntegratorInfo) {
        // Update existing record
        result = await this.infoService.updateInvoiceEntegratorInfo(this.invoiceEntegratorInfoForm.value);
      } else {
        // Add new record
        this.invoiceEntegratorInfoForm.value.id = 0; // ensure ID is set to 0 for new entries
        result = await this.infoService.addInvoiceEntegratorInfo(this.invoiceEntegratorInfoForm.value);
      }

      if (result) {
        this.toasterService.success('Fatura entegratör bilgisi başarıyla kaydedildi');
        this.loadInvoiceEntegratorInfos();
        this.updatedInvoiceEntegratorInfo = null;
        this.invoiceEntegratorInfoForm.reset();
      } else {
        this.toasterService.error('Fatura entegratör bilgisi kaydedilemedi');
      }
    } catch (error) {
      this.toasterService.error('Fatura entegratör bilgisi kaydedilirken bir hata oluştu');
    }
  }

  onEditInvoiceEntegratorInfo(invoiceEntegrator: InvoiceIntegratorInfo) {
    this.updatedInvoiceEntegratorInfo = invoiceEntegrator;
    this.invoiceEntegratorInfoForm.patchValue(invoiceEntegrator);
  }

  async onDeleteInvoiceEntegratorInfo(id: number) {
    try {
      const result = await this.infoService.deleteInvoiceEntegratorInfo(id);
      if (result) {
        this.toasterService.success('Fatura entegratör bilgisi başarıyla silindi');
        this.loadInvoiceEntegratorInfos();
      } else {
        this.toasterService.error('Fatura entegratör bilgisi silinemedi');
      }
    } catch (error) {
      this.toasterService.error('Fatura entegratör bilgisi silinirken bir hata oluştu');
    }
  }
  //-------------------------------------------

  async onSubmitTestMail() {
    try {

      const result = await this.infoService.sendTestMail(this.testMailForm.value);
      if (result) {
        this.toasterService.success('Mail Gönderildi');
      } else {
        this.toasterService.error('Mail Gönderilemedi');
      }

      this.testMailInfo = null;
    } catch (error) {
      this.testMailInfo = null;

      this.toasterService.error('Mail gönderilirken bir hata oluştu');
    }
  }

  testMailInfo: MailInfo;
  openDialog(mailInfo) {
    this.testMailInfo = mailInfo;
    this.testMailDialog = true;
  }

}
