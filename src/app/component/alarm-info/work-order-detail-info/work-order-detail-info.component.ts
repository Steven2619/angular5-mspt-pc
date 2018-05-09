import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogModule, MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import {FormControl, Validators} from '@angular/forms';
import { CommonService } from '../../../core/services/common.service'

@Component({
  selector: 'app-work-order-detail-info',
  templateUrl: './work-order-detail-info.component.html',
  styleUrls: ['./work-order-detail-info.component.scss']
})
export class WorkOrderDetailInfoComponent implements OnInit {

  constructor(//声明定义修改模态框组件
  public dialogRef: MatDialogRef<WorkOrderDetailInfoComponent>,
  //注入修改模态框显示时传递的数据，data 就是页面双向绑定的对象data
  @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
  }

}
