import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TerminalWellRoutingModule } from './terminal-well-routing.module';
import { TerminalWellComponent } from './terminal-well.component';
import { SharedModule } from '../../common/shared.module';
import { CoreModule } from '../../core/core.module';
import { ModalInfoComponent } from './modal-info/modal-info.component';


@NgModule({
  imports: [
    CommonModule,
    TerminalWellRoutingModule,
    SharedModule,
    CoreModule
  ],
  declarations: [TerminalWellComponent, ModalInfoComponent],
  entryComponents: [
    ModalInfoComponent
  ]
})
export class TerminalWellModule { }
