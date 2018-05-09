import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UpdatePasswordRoutingModule } from './update-password-routing.module';
import { UpdatePasswordComponent } from './update-password.component';
import {SharedModule} from '../../common/shared.module';
import {CoreModule} from '../../core/core.module';

@NgModule({
  imports: [
    CommonModule,
    UpdatePasswordRoutingModule,
    SharedModule,
    CoreModule
  ],
  declarations: [UpdatePasswordComponent]
})
export class UpdatePasswordModule { }
