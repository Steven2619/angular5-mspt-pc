import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HttpClientModule} from '@angular/common/http';
import {AuthService} from './services/auth.service';
import {AuthGuard} from './guards/auth.guard';
import {CommonService} from './services/common.service';
import {SharedModule} from '../common/shared.module';
import {DemoService} from './services/demo.service';
import {TerminalEquipmentService} from './services/terminal-equipment.service';
import {ActiveAlarmService} from './services/active-alarm.service';
import {HTTP_INTERCEPTORS} from '@angular/common/http';
import {InterceptorService} from './services/interceptor.service';
import {HttpService} from './services/http.service';
import {TerminalWellService} from './services/terminal-well.service';
import {WorkOrderService} from './services/work-order.service';
import {LinkCityService} from './services/link-city.service';
import {ConfigDetailService} from './services/config-detail.service';
import {SysManageService} from './services/sys-manage.service';
import {EquipmentMessageService} from './services/equipment-message.service';
import {MapManageService} from "./services/map-manage.service";

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    SharedModule,
  ],
  declarations: [],
  providers: [
    AuthService,
    AuthGuard,
    CommonService,
    DemoService,
    TerminalEquipmentService,
    ActiveAlarmService,
    TerminalWellService,
    HttpService,
    WorkOrderService,
    LinkCityService,
    ConfigDetailService,
    SysManageService,
    MapManageService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: InterceptorService,
      multi: true
    },
    EquipmentMessageService
  ]
})
export class CoreModule {
}
