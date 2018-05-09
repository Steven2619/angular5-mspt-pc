import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
//导入http请求处理
import { HttpClient } from '@angular/common/http';
//导入访问后台基本路径
import { environment } from '../../../environments/environment';
import { ModalInfoComponent } from '../../component/alarm-info/modal-info/modal-info.component';
import { BatchModalComponent } from '../../component/alarm-info/batch-modal/batch-modal.component';
import { WorkOrderDetailInfoComponent } from '../../component/alarm-info/work-order-detail-info/work-order-detail-info.component';
import { MatDialog } from '@angular/material';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map';
//导入请求
import { HttpService } from './http.service';
@Injectable()
export class ActiveAlarmService {
  //访问后台的基本路径
  private baseUrl = environment.apiBase
  constructor(
    public dialog: MatDialog,
    private http: HttpClient,
    private httpServ: HttpService
  ) { }

  //编辑模态框的显示
  show(message): Observable<any> {
    const dialogRef = this.dialog.open(ModalInfoComponent, {
      disableClose: true,
      width: '800px',
      // height: '800px',
      data: message
    });
    return dialogRef.afterClosed();
  }

  //批量操作
  showBatchBox(message): Observable<any> {
    const dialogRef = this.dialog.open(BatchModalComponent, {
      width: '400px',
      data: message
    });
    return dialogRef.afterClosed()
  }


  //获取所有的告警信息
  listActiveAlarms(pageInfo): Observable<any> {
    //访问数据
    return this.httpServ.post(this.baseUrl + '/activeAlarm/listActiveAlarms', pageInfo);
  }


  //通过告警编号获取告警信息
  queryAlarmDetail(alarmId): Observable<any> {
    console.log("告警编号================》", alarmId);
    return this.httpServ.post(this.baseUrl + '/activeAlarm/queryAlarmDetail', alarmId);
  }


  //通过工单编号获取工单信息
  queryWorkOrderDetail(orderNo): Observable<any> {
    console.log("工单编号================》", orderNo);
    return this.httpServ.post(this.baseUrl + '/workOrderInfo/queryWorlOrderDetail', orderNo);
  }

  //通过告警编号修改确认告警标识
  confirmAlarm(alarmId): Observable<any> {
    console.log("告警编号================》", alarmId);
    return this.httpServ.post(this.baseUrl + '/activeAlarm/confirmAlarm', alarmId);
  }

  //通过告警编号修改清除告警标识
  cleanAlarm(alarmId): Observable<any> {
    console.log("告警编号================》", alarmId);
    return this.httpServ.post(this.baseUrl + '/activeAlarm/cleanAlarm', alarmId);
  }

  //保存修改后的数据
  update(activeAlarm): Observable<any> {
    console.log("设备修改的信息==============》", activeAlarm);
    return this.httpServ.post(this.baseUrl + '/activeAlarm/update', activeAlarm);
  }

  //批量确认告警
  confirmAlarmBatch(choose): Observable<any> {
    return this.httpServ.post(this.baseUrl + '/activeAlarm/confirmAlarmBatch', choose);
  }

  //批量清除告警
  cleanAlarmBatch(choose): Observable<any> {
    return this.httpServ.post(this.baseUrl + '/activeAlarm/cleanAlarmBatch', choose);
  }


  //模态框的显示
  showModel(WorkOrderComponent, params?: any): Observable<any> {
    const dialogRef = this.dialog.open(WorkOrderComponent, {
      disableClose: true,
      width: '800px',
      data: params
    });
    return dialogRef.afterClosed();
  }


  //工单详情模态框的显示
  showWorkOrderModel(message): Observable<any> {
    const dialogRef = this.dialog.open(WorkOrderDetailInfoComponent, {
      disableClose: true,
      width: '800px',
      // height: '800px',
      data: message
    });
    return dialogRef.afterClosed();
  }


  //添加工单
  addWorkOrder(workOrderInfo): Observable<any> {
    return this.httpServ.post(this.baseUrl + '/workOrderInfo/saveActiveAlarm', workOrderInfo);
  }

  //获取告警类型
  getActiveAlarmType(): Observable<any> {
    //访问数据
    return this.httpServ.get(this.baseUrl + '/activeAlarm/getAlarmType');
  }

}
