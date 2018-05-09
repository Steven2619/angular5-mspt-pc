import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {SysDictComponent} from './sys-dict.component';

const routes: Routes = [{
  path : '',
  component : SysDictComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SysDictRoutingModule { }
