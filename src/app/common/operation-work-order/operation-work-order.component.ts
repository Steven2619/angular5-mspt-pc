import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {WorkOrderService} from '../../core/services/work-order.service';
import {CommonService} from '../../core/services/common.service';

@Component({
  selector: 'app-operation-work-order',
  templateUrl: './operation-work-order.component.html',
  styleUrls: ['./operation-work-order.component.scss']
})
export class OperationWorkOrderComponent implements OnInit {

  operatData: any = {
    alarmId: '',
    alarmIdArr: [],
    alarmName: '',
    alarmNo: '',
    createTime: '',
    createUser: '',
    endTime: '',
    equipmentName: '',
    equipmentNo: '',
    expireTime: '',
    installAddress: '',
    newEquipmentCount: '',
    operation: '',
    orderDescription: '',
    orderNo: '',
    orderStatus: '',
    orderType: '',
    startTime: '',
    wellNoList: ''
  };
  alarmIdData: any;
  constructor(public dialogRef: MatDialogRef<OperationWorkOrderComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              public comService: CommonService,
              public workService: WorkOrderService) {
    if (this.data.operation && this.data.operation == '2') {
      this.getAlarmIDList();
    }else {
      this.operatData = this.data;
    }
    // console.log(this.operatData);
    // this.operatData.orderDescription ? this.operatData.orderDescription += '\n' : this.operatData.orderDescription;
    console.log(data);
  }

  ngOnInit() {

  }

  getAlarmIDList() {
    // console.log(this.data.equipmentNo);
    let equipmentNo = this.data.equipmentNo;
    this.workService.getAlarmIdList(equipmentNo).subscribe(res => {
      this.alarmIdData = res.result;
      this.operatData = this.data;
      let alarmArr = this.data.alarmId.split(',');
      for(let i=0;i<alarmArr.length;i++){
        alarmArr[i]= Number(alarmArr[i]);
      }
      console.log(alarmArr);
      this.operatData.alarmIdArr = alarmArr;
    });
  }

  OperationOk(operatData) {
    this.workService.updateWorkOrder(operatData)
      .subscribe(res => {
        if (res.status.code == 0) {
          this.comService.showBox('工单操作成功');
          this.dialogRef.close(true);
        } else {
          this.comService.showBox('工单操作失败');
        }
      });
  }

  editWorkOrder(workOrderData) {
    console.log(workOrderData);
    if (!this.valueIsEmpty(workOrderData)) {
      return;
    }
    if (workOrderData.alarmIdArr) {
      workOrderData.alarmId = workOrderData.alarmIdArr.join(',');
      delete workOrderData.alarmIdArr;
    }
    console.log(workOrderData);
    this.workService.editWorkOrder(workOrderData).subscribe(res=>{
      if (res.status.code == 0) {
        this.comService.showBox('工单编辑成功');
        this.dialogRef.close(true);
      } else {
        this.comService.showBox('工单编辑失败');
      }
    });
  }

  valueIsEmpty(data) {
    if (data.operation == '1') {
      if (!data.newEquipmentCount) {
        this.comService.showBox('新装设备数量不能为空');
        return false;
      }
      if (!data.installAddress) {
        this.comService.showBox('新装工单安装地址不能为空');
        return false;
      }
    }
    return true;
  }
}
