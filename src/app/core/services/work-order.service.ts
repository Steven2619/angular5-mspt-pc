import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {environment} from '../../../environments/environment';
import {MatDialog} from '@angular/material';
import {HttpService} from './http.service';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map';


@Injectable()
export class WorkOrderService {
  //访问后台的基本路径
  private baseUrl = environment.apiBase;

  constructor(public dialog: MatDialog,
              private http: HttpService) {
  }

  //获取所有的工单信息
  listWorkOrderInfos(pageInfo): Observable<any> {
    //访问数据
    return this.http.post(this.baseUrl + '/workOrderInfo/listWorkOrderInfos', pageInfo);
  }

  //添加工单
  addWorkOrder(workOrderInfo): Observable<any> {
    return this.http.post(this.baseUrl + '/workOrderInfo/save',workOrderInfo);
  }

  //删除、归档工单
  updateWorkOrder(updateInfo): Observable<any>{
    return this.http.post(this.baseUrl + '/workOrderInfo/update',updateInfo);
  }
  //编辑工单
  editWorkOrder(workOrderInfo): Observable<any>{
    return this.http.post(this.baseUrl + '/workOrderInfo/updateOrder',workOrderInfo);
  }
  //获取设备信息
  getEquipmentInfo(): Observable<any>{
    return this.http.get(this.baseUrl+'/terminalEquipment/list');
  }

  //通过告警源查询所有告警ID
  getAlarmIdList(alarmSource):Observable<any>{
    return this.http.post(this.baseUrl+'/activeAlarm/queryByAlarmSource',alarmSource);
  }

  //通过设备编号查询告警信息
  activeAlarmsList(alarmInfo): Observable<any>{
    return this.http.post(this.baseUrl+'/activeAlarm/queryAlarmByAlarmSource',alarmInfo);
  }
  //通过管井编号模糊查询管井信息
  searchWellNo(searchWell): Observable<any> {
    return this.http.post(this.baseUrl + '/terminalWell/queryByCondition',searchWell);
  }

  //模态框的显示
  showModel(WorkOrderComponent,params?:any): Observable<any> {
    //WorkOrderComponent 显示的工单组件
    const dialogRef = this.dialog.open(WorkOrderComponent, {
      disableClose: true,
      width: '800px',
      data: params
    });
    return dialogRef.afterClosed();
  }

}
