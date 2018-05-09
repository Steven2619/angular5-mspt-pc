import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material";
import {CommonService} from "../../../core/services/common.service";
import {MapManageService} from "../../../core/services/map-manage.service";

@Component({
  selector: 'app-modify-info',
  templateUrl: './modify-info.component.html',
  styleUrls: ['./modify-info.component.scss']
})
export class ModifyInfoComponent implements OnInit {

  modifyData: any;

  constructor(public dialogRef: MatDialogRef<ModifyInfoComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              public mapService: MapManageService,
              public comService: CommonService,) {
    console.log(this.data);
    this.modifyData = data;

  }


  ngOnInit() {

  }

  //确认修改管井设备信息
  editWellInfo(data) {
    let wellInfo = {
      equipmentNo: data.equipmentNo,
      equipmentAlias: data.equipmentAlias,
      equipmentType: data.equipmentType,
      adminStatus: data.adminStatus,
      wellId: data.wellId,
      wellNo: data.wellNo,
      wellAlias: data.wellAlias,
      wellType: data.wellType,
      address: data.address,
      remark: data.remark,
    };
    console.log(wellInfo);
    this.mapService.editWellInfos(wellInfo).subscribe(res => {
      if (res.status.code == 0) {
        this.comService.showBox('信息修改成功');
        this.dialogRef.close(true);
      } else {
        this.comService.showBox('信息修改失败');
      }
    })
  }

}
