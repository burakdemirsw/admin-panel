import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import TypedRegistry from 'chart.js/dist/core/core.typedRegistry';
import { CargoInfo, MarketPlaceInfo, NebimInfo, PaymentInfo } from 'src/app/models/model/company/companyInfo';
import { InfoService } from 'src/app/services/admin/info.service';
import { ToasterService } from 'src/app/services/ui/toaster.service';

@Component({
  selector: 'app-pages-info',
  templateUrl: './pages-info.component.html',
  styleUrls: ['./pages-info.component.css']
})
export class PagesInfoComponent implements OnInit {
  companyInfoForm: FormGroup;
  nebimInfoForm: FormGroup;
  mailInfoForm: FormGroup;
  reportInfoForm: FormGroup;
  databaseInfoForm: FormGroup;
  marketPlaceInfoForm: FormGroup;
  paymentInfoForm: FormGroup;
  cargoInfoForm: FormGroup;
  nebimInfos: NebimInfo[] = [];
  marketPlaceInfos: MarketPlaceInfo[] = [];
  cargoInfos: CargoInfo[] = [];

  paymentInfos: PaymentInfo[] = [];
  constructor(
    private fb: FormBuilder,
    private infoService: InfoService,
    private toasterService: ToasterService
  ) { }

  ngOnInit(): void {
    this.createCompanyInfoForm();
    this.createNebimInfoForm();
    this.createMailInfoForm();
    this.createReportInfoForm();
    this.createDatabaseInfoForm();
    this.createMarketPlaceInfoForm();
    this.createPaymentInfoForm();
    this.createCargoInfoForm();

    this.loadCompanyInfo();
    this.loadNebimInfos();
    this.loadMailInfo();
    this.loadDatabaseInfo();
    this.loadMarketPlaceInfos();
    this.loadPaymentInfos();
    this.loadCargoInfos();
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
      nebimUrl: [null]
    });
  }

  createNebimInfoForm() {
    this.nebimInfoForm = this.fb.group({
      id: [0],
      type: [null],
      officeCode: [null],
      storeCode: [null],
      posTerminalID: [null],
      shipmentMethodCode: [null],
      deliveryCompanyCode: [null]
    });
  }

  createMailInfoForm() {
    this.mailInfoForm = this.fb.group({
      isFirst: [false],
      userName: [null],
      password: [null],
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
      sellerId: [null]
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

  async loadMailInfo() {
    try {
      const data = await this.infoService.getMailInfos();
      if (data) {
        this.mailInfoForm.patchValue(data);
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
      if (data) {
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
  //----------------------------------------------------------------------------------MAIL
  async onSubmitMailInfo() {
    if (this.mailInfoForm.invalid) {
      this.toasterService.error('Lütfen tüm gerekli alanları doldurun');
      return;
    }

    try {
      const result = await this.infoService.addMailInfo(this.mailInfoForm.value);
      if (result) {
        this.toasterService.success('Mail bilgileri başarıyla kaydedildi');
        // this.mailInfoForm.reset();
      } else {
        this.toasterService.error('Mail bilgileri kaydedilemedi');
      }
    } catch (error) {
      this.toasterService.error('Mail bilgileri kaydedilirken bir hata oluştu');
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

}
