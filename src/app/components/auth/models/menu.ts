import { MenuInfo } from "src/app/models/model/company/companyInfo";

export class Menu {
  name: string;
  actions: Action[] = [];

}
export class Action {
  actionType: string;
  httpType: string;
  definition: string;
  code: string;

}
export class Role_VM {
  id: number
  roleName: string
}
export class MenuInfo_VM {
  id: number
  manuInfoDescription: string
}
export class GetRolesToEndpointQueryRequest {
  code: string
  menu: string;
}
export class ListItem {
  label: string
  value: string
}
export class AssignRoleEndpointCommandRequest {
  roles: Role_VM[];
  code: string;
  menu: string;
  type?: any;
}
export class AssignRoleToUserCommandRequest {
  userId: number;
  roles: Role_VM[];
}
export class AssignMenuInfoToRoleRequest {
  roleId: number;
  menuInfos: MenuInfo[];
}
