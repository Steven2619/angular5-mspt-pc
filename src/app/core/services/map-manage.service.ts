import {Injectable} from '@angular/core';
import {Observable} from "rxjs/Observable";
import {HttpService} from "./http.service";
import {MatDialog} from "@angular/material";
import {environment} from "../../../environments/environment";
import {DeleteModalComponent} from "../../common/delete-modal/delete-modal.component";

@Injectable()
export class MapManageService {
  baseUrl: string;
  wellTypeData: Array<any>;
  eqTypeData: Array<any>;
  adminStatusData: Array<any>;
  constructor(public dialog: MatDialog,
              private http: HttpService) {
    this.baseUrl = environment.apiBase;
    this.wellTypeData = [{key: 0, val: '常规管井'}, {key: 1, val: '机械锁管井'}, {key: 2, val: '电子管井'}];
    this.eqTypeData = [{key: 1, val: '倾角传感器井盖'}, {key: 2, val: '烟雾感应'}, {key: 3, val: '行程开关井盖'}];
    this.adminStatusData = [{key: -1, val: '已拆除'}, {key: 0, val: '未安装'}, {key: 1, val: '已安装'}, {
      key: 2,
      val: '正常开启'
    }, {key: 3, val: '维修'}];
  }

  //模态框的显示
  showModel(ModelComponent, params?: any): Observable<any> {
    //ModelComponent 显示的模块组件
    const dialogRef = this.dialog.open(ModelComponent, {
      disableClose: true,
      width: '800px',
      data: params
    });
    return dialogRef.afterClosed();
  }

  // 弹出删除提示框
  showDelete(message): Observable<any> {
    const dialogRef = this.dialog.open(DeleteModalComponent, {
      width: '400px',
      data: message
    });
    return dialogRef.afterClosed();
  }

  //通过管井ID操作删除
  deleteWell(wellId): Observable<any> {
    return this.http.post(this.baseUrl + '/terminalWell/delete', wellId);
  }

  //获取地图所有的管井信息
  listMapInfos(mapInfo): Observable<any> {
    return this.http.post(this.baseUrl + '/mapInfo/list', mapInfo);
  }

  // 修改管井和设备信息
  editWellInfos(wellInfo): Observable<any> {
    return this.http.post(this.baseUrl + '/mapInfo/editMapInfo', wellInfo);
  }

  // 修正管井位置
  editWellSite(siteInfo): Observable<any> {
    return this.http.post(this.baseUrl + '/mapInfo/editMapSite', siteInfo);
  }
  // 添加管井
  addWellInfo(WellInfo): Observable<any> {
    return  this.http.post(this.baseUrl +'/terminalWell/save',WellInfo);
  }
  //判断增加的管井编号是否重复
  queryByWellNo(wellNo): Observable<any> {
    return this.http.post(this.baseUrl + '/terminalWell/queryByWellNo', wellNo);
  }

  //根据设备编号查找配置
  findByEquipmentNo(equipmentNo): Observable<any> {
    return this.http.post(this.baseUrl + '/terminalEquipmentConfig/findByequipmentNo', equipmentNo);
  }

  //修改终端的配置
  updateEquipmentConfig(ConfigInfo): Observable<any> {
    return this.http.post(this.baseUrl + '/terminalEquipmentConfig/update', ConfigInfo);
  }

  transformInstallStatus(value: number) {
    let transitionValue = "";
    // 0:未安装;1:待安装;2:已安装
    switch (value) {
      case 0:     // 未安装
        transitionValue = "未安装";
        break;
      case 1:      //待安装
        transitionValue = "待安装";
        break;
      case 2:      //已安装
        transitionValue = "已安装";
        break;
      default:
        transitionValue = "";
    }
    return transitionValue;
  }

  transformWellType(value: number) {
    let transitionValue = "";
    // 0:常规管井1:机械锁管井2:电子管井
    switch (value) {
      case 0:     // 常规管井
        transitionValue = "常规管井";
        break;
      case 1:      //机械锁管井
        transitionValue = "机械锁管井";
        break;
      case 2:      //电子管井
        transitionValue = "电子管井";
        break;
      default:
        transitionValue = "";
    }
    return transitionValue;
  }

  transformEquipmentType(value: number) {
    let transitionValue = "";
    //  1:倾角传感器井盖 2:烟雾感应 3:行程开关井盖
    switch (value) {
      case 1:      //倾角传感器井盖
        transitionValue = "倾角传感器井盖";
        break;
      case 2:      //烟雾感应
        transitionValue = "烟雾感应";
        break;
      case 3:      //行程开关井盖
        transitionValue = "行程开关井盖";
        break;
      default:
        transitionValue = "";
    }
    return transitionValue;
  }

  transformAdminStatus(value: number) {
    let transitionValue = "";
    // -1:已拆除;0:未安装;1:已安装;2:正常开启;3:维修
    switch (value) {
      case -1:     // 已拆除
        transitionValue = "已拆除";
        break;
      case 0:      //未安装
        transitionValue = "未安装";
        break;
      case 1:      //已安装
        transitionValue = "已安装";
        break;
      case 2:      //正常开启
        transitionValue = "正常开启";
        break;
      case 3:      //维修
        transitionValue = "维修";
        break;
      default:
        transitionValue = "";
    }
    return transitionValue;
  }


  //根据经纬度获得地址
  geocoder(position: any) {
    let geocoder
    AMap.service('AMap.Geocoder', () => {//回调函数
      //实例化Geocoder
      geocoder = new AMap.Geocoder({
        radius: 1000,
        extensions: "all"
      });
      //TODO: 使用geocoder 对象完成相关功能
    });
    return Observable.create(observer => {
      geocoder.getAddress(position, (status, result) => {
        if (status === 'complete' && result.info === 'OK') {
          //获得了有效的地址信息:
          let addressComponent = result.regeocode.addressComponent;
          observer.next(addressComponent);
        } else {
          observer.error(`坐标获取地址失败`);
        }
      });
    })
  }

}
