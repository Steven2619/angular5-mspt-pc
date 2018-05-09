import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NewworkOrderRoutingModule } from './newwork-order-routing.module';
import { NewworkOrderComponent } from './newwork-order.component';
import {CoreModule} from '../../../core/core.module';
import {SharedModule} from '../../../common/shared.module';
import {AddWorkOrderComponent} from './add-work-order/add-work-order.component';

@NgModule({
  imports: [
    CommonModule,
    NewworkOrderRoutingModule,
    SharedModule,
    CoreModule
  ],
  declarations: [NewworkOrderComponent,AddWorkOrderComponent],
  entryComponents:[
    AddWorkOrderComponent
  ]
})
export class NewworkOrderModule { }
