import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {SysManageService} from '../../../core/services/sys-manage.service';
import {CommonService} from '../../../core/services/common.service';
import { PageInfo, pageSize} from '../../../models/page-info';
import {LogErrorDetailComponent} from './log-error-detail/log-error-detail.component';
import { Router, NavigationEnd } from '@angular/router';
@Component({
  selector: 'app-sys-log',
  templateUrl: './sys-log.component.html',
  styleUrls: ['./sys-log.component.scss']
})
export class SysLogComponent implements OnInit {
  @ViewChild('tableBody') tableBody: ElementRef;
  public isSelectAll: Boolean = false;
  @ViewChild('checkAll') checkAllEl: ElementRef;
  sysLogFormGroup: FormGroup;
public menuTitle=null;
  public tableList = [];
  //根据toke获取的权限信息
  public perInfo = {};
  //权限变量
  public permissions = [];
  constructor(
    public sysManageService: SysManageService,
    public commonServ: CommonService,
    public router:Router
  ) {
    this.sysLogFormGroup = new FormGroup({
      eventStatus : new FormControl('-1'),
      startTime : new FormControl(),
      endTime : new FormControl(),
    });
  }
  public page: Boolean = false;
  // 总条数:totalRows 总页数:totalPages  当前页:currentPage 提示信息:message 每月显示的条数pageSize 排序字段 sort
  pageInfo: PageInfo = {
    totalRows: 0,
    totalPages: 0,
    currentPage: 1,
    message: '',
    pageSize: pageSize,
    data: [],
    sort: {},
    searchData: {}
  };
  initPageInfo: PageInfo = {
    totalRows: 0,
    totalPages: 0,
    currentPage: 1,
    message: '',
    pageSize: pageSize,
    data: [],
    sort: {},
    searchData: {}
  };
  ngOnInit() {
    this.querySysLogInfoList();
    this.commonServ.getNavList().subscribe((data) => {
        this.perInfo = data.result.sysMenus;
        this.permissions = data.result.userSysPermCodes;
      // console.log(this.perInfo)
      // this.getPermissions(this.perInfo, this.router.url);
      for(let k in this.perInfo){
         let list= this.perInfo[k]['childData'];
         for(let i=0;i<list.length;i++){
             if(list[i]['href']===this.router.url){
                 this.menuTitle=list[i]['title'];
             }
         }
      }
    })
  }

  /**
   * 根据查询条件查询
   */
  querySysLogInfoList() {
    // console.log('----querySysLogInfoList---');
    // console.log(this.sysLogFormGroup.value);
    if (!this.validate()){
      console.log('----querySysLogInfoList--1');
      return;
    }
    if(!this.sysLogFormGroup.value.eventStatus){
      this.sysLogFormGroup.value['eventStatus'] = '-1';
    }
    this.initPageInfo.searchData = this.sysLogFormGroup.value;
    this.sysManageService.getSysLogInfoList(this.initPageInfo).subscribe((response) => {
      // console.log("分页查询的结果是：", response);
      this.tableList = response.result.data;
      this.pageInfo.totalRows = response.result.totalRows;
      this.pageInfo.currentPage = response.result.currentPage;
      this.pageInfo.pageSize = response.result.pageSize;
      this.pageInfo.totalPages = response.result.totalPages;
      this.pageInfo.message = response.result.message;
      this.pageInfo.sort = response.result.sort;
      this.page = true;
    });
  }
  validate(){
    const groupValue = this.sysLogFormGroup.value;
    console.log(groupValue);
    if (groupValue.startTime != null && groupValue.endTime != null){
      if( groupValue.startTime > groupValue.endTime){
        this.commonServ.showBox('结束时间不应该大于起始时间');
        return false;
      }
    }
    return true;
  }

  showErrorLogDtlInfo(info){
    // console.log(info);
    let details = {};
    if(info.eventErrorCode){
      details['eventErrorCode'] = info.eventErrorCode;
    }else{
      details['eventErrorCode'] = '无';
    }
    details['eventRemoteIp'] = info.eventRemoteIp;
    details['eventDescription'] = info.eventDescription;
    const data = {title : '详细描述' , details : details};
    this.sysManageService.showModal( data , LogErrorDetailComponent).subscribe( (isConfirmed) => {

    });
  }
  /**
   * 分页函数
   * pno--页数
   **/
  goPage(pno) {
    if (this.page) {
      if (this.pageInfo.totalPages === 0) {
        this.openDefaultDialog('暂无数据');
        return;
      }

      // event.preventDefault();
      if (pno > this.pageInfo.totalPages) {
        // this.openDefaultDialog('已经是最后一页了');
        return;
      }

      if (pno <= 0) {
        // this.openDefaultDialog('已经是第一页了');
        return;
      }
    }
    this.pageInfo.currentPage = pno;
    this.pageInfo.searchData = this.sysLogFormGroup.value;
    // console.log(this.pageInfo);
    this.sysManageService.getSysLogInfoList(this.pageInfo).subscribe((response) => {
      // console.log("goPage 分页查询的结果是：", response);
      this.tableList = response.result.data;
      this.pageInfo.totalRows = response.result.totalRows;
      this.pageInfo.currentPage = response.result.currentPage;
      this.pageInfo.pageSize = response.result.pageSize;
      this.pageInfo.totalPages = response.result.totalPages;
      this.pageInfo.message = response.result.message;
      this.pageInfo.sort = response.result.sort;
      this.page = true;
      if (this.pageInfo.totalPages === 0) {
        this.openDefaultDialog('暂无数据');
      }
    });
  }
// 批量删除事件
  batchDeleteSysLogInfo() {
    const checkboxes = this.tableBody.nativeElement.querySelectorAll('input[type="checkbox"]');
    const selectedList = [];
    checkboxes.forEach((item) => {
      if (item.checked) {
        selectedList.push(item.value);
      }
    });
    if (selectedList.length === 0) {
      this.commonServ.showBox("没有选择要删除的数据");
      return;
    }
    let idStr = selectedList.join(',');
    // console.log('--batchDeleteSysLogInfo---' + idStr);
    this.commonServ.showDelBox('选中数据').subscribe((isSuccessed) => {
      if (isSuccessed) {
        this.sysManageService.deleteSysLogInfo(idStr).subscribe( (response) => {
          // console.log(response);
          if (response.status.code ===  0 ) {
            this.commonServ.showBox('删除成功');
            this.querySysLogInfoList();
          }
        });
      }
    });

  }

  deleteSysLogInfoBetweenTime(){
    // console.log('----querySysLogInfoList---');
    const info = this.sysLogFormGroup.value;
    // console.log(info);
    if(info.startTime == null) {
      this.commonServ.showBox('请选择删除数据的起始时间');
      return;
    }else if(info.endTime == null) {
      this.commonServ.showBox('请选择删除数据的结束时间');
      return;
    }
    const msg = SysLogComponent.dateFormat(info.startTime,'yyyy-MM-dd HH:mm:ss' ) + ' 到 ' + SysLogComponent.dateFormat(info.endTime,'yyyy-MM-dd HH:mm:ss') + '的数据';
    this.commonServ.showDelBox(msg).subscribe((isSuccessed) => {
      if (isSuccessed) {
        this.sysManageService.deleteSysLogInfoBetweenTime(info).subscribe( (response) => {
          // console.log(response);
          if (response.status.code ===  0 ) {
            this.commonServ.showBox('删除成功');
            this.querySysLogInfoList();
          }
        });
      }
    });
  }

  // 提示模态框
  openDefaultDialog(message): void {
    this.commonServ.showBox(message);
  }

  onCheckboxAllChanged() {
    const checkboxes = this.tableBody.nativeElement.querySelectorAll('input[type="checkbox"]');
    if (this.isSelectAll) {
      checkboxes.forEach((item) => {
        item.checked = false;
      });
      this.isSelectAll = false;
    } else {
      checkboxes.forEach((item) => {
        item.checked = true;
      });
      this.isSelectAll = true;
    }
  }
  onCheckboxItemChanged(event) {
    event.stopPropagation();
    const checkboxes = this.tableBody.nativeElement.querySelectorAll('input[type="checkbox"]');
    let temp = true;
    checkboxes.forEach((item) => {
      if (!item.checked) {
        temp = false;
      }
    });
    if (temp) {
      this.isSelectAll = true;
    } else {
      this.isSelectAll = false;
    }
    const checkAllElem = this.checkAllEl.nativeElement;
    temp ? checkAllElem.checked = true : checkAllElem.checked = false;
  }
  convertToDate(nows) {
    const now = new Date(nows);
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    const date = now.getDate();
    const hour = now.getHours();
    const minute = now.getMinutes();
    const second = now.getSeconds();
    return year + '-' + month + '-' + date + ' ' + hour + ':' + minute + ':' + second;
  }

  /**
   * 日期对象转为日期字符串
   * @param date 需要格式化的日期对象
   * @param sFormat 输出格式,默认为yyyy-MM-dd                        年：y，月：M，日：d，时：h，分：m，秒：s
   * @example  dateFormat(new Date())                               "2017-02-28"
   * @example  dateFormat(new Date(),'yyyy-MM-dd')                  "2017-02-28"
   * @example  dateFormat(new Date(),'yyyy-MM-dd HH:mm:ss')         "2017-02-28 13:24:00"   ps:HH:24小时制
   * @example  dateFormat(new Date(),'yyyy-MM-dd hh:mm:ss')         "2017-02-28 01:24:00"   ps:hh:12小时制
   * @example  dateFormat(new Date(),'hh:mm')                       "09:24"
   * @example  dateFormat(new Date(),'yyyy-MM-ddTHH:mm:ss+08:00')   "2017-02-28T13:24:00+08:00"
   * @example  dateFormat(new Date('2017-02-28 13:24:00'),'yyyy-MM-ddTHH:mm:ss+08:00')   "2017-02-28T13:24:00+08:00"
   * @returns {string}
   */
  static dateFormat(date: Date, sFormat: String = 'yyyy-MM-dd'): string {
    let time = {
      Year: 0,
      TYear: '0',
      Month: 0,
      TMonth: '0',
      Day: 0,
      TDay: '0',
      Hour: 0,
      THour: '0',
      hour: 0,
      Thour: '0',
      Minute: 0,
      TMinute: '0',
      Second: 0,
      TSecond: '0',
      Millisecond: 0
    };
    time.Year = date.getFullYear();
    time.TYear = String(time.Year).substr(2);
    time.Month = date.getMonth() + 1;
    time.TMonth = time.Month < 10 ? "0" + time.Month : String(time.Month);
    time.Day = date.getDate();
    time.TDay = time.Day < 10 ? "0" + time.Day : String(time.Day);
    time.Hour = date.getHours();
    time.THour = time.Hour < 10 ? "0" + time.Hour : String(time.Hour);
    time.hour = time.Hour < 13 ? time.Hour : time.Hour - 12;
    time.Thour = time.hour < 10 ? "0" + time.hour : String(time.hour);
    time.Minute = date.getMinutes();
    time.TMinute = time.Minute < 10 ? "0" + time.Minute : String(time.Minute);
    time.Second = date.getSeconds();
    time.TSecond = time.Second < 10 ? "0" + time.Second : String(time.Second);
    time.Millisecond = date.getMilliseconds();

    return sFormat.replace(/yyyy/ig, String(time.Year))
      .replace(/yyy/ig, String(time.Year))
      .replace(/yy/ig, time.TYear)
      .replace(/y/ig, time.TYear)
      .replace(/MM/g, time.TMonth)
      .replace(/M/g, String(time.Month))
      .replace(/dd/ig, time.TDay)
      .replace(/d/ig, String(time.Day))
      .replace(/HH/g, time.THour)
      .replace(/H/g, String(time.Hour))
      .replace(/hh/g, time.Thour)
      .replace(/h/g, String(time.hour))
      .replace(/mm/g, time.TMinute)
      .replace(/m/g, String(time.Minute))
      .replace(/ss/ig, time.TSecond)
      .replace(/s/ig, String(time.Second))
      .replace(/fff/ig, String(time.Millisecond))
  }
  //权限设置
  // getPermissions(preinfo, currentUrl) {
  //   this.commonServ.getPermissions(preinfo, currentUrl).subscribe((data) => {
  //     this.permissions = data
  //   })
  // }
  hasPermission(val): boolean {
    for (let i = 0; i < this.permissions.length; i++) {
        if(this.permissions[i]===val){
            return true;
        }
    }
    return false;
  }

}
