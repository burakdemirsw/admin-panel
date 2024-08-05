import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NebimInfo } from 'src/app/models/model/company/companyInfo';
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
  nebimInfos: NebimInfo[] = [];
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

    this.loadCompanyInfo();
    this.loadNebimInfo();
    this.loadMailInfo();
    this.loadDatabaseInfo();
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

  async loadCompanyInfo() {
    try {
      const data = await this.infoService.getCompanyInfos();
      if (data) {
        this.companyInfoForm.patchValue(data[0]);
      }
    } catch (error) {
      this.toasterService.error('Şirket bilgileri yüklenirken bir hata oluştu');
    }
  }

  async loadNebimInfo() {
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
        this.mailInfoForm.patchValue(data[0]);
      }
    } catch (error) {
      this.toasterService.error('Mail bilgileri yüklenirken bir hata oluştu');
    }
  }

  async loadDatabaseInfo() {
    try {
      const data = await this.infoService.getDatabaseInfos();
      if (data) {
        this.databaseInfoForm.patchValue(data[0]);
      }
    } catch (error) {
      this.toasterService.error('Veritabanı bilgileri yüklenirken bir hata oluştu');
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
        this.companyInfoForm.reset();
      } else {
        this.toasterService.error('Şirket bilgileri kaydedilemedi');
      }
    } catch (error) {
      this.toasterService.error('Şirket bilgileri kaydedilirken bir hata oluştu');
    }
  }

  async onSubmitNebimInfo() {
    if (this.nebimInfoForm.invalid) {
      this.toasterService.error('Lütfen tüm gerekli alanları doldurun');
      return;
    }

    try {
      const result = await this.infoService.addNebimInfo(this.nebimInfoForm.value);
      if (result) {
        await this.loadNebimInfo();
        this.toasterService.success('Nebim bilgileri başarıyla kaydedildi');
        this.nebimInfoForm.reset();
      } else {
        this.toasterService.error('Nebim bilgileri kaydedilemedi');
      }
    } catch (error) {
      this.toasterService.error('Nebim bilgileri kaydedilirken bir hata oluştu');
    }
  }

  async onSubmitMailInfo() {
    if (this.mailInfoForm.invalid) {
      this.toasterService.error('Lütfen tüm gerekli alanları doldurun');
      return;
    }

    try {
      const result = await this.infoService.addMailInfo(this.mailInfoForm.value);
      if (result) {
        this.toasterService.success('Mail bilgileri başarıyla kaydedildi');
        this.mailInfoForm.reset();
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
        this.toasterService.success('Veritabanı bilgileri başarıyla kaydedildi');
        this.databaseInfoForm.reset();
      } else {
        this.toasterService.error('Veritabanı bilgileri kaydedilemedi');
      }
    } catch (error) {
      this.toasterService.error('Veritabanı bilgileri kaydedilirken bir hata oluştu');
    }
  }
}
