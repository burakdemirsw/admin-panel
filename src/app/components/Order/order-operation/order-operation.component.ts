import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { BarcodeModel } from 'src/app/models/model/product/barcodeModel';
import { ProductCreateModel } from 'src/app/models/model/product/productCreateModel';
import { ProductService } from 'src/app/services/admin/product.service';
import { HttpClientService } from 'src/app/services/http-client.service';
import { AlertifyService } from 'src/app/services/ui/alertify.service';
import { BarcodeAddModel } from '../../../models/model/product/barcodeAddModel';
import { OrderSaleDetail } from 'src/app/models/model/order/orderSaleDetail';
import { ActivatedRoute, Router } from '@angular/router';
import { OrderService } from '../../../services/admin/order.service';
import { OrderBillingListModel } from 'src/app/models/model/order/orderBillingListModel';
import { ProductOfOrder } from 'src/app/models/model/order/productOfOrders';
import { ItemBillingModel } from 'src/app/models/model/product/itemBillingModel ';
import { ClientUrls } from 'src/app/models/const/ClientUrls';
import { CountProductRequestModel } from 'src/app/models/model/order/countProductRequestModel';
import { ProductCountModel } from 'src/app/models/model/shelfNameModel';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';

@Component({
  selector: 'app-order-operation',
  templateUrl: './order-operation.component.html',
  styleUrls: ['./order-operation.component.css']
})
export class OrderOperationComponent implements OnInit {
  productsToCollect: ProductOfOrder[];
  collectedProducts: ProductOfOrder[]=[];
  process: boolean = false;
  checkForm: FormGroup;
  activeTab: number = 1;
  currentOrderNo : string;
  constructor(
    private httpClientService: HttpClientService,
    private formBuilder: FormBuilder,
    private alertifyService: AlertifyService,
    private orderService: OrderService,
    private activatedRoute : ActivatedRoute,
    private router : Router,
    private httpClient : HttpClient,
    private spinnerService: NgxSpinnerService
  ) {}

  ngOnInit() {
    this.activatedRoute.params.subscribe(params=>{
       var orderNumber: string = params["orderNumber"]
       var orderNumberType = orderNumber.split('-')[1]
       if(orderNumberType==="BP"){
         this.getCollectedProducts(params["orderNumber"],"BP");

       }else{
        this.getCollectedProducts(params["orderNumber"],"WS");
       }
      this.currentOrderNo = params["orderNumber"];
    })
    this.formGenerator();
    // this.getOrdersProduct("1-WS-2-11626")
  }

    getCollectedProducts(orderNo : string,orderNoType : string): any {

      var endpoint : string  = "";
      if(orderNoType==="BP"){
        endpoint = 'Order/GetPurchaseOrderSaleDetail/'
      }else{
        endpoint= 'Order/GetOrderSaleDetail/'
      }
    try {
      this.httpClientService
        .get<ProductOfOrder>({
          controller:endpoint+orderNo,
        })
        .subscribe((data) => {
          //console.log(data);
          this.productsToCollect = data;
        });
    } catch (error: any) {
      console.log(error.message);
    }
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

  currentQrCode: string = '';
  orderBillingModel: OrderBillingListModel;
  formGenerator() {
    this.checkForm = this.formBuilder.group({
      barcode: ['', Validators.required],
      shelfNo: ['', Validators.required],
      quantity: ['', Validators.required]

    });
  }
  collectAndPack
  (list : ProductOfOrder[]){
    //nebime yolla

    try {
      this.httpClientService
      .post<ProductOfOrder[]>({
        controller: 'Order/CollectAndPack/' + this.currentOrderNo,
      }, list)
      .pipe(
        catchError((error: any) => {
          if (error.status === 400) {
            this.alertifyService.error( error.error);
          } else {
           // this.alertifyService.error('An error occurred:');
          }
          throw error; // Rethrow the error to continue error handling
        })
      )
      .subscribe((data) => {
       // this.alertifyService.success(data.toString());
        this.router.navigate(['/orders-management']);
      });
    } catch (error: any) {
     // this.alertifyService.error('An error occurred:');
    }


  }

  async onSubmit(productModel: ProductOfOrder) {
    const url = ClientUrls.baseUrl+'/Order/CountProduct';
     //satış faturası alanı------------------------------------------------------------------------
    if(this.currentOrderNo.split('-')[1]==="WS"){
      if(productModel.shelfNo=="" ||productModel.shelfNo==undefined || productModel.shelfNo==null  )
      {
        var requestModel : CountProductRequestModel = new CountProductRequestModel(); 
        requestModel.barcode=productModel.barcode;
        requestModel.shelfNo=productModel.shelfNo;
        requestModel.qty =productModel.quantity.toString() == ""  ? 1 : productModel.quantity;
        requestModel.orderNumber = this.currentOrderNo;
        var response = await this.httpClient.post<ProductCountModel | undefined>(url, requestModel).toPromise();
        
        if (response === undefined)
         {
          // Handle the undefined case, perhaps throw an error or set a default value.
        } else {
          var data: ProductCountModel = response;
  
          if(data.status=="RAF"){
            this.checkForm.get("shelfNo")?.setValue(data.description); 
            productModel.shelfNo  = response.description;
          }else{
            this.checkForm.get("barcode")?.setValue(data.description); 
            productModel.barcode  = response.description;
          }
        }

      }else  if(productModel.shelfNo!="" ||productModel.shelfNo!=undefined || productModel.shelfNo!=null  ){
        var requestModel : CountProductRequestModel = new CountProductRequestModel();
        requestModel.barcode=productModel.barcode;
        requestModel.shelfNo=productModel.shelfNo;
        requestModel.qty = productModel.quantity.toString() == ""  ? 1 : productModel.quantity;
        requestModel.orderNumber = this.currentOrderNo;
        var response = await this.httpClient.post<ProductCountModel | undefined>(url, requestModel).toPromise();
        
        if (response === undefined)
         {
          // Handle the undefined case, perhaps throw an error or set a default value.
        } else {
          var data: ProductCountModel = response  ;
  
          if(data.status=="RAF"){
            this.checkForm.get("shelfNo")?.setValue(data.description); 
            productModel.shelfNo  = response.description;
          }else{
            this.checkForm.get("barcode")?.setValue(data.description); 
            productModel.barcode  = response.description;
          }
        }
      }
     
      var foundModel = this.productsToCollect.find(
        (o) =>
          o.barcode == productModel.barcode && o.shelfNo == productModel.shelfNo
      );
      if (foundModel) {
        const foundProduct = this.productsToCollect.find(
          (o) =>
            o.barcode == productModel.barcode &&
            o.shelfNo == productModel.shelfNo
        );
        if (
          foundProduct &&
          foundProduct.quantity &&
          foundProduct.quantity > 1
        ) {

          this.checkForm.get("shelfNo")?.setValue(productModel.shelfNo);
          this.checkForm.get("quantity")?.setValue("");
          foundProduct.quantity -= productModel.quantity.toString() == ""  ? 1 : productModel.quantity;
          this.collectedProducts.push(foundModel);
          this.alertifyService.success('Ürün Toplama İşlemi Tamamlandı!');
    

        } else if (foundProduct?.quantity === 1) {


          this.checkForm.get("shelfNo")?.setValue("");
          this.checkForm.get("quantity")?.setValue("");

          const index = this.productsToCollect.indexOf(foundProduct);
          this.collectedProducts.push(foundModel);
          foundProduct.quantity -=  productModel.quantity.toString() == ""  ? 1 : productModel.quantity;
          this.alertifyService.success('Ürün Toplama İşlemi Tamamlandı!');
       
            this.productsToCollect.splice(index, 1);

            if (this.productsToCollect.length === 0) {

              //tüm ürünler bittiğinde fiş yazdırılcak 
                // fiş yazdırılırken urldeki ınvoice number sp ye gönderilcek ve fiş bilgileri alıncak
                // MISIGO-POS uygulamasından Model , Servis ve Design Alıncak 
                // Aynı Kodlar API'ye aktarılcak!.
                // mola
              alert('Tüm Ürünler Toplandı!');
           
            this.collectAndPack( this.collectedProducts)
           
             }
          
        }
      }
    
    this.checkForm.get("barcode")?.setValue("");
   // this.checkForm.get("shelfNo")?.setValue("");
    this.focusNextInput("barcode");
    }
    //alış faturası alanı--------------------------------------------------------------------
    else{ 
      if(productModel.shelfNo=="" ||productModel.shelfNo==undefined || productModel.shelfNo==null  )
      {
        var requestModel : CountProductRequestModel = new CountProductRequestModel(); 
        requestModel.barcode=productModel.barcode;
        requestModel.shelfNo=productModel.shelfNo;
        requestModel.qty =productModel.quantity.toString() == ""  ? 1 : productModel.quantity;
        requestModel.orderNumber = this.currentOrderNo;
        var response = await this.httpClient.post<ProductCountModel | undefined>(url, requestModel).toPromise();
        
        if (response === undefined)
         {
          // Handle the undefined case, perhaps throw an error or set a default value.
        } else {
          var data: ProductCountModel = response;
  
          if(data.status=="RAF"){
            this.checkForm.get("shelfNo")?.setValue(data.description); 
            productModel.shelfNo  = response.description;
          }else{
            this.checkForm.get("barcode")?.setValue(data.description); 
            productModel.barcode  = response.description;
          }
        }

      }else  if(productModel.shelfNo!="" ||productModel.shelfNo!=undefined || productModel.shelfNo!=null  ){
        var requestModel : CountProductRequestModel = new CountProductRequestModel();
        requestModel.barcode=productModel.barcode;
        requestModel.shelfNo=productModel.shelfNo;
        requestModel.qty = productModel.quantity.toString() == ""  ? 1 : productModel.quantity;
        requestModel.orderNumber = this.currentOrderNo;
        var response = await this.httpClient.post<ProductCountModel | undefined>(url, requestModel).toPromise();
        
        if (response === undefined)
         {
          
        } else {
          var data: ProductCountModel = response  ;
  
          if(data.status=="RAF"){
            this.checkForm.get("shelfNo")?.setValue(data.description); 
            productModel.shelfNo  = response.description;
          }else{
            this.checkForm.get("barcode")?.setValue(data.description); 
            productModel.barcode  = response.description;
          }
        }
      }
     //kontrol olsun i
     var foundModel2: ProductOfOrder | undefined = this.productsToCollect.find(
      (o) =>
        o?.barcode === productModel.barcode && o?.shelfNo === productModel.shelfNo
    );
    
    
      if (foundModel2 || !foundModel2  ) {
        const foundProduct = this.productsToCollect.find(
          (o) =>
            o.barcode == productModel.barcode 
        );
        if (
          foundProduct &&
          foundProduct.quantity &&
          foundProduct.quantity > 1
        ) {

          this.checkForm.get("shelfNo")?.setValue(productModel.shelfNo);
          this.checkForm.get("quantity")?.setValue("");
          foundProduct.quantity -= productModel.quantity.toString() == ""  ? 1 : productModel.quantity;
          if (foundModel2 !== undefined) {
            var foundModel3: ProductOfOrder | undefined = this.productsToCollect.find(
              (o) => o?.barcode === productModel.barcode
            );
            
            if (foundModel3 !== undefined) {
              foundModel3.shelfNo = productModel.shelfNo;
              this.collectedProducts.push(foundModel3);
            }
          
          }
          this.alertifyService.success('Ürün Toplama İşlemi Tamamlandı!');
    

        } else if (foundProduct?.quantity === 1) {


          this.checkForm.get("shelfNo")?.setValue("");
          this.checkForm.get("quantity")?.setValue("");

          const index = this.productsToCollect.indexOf(foundProduct);
          if (foundModel2 !== undefined) {
            var foundModel3: ProductOfOrder | undefined = this.productsToCollect.find(
              (o) => o?.barcode === productModel.barcode
            );
            
            if (foundModel3 !== undefined) {
              foundModel3.shelfNo = productModel.shelfNo;  
              this.collectedProducts.push(foundModel3);
            }
          
          }
          foundProduct.quantity -=  productModel.quantity.toString() == ""  ? 1 : productModel.quantity;
          this.alertifyService.success('Ürün Toplama İşlemi Tamamlandı!');
       
            this.productsToCollect.splice(index, 1);

            if (this.productsToCollect.length === 0) {

             
              alert('Tüm Ürünler Toplandı!');
           
            this.collectAndPack( this.collectedProducts)
           
             }
          
        }
      }
    
    this.checkForm.get("barcode")?.setValue("");
   // this.checkForm.get("shelfNo")?.setValue("");
    this.focusNextInput("barcode");
    }

  }
}
