export class UserRegister_VM {
  id: number;
  firstName: string;
  lastName: string;
  password: string;
  email?: string;
  phoneNumber?: string;
  gender: string;
  salesPersonCode: string;
  roleDescription: string;
  printerName_1?: string
  printerName_2?: string
}
export class Token {
  accessToken !: string
  expiration !: Date
  refreshToken !: string

}
export class UserLoginCommandModel {
  phoneNumberOrEmail: string;
  password: string;
}
export class RefreshTokenCommandModel {
  refreshToken: string;
}

export class GetUserFilter {
  id!: number;
  firstName!: string;
  lastName!: string;
  email!: string;
  phoneNumber!: string;
  count: number;
  constructor(id?: number) {
    this.id = id;
    this.count = 1;
  }
}
export class UserClientInfoResponse {
  token: Token
  userId: number
  salesPersonCode: string;
  mail: string
  phoneNumber: string
  refreshTokenCommandResponse: RefreshTokenCommandResponse
  name: string
  surname: string
  roleDescription: string
}
export class RefreshTokenCommandResponse {
  state?: boolean;
  token?: Token;
}

export class UserList_VM {
  id: number;
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  phoneNumber?: string;
  salesPersonCode?: string
  roleDescription?: string
  printerName_1?: string
  printerName_2?: string

}
export class PasswordRequest_CM {
  oldPassword: string
  newPassword: string
  newPasswordConfirm: string
  userId: string
  passwordToken: string
}
