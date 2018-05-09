import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TerminalEquipmentComponent } from './terminal-equipment.component';
const routes: Routes = [
  {
  path: '',
  component: TerminalEquipmentComponent
}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TerminalEquipmentRoutingModule { }
