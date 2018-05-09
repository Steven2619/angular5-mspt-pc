import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NewworkOrderComponent } from './newwork-order.component'
const routes: Routes = [{
    path:'',
    component:NewworkOrderComponent
}];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NewworkOrderRoutingModule { }
