import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SysPermissionRoutingModule } from './sys-permission-routing.module';
import { SysPermissionComponent } from './sys-permission.component';
import {SharedModule} from '../../../common/shared.module';
import {CoreModule} from '../../../core/core.module';
import { PermissionModalComponent } from './permission-modal/permission-modal.component';


@NgModule({
  imports: [
    CommonModule,
    SysPermissionRoutingModule,
    SharedModule,
    CoreModule
  ],
  declarations: [SysPermissionComponent, PermissionModalComponent],
  entryComponents: [PermissionModalComponent]
})
export class SysPermissionModule { }
