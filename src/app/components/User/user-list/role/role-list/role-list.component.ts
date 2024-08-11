import { Component, SimpleChanges, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AssignMenuInfoToRoleRequest, AssignRoleToUserCommandRequest, ListItem, Role_VM } from 'src/app/components/auth/models/menu';
import { MenuInfo, MenuInfo_VM } from 'src/app/models/model/company/companyInfo';
import { UserList_VM } from 'src/app/models/model/user/userRegister_VM';
import { HeaderService } from 'src/app/services/admin/header.service';
import { InfoService } from 'src/app/services/admin/info.service';
import { UserService } from 'src/app/services/admin/user.service';
import { ToasterService } from 'src/app/services/ui/toaster.service';

@Component({
  selector: 'app-role-list',

  templateUrl: './role-list.component.html',
  styleUrl: './role-list.component.css'
})
export class RoleListComponent {

  brandForm: FormGroup;
  constructor(
    private toasterService: ToasterService,
    private userService: UserService,
    private formBuilder: FormBuilder,
    private infoService: InfoService,
    private headerService: HeaderService

  ) { }

  async ngOnInit() {
    this.headerService.updatePageTitle('Rol Yönetimi')

    this.formCreator();
    this.getroles();
  }

  visible: boolean = false;
  roles: Role_VM[] = [];
  roleModel: Role_VM = null;



  showDialog2(setnull: boolean) {
    if (setnull) {
      this.roleModel = null;
    }
    if (this.visible) {
      this.visible = false;
    } else {
      this.visible = true;
    }
  }

  roleForm: FormGroup;
  formCreator() {
    this.roleForm = this.formBuilder.group({
      roleName: [null, Validators.required],

    });
  }
  async getroles() {
    this.roles = await this.userService.getRoles(0);
    console.log(this.roles);
  }


  async deleteRole(roleId: number) {
    const response = await this.userService.deleteRole(roleId);
    if (response) {
      this.toasterService.success("Rol Silindi");
      await this.getroles();
    }
  }

  updateRoleModal(roleModel: Role_VM) {
    this.roleModel = roleModel;
    this.roleForm.get("roleName").setValue(roleModel.roleName);
    this.showDialog2(false);
  }
  showDialog() {
    if (this.visible) {
      this.visible = false;
    } else {
      this.visible = true;
    }
  }
  async submitForm(formValue: any) {
    if (!this.roleModel) {
      if (this.roleForm.valid) {
        let role: Role_VM = new Role_VM();
        role.id = 0;
        role.roleName = formValue.roleName;

        const response = await this.userService.addRoles(role);
        if (response == true) {
          this.showDialog();
        }
        this.toasterService.success(
          "Rol Eklendi"
        );
        location.reload();
      } else {
        this.toasterService.error(
          "Form Hatası",
        );
      }
    } else {
      if (this.roleForm.valid) {
        let role: Role_VM = new Role_VM();
        role.id = this.roleModel.id;
        role.roleName = formValue.roleName;

        const response = await this.userService.updateRole(role);
        if (response == true) {
          this.showDialog();
        }
        this.toasterService.success(
          "Rol Güncellendi",
        );
        location.reload();
      } else {
        this.toasterService.error(
          "Lütfen Formu Doldurunuz"

        );
      }
    }
  }
  @ViewChild('ms') ms: any;

  onSelectAllChange(event) {
    this.selectedItems = event.checked ? [...this.ms.visibleOptions()] : [];
    this.selectAll = event.checked;
  }
  listHeader: string;
  visible2: boolean
  listItems: any[] = []
  selectedItems: any[] = [];
  selectAll = false;
  menus: MenuInfo_VM[] = [];
  selectedRole;
  async openModalForRole(role: Role_VM) {
    if (this.selectedRole?.id != role.id) {
      this.selectedRole = role;
      this.visible2 = true

      this.listHeader = role.roleName

      this.menus = await this.infoService.getMenuInfos(true, true);
      var items: ListItem[] = []
      this.menus.forEach(r => {
        var item: ListItem = new ListItem();
        item.label = r.label
        item.value = r.id.toString()
        items.push(item)
      });
      this.listItems = items
      this.selectedItems = [];
      var menuInfos: MenuInfo_VM[] = await this.userService.getMenuInfosOfRoles(role.id);
      if (menuInfos) {
        var _selectedItems: any[] = []

        menuInfos.forEach(r => {
          var item = { value: r.id.toString(), label: r.label }
          _selectedItems.push(item)
        });
        this.selectedItems = _selectedItems;

      }
    } else {
      this.visible2 = true
    }

  }
  async assignMenuInfoToRole() {
    var model: AssignMenuInfoToRoleRequest = new AssignMenuInfoToRoleRequest();
    model.roleId = this.selectedRole.id;
    var menus: MenuInfo[] = [];

    console.log(this.selectedItems);
    this.selectedItems.forEach(r => {

      var menu: MenuInfo = new MenuInfo();
      menu.id = Number(r.value)
      menu.label = r.label;
      menus.push(menu)

    });

    model.menuInfos = menus;



    console.log(model);
    var response = await this.userService.assignRoleToMenuInfo(model);
    if (response) {
      location.reload();
    }
  }

}
