import {Component, Inject, OnInit} from '@angular/core';
import {MapManageService} from "../../../core/services/map-manage.service";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material";
import {CommonService} from "../../../core/services/common.service";
import {WorkOrderService} from "../../../core/services/work-order.service";

@Component({
  selector: 'app-create-work-order',
  templateUrl: './create-work-order.component.html',
  styleUrls: ['./create-work-order.component.scss']
})
export class CreateWorkOrderComponent implements OnInit {

  //添加的工单类型  type：1 新装，type：2  维护
  orderData: any = {};
  wellData: any;
  wellSearch: string;
  wellNoInstall: any;
  count: number;

  constructor(public dialogRef: MatDialogRef<CreateWorkOrderComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              public mapService: MapManageService,
              public workService: WorkOrderService,
              public comService: CommonService) {

    if (this.data.orderType == '1') {
      this.mapService.geocoder(data.position).subscribe(res => {
        this.orderData = {
          orderType: data.orderType,
          installAddress: res.province + res.city + res.district + res.township + res.street + res.streetNumber
        };
      });
      this.getNotInstalledWellInfo();
    }
    if (this.data.orderType == '2') {
      this.orderData = {
        orderType: data.orderType,
        equipmentNo: data.equipmentNo,
      };
      this.onEquipmentAlarmId(data.equipmentNo)
    }
  }

  ngOnInit() {
  }

  //得到未安装的管井信息
  getNotInstalledWellInfo(params: string = '0') {
    this.workService.searchWellNo(params)
      .subscribe(res => {
        console.log(res.result);
        this.wellData = res.result;
      });
  }


  onInput() {
    console.log(this.wellSearch);
    this.count = 0;
    let wellNo = this.wellSearch;
    wellNo = wellNo ? wellNo.trim() : '0';
    this.getNotInstalledWellInfo(wellNo);
  }

  //新装工单确定按钮
  AddOkSubmit(data) {
    // console.log(data);
    if (!this.valueIsEmpty(data)) {
      return;
    }
    if (this.wellNoInstall) {
      data.wellNoList = this.wellNoInstall.join(',');
    }
    this.addWorkOrderFun(data);
  }

  // 判断是否值为空
  valueIsEmpty(data) {
    if (this.data.orderType == '1') {
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


  setSelectedAll = function () {
    let data = this.wellData;
    this.wellNoInstall = [];
    this.count = 0;
    for (let i in data) {
      if (data[i].checked) {
        this.count++;
        this.wellNoInstall.push(data[i].wellNo);
      }
    }
    console.log(data);
    console.log(this.wellNoInstall);
  };

  // 选中，反选
  onToggle(item) {
    item.checked = !item.checked;
    this.setSelectedAll();
  }

  // 在已选项列表中取消选中
  cancleSelected(item) {
    item.checked = false;
    this.setSelectedAll();
  }


  //监听告警设备的告警关联id的列表
  onEquipmentAlarmId(equipmentNo) {
    console.log(equipmentNo);
    this.workService.getAlarmIdList(equipmentNo).subscribe(res => {
      if (res.status.code == 0) {
        let alarmIdArr = res.result;
        this.orderData.alarmId = '';
        for (let i = 0, len = alarmIdArr.length; i < len; i++) {
          this.orderData.alarmId += alarmIdArr[i].alarmId + ",";
        }
      }
    })
  }

  //维护工单确定按钮
  maintOkSubmit(data) {
    this.addWorkOrderFun(data);
  }

  //生成工单的方法
  addWorkOrderFun(data: any) {
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
