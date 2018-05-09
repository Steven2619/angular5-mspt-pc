import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {CommonService} from '../../../../core/services/common.service';
import {WorkOrderService} from '../../../../core/services/work-order.service';

@Component({
  selector: 'app-alarm-info',
  templateUrl: './alarm-info.component.html',
  styleUrls: ['./alarm-info.component.scss']
})
export class AlarmInfoComponent implements OnInit {

  //权限变量
  permissions = {};
  page: Boolean = false;
  // 总条数:totalRows 总页数:totalPages  当前页:currentPage 提示信息:message 每月显示的条数pageSize 排序字段 sort


  constructor(public dialogRef: MatDialogRef<AlarmInfoComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              public  comService: CommonService,
              public workService: WorkOrderService) {
    console.log(this.data);
  }

  ngOnInit() {
    this.page = true;
  }


  //查询
  searchTablelist() {
    this.data.data = [];
    this.workService.activeAlarmsList(this.data).subscribe((data) => {
      console.log(this.data);
      console.log('分页查询的结果是：', data);
      this.data.data = data.result.data;
      this.data.totalRows = data.result.totalRows;
      this.data.currentPage = data.result.currentPage;
      this.data.pageSize = data.result.pageSize;
      this.data.totalPages = data.result.totalPages;
      this.data.message = data.result.message;
      this.data.sort = data.result.sort;
      console.log(this.data.data);
      this.page = true;
      if (this.data.totalPages === 0) {
        this.openDefaultDialog('暂无数据');
      }
    });
  }



  //提示模态框
  openDefaultDialog(message): void {
    this.comService.showBox(message);
  }

  /**
   * 分页函数
   * pno--页数
   * psize--每页显示记录数
   **/
  goPage(pno) {
    if (this.page) {
      if (this.data.totalPages == 0) {
        this.openDefaultDialog('暂无数据');
        return;
      }
      if (pno >= this.data.totalPages) {
        // this.openDefaultDialog('已经是最后一页了');
        return;
      }
      if (pno < 0) {
        // this.openDefaultDialog('已经是第一页了');
        return;
      }
    }
    this.data.currentPage = pno;
    this.searchTablelist();
  }

  //权限设置
  getPermissions(preinfo, currentUrl) {
    this.comService.getPermissions(preinfo, currentUrl).subscribe((data) => {
      this.permissions = data;
    });
  }

}
