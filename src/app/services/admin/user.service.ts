import { Injectable } from '@angular/core';
import { Router, Route } from '@angular/router';
import { HttpClientService } from '../http-client.service';
import { ToasterService } from '../ui/toaster.service';
import { UserRegister_VM, UserLoginCommandModel, RefreshTokenCommandModel, GetUserFilter, UserClientInfoResponse, UserList_VM, Token, PasswordRequest_CM } from 'src/app/models/model/user/userRegister_VM';
import { Role_VM, GetRolesToEndpointQueryRequest, AssignRoleEndpointCommandRequest, Menu, AssignRoleToUserCommandRequest, MenuInfo_VM, AssignMenuInfoToRoleRequest } from 'src/app/components/auth/models/menu';
import { MenuInfo } from 'src/app/models/model/company/companyInfo';

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
      // console.log(response);
      return true;
    } else {
      // console.log("Kayıt Başarısız");
      return false;
    }
  }

  async update(model: UserRegister_VM): Promise<boolean> {
    const response = await this.client
      .post<UserRegister_VM>({ controller: "users/update" }, model)
      .toPromise();

    if (response) {
      // console.log(response);
      return true;
    } else {
      // console.log("Güncelleme Başarısız");
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
        // console.log(response);
      } else {
        // console.log("response alınamadı")
      }
      const userClientInfoResponse: UserClientInfoResponse = response;
      // console.log("Çevirilen Model: " + userClientInfoResponse)

      localStorage.setItem("accessToken", userClientInfoResponse.token.accessToken == null ? "" : userClientInfoResponse.token.accessToken);
      localStorage.setItem("refreshToken", userClientInfoResponse.token.refreshToken == null ? "" : userClientInfoResponse.token.refreshToken);
      localStorage.setItem("salesPersonCode", userClientInfoResponse.salesPersonCode == null ? "" : userClientInfoResponse.salesPersonCode);
      localStorage.setItem("roleDescription", userClientInfoResponse.roleDescription == null ? "" : userClientInfoResponse.roleDescription);

      localStorage.setItem("userId", userClientInfoResponse.userId.toString() == null ? "" : userClientInfoResponse.userId.toString());
      localStorage.setItem("mail", userClientInfoResponse.mail.toString() == null ? "" : userClientInfoResponse.mail.toString());
      localStorage.setItem("phoneNumber", userClientInfoResponse.phoneNumber.toString() == null ? "" : userClientInfoResponse.phoneNumber.toString());
      localStorage.setItem("name", userClientInfoResponse.name.toString() == null ? "" : userClientInfoResponse.name.toString());
      localStorage.setItem("surname", userClientInfoResponse.surname.toString() == null ? "" : userClientInfoResponse.surname.toString());
      localStorage.setItem("officeCode", userClientInfoResponse.officeCode.toString() == null ? "" : userClientInfoResponse.officeCode.toString());
      localStorage.setItem("warehouseCode", userClientInfoResponse.warehouseCode.toString() == null ? "" : userClientInfoResponse.warehouseCode.toString());
      localStorage.setItem("isUseAllOffice", userClientInfoResponse.isUseAllOffice == null ? "" : userClientInfoResponse.isUseAllOffice);


      if (response) {
        // console.log(response);
        return true;
      } else {
        // console.log("Giriş Başarısız");
        return false;
      }
    } catch (error) {
      // console.log("Login:" + error)
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
    localStorage.setItem("officeCode", userClientInfoResponse.officeCode.toString());
    localStorage.setItem("warehouseCode", userClientInfoResponse.warehouseCode.toString());
    localStorage.setItem("isUseAllOffice", userClientInfoResponse.isUseAllOffice.toString());
    if (response) {
      // console.log(response);
      return true;
    } else {
      // console.log('Refresh Token Alınamadı');
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

        model.officeCode = localStorage.getItem("officeCode")
        model.warehouseCode = localStorage.getItem("warehouseCode")
        model.isUseAllOffice = localStorage.getItem("isUseAllOffice")
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

  //AUTH----------------------------------------------

  async getRoles(id: number): Promise<Role_VM[]> {
    try {

      const response: any = await this.client
        .get<Role_VM>({ controller: "users/get-roles" }, id.toString() == "0" ? "" : id.toString())
        .toPromise();

      return response;
    } catch (error) {
      return null;
    }
  }
  async addRoles(role: Role_VM): Promise<any> {
    try {
      const response = await this.client
        .post<Role_VM>({ controller: "users/add-role" }, role)
        .toPromise();

      return response;
    } catch (error) {
      return null;
    }
  }
  async updateRole(role: Role_VM): Promise<any> {
    try {
      const response = await this.client
        .post<Role_VM>({ controller: "users/update-role" }, role)
        .toPromise();

      return response;
    } catch (error) {
      return null;
    }
  }


  async deleteRole(roleId: number): Promise<boolean> {
    try {
      const response = await this.client
        .delete<boolean>(
          { controller: "users/delete-role" },
          roleId.toString()
        )
        .toPromise();

      return response;
    } catch (error) {
      return null;
    }
  }

  async getRolesToEndpoint(model: GetRolesToEndpointQueryRequest): Promise<any> {
    try {
      const response = await this.client
        .post<GetRolesToEndpointQueryRequest>({ controller: "users/get-roles-to-endpoint" }, model)
        .toPromise();

      return response;
    } catch (error) {
      return null;
    }
  }
  async assignRoleEndpoint(model: AssignRoleEndpointCommandRequest): Promise<any> {
    try {
      const response = await this.client
        .post<AssignRoleEndpointCommandRequest>({ controller: "users/assing-role-endpoint" }, model)
        .toPromise();

      return response;
    } catch (error) {
      return null;
    }
  }

  async assignRoleToUserAsync(model: AssignRoleToUserCommandRequest): Promise<any> {
    try {
      const response = await this.client
        .post<AssignRoleToUserCommandRequest>({ controller: "users/assing-role-to-user" }, model)
        .toPromise();

      return response;
    } catch (error) {
      return null;
    }
  }

  async getAuthorizeDefinitionEndpoints(): Promise<Menu[]> {
    try {
      const response = await this.client
        .get<Menu>({
          controller: "ApplicationServices/get-authorize-definition-endpoints",
        })
        .toPromise();

      return response;
    } catch (error) {
      return null;
    }
  }
  async getRolesOfUser(id: number): Promise<Role_VM[]> {
    try {
      const response = await this.client
        .get<Role_VM>({ controller: "users/get-roles-of-user" }, id.toString())
        .toPromise();

      return response;
    } catch (error) {
      return null;
    }
  }
  async getMenuInfosOfRoles(id: number): Promise<MenuInfo_VM[]> {
    try {

      const response: any = await this.client
        .get<MenuInfo_VM>({ controller: "users/get-menu-infos-of-role" }, id.toString())
        .toPromise();

      return response;
    } catch (error) {
      return null;
    }
  }

  async assignRoleToMenuInfo(model: AssignMenuInfoToRoleRequest): Promise<any> {
    try {
      const response = await this.client
        .post<AssignMenuInfoToRoleRequest>({ controller: "users/assing-menu-info-to-role" }, model)
        .toPromise();

      return response;
    } catch (error) {
      return null;
    }
  }
  async isUserAuthorized(userId: number, route: string): Promise<any> {
    route = route.includes('/') ? route.split('/')[1] : route
    var query = `${userId}/${route}`
    const response = await this.client
      .get<boolean>({ controller: "users/is-user-authorized" }, query)
      .toPromise();
    return response;
  }
}
