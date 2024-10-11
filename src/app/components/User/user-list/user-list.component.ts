import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { GetUserFilter, UserList_VM } from 'src/app/models/model/user/userRegister_VM';
import { HeaderService } from 'src/app/services/admin/header.service';
import { UserService } from 'src/app/services/admin/user.service';
import { AlertifyService } from 'src/app/services/ui/alertify.service';
import { ListItem, Role_VM, AssignRoleToUserCommandRequest } from '../../auth/models/menu';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {
  roles: Role_VM[] = []
  selectedItems: any[] = [];
  visible2: boolean = false;
  listItems: any[] = []
  listHeader: string = "null";
  selectAll = false;
  constructor(
    private alertifyService: AlertifyService,
    private formBuilder: FormBuilder,
    private router: Router,
    private headerService: HeaderService,
    private userService: UserService
  ) { }

  async ngOnInit() {
    this.headerService.updatePageTitle("Kullanıcılar")
    await this.getUsers();
  }

  users: UserList_VM[] = [];
  async getUsers() {
    var filter: GetUserFilter = new GetUserFilter();
    filter.count = 100;
    this.users = await this.userService.getUsers(filter);
  }

  async deleteUser(userId: number) {
    const response = await this.userService.deleteUser(userId);
    if (response) {
      await this.getUsers();
    }
  }
  registerModel: UserList_VM = null;
  visible: boolean = false;
  updateUserModal(registerModel: UserList_VM) {
    this.registerModel = registerModel;
    this.showDialog(false);
  }
  showDialog(deleteUser: boolean) {
    if (deleteUser) {
      this.registerModel = null;
    }
    if (this.visible) {
      this.visible = false;
    } else {
      this.visible = true;
    }
  }
  selectedUser: UserList_VM = null;
  async openModalForUser(user: UserList_VM) {
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
