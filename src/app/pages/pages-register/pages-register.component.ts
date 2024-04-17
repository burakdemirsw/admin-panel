import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SalesPersonModel } from 'src/app/models/model/order/salesPersonModel';
import { UserRegister_VM, GetUserFilter, UserList_VM } from 'src/app/models/model/user/userRegister_VM';
import { UserService } from 'src/app/services/admin/user.service';
import { HttpClientService } from 'src/app/services/http-client.service';
import { AlertifyService } from 'src/app/services/ui/alertify.service';
import { ToasterService } from 'src/app/services/ui/toaster.service';
import { GeneralService } from '../../services/admin/general.service';
import { HeaderService } from 'src/app/services/admin/header.service';

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
    private alertifyService: AlertifyService, private httpClientService: HttpClientService, private activatedRoute: ActivatedRoute
  ) { }

  userList: UserList_VM[] = []
  async ngOnInit() {
    this.headerService.updatePageTitle("Kullanıcı Ekle")
    this.formGenerator();
    await this.getSalesPersonModels()

    this.activatedRoute.params.subscribe(async (params) => {
      if (params['userId']) {

        this.isUpdate = true;
        await this.findUser(Number(params['userId']))
      }
    })


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
      // this.registerForm.get("password").setValue(registerModel.password);
      // this.registerForm.get("confirmPassword").setValue(registerModel.password);

      this.registerForm.get("phoneNumber").setValue(registerModel.phoneNumber);
      this.registerForm.get("salesPersonCode").setValue(registerModel.salesPersonCode);

      var salesPerson = this.salesPersonModels.find(sp => sp.salespersonCode === registerModel.salesPersonCode)
      this.selectedPerson = { name: salesPerson.firstLastName, code: registerModel.salesPersonCode }
      this.salesPersonModelList.push(this.selectedPerson);

    } else {
      this.registerForm.reset();
    }
  }


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
      salesPersonCode: [null, Validators.required],
      password: [null],
      confirmPassword: [null],
      gender: ["Erkek"],
      roleDescription: [null],


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
            roleDescription: this.registerForm.value.roleDescription.role


          };

          var response = await this.userService.register(model);
          if (response == true) {


            this.generalService.waitAndNavigate("İşlem Başaılı: " + "Kullanıcı Sisteme Eklendi", "user-list")

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
            roleDescription: this.registerForm.value.roleDescription.role
          };

          var response = await this.userService.update(model);
          if (response == true) {
            // this.router.navigate(['/login']);
            this.generalService.waitAndNavigate("İşlem Başaılı: " + "Kullanıcı Güncellendi", "user-list")



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

}
