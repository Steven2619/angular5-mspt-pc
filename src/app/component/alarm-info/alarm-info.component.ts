import { Component, OnInit, AfterViewInit, ElementRef, ViewChild, Inject } from '@angular/core';
import { ActiveAlarmService } from '../../core/services/active-alarm.service';
import { ActivatedRoute } from '@angular/router';
//分页查询
import { PageInfo, pageSize } from '../../models/page-info';
//插叙条件封装的对象
import { ActiveAlarm } from '../../models/active-alarm';
//删除提示框
import { CommonService } from '../../core/services/common.service';
import { AddAlarmWorkOrdeComponent } from './add-alarm-work-orde/add-alarm-work-orde.component';
import { Router, NavigationEnd } from '@angular/router';


@Component({
  selector: 'app-alarm-info',
  templateUrl: './alarm-info.component.html',
  styleUrls: ['./alarm-info.component.scss']
})
export class AlarmInfoComponent implements OnInit {
  public tableList = [];
  public tableInitList = [];
  public menuTitle = null;
  //查询条件的实体
  activeAlarm = {
    alarmSource: null,
    alarmType: null,
    alarmLevel: null,
    ackFlag: null,
    clearFlag: null,
    startTime: null,
    endTime: null
  };
  //根据toke获取的权限信息
  public perInfo = {};
  //权限变量
  public permissions = [];
  //告警类型集合
  public activeAlarmTypeList = [];

  public page: Boolean = false;
  // 总条数:totalRows 总页数:totalPages  当前页:currentPage 提示信息:message 每月显示的条数pageSize 排序字段 sort
  pageInfo: PageInfo = {
    totalRows: 0,
    totalPages: 0,
    currentPage: 0,
    message: '',
    pageSize: pageSize,
    data: [],
    sort: {},
    searchData: this.activeAlarm
  };
  urlLevel = null;
  //声明全选，不选，反选用的变量
  //定义有多选的table表的body
  @ViewChild('tableBody') tableBody: ElementRef;
  //默认多选框时不选中的状态
  public isSelectAll: Boolean = false;
  //定义多选框的ID： #checkAll
  @ViewChild('checkAll') checkAllEl: ElementRef;

  constructor(
    public commonServ: CommonService,
    public activeAlarmService: ActiveAlarmService,
    public activatedRoute: ActivatedRoute,
    public router: Router
  ) { }

  ngOnInit() {
    this.commonServ.getNavList().subscribe((data) => {
      this.perInfo = data.result.sysMenus;
      this.permissions = data.result.userSysPermCodes;
      // this.getPermissions(this.perInfo, this.router.url);
      for (let k in this.perInfo) {
        let list = this.perInfo[k]['childData'];
        for (let i = 0; i < list.length; i++) {
          if (list[i]['href'] === this.router.url) {
            this.menuTitle = list[i]['title'];
          }
        }
      }
    })

    //获取设备类型
    this.activeAlarmService.getActiveAlarmType().subscribe((data) => {
      this.activeAlarmTypeList = data.result;
    });

    this.activatedRoute.queryParams.subscribe((data) => {
      if (this.page === false || (data['alarmLevel'] !== this.urlLevel)) {
        this.pageInfo['searchData']['alarmLevel'] = data['alarmLevel'];
        this.urlLevel = data['alarmLevel'];
        this.activeAlarmService.listActiveAlarms(this.pageInfo).subscribe((data) => {
          this.tableList = data.result.data;
          this.tableInitList = data.result.data;
          this.pageInfo.totalRows = data.result.totalRows;
          this.pageInfo.currentPage = data.result.currentPage;
          this.pageInfo.pageSize = data.result.pageSize;
          this.pageInfo.totalPages = data.result.totalPages;
          this.pageInfo.message = data.result.message;
          this.pageInfo.sort = data.result.sort;
        });
      }

    })
    this.activeAlarmService.listActiveAlarms(this.pageInfo).subscribe((data) => {
      console.log(this.pageInfo)
      console.log("分页查询的结果是：", data);
      this.tableList = data.result.data;
      this.tableInitList = data.result.data;
      this.pageInfo.totalRows = data.result.totalRows;
      this.pageInfo.currentPage = data.result.currentPage;
      this.pageInfo.pageSize = data.result.pageSize;
      this.pageInfo.totalPages = data.result.totalPages;
      this.pageInfo.message = data.result.message;
      this.pageInfo.sort = data.result.sort;
      console.log(this.tableList);
      this.page = true;
    });
  }

  //查询
  searchTablelist() {
    this.pageInfo = {
      totalRows: 0,
      totalPages: 0,
      currentPage: 0,
      message: '',
      pageSize: pageSize,
      data: [],
      sort: {},
      searchData: this.activeAlarm
    };
    this.ngOnInit();
  }

  //全选/反选
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

  //若有一条记录反选则全选按钮也反选
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

  //行事件
  rowEvent(position, event) {
    console.log(position)
    const checkboxes = this.tableBody.nativeElement.querySelector('input[type="checkbox"]');
    checkboxes.forEach((item) => {
      console.log(item.value)
      if (item.value == position) {
        console.log("判断成功")
        item.checked ? item.checked = false : item.checked = true;
        this.onCheckboxItemChanged(event)
        return;
      }
    });
    console.log("行事件触发");
  }


  //确认告警信息
  ackFlagIndo(alarmId, event): void {
    //阻止冒泡事件
    event.stopPropagation();
    let data;
    this.activeAlarmService.showBatchBox("是否确认告警?").subscribe((data) => {
      console.log(data);
      if (data == true) {
        this.activeAlarmService.confirmAlarm(alarmId).subscribe((result) => {
          console.log(result);
          if (result.status.code === 0) {
            this.commonServ.showBox("确认告警成功！");
          } else {
            this.commonServ.showBox("确认告警失败！");
          }
          this.ngOnInit();
        })
      }
    });
  }



  //清除告警信息
  clearFlagIndo(alarmId, event): void {
    //阻止冒泡事件
    event.stopPropagation();
    let data;
    this.activeAlarmService.showBatchBox("是否清除告警?").subscribe((data) => {
      console.log(data);
      if (data == true) {
        this.activeAlarmService.cleanAlarm(alarmId).subscribe((result) => {
          console.log(result);
          if (result.status.code === 0) {
            this.commonServ.showBox("清除告警成功！");
          } else {
            this.commonServ.showBox("清除告警失败！");
          }
          this.ngOnInit();
        })
      }
    });
  }


  //详细信息的模态框显示
  detailsIndo(alarmId, event): void {
    //阻止冒泡事件
    event.stopPropagation();
    let data;
    //通过告警编号获取告警信息
    this.activeAlarmService.queryAlarmDetail(alarmId).subscribe((result) => {
      data = result.result;
      data['title'] = '详细信息';
      console.log(data);
      this.activeAlarmService.show(data).subscribe((rel) => {
        delete data.title;
        console.log(rel);
        if (rel == true) {
          this.activeAlarmService.update(data).subscribe((result) => {
            if (result = true) {
              this.commonServ.showBox("修改成功！");
              this.ngOnInit();
              console.log("修改后的结果是：", result);
            } else {
              this.commonServ.showBox("修改失败！");
            }
          });
        }
      });
    })
  }


  //工单详细信息的模态框显示
  workDetailInfo(orderNo, event): void {
    //阻止冒泡事件
    event.stopPropagation();
    let data;
    //通过告警编号获取告警信息
    this.activeAlarmService.queryWorkOrderDetail(orderNo).subscribe((result) => {
      data = result.result;
      data['title'] = '工单详情';
      console.log(data);
      this.activeAlarmService.showWorkOrderModel(data).subscribe((rel) => {
        delete data.title;
        console.log(rel);
      });
    })

  }




  //批量确认告警
  allAckFlagIndo(): void {
    let chooses = [];
    const checkboxes = this.tableBody.nativeElement.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach((item) => {
      if (item.checked) {
        chooses.push(item.defaultValue);
      }
    });

    let alarmIds = [];
    chooses.forEach((item) => {
      let ackFlags = item.split(",");
      if (ackFlags[1] === "1") {
        alarmIds.push(ackFlags[0]);
      }

    });
    if (alarmIds.length > 0) {
      this.commonServ.showBox("告警编号 " + alarmIds + " 的确认状态是已确认状态");
      return;
    }

    if (chooses.length === 0) {
      this.commonServ.showBox("没有选择要确认告警的数据");
      return;
    }
    this.activeAlarmService.showBatchBox("确定要批量确认告警吗?").subscribe((data) => {
      if (data == true) {
        let alarmIdList = [];
        chooses.forEach((item) => {
          let alarmAckFlags = item.split(",");
          alarmIdList.push(alarmAckFlags[0]);
        });
        this.activeAlarmService.confirmAlarmBatch(alarmIdList).subscribe((result) => {
          if (result = true) {
            this.commonServ.showBox("批量确认告警成功！");
            this.ngOnInit();
          } else {
            this.commonServ.showBox("批量确认告警失败！");
          }
        });
      }
    });
  }




  //批量清除告警
  allClearFlagIndo(): void {
    let chooses = [];
    const checkboxes = this.tableBody.nativeElement.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach((item) => {
      if (item.checked) {
        chooses.push(item.defaultValue);
      }
    });

    let alarmIds = [];
    chooses.forEach((item) => {
      let clearFlags = item.split(",");
      if (clearFlags[2] === "1") {
        alarmIds.push(clearFlags[0]);
      }
    });
    if (alarmIds.length > 0) {
      this.commonServ.showBox("告警编号 " + alarmIds + " 的清除状态是已清除状态");
      return;
    }

    if (chooses.length === 0) {
      this.commonServ.showBox("没有选择要清除告警的数据");
      return;
    }
    this.activeAlarmService.showBatchBox("确定要批量清除告警吗?").subscribe((data) => {
      if (data == true) {
        let alarmIdList = [];
        chooses.forEach((item) => {
          let alarmClearFlags = item.split(",");
          alarmIdList.push(alarmClearFlags[0]);
        });
        this.activeAlarmService.cleanAlarmBatch(alarmIdList).subscribe((result) => {
          if (result = true) {
            this.commonServ.showBox("批量清除告警成功！");
            this.ngOnInit();
          } else {
            this.commonServ.showBox("批量清除失败成功！");
          }
        });
      }
    });
  }


  //生成告警工单
  addOrderInfo(activeAlarmInfo, event) {
    let chooses = [];
    const checkboxes = this.tableBody.nativeElement.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach((item) => {
      let alarmIds = item.value.split(",");
      if (alarmIds[0] == activeAlarmInfo.alarmId) {
        item.checked = true;
        this.onCheckboxItemChanged(event);
      }
      if (item.checked) {
        chooses.push(item.defaultValue);
      }
    });
    if (chooses.length > 1) {
      //截取所有选中告警源
      let alarmSourceList = [];
      let orderNoList = [];
      let alarmIds;
      chooses.forEach((item) => {
        let alarmSource = item.split(",");
        alarmSourceList.push(alarmSource[3]);
        if (alarmSource[4] != "") {
          orderNoList.push(alarmSource[4]);
        }
        if (alarmIds == undefined) {
          alarmIds = alarmSource[0];
        } else {
          alarmIds += "," + alarmSource[0];
        }
      });

      this.activeAlarmService.showBatchBox("是否将多条告警源相同的信息生成告警工单？").subscribe((data) => {
        if (data == true) {
          let params = {
            orderType: '2',
            orderDescription: activeAlarmInfo.orderDescription,
            equipmentNo: activeAlarmInfo.alarmSource,
            alarmId: alarmIds,
            alarmNo: activeAlarmInfo.alarmId
          };

          //必须要相同的告警源才可以生成告警工单
          for (let i = 0; i < alarmSourceList.length; i++) {
            if (i != alarmSourceList.length - 1) {
              if (alarmSourceList[i] != alarmSourceList[i + 1]) {
                this.commonServ.showBox("请选择相同的告警源！");
                return;
              }
            }
          }
          //必须要是未生成的账单才可以生成告警工单
          if (orderNoList.length > 0) {
            this.commonServ.showBox("请选择未生成告警工单的告警信息！");
            return;
          }

          this.activeAlarmService.showModel(AddAlarmWorkOrdeComponent, params).subscribe(flag => {
            if (flag) {
              this.ngOnInit();
            }
          });
        } else {
          let params = {
            orderType: '2',
            orderDescription: activeAlarmInfo.orderDescription,
            equipmentNo: activeAlarmInfo.alarmSource,
            alarmId: activeAlarmInfo.alarmId,
            alarmNo: activeAlarmInfo.alarmId
          };
          this.activeAlarmService.showModel(AddAlarmWorkOrdeComponent, params).subscribe(flag => {
            if (flag) {
              this.ngOnInit();
            }
          });
        }
      });
    } else {
      let params = {
        orderType: '2',
        orderDescription: activeAlarmInfo.orderDescription,
        equipmentNo: activeAlarmInfo.alarmSource,
        alarmId: activeAlarmInfo.alarmId,
        alarmNo: activeAlarmInfo.alarmId
      };
      this.activeAlarmService.showModel(AddAlarmWorkOrdeComponent, params).subscribe(flag => {
        if (flag) {
          this.ngOnInit();
        }
      });
    }
  }


  //提示模态框
  openDefaultDialog(message): void {
    this.commonServ.showBox(message);
  }

  /**
 * 分页函数
 * pno--页数
 * psize--每页显示记录数
 **/
  goPage(pno) {
    if (this.page) {
      if (this.pageInfo.totalPages == 0) {
        this.openDefaultDialog('暂无数据');
        return;
      }

      //event.preventDefault();
      if (pno >= this.pageInfo.totalPages) {
        //this.openDefaultDialog('已经是最后一页了');
        return;
      }

      if (pno < 0) {
        //this.openDefaultDialog('已经是第一页了');
        return;
      }
    }
    this.pageInfo.currentPage = pno;
    //this.pageInfo.pageSize = pageSize;
    this.activeAlarmService.listActiveAlarms(this.pageInfo).subscribe((data) => {
      console.log("分页查询的结果是：", data);
      this.tableList = data.result.data;
      this.tableInitList = data.result.data;
      this.pageInfo.totalRows = data.result.totalRows;
      this.pageInfo.currentPage = data.result.currentPage;
      this.pageInfo.pageSize = data.result.pageSize;
      this.pageInfo.totalPages = data.result.totalPages;
      this.pageInfo.message = data.result.message;
      this.page = true;
      if (this.pageInfo.totalPages === 0) {
        this.openDefaultDialog('暂无数据');
      }
    });
  }
  //权限设置
  // getPermissions(preinfo, currentUrl) {
  //   this.commonServ.getPermissions(preinfo, currentUrl).subscribe((data) => {
  //     this.permissions = data
  //   })
  // }
  hasPermission(val): boolean {
    for (let i = 0; i < this.permissions.length; i++) {
      if (this.permissions[i] === val) {
        return true;
      }
    }
    return false;
  }


}
