import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { environment } from '../../../environments/environment';
import { HttpService } from './http.service';
@Injectable()
export class ConfigDetailService {
  private baseUrl = environment.apiBase;
  constructor(
    private httpServ: HttpService
  ) { }
  //保存终端信息
  saveConfig(data): Observable<any> {
    console.log("增加的配置信息==============》", data);
    return this.httpServ.post(this.baseUrl + '/terminalEquipmentConfig/save', data);

  }
  //保存终端信息
  findById(equipmentNo): Observable<any> {
    console.log("查询的设备编号信息==============》", equipmentNo);
    return this.httpServ.post(this.baseUrl + '/terminalEquipment/findById', equipmentNo);

  }
}
