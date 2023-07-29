import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { BarcodeModel } from 'src/app/models/model/product/barcodeModel';
import { WarehosueOperationDetailModel } from 'src/app/models/model/warehouse/warehosueOperationDetail';
import { WarehouseOperationListModel } from 'src/app/models/model/warehouse/warehosueOperationListModel';
import { ShelfService } from 'src/app/services/admin/shelf.service';
import { HttpClientService } from 'src/app/services/http-client.service';
import { AlertifyService } from 'src/app/services/ui/alertify.service';
import { WarehouseOperationProductModel } from 'src/app/models/model/warehouse/warehouseOperationProductModel';

@Component({
  selector: 'app-warehouse-operation-confirm-detail',
  templateUrl: './warehouse-operation-confirm-detail.component.html',
  styleUrls: ['./warehouse-operation-confirm-detail.component.css']
})
export class WarehouseOperationConfirmDetailComponent implements OnInit,OnDestroy {
  warehouseConfirmForm :FormGroup;
  activeTab :number = 1; 
  constructor(  
    private httpClientService: HttpClientService,
    private formBuilder: FormBuilder,
    private alertifyService: AlertifyService,
    private activatedRoute: ActivatedRoute,
    private spinnerService: NgxSpinnerService,
    private shelfService: ShelfService
  ) { } 
  ngOnDestroy(): void {
    localStorage.removeItem('currentWarehosue');
  }
  warehosueOperationDetail  : WarehosueOperationDetailModel[] = [];
  totalProductNumber : number = this.warehosueOperationDetail.length ;

  ngOnInit(): void {

    this.activatedRoute.params.subscribe((params) => {
      this.spinnerService.show();
      this.formGenerator();
      this.getWarehosueOperationDetail(params['innerNumber']);
      this.getWarehouse(params['innerNumber'])
      // this.formGenerator();
      setTimeout(() => {
        this.spinnerService.hide();
      }, 1000);
    });
  }

  takeProduct(productCode:string){

  }
warehouseOperationListModel :WarehouseOperationListModel;
  getWarehouse(innerNumber : string){
    try {
      this.httpClientService
        .get<WarehouseOperationListModel>({
          controller: 'Warehouse/GetWarehouseOfperationDetail/'+innerNumber,
        })
        .subscribe((data) => {
           this.warehouseOperationListModel = data[0];
         
          console.log(data);

          this.formGenerator();
          
        });
    } catch (error: any) {
      console.log(error.message);
    }
  }
  formGenerator() {
  
    try {
      this.warehouseConfirmForm = this.formBuilder.group({
       
        shelfNo: ["",Validators.required],
        barcode: ["",Validators.required]
 
        
      });
    } catch (error:any) {
      alert(error.message)
    }

  }
  barcodeModel : BarcodeModel ;
  getProductDetailAndDropFromList(){
    // var value = (document.getElementById("barcode") as HTMLInputElement).value
    var value = this.warehouseConfirmForm.get("barcode")?.value;
    try {
      this.httpClientService
        .get<BarcodeModel>({
          controller: 'Warehouse/GetBarcodeDetail/' + value,
        })
        .subscribe((data) => {
          this.barcodeModel = data[0];
          this.onSubmit(data[0])
          console.log(data);

          this.formGenerator();
          
        });
    } catch (error: any) {
      console.log(error.message);
    }
  }

  

  onSubmit(barcodeModel:BarcodeModel){
    const itemCodeValue = barcodeModel.itemCode; // itemCode değerini formdan al

    // İlgili ürün koduna ait ürünü warehosueOperationDetail dizisinde bul
    const product = this.warehosueOperationDetail.find(
      (detail) => detail.itemCode === itemCodeValue
    );

    if (product) {
      if (product.qty1 > 0) {
        // Stoktan bir azaltma yap
        product.qty1 -= 1;
        this.totalProductNumber= product.qty1 
        if (product.qty1 === 0) {
        this.focusNextInput("shelfNo")
        }
      } else {
        alert('Stokta yeterli ürün bulunmamaktadır!');
      }
    } else {
      alert('Ürün bulunamadı!');
    }
  }


  fistQtyNumber : number;
  getWarehosueOperationDetail(id:string):void{
    try {
      this.httpClientService
        .get<WarehosueOperationDetailModel>({
          controller: 'Warehouse/GetWarehouseOperationDetail/'+id,
        })
        .subscribe((data) => {
          console.log(data);
          this.warehosueOperationDetail = data;
          this.fistQtyNumber = data[0].qty1
        
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

  postModel(){
    let innerNumber: string;

    this.activatedRoute.params.subscribe((params) => {
      innerNumber = params['innerNumber'];
    
      let model: WarehouseOperationProductModel = new WarehouseOperationProductModel();
      model.barcode = this.warehouseConfirmForm.get("barcode")?.value;
      model.lot = this.barcodeModel == undefined ? "null" : this.barcodeModel.party;
      model.quantity = (this.fistQtyNumber - this.totalProductNumber).toString();
      model.shelfNumber = this.warehouseConfirmForm.get("shelfNo")?.value;
      model.warehouse = localStorage.getItem("currentWarehouse")?.toString() || "";
      model.innerNumber = innerNumber;
      try {
        this.httpClientService
          .post<WarehouseOperationProductModel>({
            controller: 'Warehouse/SendNebımToTransferProduct',
          },model)
          .subscribe((data) => {
            console.log(data);
  
          
          });
      } catch (error: any) {
        console.log(error.message);
      }
      // Diğer işlemler...
    });



  }
  
  

}

// Create PROCEDURE [dbo].[Usp_PostZtMSRAFSTOK]
// 	(	 @Barkod nvarchar(50) //bu değer formdan 
// 	,@Parti  nvarchar(50)  //bu değer sp den 
// 	, @Rafno  nvarchar(50)// bu değer formdan 
// 	,@Adet   nvarchar(50)//bu değer fistQtyNumber'dan
// 	,@Depo   nvarchar(50)//bu değer 
// )