import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {SysPermissionComponent} from './sys-permission.component';

const routes: Routes = [{
  path : '',
  component : SysPermissionComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SysPermissionRoutingModule { }
