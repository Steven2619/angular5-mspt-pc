import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {WorkOrderService} from '../../../../core/services/work-order.service';
import {CommonService} from '../../../../core/services/common.service';

@Component({
  selector: 'app-maint-work-order',
  templateUrl: './maint-work-order.component.html',
  styleUrls: ['./maint-work-order.component.scss']
})
export class MaintWorkOrderComponent implements OnInit {

  //添加的工单类型  type：1 新装，type：2  维护
  orderData: any = {};
  equipmentData: any;
  alarmIdData:any;
  constructor(public dialogRef: MatDialogRef<MaintWorkOrderComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              public  comService: CommonService,
              public workService: WorkOrderService) {

    this.orderData = data;
    this.orderData.orderDescription ? this.orderData.orderDescription += '\n' : this.orderData.orderDescription;

    console.log(this.orderData);

    if (this.orderData.orderType == '2') {
      this.getEquipmentInfo();
    }
  }

  ngOnInit() {
  }

  //得到所有设备信息
  getEquipmentInfo() {
    this.workService.getEquipmentInfo().subscribe(res => {
      // console.log(res);
      this.equipmentData = res.result;
    });
  }

  //监听告警源的改变获取关联id的列表
  onEquipmentNoChange(equipmentNo){
    console.log(equipmentNo);
    this.workService.getAlarmIdList(equipmentNo).subscribe(res=>{
      this.alarmIdData = res.result;
    })
  }

  //确定按钮
  okSubmit(data) {
    // console.log(data);
    if(data.alarmIdArr){
      data.alarmId = data.alarmIdArr.join(',');
      delete data.alarmIdArr;
    }
    this.workService.addWorkOrder(data).subscribe(res => {
      if (res.status.code == 0) {
        this.comService.showBox('工单添加成功');
        this.dialogRef.close(true);
      } else {
        this.comService.showBox('工单添加失败');
      }

    }, err => {
      console.log(`添加工单失败！${err}`);
    });
  }


}
