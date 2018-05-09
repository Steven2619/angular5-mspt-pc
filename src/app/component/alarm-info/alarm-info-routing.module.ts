import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AlarmInfoComponent } from './alarm-info.component';

const routes: Routes = [
    {
    path:'',
    component:AlarmInfoComponent
}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AlarmInfoRoutingModule { }
