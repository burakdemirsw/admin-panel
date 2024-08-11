import { Component, OnInit, ViewChild } from '@angular/core';
import { TreeNode, MenuItem } from 'primeng/api';
import { UserService } from 'src/app/services/admin/user.service';
import { AuthService } from 'src/app/services/ui/auth.service';
import { ToasterService } from 'src/app/services/ui/toaster.service';
import { AssignRoleEndpointCommandRequest, GetRolesToEndpointQueryRequest, ListItem, Menu, Role_VM } from '../models/menu';
import { HeaderService } from 'src/app/services/admin/header.service';

@Component({
  selector: 'app-authorization',
  templateUrl: './authorization.component.html',
  styleUrl: './authorization.component.css'
})
export class AuthorizationComponent implements OnInit {
  filesNodes: TreeNode[] = []; // TreeNode listesini depolamak için bir değişken oluşturun
  selectedFiles: any[] = []
  items!: MenuItem[];
  visible: boolean = false;
  endpointList: Menu[] = []

  roles: Role_VM[] = []
  listHeader: string = "null";
  selectedItems: any[] = [];
  listItems: any[] = []
  selectAll = false;

  constructor(private headerService: HeaderService, private authService: AuthService, private userService: UserService, private toasterService: ToasterService) { }

  async ngOnInit() {
    this.headerService.updatePageTitle('Yetki Yönetimi')
    await this.getAuthorizeDefinitionEndpoints();
    this.items = [
      { label: 'Rol Ata', icon: 'pi pi-plus', command: (event) => this.changeVisible(this.selectedFiles) }
    ];


  }

  log() {
    console.log(this.selectedItems)
  }

  async changeVisible(event: any) {

    if (this.visible) {
      this.visible = false;
    } else {
      this.visible = true
    }
    await this.getroles(event);
  }

  async getroles(e: any) {
    this.roles = await this.userService.getRoles(0);
    var items: ListItem[] = []
    this.roles.forEach(r => {
      var item: ListItem = new ListItem();
      item.label = r.roleName
      item.value = r.id.toString()
      items.push(item)
    });
    this.listItems = items
    this.listHeader = e.label
    this.selectedItems = [];
    var requestModel: GetRolesToEndpointQueryRequest = new GetRolesToEndpointQueryRequest();
    this.endpointList.forEach(e => {
      var endpoint = e.actions.find(a => a.definition === this.listHeader);
      if (endpoint) {
        requestModel.code = endpoint.code
        requestModel.menu = e.name;

      }
    });
    var response = await this.userService.getRolesToEndpoint(requestModel);
    var _selectedItems: any[] = []
    if (response) {
      response.forEach(r => {
        var item = { value: r.id.toString(), label: r.roleName }
        _selectedItems.push(item)
      });
      this.selectedItems = _selectedItems;
    }

    console.log(this.roles);
    console.log(this.selectedItems);

  }

  async assignRoleEndpoint() {
    var model: AssignRoleEndpointCommandRequest = new AssignRoleEndpointCommandRequest();
    this.endpointList.forEach(e => {
      var endpoint = e.actions.find(a => a.definition === this.listHeader);
      if (endpoint) {
        model.code = endpoint.code
        model.menu = e.name;

      }

      var roles: Role_VM[] = [];

      this.selectedItems.forEach(r => {

        var role: Role_VM = new Role_VM();
        role.id = Number(r.value)
        role.roleName = r.label;
        roles.push(role)

      });

      model.roles = roles;
      model.type = null;

    });
    console.log(model);
    var response = await this.userService.assignRoleEndpoint(model);
    if (response) {
      // await this.getAuthorizeDefinitionEndpoints();
      this.toasterService.success(
        "Yetkilendirme Başarılı",
      );
      this.visible = false
    }
  }

  assingRoleEndpoint() {
    var roles: Role_VM[] = []
    this.selectedItems.forEach(i => {
      var role: Role_VM = new Role_VM();
      role.id = Number(i.value)
      role.roleName = i.label;

      roles.push(role);
    });

  }

  async getAuthorizeDefinitionEndpoints() {
    try {
      const response: Menu[] = await this.userService.getAuthorizeDefinitionEndpoints();
      this.endpointList = response;
      if (response) {
        this.filesNodes = this.menuToTreeNode(response); // Menu verilerini TreeNode listesine dönüştürün
      }
    } catch (error) {
      console.error(error);
    }
  }

  // Menu verilerini TreeNode listesine dönüştüren fonksiyon
  menuToTreeNode(menuList: Menu[]): TreeNode[] {

    try {
      const treeNodes: TreeNode[] = [];

      menuList.forEach((menu, index) => {
        const menuNode: TreeNode = {
          key: index.toString(),
          label: menu.name,
          data: menu,
          icon: 'pi pi-fw pi-file',
          children: [],

        };

        menu.actions.forEach((action, actionIndex) => {
          const actionNode: TreeNode = {
            key: `${index}-${actionIndex}`,
            label: action.definition,
            data: action,
            icon: 'pi pi-fw pi-file', // İstediğiniz simgeyi burada belirleyebilirsiniz
          };

          menuNode.children.push(actionNode);
        });

        treeNodes.push(menuNode);
      });

      console.log(treeNodes);
      return treeNodes;
    } catch (error) {
      console.log(error.message)
      return null;
    }

  }

  onTreeNodeSelect(event: { originalEvent: Event; node: TreeNode }): void {
    const selectedNode = event.node;
    if (selectedNode) {
      console.log('Selected Tree Node Name:', selectedNode.label);
    }
  }
  @ViewChild('ms') ms: any;

  onSelectAllChange(event) {
    this.selectedItems = event.checked ? [...this.ms.visibleOptions()] : [];
    this.selectAll = event.checked;
  }

}
