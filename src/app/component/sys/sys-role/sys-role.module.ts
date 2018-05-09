import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SysRoleRoutingModule } from './sys-role-routing.module';
import { SysRoleComponent } from './sys-role.component';
import {SharedModule} from '../../../common/shared.module';
import {CoreModule} from '../../../core/core.module';
import { RoleModalComponent } from './role-modal/role-modal.component';
import { RolePermModalComponent } from './role-perm-modal/role-perm-modal.component';

@NgModule({
  imports: [
    CommonModule,
    SysRoleRoutingModule,
    SharedModule,
    CoreModule
  ],
  declarations: [SysRoleComponent, RoleModalComponent, RolePermModalComponent],
  entryComponents: [RoleModalComponent, RolePermModalComponent]
})
export class SysRoleModule { }
