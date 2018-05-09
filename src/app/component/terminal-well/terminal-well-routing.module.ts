import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TerminalWellComponent } from './terminal-well.component'
const routes: Routes = [
  {
    path: '',
    component: TerminalWellComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TerminalWellRoutingModule { }
