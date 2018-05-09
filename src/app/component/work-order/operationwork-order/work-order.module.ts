import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SharedModule} from '../../../common/shared.module';
import {CoreModule} from '../../../core/core.module';
import {WorkOrderRoutingModule} from './work-order-routing.module';
import {WorkOrderComponent} from './work-order.component';
import {MaintWorkOrderComponent} from './maint-work-order/maint-work-order.component';
import {AlarmInfoComponent} from './alarm-info/alarm-info.component';

@NgModule({
  imports: [
    CommonModule,
    WorkOrderRoutingModule,
    SharedModule,
    CoreModule
  ],
  declarations: [WorkOrderComponent, MaintWorkOrderComponent, AlarmInfoComponent],
  entryComponents: [
    MaintWorkOrderComponent,
    AlarmInfoComponent
  ]
})
export class WorkOrderModule {
}
