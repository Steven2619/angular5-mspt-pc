import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TerminalEquipmentRoutingModule } from './terminal-equipment-routing.module';
import { TerminalEquipmentComponent } from './terminal-equipment.component';
//引入form输入框引入的model
import { SharedModule } from '../../common/shared.module';
import { CoreModule } from '../../core/core.module';

import { ModalInfoComponent } from './modal-info/modal-info.component';
import { ConfigInfoComponent } from './config-info/config-info.component';
import { DetailInfoComponent } from './detail-info/detail-info.component';
import { ShowModelComponent } from './show-model/show-model.component';
import { EquipmentDetailInfoComponent } from './equipment-detail-info/equipment-detail-info.component';

@NgModule({
  imports: [
    CommonModule,
    TerminalEquipmentRoutingModule,
    SharedModule,
    CoreModule
  ],
  declarations: [TerminalEquipmentComponent, ModalInfoComponent, ConfigInfoComponent, DetailInfoComponent, ShowModelComponent, EquipmentDetailInfoComponent],
  entryComponents: [
    ModalInfoComponent,
    ConfigInfoComponent,
    DetailInfoComponent,
    ShowModelComponent,
    EquipmentDetailInfoComponent
  ]
})
export class TerminalEquipmentModule { }
