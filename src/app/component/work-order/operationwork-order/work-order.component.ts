import { Component, OnInit } from '@angular/core';
import { WorkOrderService } from '../../../core/services/work-order.service';
import { PageInfo, pageSize } from '../../../models/page-info';      //分页查询
import { CommonService } from '../../../core/services/common.service';     //删除提示框
import { FormBuilder } from '@angular/forms';
import { OperationWorkOrderComponent } from '../../../common/operation-work-order/operation-work-order.component';
import { MaintWorkOrderComponent } from './maint-work-order/maint-work-order.component';
import { Router } from '@angular/router';
import { AlarmInfoComponent } from './alarm-info/alarm-info.component';

@Component({
  selector: 'app-work-order',
  templateUrl: './work-order.component.html',
  styleUrls: ['./work-order.component.scss']
})
export class WorkOrderComponent implements OnInit {

  workOrderForm: any;  //查询表单
  tableList = [];
  tableInitList = [];
  menuTitle = null;
  //根据toke获取的权限信息
  perInfo = {};
  //权限变量
  permissions = [];
  page: Boolean = false;
  // 总条数:totalRows 总页数:totalPages  当前页:currentPage 提示信息:message 每月显示的条数pageSize 排序字段 sort
  pageInfo: PageInfo = {
    totalRows: 0,
    totalPages: 0,
    currentPage: 0,
    message: '',
    pageSize: pageSize,
    data: [],
    sort: {},
    searchData: {}
  };

  alarmInfoData: PageInfo = {
    totalRows: 0,
    totalPages: 0,
    currentPage: 0,
    message: '',
    pageSize: pageSize,
    data: [],
    sort: {},
    searchData: {
      alarmSource: '',
      alarmIds: ''
    }
  };
  searchDataInfo: any;

  constructor(public comService: CommonService,
    public formBuilder: FormBuilder,
    public workOrderService: WorkOrderService,
    private router: Router, ) {

  }
  ngOnInit() {
    this.initForm();  //初始化表单
    this.searchTableList(this.workOrderForm.value);
    this.comService.getNavList().subscribe((data) => {
      this.perInfo = data.result.sysMenus;
      this.permissions = data.result.userSysPermCodes;
      for (let k in this.perInfo) {
        let list = this.perInfo[k]['childData'];
        for (let i = 0; i < list.length; i++) {
          if (list[i]['href'] === this.router.url) {
            this.menuTitle = list[i]['title'];
          }
        }
      }
    });
  }

  initForm() {
    //初始化查询表单
    this.workOrderForm = this.formBuilder.group({
      orderStatus: ['', [/*Validators.required*/]],
      createUser: ['', [/*Validators.required*/]],
      startTime: ['', [/*Validators.required*/]],
      endTime: ['', [/*Validators.required*/]],
    });
  }

  //表单提交查询
  searchTableList(formData) {
    this.searchDataInfo = {
      orderType: '2',
      createUser: formData.createUser,
      orderStatus: formData.orderStatus || '-1',
      startTime: Date.parse(formData.startTime),
      endTime: Date.parse(formData.endTime)
    };
    console.log(this.searchDataInfo);

    this.pageInfo.searchData = this.searchDataInfo;
    this.workOrderService.listWorkOrderInfos(this.pageInfo).subscribe((res) => {
      console.log('分页查询的结果是：', res);
      this.tableList = res.result.data;
      this.tableInitList = res.result.data;
      this.pageInfo.totalRows = res.result.totalRows;
      this.pageInfo.currentPage = res.result.currentPage;
      this.pageInfo.pageSize = res.result.pageSize;
      this.pageInfo.totalPages = res.result.totalPages;
      this.pageInfo.message = res.result.message;
      console.log(this.tableList);
      this.page = true;
    });
  }

  //添加维护工单
  maintOrderInfo() {
    let params = {
      orderType: '2',     //1==>新增工单，2==>维护工单
      orderDescription: '',
      equipmentNo: '',
    };
    this.workOrderService.showModel(MaintWorkOrderComponent, params)
      .subscribe(flag => {
        flag ? this.searchTableList(this.workOrderForm.value) : null;
      });
  }

  alarmInfo(eqNo, alarmId) {
    console.log(`查看${eqNo}告警列表`);
    this.alarmInfoData = {
      totalRows: 0,
      totalPages: 0,
      currentPage: 0,
      message: '',
      pageSize: pageSize,
      data: [],
      sort: {},
      searchData: {
        alarmSource: '',
        alarmIds: ''
      }
    };
    this.alarmInfoData.searchData['alarmSource'] = eqNo;
    this.alarmInfoData.searchData['alarmIds'] = alarmId;
    this.workOrderService.activeAlarmsList(this.alarmInfoData).subscribe((data) => {
      console.log(this.alarmInfoData);
      console.log('告警查询的结果是：', data.result);
      this.alarmInfoData = data.result;
      if (this.alarmInfoData.totalPages === 0) {
        this.openDefaultDialog('暂无数据');
        return;
      }
      let alarmData = {
        alarmSource: '',
        alarmIds: ''
      };
      alarmData.alarmSource = eqNo;
      alarmData.alarmIds = alarmId;
      this.alarmInfoData.searchData = alarmData;
      this.workOrderService.showModel(AlarmInfoComponent, this.alarmInfoData);
    });

  }

  //提示模态框
  openDefaultDialog(message): void {
    this.comService.showBox(message);
  }

  //删除、归档操作工单,编辑工单
  updateInfo(item, operation) {
    item.operation = operation;
    console.log(item);
    this.goOperationWorkOrderComponent(item);
  }

  //跳转到操作工单组件
  goOperationWorkOrderComponent(item) {
    this.workOrderService.showModel(OperationWorkOrderComponent, item)
      .subscribe(res => {
        console.log(`编辑：${res}`);
        res ? this.searchTableList(this.workOrderForm.value) : null;
      });
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
      if (pno >= this.pageInfo.totalPages) {
        // this.openDefaultDialog('已经是最后一页了');
        return;
      }

      if (pno < 0) {
        // this.openDefaultDialog('已经是第一页了');
        return;
      }
    }
    this.pageInfo.currentPage = pno;
    //this.pageInfo.pageSize = pageSize;
    this.workOrderService.listWorkOrderInfos(this.pageInfo).subscribe((data) => {
      console.log('分页查询的结果是：', data);
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

  hasPermission(val): boolean {
    for (let i = 0; i < this.permissions.length; i++) {
      if (this.permissions[i] === val) {
        return true;
      }
    }
    return false;
  }
}
