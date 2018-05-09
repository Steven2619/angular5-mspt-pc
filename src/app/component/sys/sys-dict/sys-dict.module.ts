import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SysDictRoutingModule } from './sys-dict-routing.module';
import { SysDictComponent } from './sys-dict.component';
import {SharedModule} from '../../../common/shared.module';
import {CoreModule} from '../../../core/core.module';
import { SysdictModalComponent } from './sysdict-modal/sysdict-modal.component';

@NgModule({
  imports: [
    CommonModule,
    SysDictRoutingModule,
    SharedModule,
    CoreModule
  ],
  declarations: [SysDictComponent, SysdictModalComponent],
  entryComponents: [SysdictModalComponent]
})
export class SysDictModule { }
