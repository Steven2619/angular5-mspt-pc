import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AlarmInfoRoutingModule } from './alarm-info-routing.module';
import { AlarmInfoComponent } from './alarm-info.component';
import { SharedModule } from '../../common/shared.module';
import { CoreModule } from '../../core/core.module';
import { ModalInfoComponent } from './modal-info/modal-info.component';
import { BatchModalComponent } from './batch-modal/batch-modal.component';
import { AddAlarmWorkOrdeComponent } from './add-alarm-work-orde/add-alarm-work-orde.component';
import { WorkOrderDetailInfoComponent } from './work-order-detail-info/work-order-detail-info.component';
@NgModule({
  imports: [
    CommonModule,
    AlarmInfoRoutingModule,
    SharedModule,
    CoreModule
  ],
  declarations: [AlarmInfoComponent, ModalInfoComponent, BatchModalComponent, AddAlarmWorkOrdeComponent, WorkOrderDetailInfoComponent],
  entryComponents: [
    ModalInfoComponent,
    BatchModalComponent,
    AddAlarmWorkOrdeComponent,
    WorkOrderDetailInfoComponent
  ]
})
export class AlarmInfoModule { }
