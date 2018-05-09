import { Injectable, Inject } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { DeleteModalComponent } from '../../common/delete-modal/delete-modal.component'
import { environment } from '../../../environments/environment';
import { ModalComponent } from '../../common/modal/modal.component';
import { MatDialog } from '@angular/material';
import 'rxjs/add/Observable/of';
import { HttpService } from './http.service';
import {CommonModalComponent} from '../../common/common-modal/common-modal.component';
@Injectable()
export class CommonService {
  private baseUrl = environment.apiBase;
  constructor(
    public dialog: MatDialog,
    public httpServ: HttpService
  ) { }

  getNavList(): Observable<any> {
      // console.log("菜单集合",this.navList)
    // return Observable.of(this.navList);
    // return this.httpServ.get(this.baseUrl + '/browser/getSysMenus');
    return this.httpServ.get(this.baseUrl + '/browser/getInitSystemInfo');
  }
  showBox(message): Observable<any> {
    const dialogRef = this.dialog.open(ModalComponent, {
      width: '400px',
      data: message
    });
    return dialogRef.afterClosed();
    // dialogRef.afterClosed().subscribe(result => {
    //   console.log('The dialog was closed');
    // });
  }
  showCommonBox(message): Observable<any> {
    const dialogRef = this.dialog.open(CommonModalComponent, {
      width: '400px',
      data: message
    });
    return dialogRef.afterClosed();
  }

  showDelBox(message): Observable<any> {
    const dialogRef = this.dialog.open(DeleteModalComponent, {
      width: '400px',
      data: message
    });
    return dialogRef.afterClosed();
  }

  /***
   * 封装H5本地储存sessionStorage
   * sessionWrite   写入
   * @params key ：string
   * @params value ：any
   */
  public sessionWrite(key: string, value: any) {
    if (value) {
      value = JSON.stringify(value);
    }
    sessionStorage.setItem(key, value);
  }

  /***
   * 封装H5本地储存sessionStorage
   * sessionRead   读取
   * @params key ：string
   * return  value ：any
   */
  public sessionRead<T>(key: string): T {
    let value: string = sessionStorage.getItem(key);

    if (value && value != "undefined" && value != "null") {
      return <T>JSON.parse(value);
    }
    return null;
  }
  //获取权限信息方法
  getPermissions(data, currentUrl): Observable<any> {
    let menuList = data;
    let len = menuList.length;
    for (let i = 0; i < len; i++) {
      for (let j = 0; j < menuList[i].childData.length; j++) {
        if (menuList[i].childData[j]['href'] === currentUrl) {
          let rel = menuList[i].childData[j]['permCodeList'];
          let result = rel.split("|");
          let relInfo = {}
          result.forEach(function(value, i) {
            let perm = value.split(":");
            relInfo[perm[1]] = true;
          })
          // console.log(relInfo)
          return Observable.of(relInfo);
        }
      }
    }
  }
  // 权限判断
  // hasPermissions()
  // 获取告警
  getAlarm(info): Observable<any> {
   if (this.sessionRead('token')) {
    return this.httpServ.post(this.baseUrl + '/activeAlarm/queryCountLeveL', info);
   }else {
    return Observable.of(false);
   }
  }
}
