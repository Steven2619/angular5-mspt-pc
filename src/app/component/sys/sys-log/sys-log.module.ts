import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SysLogRoutingModule } from './sys-log-routing.module';
import { SysLogComponent } from './sys-log.component';
import {SharedModule} from '../../../common/shared.module';
import {CoreModule} from '../../../core/core.module';
import { LogErrorDetailComponent } from './log-error-detail/log-error-detail.component';


@NgModule({
  imports: [
    CommonModule,
    SysLogRoutingModule,
    SharedModule,
    CoreModule
  ],
  declarations: [SysLogComponent, LogErrorDetailComponent],
  entryComponents: [LogErrorDetailComponent]
})
export class SysLogModule { }
