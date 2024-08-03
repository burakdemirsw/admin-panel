import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { SalesPersonModel } from 'src/app/models/model/order/salesPersonModel';
import { GetUserFilter, UserClientInfoResponse, UserList_VM, UserRegister_VM } from 'src/app/models/model/user/userRegister_VM';
import { HeaderService } from 'src/app/services/admin/header.service';
import { UserService } from 'src/app/services/admin/user.service';
import { HttpClientService } from 'src/app/services/http-client.service';
import { AlertifyService } from 'src/app/services/ui/alertify.service';
import { GeneralService } from '../../services/admin/general.service';
import { ToasterService } from 'src/app/services/ui/toaster.service';
import { UserShelf } from 'src/app/models/model/user/personalShelf';
import { WarehouseService } from 'src/app/services/admin/warehouse.service';
import { AvailableShelf } from 'src/app/models/model/warehouse/availableShelf';
import { OrderService } from 'src/app/services/admin/order.service';
import { GetCustomerList_CM, CustomerList_VM } from '../../models/model/order/getCustomerList_CM';

@Component({
  selector: 'app-pages-register',
  templateUrl: './pages-register.component.html',
  styleUrls: ['./pages-register.component.css']
})
export class PagesRegisterComponent implements OnInit {
  registerForm: FormGroup;
  isUpdate: boolean = false;
  id: number = 0;
  constructor(
    private generalService: GeneralService,
    private formBuilder: FormBuilder,
    private userService: UserService,
    private headerService: HeaderService,
    private alertifyService: AlertifyService,
    private httpClientService: HttpClientService,
    private activatedRoute: ActivatedRoute,
    private toasterService: ToasterService,
    private warehouseService: WarehouseService,
    private orderService: OrderService

  ) { }

  userList: UserList_VM[] = []
  async ngOnInit() {
    this.headerService.updatePageTitle("Kullanıcı Ekle")
    this.formGenerator();
    this.shelfFormGenerator();
    await this.getShelves();
    await this.getSalesPersonModels()
    this.user_info = await this.userService.getUserClientInfoResponse();
    this.activatedRoute.params.subscribe(async (params) => {
      if (params['userId']) {

        this.id = Number(params['userId'])
        await this.getUserShelves();
        this.isUpdate = true;
        await this.findUser(Number(params['userId']))
      }
    })
    if (!this.id) {
      this.isUpdate = false;
    }


  }
  user_info: UserClientInfoResponse;
  userShelves: UserShelf[] = [];
  shelves: AvailableShelf[] = [];
  selectedShelve: AvailableShelf;
  async getShelves() {
    var response = await this.warehouseService.getAvailableShelves()
    this.shelves = response;
  }
  async getUserShelves() {
    var response = await this.userService.getUserShelves(this.id)
    this.userShelves = response;
  }
  async deleteUserShelf(id: number) {
    var response = await this.userService.deleteUserShelf(id)
    if (response) {
      this.toasterService.success("Silindi");
      await this.getUserShelves();
    } else {
      this.toasterService.warn("Silinmedi")
    }
  }
  async addUserShelf(request: UserShelf) {
    var response = await this.userService.addUserShelf(request)
    if (response) {
      this.toasterService.success("Eklendi");
      await this.getUserShelves();
    } else {
      this.toasterService.warn("Eklenmedi")
    }
  }
  async updateUserShelf(request: UserShelf) {
    var response = await this.userService.updateUserShelf(request)
    if (response) {
      this.toasterService.success("Güncellendi");
    } else {
      this.toasterService.warn("Güncellenmedi")
    }
  }
  async findUser(userId: number) {
    this.userList = await this.userService.getUsers(new GetUserFilter(userId))
    if (this.userList.length > 0) {
      this.updateUserModal(this.userList[0]);
    }
  }

  updateUserModal(registerModel: UserList_VM) {
    if (registerModel) {
      this.registerForm.get("firstName").setValue(registerModel.firstName);
      this.registerForm.get("lastName").setValue(registerModel.lastName);
      this.registerForm.get("email").setValue(registerModel.email);
      this.registerForm.get("printerName_1").setValue(registerModel.printerName_1);
      this.registerForm.get("printerName_2").setValue(registerModel.printerName_2);
      var findedRole = this.roleDescriptions.find(r => r.role === registerModel.roleDescription)
      this.registerForm.get("roleDescription").setValue(findedRole);
      // this.registerForm.get("password").setValue(registerModel.password);
      // this.registerForm.get("confirmPassword").setValue(registerModel.password);
      this.registerForm.get("currAccCode").setValue(registerModel.currAccCode);

      this.registerForm.get("phoneNumber").setValue(registerModel.phoneNumber);
      this.registerForm.get("salesPersonCode").setValue(registerModel.salesPersonCode);

      var salesPerson = this.salesPersonModels.find(sp => sp.salespersonCode === registerModel.salesPersonCode)
      this.selectedPerson = { name: salesPerson.firstLastName, code: registerModel.salesPersonCode }
      this.salesPersonModelList.push(this.selectedPerson);

    } else {
      this.registerForm.reset();
    }
  }
  customerModels: CustomerList_VM[] = [];
  salesPersonModels: SalesPersonModel[] = [];
  salesPersonModelList: any[] = [];
  customerModelList: any[] = [];
  selectedPerson: any;
  selectedCustomer: any;
  async getSalesPersonModels(): Promise<any> {
    try {
      this.salesPersonModels = await this.httpClientService
        .get<SalesPersonModel>({
          controller: 'Order/GetSalesPersonModels',
        })
        .toPromise();

      this.salesPersonModelList = this.salesPersonModels.map((c) => {
        return { name: (c.firstLastName + " " + `${c.salespersonCode}`), code: c.salespersonCode };
      });

      //------------
      var request: GetCustomerList_CM = new GetCustomerList_CM();
      request.currAccCode = null;
      var response: CustomerList_VM[] = await this.orderService.getCustomerList_2(request);

      this.customerModels = response;
      this.customerModelList = this.customerModels.map((c) => {
        return { name: (c.currAccDescription + " " + `${c.currAccCode}`), code: c.currAccCode };
      });
    } catch (error: any) {
      this.alertifyService.error(error.message);
      return null;
    }
  }


  roleDescriptions: any[] = [{ role: "Admin" }, { role: "Salesman" }, { role: "Test User" }]
  selectedRole: any;
  shelfForm: FormGroup;
  shelfFormGenerator() {

    this.shelfForm = this.formBuilder.group({
      shelfNo: [null, Validators.required]
    });


  }
  formGenerator() {
    this.registerForm = this.formBuilder.group({
      // firstName: ['Burak', Validators.required],
      // lastName: ['Burak', Validators.required],
      // email: [{ value: 'demir.burock96@gmail.com', disabled: false }, [Validators.required, Validators.email]],
      // phoneNumber: [null, Validators.required],
      // salesPersonCode: [null, Validators.required],
      // password: [null],
      // confirmPassword: [null],
      // gender: ["Erkek"],
      // roleDescription: [],
      // printerName_1: ['Burak'],
      // printerName_2: ['Burak'],
      // currAccCode: ['Burak']
      firstName: [null, Validators.required],
      lastName: [null, Validators.required],
      email: [{ value: null, disabled: false }, [Validators.required, Validators.email]],
      phoneNumber: [null, Validators.required],
      salesPersonCode: [null, Validators.required],
      password: [null],
      confirmPassword: [null],
      gender: [null],
      roleDescription: [null],
      printerName_1: [null],
      printerName_2: [null],
      currAccCode: [null]


    });
  }

  async submitForm() {


    //ekleme işlemi yapılcak
    if (!this.isUpdate) {
      //ekleme işlemi yapılcak
      if (this.registerForm.valid) {
        if (
          this.registerForm.value.password ===
          this.registerForm.value.confirmPassword
        ) {


          const model: UserRegister_VM = {
            id: 0,
            firstName: this.registerForm.value.firstName,
            lastName: this.registerForm.value.lastName,
            password: this.registerForm.value.password,
            salesPersonCode: this.registerForm.value.salesPersonCode.code,
            email: this.registerForm.value.email,
            phoneNumber: this.registerForm.value.phoneNumber,
            gender: this.registerForm.value.gender,
            roleDescription: this.registerForm.value.roleDescription.role,
            printerName_1: this.registerForm.value.printerName_1,
            printerName_2: this.registerForm.value.printerName_2,
            currAccCode: this.registerForm.value.currAccCode.code


          };

          var response = await this.userService.register(model);
          if (response == true) {


            this.generalService.waitAndNavigate("İşlem Başaılı: " + "Kullanıcı Sisteme Eklendi", "user-list")

          } else {
            this.toasterService.warn('Müşteri Eklenmedi');
          }
          //console.log("Model:", model);
        } else {
          this.alertifyService.error("Şifreler Uyuşmuyor");
        }
      } else {

        this.generalService.whichRowIsInvalid(this.registerForm)
      }
    } else {
      //güncelleme işlemi yapılcak
      if (this.registerForm.valid) {
        if (
          this.registerForm.value.password ===
          this.registerForm.value.confirmPassword
        ) {
          const model: UserRegister_VM = {
            id: this.userList[0].id,
            firstName: this.registerForm.value.firstName,
            lastName: this.registerForm.value.lastName,
            password: this.registerForm.value.password,
            salesPersonCode: this.registerForm.value.salesPersonCode.code,
            email: this.registerForm.value.email,
            phoneNumber: this.registerForm.value.phoneNumber,
            gender: this.registerForm.value.gender,
            roleDescription: this.registerForm.value.roleDescription.role,
            printerName_1: this.registerForm.value.printerName_1,
            printerName_2: this.registerForm.value.printerName_2,
            currAccCode: this.registerForm.value.currAccCode.code

          };

          var response = await this.userService.update(model);
          if (response == true) {
            // this.router.navigate(['/login']);
            this.generalService.waitAndNavigate("İşlem Başaılı: " + "Kullanıcı Güncellendi", "user-list")



          } else {
            this.toasterService.warn('Müşteri Güncellenmedi');
          }
          //console.log("Model:", model);
        } else {
          this.alertifyService.error("Şifreler Uyuşmuyor");
        }
      } else {
        //console.log("Form Geçerli Değil");
        //console.log(this.registerForm.value);
      }
    }

  }

  async onShelfFormSubmit(form: any) {
    var filter: GetUserFilter = new GetUserFilter();
    filter.count = 100;
    var _list: UserList_VM[] = await this.userService.getUsers(filter)
    var finded_user = _list.find(u => u.id == this.id);
    if (finded_user) {
      if (this.shelfForm.valid) {

        const isValid = !this.userShelves?.some(x => x.shelfNo === form.shelfNo.description);

        if (isValid) {
          var request: UserShelf = new UserShelf();
          request.shelfNo = form.shelfNo.description;
          request.userId = finded_user.id;
          request.customerCode = finded_user.currAccCode;
          await this.addUserShelf(request);
        }
        else {
          this.toasterService.warn("Bu Raf Zaten Eklendi")
        }
      } else {
        this.toasterService.warn("Form Geçersiz")
      }

    } else {
      this.toasterService.warn("Kullanıcı Bulunamadı")
    }


  }
}
