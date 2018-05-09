import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {SysRoleComponent} from './sys-role.component';

const routes: Routes = [{
  path : '',
  component : SysRoleComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SysRoleRoutingModule { }
