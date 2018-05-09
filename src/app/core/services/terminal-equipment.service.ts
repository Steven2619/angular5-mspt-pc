import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
//导入http请求处理
import { HttpClient } from '@angular/common/http';
//导入访问后台基本路径
import { environment } from '../../../environments/environment';
//导入修改，增加显示模态框的组件，这个是用于编辑按钮和模态框显示关联的组件，修改的的模态框是一个新创建的组件
import { ModalInfoComponent } from '../../component/terminal-equipment/modal-info/modal-info.component';
//导入终端配置的组件
import { ConfigInfoComponent } from '../../component/terminal-equipment/config-info/config-info.component';
import { DetailInfoComponent } from '../../component/terminal-equipment/detail-info/detail-info.component';
import { EquipmentDetailInfoComponent } from '../../component/terminal-equipment/equipment-detail-info/equipment-detail-info.component';
//导入展示组件
import { ShowModelComponent } from '../../component/terminal-equipment/show-model/show-model.component';
//导入终端配置的组件
import { MatDialog } from '@angular/material';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { HttpService } from './http.service';

import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map';
@Injectable()
export class TerminalEquipmentService {
  private terminalInfoList = [];
  //访问后台的基本路径
  private baseUrl = environment.apiBase
  constructor(
    public dialog: MatDialog,
    private http: HttpClient,
    private httpServ: HttpService
  ) { }

  //获取所有的设信息
  getTerminalInfoList(): Observable<any> {
    //访问数据
    return this.httpServ.get(this.baseUrl + '/terminalEquipment/list')
  }

  //带分页的查询
  getAllTerminalInfos(pageInfo): Observable<any> {
    console.log('pageInfo=====》', pageInfo);
    //访问数据
    return this.httpServ.post(this.baseUrl + '/terminalEquipment/listErminalEquipmentInfos', pageInfo);
  }

  //查询
  search(terminalEquipment): Observable<any> {
    return this.httpServ.post(this.baseUrl + '/terminalEquipment/list', terminalEquipment);
  }
  //获取设备类型
  getEquipmentType(): Observable<any> {
    //访问数据
    return this.httpServ.get(this.baseUrl + '/terminalEquipment/getEquipmentType');
  }

  //增加、修改模态框的显示
  show(message): Observable<any> {
    //ModalInfoComponent 新创建的修改组件
    //delete message.title;
    const dialogRef = this.dialog.open(ModalInfoComponent, {
      disableClose: true,
      width: '800px',
      // height: '800px',
      data: message
    });
    return dialogRef.afterClosed();
  }
  //显示重启,版本,校正角度的模态框
  showModel(message): Observable<any> {
    const dialogRef = this.dialog.open(ShowModelComponent, {
      disableClose: false,
      width: '400px',
      data: message
    });
    return dialogRef.afterClosed()
  }
  //根据设备编号查找配置
  findByequipmentNo(equipmentNo): Observable<any> {
    return this.httpServ.post(this.baseUrl + '/terminalEquipmentConfig/findByequipmentNo', equipmentNo);
  }
  //访问终端的配置
  getTerminalConfingInfoList(): Observable<any> {
    //访问数据
    return this.httpServ.get(this.baseUrl + '/terminalEquipmentConfig/getConfigType')
  }

  // showDetail
  //显示终端配置
  showConfig(message): Observable<any> {
    console.log(message)
    const dialogRef = this.dialog.open(ConfigInfoComponent, {
      disableClose: false,
      width: '900px',
      // height: '800px',
      data: message
    });
    return dialogRef.afterClosed();
  }
  //显示终端消息日志
  showMessage(message): Observable<any> {
    console.log(message)
    const dialogRef = this.dialog.open(DetailInfoComponent, {
      disableClose: false,
      width: '1000px',
      // height: '800px',
      data: message
    });
    return dialogRef.afterClosed();
  }

  showEquipmentDetailModal(message): Observable<any> {
    console.log(message)
    const dialogRef = this.dialog.open(EquipmentDetailInfoComponent, {
      disableClose: false,
      width: '1000px',
      height: '650px',
      data: message
    });
    return dialogRef.afterClosed();
  }


  //修改时通过获取修改的对象
  getListDataById(id): Observable<any> {
    return this.httpServ.post(this.baseUrl + '/terminalEquipment/findByeEquipmentNo', id);
  }

  //保存修改后的数据
  update(erminalEquipmentInfo): Observable<any> {
    console.log("设备修改的信息==============》", erminalEquipmentInfo);
    return this.httpServ.post(this.baseUrl + '/terminalEquipment/update', erminalEquipmentInfo);

  }
  //修改终端的配置
  updateEquimentConfig(terminalEquipmentConfigInfo): Observable<any> {
    return this.httpServ.post(this.baseUrl + '/terminalEquipmentConfig/update', terminalEquipmentConfigInfo);
  }
  //增加设备
  save(erminalEquipmentInfo): Observable<any> {
    console.log("增加的设备信息==============》", erminalEquipmentInfo);
    return this.httpServ.post(this.baseUrl + '/terminalEquipment/save', erminalEquipmentInfo);

  }

  //批量删除
  deleteBatch(choose): Observable<any> {
    return this.httpServ.post(this.baseUrl + '/terminalEquipment/deleteBatch', choose);
  }

  //通过设备号删除
  delete(equipmentNo): Observable<any> {
    return this.httpServ.post(this.baseUrl + '/terminalEquipment/delete', equipmentNo);
  }

  getMessageByEquipmentNo(equipmentNo): Observable<any> {
    return this.httpServ.post(this.baseUrl + '/terminalEquipment/queryMessageByEquipmentNo', equipmentNo);
  }

}
