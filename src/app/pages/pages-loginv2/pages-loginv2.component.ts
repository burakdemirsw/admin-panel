import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SalesPersonModel } from 'src/app/models/model/order/salesPersonModel';
import { UserLoginCommandModel } from 'src/app/models/model/user/userRegister_VM';
import { UserService } from 'src/app/services/admin/user.service';
import { HttpClientService } from 'src/app/services/http-client.service';
import { AlertifyService } from 'src/app/services/ui/alertify.service';
import { AuthService } from 'src/app/services/ui/auth.service';
import { ToasterService } from 'src/app/services/ui/toaster.service';

@Component({
  selector: 'app-pages-loginv2',
  templateUrl: './pages-loginv2.component.html',
  styleUrls: ['./pages-loginv2.component.css']
})
export class PagesLoginv2Component implements OnInit {
  phoneNumberOrEmail: string;
  password: string;
  errorMessage: string;
  ngModel;
  loginForm: FormGroup;
  emailForm: FormGroup
  constructor(
    private userService: UserService, private router: Router,
    private formBuilder: FormBuilder, private alertifyService: AlertifyService) { }
  ngOnInit(): void {
    this.emailFormCreator();
    this.formGenerator();
  }



  formGenerator() {
    this.loginForm = this.formBuilder.group({
      password: [null, Validators.required],
      phoneNumberOrEmail: [null, Validators.required],
    });
  }


  async onSubmit(loginFormValue: any) {
    try {
      if (this.loginForm.valid) {
        const model: UserLoginCommandModel = {
          password: loginFormValue.password,
          phoneNumberOrEmail: loginFormValue.phoneNumberOrEmail,
        };

        var response = await this.userService.login(model);
        if (response) {
          const returnUrl = this.getReturnUrl(); // Get return URL from params
          location.href = returnUrl ? decodeURIComponent(returnUrl) : location.origin + "/dashboard";
          // this.router.navigate([returnUrl || "/dashboard"]); // If using Angular router
        }
      } else {
        console.log('Form Geçerli Değil');
      }
    } catch (error) {
      this.alertifyService.warning("Hata Alındı: " + error.message);
    }
  }

  getReturnUrl(): string | null {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('returnUrl');
  }

  visible: boolean;
  openDialog() {
    this.visible = !this.visible

  }

  emailFormCreator() {
    this.emailForm = this.formBuilder.group({
      userEmail: [null]

    });
  }

  async submitEmailForm(value: any) {
    if (this.emailForm.valid) {
      var response = await this.userService.sendPasswordResetEmail(value.userEmail);
      if (response) {
        this.alertifyService.success("Mail Gönderildi: " + "Mail Kutunuzu Kontrol Ediniz...")
      }
    }
  }

}
