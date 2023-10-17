import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { CountListFilterModel } from 'src/app/models/model/filter/countListFilterModel';
import { CountListModel } from 'src/app/models/model/product/countListModel';
import { WarehouseOperationListModel } from 'src/app/models/model/warehouse/warehosueOperationListModel';
import { GeneralService } from 'src/app/services/admin/general.service';
import { WarehouseService } from 'src/app/services/admin/warehouse.service';
import { HttpClientService } from 'src/app/services/http-client.service';
import { AlertifyService } from 'src/app/services/ui/alertify.service';

@Component({
  selector: 'app-warehouse-shelf-count-list',
  templateUrl: './warehouse-shelf-count-list.component.html',
  styleUrls: ['./warehouse-shelf-count-list.component.css']
})

export class WarehouseShelfCountListComponent implements OnInit {
  constructor(
    private httpClientService: HttpClientService,
    private alertifyService: AlertifyService,
    private spinnerService: NgxSpinnerService,
    private router: Router,
    private formBuilder: FormBuilder,

    private warehouseService : WarehouseService,
    private generalService : GeneralService,
    private title : Title
  ) { }

  async ngOnInit() {
    this.title.setTitle("Sayım")

    this.spinnerService.show();
    this.  formGenerator() ;
    await this.getGetCountList();
  
    
    this.spinnerService.hide();

  }
  currentPage:number = 1; // Başlangıçta ilk sayfayı göster
  filterForm: FormGroup;

  innerNumberList : string[] = [];
  addInnerNumberToList(innerNumber : string){
    if (!this.innerNumberList.includes(innerNumber)) {
      this.innerNumberList.push(innerNumber);
    } else {
      const index = this.innerNumberList.indexOf(innerNumber);
      this.innerNumberList.splice(index, 1);
    }
  }
  async newCount(){
    try {
      const orderNo : string  = await this.generalService.generateGUID();
      this.router.navigate(['/warehouse-shelf-count/'+orderNo]);
    } catch (error: any) {
      console.log(error.message);
    }

  }

  countList : CountListModel[]

  async getGetCountList(): Promise<any> {
    try {
      this.countList = await this.warehouseService.getCountList();
    } catch (error: any) {
      console.log(error.message);
    }
  }

  formGenerator() {
    this.filterForm = this.formBuilder.group({
      orderNo: [null, Validators.required],
      totalProduct: [null, Validators.required],
      startDate: [null, Validators.required],
      endDate: [null, Validators.required]

    });
  }

  async onSubmit(model:CountListFilterModel){
    this.spinnerService.show()
    const response =  await this.warehouseService.GetCountListByFilter(model)
    if(response){
      this.countList = response;
      this.spinnerService.hide()
    }
  }
  async filterList(){
   
  }
}