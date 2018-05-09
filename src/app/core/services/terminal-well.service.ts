import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
//导入http请求处理
import {HttpClient} from '@angular/common/http';
//导入访问后台基本路径
import {environment} from '../../../environments/environment';
//导入修改，增加显示模态框的组件，这个是用于编辑按钮和模态框显示关联的组件，修改的的模态框是一个新创建的组件
import {ModalInfoComponent} from '../../component/terminal-well/modal-info/modal-info.component';
//导入终端配置的组件
import {MatDialog} from '@angular/material';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
//导入身份城市的文件
//import {  cityInfo  } from '../../models/city';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map';
//导入请求
import {HttpService} from './http.service';

@Injectable()
export class TerminalWellService {
  //访问后台的基本路径
  private baseUrl = environment.apiBase;

  // private address=cityInfo;
  constructor(public dialog: MatDialog,
              private http: HttpClient,
              private httpServ: HttpService) {
  }

  //获取所有的网井信息
  listTerminalWellInfos(pageInfo): Observable<any> {
    //访问数据
    return this.httpServ.post(this.baseUrl + '/terminalWell/listTerminalWellInfos', pageInfo);
  }

  //获取管井类型getWellType
  getWellType(): Observable<any> {
    //访问数据
    return this.httpServ.get(this.baseUrl + '/terminalWell/getWellType');
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

//判断增加的管井编号是否重复
  queryByWellNo(wellNo): Observable<any> {
    return this.httpServ.post(this.baseUrl + '/terminalWell/queryByWellNo', wellNo);
  }

  //增加管井
  save(terminalWellInfo): Observable<any> {
    console.log("增加的设备信息==============》", terminalWellInfo);
    return this.httpServ.post(this.baseUrl + '/terminalWell/save', terminalWellInfo);

  }

  //修改时通过获取修改的对象
  getListDataById(id): Observable<any> {
    return this.httpServ.post(this.baseUrl + '/terminalWell/findById', id);
  }

  //通过设备状态获取设备信息
  // queryByAdminStatus(adminStatus):Observable<any>{
  //  return  this.http.post(this.baseUrl +'/terminalEquipment/queryByAdminStatus',adminStatus);
  // }

  //保存修改后的数据
  update(terminalWellInfo): Observable<any> {
    console.log("设备修改的信息==============》", terminalWellInfo);
    return this.httpServ.post(this.baseUrl + '/terminalWell/update', terminalWellInfo);

  }

  //批量删除
  deleteBatch(wellIds): Observable<any> {
    return this.httpServ.post(this.baseUrl + '/terminalWell/deleteBatch', wellIds);
  }

  //通过设管井ID删除
  delete(id): Observable<any> {
    return this.httpServ.post(this.baseUrl + '/terminalWell/delete', id);
  }


}
