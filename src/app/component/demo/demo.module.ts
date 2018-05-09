import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DemoRoutingModule } from './demo-routing.module';
import { DemoComponent } from './demo.component';
import { SharedModule } from '../../common/shared.module';
import { CoreModule } from '../../core/core.module';
import { ModalInfoComponent } from './modal-info/modal-info.component';
import { DetailsInfoComponent } from './details-info/details-info.component'

@NgModule({
  imports: [
    CommonModule,
    DemoRoutingModule,
    SharedModule,
    CoreModule
  ],
  declarations: [DemoComponent, ModalInfoComponent, DetailsInfoComponent],
  entryComponents: [
    ModalInfoComponent,
    DetailsInfoComponent
  ]
})
export class DemoModule { }
