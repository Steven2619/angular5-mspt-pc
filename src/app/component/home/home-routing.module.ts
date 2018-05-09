import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home.component';
const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    children: [
      {
        path: 'alarm-info',
        loadChildren: '../alarm-info/alarm-info.module#AlarmInfoModule'
      },
      {
        path: 'terminal-equipment',
        loadChildren: '../terminal-equipment/terminal-equipment.module#TerminalEquipmentModule'
      },
      {
        path: 'terminal-well',
        loadChildren: '../terminal-well/terminal-well.module#TerminalWellModule'
      },
      {
        path: 'operationwork-order',
        loadChildren: '../work-order/operationwork-order/work-order.module#WorkOrderModule'
      },
      {
        path: 'newwork-order',
        loadChildren: '../work-order/newwork-order/newwork-order.module#NewworkOrderModule'
      },
      {
        path: 'sys-dict',
        loadChildren: '../sys/sys-dict/sys-dict.module#SysDictModule'
      },
      {
        path: 'sys-log',
        loadChildren: '../sys/sys-log/sys-log.module#SysLogModule'
      },
      {
        path: 'sys-permission',
        loadChildren: '../sys/sys-permission/sys-permission.module#SysPermissionModule'
      },
      {
        path: 'sys-role',
        loadChildren: '../sys/sys-role/sys-role.module#SysRoleModule'
      },
      {
        path: 'sys-user',
        loadChildren: '../sys/sys-user/sys-user.module#SysUserModule'
      },
      {
        path: 'demo',
        loadChildren: '../demo/demo.module#DemoModule'
      },
      /*{
        path: 'map-manage',
        loadChildren: '../map-manage/map-manage.module#MapManageModule'
      },*/
      {
        path: 'map-management',
        loadChildren: '../map-management/map-management.module#MapManagementModule'
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
