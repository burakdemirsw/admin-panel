import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { GetUserFilter, UserList_VM } from 'src/app/models/model/user/userRegister_VM';
import { UserService } from 'src/app/services/admin/user.service';
import { GoogleDriveService } from 'src/app/services/common/google-drive.service';
import { AlertifyService } from 'src/app/services/ui/alertify.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {

  constructor(
    private alertifyService: AlertifyService,
    private formBuilder: FormBuilder,
    private router: Router,
    private googleDriveService: GoogleDriveService,
    private userService: UserService
  ) { }

  async ngOnInit() {
    await this.getUsers();
  }

  users: UserList_VM[] = [];
  async getUsers() {
    var filter: GetUserFilter = new GetUserFilter();
    filter.count = 100;
    this.users = await this.userService.getUsers(filter);
    console.log(this.users);
    console.log(this.users);
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


}
