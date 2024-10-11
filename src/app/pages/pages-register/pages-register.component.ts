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
import { InfoService } from '../../services/admin/info.service';
import { WarehouseOfficeModel } from 'src/app/models/model/warehouse/warehouseOfficeModel';
import { ListItem, Role_VM, AssignRoleToUserCommandRequest } from 'src/app/components/auth/models/menu';

@Component({
  selector: 'app-pages-register',
  templateUrl: './pages-register.component.html',
  styleUrls: ['./pages-register.component.css']
})
export class PagesRegisterComponent implements OnInit {
  registerForm: FormGroup;
  isUpdate: boolean = false;
  constructor(
    private generalService: GeneralService,
    private formBuilder: FormBuilder,
    private userService: UserService,
    private headerService: HeaderService,
    private alertifyService: AlertifyService,
    private httpClientService: HttpClientService,
    private activatedRoute: ActivatedRoute,
    private infoService: InfoService
  ) { }
  clientInfo: UserClientInfoResponse;
  userList: UserList_VM[] = []
  async ngOnInit() {
    this.headerService.updatePageTitle("Kullanıcı Ekle")
    this.formGenerator();
    await this.getSalesPersonModels()
    await this.getWarehouseAndOffices();
    this.clientInfo = this.userService.getUserClientInfoResponse();
    this.activatedRoute.params.subscribe(async (params) => {
      if (params['userId']) {
        this.isUpdate = true;
        await this.findUser(Number(params['userId']))
      }
    })
  }
  warehouseOfficeModels: WarehouseOfficeModel[] = []

  async getWarehouseAndOffices() {
    var response = await this.infoService.getWarehouseAndOffices();
    this.warehouseOfficeModels = response;
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
      this.registerForm.get("phoneNumber").setValue(registerModel.phoneNumber);
      this.registerForm.get("salesPersonCode").setValue(registerModel.salesPersonCode);
      var salesPerson = this.salesPersonModels?.find(sp => sp.salespersonCode === registerModel.salesPersonCode)
      if (salesPerson) {
        this.selectedPerson = { name: salesPerson.firstLastName, code: registerModel.salesPersonCode }
        this.salesPersonModelList.push(this.selectedPerson);
      }

      this.registerForm.get("officeCode").setValue(registerModel.officeCode);
      this.registerForm.get("warehouseCode").setValue(registerModel.warehouseCode);
      this.registerForm.get("isUseAllOffice").setValue(registerModel.isUseAllOffice);

    } else {
      this.registerForm.reset();
    }
  }
  customerModelList: any[] = [];
  salesPersonModels: SalesPersonModel[] = [];
  salesPersonModelList: any[] = [];
  selectedPerson: any;
  async getSalesPersonModels(): Promise<any> {
    try {
      try {
        this.salesPersonModels = await this.httpClientService
          .get<SalesPersonModel>({
            controller: 'Order/GetSalesPersonModels',
          })
          .toPromise();

        this.salesPersonModels.forEach((c) => {
          var color: any = { name: c.firstLastName + " " + `${c.salespersonCode}`, code: c.salespersonCode };
          this.salesPersonModelList.push(color);
        });


      } catch (error: any) {
        this.alertifyService.error(error.message);
        return null;
      }
    } catch (error: any) {
      this.alertifyService.error(error.message);
    }
  }

  roleDescriptions: any[] = [{ role: "Admin" }, { role: "Salesman" }, { role: "Test User" }]
  selectedRole: any;
  formGenerator() {
    this.registerForm = this.formBuilder.group({
      firstName: [null, Validators.required],
      lastName: [null, Validators.required],
      email: [{ value: null, disabled: false }, [Validators.required, Validators.email]],
      phoneNumber: [null, Validators.required],
      salesPersonCode: [null],
      password: [null],
      confirmPassword: [null],
      gender: ["Erkek"],
      roleDescription: [null],
      printerName_1: [null],
      printerName_2: [null],
      officeCode: [null],
      warehouseCode: [null],
      isUseAllOffice: [false]


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
            salesPersonCode: this.registerForm.value.salesPersonCode?.code,
            email: this.registerForm.value.email,
            phoneNumber: this.registerForm.value.phoneNumber,
            gender: this.registerForm.value.gender,
            roleDescription: this.registerForm.value.roleDescription.role,
            printerName_1: this.registerForm.value.printerName_1,
            printerName_2: this.registerForm.value.printerName_2,
            officeCode: this.registerForm.value.officeCode,
            warehouseCode: this.registerForm.value.warehouseCode,
            isUseAllOffice: this.registerForm.value.isUseAllOffice,
          };

          var response = await this.userService.register(model);
          if (response == true) {


            this.generalService.waitAndNavigate("İşlem Başaılı: " + "Kullanıcı Sisteme Eklendi", "user-list")

          }

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
            salesPersonCode: this.registerForm.value.salesPersonCode?.code,
            email: this.registerForm.value.email,
            phoneNumber: this.registerForm.value.phoneNumber,
            gender: this.registerForm.value.gender,
            roleDescription: this.registerForm.value.roleDescription.role,
            printerName_1: this.registerForm.value.printerName_1,
            printerName_2: this.registerForm.value.printerName_2,
            officeCode: this.registerForm.value.officeCode,
            warehouseCode: this.registerForm.value.warehouseCode,
            isUseAllOffice: this.registerForm.value.isUseAllOffice,
          };

          var response = await this.userService.update(model);
          if (response == true) {

            this.generalService.waitAndNavigate("İşlem Başaılı: " + "Kullanıcı Güncellendi", "user-list")
          }

        } else {
          this.alertifyService.error("Şifreler Uyuşmuyor");
        }
      } else {

      }
    }

  }

  //rol kodları
  roles: Role_VM[] = []
  selectedItems: any[] = [];
  visible2: boolean = false;
  listItems: any[] = []
  listHeader: string = "null";
  selectAll = false;
  selectedUser: UserList_VM = null;
  async openModalForUser() {
    var response = await this.userService.getUsers(new GetUserFilter(this.clientInfo.userId))
    var user = response[0];
    this.selectedUser = user;
    if (this.visible2) {
      this.visible2 = false;
    } else {
      this.visible2 = true
    }
    this.listHeader = user.firstName + " " + user.lastName
    this.roles = await this.userService.getRoles(0);
    var items: ListItem[] = []
    this.roles.forEach(r => {
      var item: ListItem = new ListItem();
      item.label = r.roleName
      item.value = r.id.toString()
      items.push(item)
    });
    this.listItems = items
    this.selectedItems = [];
    var roles: Role_VM[] = await this.userService.getRolesOfUser(user.id);
    if (roles.length > 0) {
      var _selectedItems: any[] = []

      roles.forEach(r => {
        var item = { value: r.id.toString(), label: r.roleName }
        _selectedItems.push(item)
      });
      this.selectedItems = _selectedItems;

    }
  }
  async assignRoleToUser() {
    var model: AssignRoleToUserCommandRequest = new AssignRoleToUserCommandRequest();
    model.userId = this.selectedUser.id;
    var roles: Role_VM[] = [];
    this.selectedItems.forEach(r => {
      var role: Role_VM = new Role_VM();
      role.id = Number(r.value)
      role.roleName = r.label;
      roles.push(role)
    });
    model.roles = roles;
    var response = await this.userService.assignRoleToUserAsync(model);
    if (response) {
      location.reload();
    }
  }


}
