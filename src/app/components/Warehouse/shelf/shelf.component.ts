import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Router, ActivatedRoute } from '@angular/router';
import { Shelf } from 'src/app/models/model/warehouse/availableShelf';
import { GeneralService } from 'src/app/services/admin/general.service';
import { HeaderService } from 'src/app/services/admin/header.service';
import { OrderService } from 'src/app/services/admin/order.service';
import { ProductService } from 'src/app/services/admin/product.service';
import { WarehouseService } from 'src/app/services/admin/warehouse.service';
import { ToasterService } from 'src/app/services/ui/toaster.service';

@Component({
  selector: 'app-shelf',
  templateUrl: './shelf.component.html',
  styleUrls: ['./shelf.component.css']
})
export class ShelfComponent implements OnInit {
  shelves: Shelf[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private toasterService: ToasterService,
    private orderService: OrderService,
    private router: Router,

    private activatedRoute: ActivatedRoute,
    private productService: ProductService,
    private warehouseService: WarehouseService,
    private generalService: GeneralService,
    private title: Title,
    private headerService: HeaderService
  ) { }
  updateShelfForm: FormGroup;
  shelfForm: FormGroup;
  selectedShelf: Shelf | null = null;
  displayUpdateDialog: boolean = false;
  ngOnInit(): void {
    this.loadShelves();
    this.shelfForm = this.formBuilder.group({
      id: [null],
      warehouse: [null],
      shelfNo: [null, Validators.required],
      rowNumber: [null],
      konum: [null],
      createdDate: [Date.now],
      updatedDate: [Date.now],
    });
    this.updateShelfForm = this.formBuilder.group({
      id: [null],
      warehouse: ['', Validators.required],
      shelfNo: ['', Validators.required],
      rowNumber: ['', Validators.required],
      konum: ['', Validators.required],
      createdDate: [Date.now],
      updatedDate: [Date.now],
    });
  }

  async loadShelves() {
    try {
      this.shelves = await this.warehouseService.getShelves();
    } catch (error) {
      console.error('Error loading shelves:', error);
      this.toasterService.error('Raflar yüklenirken bir hata oluştu.');
    }
  }


  openUpdateDialog(shelf: Shelf) {
    this.selectedShelf = shelf;
    this.updateShelfForm.patchValue(shelf);
    this.displayUpdateDialog = true;
  }
  async addShelf(request: Shelf) {
    if (this.shelfForm.valid) {
      request.id = await this.generalService.generateGUID();
      const success = await this.warehouseService.addShelf(request);
      if (success) {
        this.loadShelves();
        this.toasterService.success("Eklendi")
        this.shelfForm.reset();
      }
    } else {
      this.toasterService.error("Form Hatalı")
    }
  }
  async updateShelf() {
    if (this.updateShelfForm.valid && this.selectedShelf) {
      const updatedShelf = { ...this.selectedShelf, ...this.updateShelfForm.value };
      const success = await this.warehouseService.updateShelf(updatedShelf);
      if (success) {
        this.loadShelves();
        this.displayUpdateDialog = false;
      }
    }
  }
  async deleteShelf(id: string) {
    const success = await this.warehouseService.removeShelf(id);
    if (success) {
      this.loadShelves();
      this.toasterService.success("Silindi")
      this.shelfForm.reset();
    }
    else {
      this.toasterService.error("Silinemedi")
    }
  }

}
