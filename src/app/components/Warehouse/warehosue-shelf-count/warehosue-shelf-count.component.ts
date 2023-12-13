import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DomSanitizer, SafeUrl, Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ClientUrls } from 'src/app/models/const/ClientUrls';
import { CreatePurchaseInvoice } from 'src/app/models/model/invoice/createPurchaseInvoice';
import { CountProductRequestModel2 } from 'src/app/models/model/order/countProductRequestModel2';
import { OrderBillingListModel } from 'src/app/models/model/order/orderBillingListModel';
import { ProductOfOrder } from 'src/app/models/model/order/productOfOrders';
import { CountedProduct } from 'src/app/models/model/product/countedProduct';
import { ItemBillingModel } from 'src/app/models/model/product/itemBillingModel ';
import { ProductCountModel } from 'src/app/models/model/shelfNameModel';
import { AvailableShelf } from 'src/app/models/model/warehouse/availableShelf';
import { WarehouseOfficeModel } from 'src/app/models/model/warehouse/warehouseOfficeModel';
import { GeneralService } from 'src/app/services/admin/general.service';
import { OrderService } from 'src/app/services/admin/order.service';
import { ProductService } from 'src/app/services/admin/product.service';
import { WarehouseService } from 'src/app/services/admin/warehouse.service';
import { HttpClientService } from 'src/app/services/http-client.service';
import { AlertifyService } from 'src/app/services/ui/alertify.service';
declare var window: any;

@Component({
  selector: 'app-warehosue-shelf-count',
  templateUrl: './warehosue-shelf-count.component.html',
  styleUrls: ['./warehosue-shelf-count.component.css'],
})
export class WarehosueShelfCountComponent implements OnInit {

  @Input() infoProducts: CreatePurchaseInvoice[] = []; 
  [x: string]: any;
  productsToCollect: ProductOfOrder[];
  collectedProducts: ProductOfOrder[] = [];
  process: boolean = false;
  checkForm: FormGroup;
  activeTab: number = 1;
  currentOrderNo: string = '';
  modalImageUrl: string;
  formModal: any;
  qrCodeValue: string ;
  qrCodeDownloadLink: any = this.sanitizer.bypassSecurityTrustResourceUrl('');

  constructor(
    private formBuilder: FormBuilder,
    private alertifyService: AlertifyService,
    private spinnerService: NgxSpinnerService,
    private httpClientService: HttpClientService,
    private httpClient: HttpClient,
    private productService: ProductService,
    private generalService: GeneralService,
    private warehouseService: WarehouseService,
    private orderService: OrderService,

    private activatedRoute: ActivatedRoute,
    private router: Router,
    private title: Title,
    private sanitizer: DomSanitizer,private datePipe: DatePipe
  ) {
    this.title.setTitle('Sayım');
  }
  shelfNumbers: string = 'RAFLAR:';
  async ngOnInit() {
    this.formGenerator();
    this.activatedRoute.params.subscribe(async (params) => {
      this.currentOrderNo = params['orderNo'];
      await this.getProductOfCount(this.currentOrderNo);
      await this.getAvailableShelves();
    });
  }
shelves  :AvailableShelf[] = []
shelves2  :AvailableShelf[] = []
  createJson(barcode: string,shelfNo:string,batchCode:string) {
  
    var model: CountedProduct = this.lastCollectedProducts.find(
      (p) => (p.barcode = barcode) && p.shelfNo == shelfNo  && p.batchCode == batchCode
    );
    const formDataJSON = JSON.stringify(model); // Form verilerini JSON'a dönüştür

    this.qrCodeValue = formDataJSON;
    // this.alertifyService.success(this.qrCodeValue)
    
  }
  async getAvailableShelves (){
    this.shelves = await  this.warehouseService.getAvailableShelves();
    this.shelves2.push(this.shelves[0])
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
          if(this.shelves.length-1>=index+1)
          {
            this.shelves2.push(this.shelves[index+1])
  
          }else{
            this.shelves2.push(this.shelves[0])
          }
         
        
        }
      }
    }

  onChangeURL(url: SafeUrl) {
    this.qrCodeDownloadLink = url;
    this.openImageModal(this.qrCodeDownloadLink);
    this.qrCodeValue = ''
  }

  openImageModal(imageUrl: string){
    this.modalImageUrl = imageUrl;
    if (!this.formModal) {
      this.formModal = new window.bootstrap.Modal(
        document.getElementById('myModal')
      );
    }
    this.formModal.show();
  }



  focusNextInput(nextInputId: string) {
    const nextInput = document.getElementById(nextInputId) as HTMLInputElement;
    if (nextInput) {
      nextInput.focus();
    }
  }
  orderBillingList: OrderBillingListModel[] = [];
  itemBillingModels: ItemBillingModel[] = [];

  deleteRow(index: number) {
    this.itemBillingModels.splice(index, 1); // İlgili satırı listeden sil
  }
  orderNo: string = '';
  warehouseModels: WarehouseOfficeModel[] = [];
  warehouseModels2: WarehouseOfficeModel[] = [];

  currentQrCode: string = '';
  orderBillingModel: OrderBillingListModel;
  formGenerator() {
    this.checkForm = this.formBuilder.group({
      barcode: [null, Validators.required],
      shelfNo: [null, Validators.required],
      quantity: [null],
      office: [null, Validators.required],
      batchCode: [null],
      warehouseCode: [null, Validators.required],
      isShelfBased: [null],
    });
  }
  async getSelectedOffice(from: number) {
    if (from == 1) {
      await this.getWarehouseList(this.checkForm.get('office')?.value, 1);
    } else {
      await this.getWarehouseList(this.checkForm.get('office')?.value, 2);
    }
  }
  async getWarehouseList(value: string, from: number): Promise<any> {
    try {
      if (from === 1) {
        const selectElement = document.getElementById(
          'office'
        ) as HTMLSelectElement;

        value = selectElement.value == '' ? 'M' : selectElement.value;
        await this.httpClientService
          .get<WarehouseOfficeModel>({
            controller: 'Warehouse/GetWarehouseModel/' + value,
          })
          .subscribe((data) => {
            this.warehouseModels = data;
          });
      } else {
        const selectElement = document.getElementById(
          'officeTo'
        ) as HTMLSelectElement;

        value = selectElement.value == '' ? 'M' : selectElement.value;
        await this.httpClientService
          .get<WarehouseOfficeModel>({
            controller: 'Warehouse/GetWarehouseModel/' + value,
          })
          .subscribe((data) => {
            this.warehouseModels = data;
          });
      }
    } catch (error: any) {
      //console.log(error.message);
    }
  }

  list: CountProductRequestModel2[] = [];
  totalCount: number = 0;
  currentPage: number = 1;

  calculateTotalQty() {
    //toplanan ürünler yazısı için
    let totalQty = 0;
    this.lastCollectedProducts.forEach((item) => {
      totalQty += item.quantity;
    });
    this.totalCount = totalQty;
  }
  lastCollectedProducts: CountedProduct[] = [];
  async getProductOfCount(orderNo: string): Promise<any> {
    this.lastCollectedProducts = await this.warehouseService.getProductOfCount(
      orderNo
    );
    
    this.calculateTotalQty();
  }
getCurrentDatetime():string{

 const datetime =  this.datePipe.transform(new Date(), 'yyyy-MM-dd HH:mm:ss')
 return datetime;
}
  async countProductRequest(
    barcode: string,
    shelfNo: string,
    quantity: number,
    office: string,
    warehouseCode: string,
    batchCode: string,

    url: string
  ): Promise<ProductCountModel> {
    var requestModel: CountProductRequestModel2 =
      new CountProductRequestModel2();
    requestModel.barcode = barcode;
    requestModel.shelfNo = shelfNo;
    requestModel.quantity = quantity == null ? 1 : quantity;
    requestModel.office = office;
    requestModel.warehouseCode = warehouseCode;
    requestModel.batchCode = batchCode;

    var response = await this.httpClient
      .post<ProductCountModel | undefined>(url, requestModel)
      .toPromise();

    return response;
  }

  async setShelfNo(barcode: string): Promise<string> {
    this.shelfNumbers = 'RAFLAR:';

    if (barcode.length > 10) {
      var result: string[] = await this.productService.countProductByBarcode(
        barcode
      );
      this.shelfNumbers += result[0];
      return result[1];
    } else {
      this.checkForm.get('barcode').setValue(null);
      this.focusNextInput('shelfNo');
      return null;
    }
  }

  async getQuantity(barcode: string): Promise<string> {
    var result: string[] = await this.productService.countProductByBarcode(
      barcode
    );

    return result[1];
  }
state : boolean  = true;
  async onSubmit(
    countProductRequestModel: CountProductRequestModel2
  ): Promise<any> {

    if (!this.checkForm.valid) {
      if (countProductRequestModel.barcode) {
        var number = await this.setShelfNo(countProductRequestModel.barcode);
        this.checkForm.get('quantity')?.setValue(Number(number)); //quantity alanı dolduruldu
        this.alertifyService.success(
          'Raflar Getirildi Ve Miktar Alanı Dolduruldu.'
        );
      } else {
        this.alertifyService.warning('Barkod Alanı Boş.');
      }
      return;
    } else {
      const url = ClientUrls.baseUrl + '/Order/CountProduct3';

      try {

          var newResponse = await this.productService.countProductByBarcode(
            countProductRequestModel.barcode
          );

          const shelves = newResponse[0]
            .split(',')
            .filter((raflar) => raflar.trim() !== '').map((raflar) => raflar.toLowerCase());;
            if(this.state){
              this.state = false;
              if (shelves.includes(countProductRequestModel.shelfNo.toLowerCase())) {
                var response: ProductCountModel =
                  await this.warehouseService.countProductRequest(
                    countProductRequestModel.barcode,
                    countProductRequestModel.shelfNo,
                    countProductRequestModel.quantity == null
                      ? Number(newResponse[1])
                      : countProductRequestModel.quantity,
                    countProductRequestModel.office,
                    countProductRequestModel.warehouseCode,
                    countProductRequestModel.batchCode,
                    'Order/CountProduct3',
                    this.currentOrderNo,
                    ''
                  );
                if (response != undefined) {
                  var data: ProductCountModel = response;
                  if (data.status == 'RAF') {
                    countProductRequestModel.shelfNo = response.description;
                  } else {
                    countProductRequestModel.barcode = response.description;
                  }
    
                  const parcalanmisVeri = this.shelfNumbers.split(':');
                  const raflarKismi = parcalanmisVeri[1];
                  const raflar = raflarKismi
                    .split(',')
                    .filter((raflar) => raflar.trim() !== '').map((raflar) => raflar.toLowerCase());
                    
                    if (raflar.length>0) {
                    if (raflar.includes(countProductRequestModel.shelfNo.toLowerCase())) {
                      countProductRequestModel.quantity = Number(newResponse[1]);
                      this.generalService.beep();
                      await this.getProductOfCount(this.currentOrderNo); //this.list.push(countProductRequestModel);
                      this.calculateTotalQty();
                      this.clearQrAndBatchCode();
                      this.state = true;
                    } else {
                      if (confirm('Raf Bulunamadı! Eklensin mi(1)?')) {
                        this.generalService.beep();
    
                        var newResponse =
                          await this.productService.countProductByBarcode(
                            countProductRequestModel.barcode
                          );
                        countProductRequestModel.quantity = Number(newResponse[1]);
                        await this.getProductOfCount(this.currentOrderNo); //this.list.push(countProductRequestModel);
                        this.calculateTotalQty();
                        this.clearQrAndBatchCode();
                        this.state = true;
                      } else {
                        
                        this.calculateTotalQty();
                        this.state = true;
                        this.alertifyService.warning('Ekleme Yapılmadı!');
                      }
                    }
                  } else {
                    countProductRequestModel.quantity = Number(newResponse[1]);
                    this.generalService.beep();
    
                    await this.getProductOfCount(this.currentOrderNo); //this.list.push(countProductRequestModel);
                    this.calculateTotalQty();
                    this.clearQrAndBatchCode();
                    this.state = true;
                  }
                }
              } else {
                if (
                  confirm(
                    'Raf Bulunamadı! Raf Barkod Doğrulaması Yapılmadan Eklensin mi(2)?'
                  )
                ) {
                  var number = await this.setShelfNo(
                    countProductRequestModel.barcode
                  );
                  this.checkForm.get('quantity')?.setValue(Number(number));
    
                  var response: ProductCountModel =
                    await this.warehouseService.countProductRequest(
                      countProductRequestModel.barcode,
                      countProductRequestModel.shelfNo,
                      countProductRequestModel.quantity === null
                        ? Number(newResponse[1])
                        : countProductRequestModel.quantity,
                      countProductRequestModel.office,
                      countProductRequestModel.warehouseCode,
                      countProductRequestModel.batchCode,
                      'Order/CountProduct3',
                      this.currentOrderNo,
                      ''
                    );
    
                  if (response != undefined) {
                    var data: ProductCountModel = response;
                    if (data.status == 'RAF') {
                      countProductRequestModel.shelfNo = response.description;
                    } else {
                      countProductRequestModel.barcode = response.description;
                    }
                    this.generalService.beep();
                    countProductRequestModel.quantity = Number(newResponse[1]);
                    await this.getProductOfCount(this.currentOrderNo); //this.list.push(countProductRequestModel);
                    this.calculateTotalQty();
                    this.clearQrAndBatchCode();
                    this.state = true;
                  }
                } else {
                  var number = await this.setShelfNo(
                    countProductRequestModel.barcode
                  );
                  this.checkForm.get('quantity')?.setValue(Number(number));
                  this.alertifyService.success(
                    'Raflar Getirildi Ve Miktar Alanı Dolduruldu.'
                  );
                  this.state = true;
                }
              }
            }
         
        
      } catch (error: any) {
        this.alertifyService.error(error.message);
        this.state = true
      }
    }
  }
  isFirstBarcode: boolean = false;
  currentbarcode: string;
  barcodeList: string[] = [];
  async checkBarcodeList(barcode: string): Promise<any> {
    var number = barcode.length;
    if (barcode.length >= 45) {
      // 1 saniye bekletmek için setTimeout kullanılıyor

      const data = await this.productService.countProductByBarcode2(
        this.checkForm.get('barcode').value
      );
      if (this.barcodeList.includes(data)) {
        console.log('B.A.S Kapandı!');
        this.isFirstBarcode = false;
        return;
      } else {
        this.isFirstBarcode = true;
        this.barcodeList.push(data);
        this.checkForm.get('quantity').setValue(null);
        console.log('B.A.S Devrede!');
      }
    }
  }
  timer: any;

  async startBarcodeTimer(barcode: string): Promise<any> {
    if( barcode !=undefined){
      if(barcode.length>=45){
        try {
          const waitTime = 1000;
    
          if (this.timer) {
            // Daha önce bir zamanlayıcı varsa iptal et
            clearTimeout(this.timer);
          }
      
          this.timer = setTimeout(() => {
            // 1 saniye bekledikten sonra işlemi gerçekleştir
            this.checkBarcodeList(barcode);
            this.timer = null; // Zamanlayıcıyı sıfırla
          }, waitTime);
        } catch (error) {
          console.log(error.message)
        }
      }
     
    }else{
      return;
    }
    
   
  }

  async check() {
    await this.onSubmit(this.checkForm.value);
  }

  enableBarcodeInput() {
    this.checkForm.get('barcode')?.enable();
  }
  clearShelfNumbers() {
    this.checkForm.get('shelfNo').setValue(null);
    this.checkForm.get('barcode').setValue(null);
    this.focusNextInput('shelfNo');
    this.shelfNumbers = 'RAFLAR:';
    this.checkForm.get('quantity').setValue(null);
    this.checkForm.get('batchCode').setValue(null)
  }
  clearQrAndBatchCode() {
    this.checkForm.get('barcode').setValue(null);
    this.checkForm.get('batchCode').setValue(null);
    this.checkForm.get('quantity').setValue(null);
    this.focusNextInput('countPageBarcode');
  }

  async completeCountFromService(orderNo: string): Promise<boolean> {
    try {
      // İşlem öncesi kullanıcıya onay iletilisi göster
      const userConfirmed = window.confirm("İşlemi tamamlamadan önce sayımı eşitlemek istiyor musunuz?");
      
      if (!userConfirmed) {
        // Kullanıcı işlemi onaylamadıysa işlemi iptal et
        return false;
      }
  
      this.spinnerService.show();
      const response = await this.productService.completeCount(
        this.currentOrderNo +
          '|' +
          (document.getElementById('isShelfBased') as HTMLInputElement).checked
      );
  
      if (response === true) {
        this.spinnerService.hide();
        this.router.navigate(['/warehouse-shelf-count-list']);
        return true;
      } else {
        this.spinnerService.hide();
        this.alertifyService.error("İşlem Başarısız");
        return false;
      }
    } catch (error:any) {
      this.spinnerService.hide();
      this.alertifyService.error("İşlem Başarısız");
      return false;
    }
  }
  

  async deleteOrderProduct(
    orderNo: string,
    itemCode: string,
    shelfNo: string
  ): Promise<boolean> {
    const response: boolean = await this.productService.deleteOrderProduct(
      this.currentOrderNo,
      itemCode
    );
    if (response) {
      this.list = this.list.filter(
        (o) => !(o.barcode == itemCode && o.shelfNo == shelfNo)
      );
      this.calculateTotalQty();
      await this.getProductOfCount(this.currentOrderNo);
      this.alertifyService.success('Silme İşlemi Başarılı.');
    } else {
      this.alertifyService.error('Silme İşlemi Başarısız.');
    }
    return response;
  }
}
