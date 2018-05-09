import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {WorkOrderService} from '../../../../core/services/work-order.service';
import {CommonService} from '../../../../core/services/common.service';


@Component({
  selector: 'app-add-work-order',
  templateUrl: './add-work-order.component.html',
  styleUrls: ['./add-work-order.component.scss']
})
export class AddWorkOrderComponent implements OnInit {

  //添加的工单类型  type：1 新装，type：2  维护
  orderData: any = {};
  wellData: any;
  wellSearch: string;
  wellNoInstall: any;
  count: number;

  constructor(public dialogRef: MatDialogRef<AddWorkOrderComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              public  comService: CommonService,
              public workService: WorkOrderService) {

    this.orderData = data;
    this.orderData.orderDescription ? this.orderData.orderDescription += '\n' : this.orderData.orderDescription;

    console.log(this.orderData);

    if (this.orderData.orderType == '1') {
      this.getNotInstalledWellInfo();
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
    this.count=0;
    let wellNo = this.wellSearch;
    wellNo = wellNo ? wellNo.trim() : '0';
    this.getNotInstalledWellInfo(wellNo);
  }

  //确定按钮
  okSubmit(data) {
    // console.log(data);
    if (!this.valueIsEmpty(data)) {
      return;
    }
    if(this.wellNoInstall){
        data.wellNoList = this.wellNoInstall.join(',');
    }
    this.workService.addWorkOrder(data).subscribe(res => {
      console.log(`添加工单成功`);
      console.log(res.status);
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

  valueIsEmpty(data) {
    if (data.orderType == '1') {
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

}
