import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SysUserRoutingModule } from './sys-user-routing.module';
import { SysUserComponent } from './sys-user.component';
import {SharedModule} from '../../../common/shared.module';
import {CoreModule} from '../../../core/core.module';
import { UserModalInfoComponent } from './user-modal-info/user-modal-info.component';
import { EditUserComponent } from './edit-user/edit-user.component';
import { AddUserComponent } from './add-user/add-user.component';

@NgModule({
  imports: [
    CommonModule,
    SysUserRoutingModule,
    SharedModule,
    CoreModule
  ],
  declarations: [SysUserComponent, UserModalInfoComponent, EditUserComponent, AddUserComponent],
  entryComponents: [
    UserModalInfoComponent, EditUserComponent , AddUserComponent 
  ]
})
export class SysUserModule { }
