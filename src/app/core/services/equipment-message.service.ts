import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
// import { HttpClient } from '@angular/common/http';
//导入访问后台基本路径
import { environment } from '../../../environments/environment';
import { HttpService } from './http.service';

@Injectable()
export class EquipmentMessageService {
  private baseUrl=environment.apiBase
  constructor(
      // private http: HttpClient,
      private httpServ:HttpService
  ) { }
  getMessageByEquipmentNo(equipmentNo): Observable<any>{
       return this.httpServ.post(this.baseUrl +'/terminalEquipment/queryMessageByEquipmentNo', equipmentNo);
  }

}
