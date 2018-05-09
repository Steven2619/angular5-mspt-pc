import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogModule, MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ActiveAlarmService } from '../../../core/services/active-alarm.service';
import {CommonService} from '../../../core/services/common.service';

@Component({
  selector: 'app-add-alarm-work-orde',
  templateUrl: './add-alarm-work-orde.component.html',
  styleUrls: ['./add-alarm-work-orde.component.scss']
})
export class AddAlarmWorkOrdeComponent implements OnInit {

  constructor(
        //声明定义修改模态框组件
        public dialogRef: MatDialogRef<AddAlarmWorkOrdeComponent>,
        //注入修改模态框显示时传递的数据，data 就是页面双向绑定的对象data
        @Inject(MAT_DIALOG_DATA) public data: any,
        public comService: CommonService,
        public activeAlarmService: ActiveAlarmService) {

     }

  ngOnInit() {
  }


  //确定按钮
  okSubmit(data) {
    this.activeAlarmService.addWorkOrder(data).subscribe(res => {
      console.log(res.status);
      if (res.status.code == 0) {
        this.comService.showBox('告警工单添加成功');
        this.dialogRef.close(true);
      } else {
        this.comService.showBox('告警工单添加失败');
      }

    }, err => {
      console.log(`添加工单失败！${err}`);
    });
  }


}
