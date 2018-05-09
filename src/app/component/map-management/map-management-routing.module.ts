import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {MapManagementComponent} from './map-management.component';

const routes: Routes = [{
  path:'',
  component:MapManagementComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MapManagementRoutingModule { }
