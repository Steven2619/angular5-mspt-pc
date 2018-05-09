import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MapManagementRoutingModule} from './map-management-routing.module';
import {MapManagementComponent} from './map-management.component';
import {CoreModule} from '../../core/core.module';
import {SharedModule} from '../../common/shared.module';
import {ModifyInfoComponent} from './modify-info/modify-info.component';
import {TransformPipe} from "../../common/pipes/transform.pipe";
import {AddWellComponent} from './add-well/add-well.component';
import {CreateWorkOrderComponent} from './create-work-order/create-work-order.component';
import {ConfigInfoComponent} from './config-info/config-info.component';

@NgModule({
  imports: [
    CommonModule,
    MapManagementRoutingModule,
    SharedModule,
    CoreModule,
  ],
  declarations: [
    MapManagementComponent,
    ModifyInfoComponent,
    TransformPipe,
    AddWellComponent,
    CreateWorkOrderComponent,
    ConfigInfoComponent
  ],
  entryComponents: [
    ModifyInfoComponent,
    AddWellComponent,
    CreateWorkOrderComponent,
    ConfigInfoComponent
  ]
})
export class MapManagementModule {
}
