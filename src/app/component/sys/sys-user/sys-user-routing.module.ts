import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {SysUserComponent} from './sys-user.component';

const routes: Routes = [{
  path : '',
  component : SysUserComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SysUserRoutingModule { }
