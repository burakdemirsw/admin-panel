import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClientService } from '../http-client.service';
import { ToasterService } from '../ui/toaster.service';
import { UserRegister_VM, UserLoginCommandModel, RefreshTokenCommandModel, GetUserFilter, UserClientInfoResponse, UserList_VM, Token, PasswordRequest_CM } from 'src/app/models/model/user/userRegister_VM';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private router: Router, private client: HttpClientService, private toasterService: ToasterService) { }

  async register(model: UserRegister_VM): Promise<boolean> {
    const response = await this.client
      .post<UserRegister_VM>({ controller: "users/Register" }, model)
      .toPromise();

    if (response) {
      console.log(response);
      return true;
    } else {
      console.log("Kayıt Başarısız");
      return false;
    }
  }

  async update(model: UserRegister_VM): Promise<boolean> {
    const response = await this.client
      .post<UserRegister_VM>({ controller: "users/update" }, model)
      .toPromise();

    if (response) {
      console.log(response);
      return true;
    } else {
      console.log("Güncelleme Başarısız");
      return false;
    }
  }

  //token ve rfToken Alır
  async login(model: UserLoginCommandModel): Promise<boolean> {
    try {
      const response = await this.client
        .post<UserLoginCommandModel | any>({ controller: "users/login" }, model)
        .toPromise();
      if (response) {
        console.log(response);
      } else {
        console.log("response alınamadı")
      }
      const userClientInfoResponse: UserClientInfoResponse = response;
      console.log("Çevirilen Model: " + userClientInfoResponse)

      localStorage.setItem("accessToken", userClientInfoResponse.token.accessToken == null ? "" : userClientInfoResponse.token.accessToken);
      localStorage.setItem("refreshToken", userClientInfoResponse.token.refreshToken == null ? "" : userClientInfoResponse.token.refreshToken);
      localStorage.setItem("salesPersonCode", userClientInfoResponse.salesPersonCode == null ? "" : userClientInfoResponse.salesPersonCode);
      localStorage.setItem("roleDescription", userClientInfoResponse.roleDescription == null ? "" : userClientInfoResponse.roleDescription);

      localStorage.setItem("userId", userClientInfoResponse.userId.toString() == null ? "" : userClientInfoResponse.userId.toString());
      localStorage.setItem("mail", userClientInfoResponse.mail.toString() == null ? "" : userClientInfoResponse.mail.toString());
      localStorage.setItem("phoneNumber", userClientInfoResponse.phoneNumber.toString() == null ? "" : userClientInfoResponse.phoneNumber.toString());
      localStorage.setItem("name", userClientInfoResponse.name.toString() == null ? "" : userClientInfoResponse.name.toString());
      localStorage.setItem("surname", userClientInfoResponse.surname.toString() == null ? "" : userClientInfoResponse.surname.toString());


      if (response) {
        console.log(response);
        return true;
      } else {
        console.log("Giriş Başarısız");
        return false;
      }
    } catch (error) {
      console.log("Login:" + error)
      return false;
    }

  }

  //rf token yeniler
  async refreshToken(model: RefreshTokenCommandModel): Promise<boolean> {
    const response = await this.client
      .post<RefreshTokenCommandModel | any>(
        { controller: 'Users/refresh-token' },
        model
      )
      .toPromise();
    const userClientInfoResponse: UserClientInfoResponse = response;


    localStorage.setItem("accessToken", userClientInfoResponse.refreshTokenCommandResponse.token.accessToken);
    localStorage.setItem("roleDescription", userClientInfoResponse.roleDescription.toString());

    localStorage.setItem("refreshToken", userClientInfoResponse.refreshTokenCommandResponse.token.refreshToken);
    localStorage.setItem("userId", userClientInfoResponse.userId.toString());
    localStorage.setItem("mail", userClientInfoResponse.mail.toString());
    localStorage.setItem("salesPersonCode", userClientInfoResponse.salesPersonCode.toString());
    localStorage.setItem("phoneNumber", userClientInfoResponse.phoneNumber.toString());
    localStorage.setItem("name", userClientInfoResponse.name.toString());
    localStorage.setItem("surname", userClientInfoResponse.surname.toString());

    if (response) {
      console.log(response);
      return true;
    } else {
      console.log('Refresh Token Alınamadı');
      return false;
    }
  }


  async getUsers(model: GetUserFilter): Promise<UserList_VM[]> {
    try {
      const response: any = await this.client
        .post({ controller: "users/get-users" }, model)
        .toPromise();

      return response;
    } catch (error) {
      return null;
    }
  }

  async deleteUser(id: number): Promise<boolean> {
    try {
      const response: any = await this.client
        .delete<string>({ controller: "users/delete-user" }, id)
        .toPromise();

      return response;
    } catch (error) {
      return false;
    }
  }

  getUserClientInfoResponse() {
    try {
      var token = localStorage.getItem("accessToken");
      if (token) {
        var model: UserClientInfoResponse = new UserClientInfoResponse();
        model.token = new Token();
        model.token.accessToken = token;
        model.token.refreshToken = localStorage.getItem("refreshToken")
        model.userId = Number(localStorage.getItem("userId"))
        model.mail = localStorage.getItem("mail")
        model.salesPersonCode = localStorage.getItem("salesPersonCode")
        model.mail = localStorage.getItem("phoneNumber")
        model.mail = localStorage.getItem("name")
        model.mail = localStorage.getItem("surname")
        model.roleDescription = localStorage.getItem("roleDescription")
        return model;
      } else {
        return null;
      }

    } catch (error) {
      return null;
    }

  }
  async confirmPasswordToken(token: string): Promise<any> {
    try {
      const response = await this.client

        .get<string>({ controller: "users/confirm-password-token" }, token.toString())
        .toPromise();

      return response;
    } catch (error) {
      return null;
    }
  }

  async sendPasswordResetEmail(mail: string): Promise<any> {
    try {
      const response = await this.client

        .get<string>({ controller: "users/send-password-reset-email" }, mail)
        .toPromise();

      return response;
    } catch (error) {
      return null;
    }
  }
  async passwordReset(model: PasswordRequest_CM): Promise<any> {
    try {
      const response = await this.client

        .post<PasswordRequest_CM>({ controller: "users/password-reset" }, model)
        .toPromise();

      return response;
    } catch (error) {
      return null;
    }
  }

  logOut() {
    localStorage.clear();
    this.router.navigate(["/pages-loginv2"]);

  }
}
