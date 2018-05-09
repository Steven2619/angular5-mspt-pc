import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { UserInfo } from '../../models/user-info';
import { CommonService } from '../../core/services/common.service';
import { MatIconRegistry } from '@angular/material';
import { SysManageService } from '../../core/services/sys-manage.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource, MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { UpdatePasswordComponent } from '../update-password/update-password.component';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  info = null;
  isLoaded: Boolean = false;
  userinfo: UserInfo = {
    userName: '',
  };
  //告警定时器
  alarmTimer = null;
  //告警数
  alarmNum = {
    urgentAlarm: 0,
    promptAlarm: 0,
    importantAlarm: 0,
    generalAlarm: 0
  }
  alarmList = [];
  //告警是否闪烁
  urgentblinking = false;
  promptblinking = false;
  importantblinking = false;
  generalblinking = false;
  //对应的定时器
  urgentTimer = null;
  promptTimer = null;
  importantTimer = null;
  generalTimer = null;
  constructor(
    private authSer: AuthService,
    private router: Router,
    private commServ: CommonService,
    private sysManageServ: SysManageService,
        public dialog: MatDialog,
  ) {

  }

  ngOnInit() {
    this.userinfo.userName = this.commServ.sessionRead('username');
    this.sysManageServ.getCurrentUserInfo().subscribe(response => {
      this.info = response.result;
      // console.log("用户信息",this.info)
    })

    this.isLoaded = true;
    this.commServ.getAlarm([]).subscribe((data) => {
      // console.log('告警请求数据', data.result);
      this.alarmList = data.result;
      this.getAlarmNum(this.alarmList);
    });
    this.alarmTimer = setInterval(() => {
      this.commServ.getAlarm(this.alarmList).subscribe((data) => {
        // console.log('定时器返回', data);
        if ( data === false) {
          clearInterval(this.alarmTimer);
        }

        // console.log('告警请求数据', data);
        // console.log('长度', data.result.length)
        if (data.result.length === 0) {
          // 清除四个告警灯的定时器;
          this.closeAllalarmtimer();
        } else {
          this.alarmList = data.result;
          this.getAlarmNum(this.alarmList);
        }
      })
    }, 5000);
  }
  loginOut() {
    this.commServ.showBox('你确定要退出吗?').subscribe((rel) => {
      if (rel === true) {
        this.closeAllalarmtimer();
        clearInterval(this.alarmTimer);
        sessionStorage.clear();
        this.router.navigate(['login']);
      }
    })
  }
  goAlarm(level) {
    this.router.navigate(['alarm-info'], { queryParams: { alarmLevel: level } });
  }
  /*****
  //告警数
  alarmNum = {
    urgentAlarm: 0,
    promptAlarm: 0,
    importantAlarm: 0,
    generalAlarm: 0
  }
  //告警是否闪烁
  urgentblinking = false;
  promptblinking = false;
  importantblinking = false;
  generalblinking = false;
  //对应的定时器
  urgentTimer = null;
  promptTimer = null;
  importantTimer = null;
  generalTimer = null;
  *****/
  //获取告警数
  getAlarmNum(data) {
    const list = data;
    const len = data.length;

    for (let i = 0; i < len; i++) {
      //告警数赋值
      if (list[i]['alarmLevel'] === 7) {
        this.alarmNum['urgentAlarm'] = list[i]['alarmLevelCount'];
        if (this.urgentTimer === null) {
          // console.log("定时器7",this.urgentTimer)
          if (list[i]['flag'] === 1) {
            this.urgentTimer = setInterval(() => {
              this.urgentblinking ? this.urgentblinking = false : this.urgentblinking = true
            }, 500);
          }
        } else {
          if (list[i]['flag'] !== 1) {
            clearInterval(this.urgentTimer);
            this.urgentTimer = null;
            this.urgentblinking = false;
          }
        }
      } else if (list[i]['alarmLevel'] === 6) {
        this.alarmNum['promptAlarm'] = list[i]['alarmLevelCount'];
        if (this.promptTimer === null) {
          if (list[i]['flag'] === 1) {
            this.promptTimer = setInterval(() => {
              this.promptblinking ? this.promptblinking = false : this.promptblinking = true
            }, 500);
          }
        } else {
          if (list[i]['flag'] !== 1) {
            clearInterval(this.promptTimer);
            this.promptTimer = null;
            this.promptblinking = false;
          }
        }
      } else if (list[i]['alarmLevel'] === 5) {
        this.alarmNum['importantAlarm'] = list[i]['alarmLevelCount'];
        if (this.importantTimer === null) {
          if (list[i]['flag'] === 1) {
            this.importantTimer = setInterval(() => {
              this.importantblinking ? this.importantblinking = false : this.importantblinking = true
            }, 500);
          }
        } else {
          if (list[i]['flag'] !== 1) {
            clearInterval(this.importantTimer);
            this.importantTimer = null;
            this.importantblinking = false;
          }
        }
      } else if (list[i]['alarmLevel'] === 4) {
        this.alarmNum['generalAlarm'] = list[i]['alarmLevelCount'];
        if (this.generalTimer === null) {
          if (list[i]['flag'] === 1) {
            this.generalTimer = setInterval(() => {
              this.generalblinking ? this.generalblinking = false : this.generalblinking = true
            }, 500);
          }
        } else {
          if (list[i]['flag'] !== 1) {
            clearInterval(this.generalTimer);
            this.generalTimer = null;
            this.generalblinking = false;
          }
        }
      }
    }
  }

  //清除四个告警定时器
  closeAllalarmtimer() {
    clearInterval(this.urgentTimer);
    clearInterval(this.promptTimer);
    clearInterval(this.importantTimer);
    clearInterval(this.generalTimer);
    this.urgentTimer = null;
    this.promptTimer = null;
    this.importantTimer = null;
    this.generalTimer = null;
    this.urgentblinking = false;
    this.promptblinking = false;
    this.importantblinking = false;
    this.generalblinking = false;
  }

  updatePassword() {
    const dialogRef = this.dialog.open(UpdatePasswordComponent, {
      disableClose: true,
      width: '800px',

    });
    dialogRef.afterClosed().subscribe(result=>{
        if(result){
            this.closeAllalarmtimer();
            clearInterval(this.alarmTimer);
            sessionStorage.clear();
            this.router.navigate(['login']);
        }
    })
  }
}
