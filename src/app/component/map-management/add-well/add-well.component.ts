import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material";
import {MapManageService} from "../../../core/services/map-manage.service";
import {CommonService} from "../../../core/services/common.service";

@Component({
  selector: 'app-add-well',
  templateUrl: './add-well.component.html',
  styleUrls: ['./add-well.component.scss']
})
export class AddWellComponent implements OnInit {

  wellInfo: any = {
    wellNo: null,
    wellAlias: null,
    wellType: null,
    longitude: null,
    latitude: null,
    province: null,
    city: null,
    town: null,
    country: null,
    address: null,
    remark: null,
  };
  IsWellNo: boolean = false;

  constructor(public dialogRef: MatDialogRef<AddWellComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              public mapService: MapManageService,
              public comService: CommonService,) {

    this.mapService.geocoder(data).subscribe(res => {
      this.wellInfo = {
        longitude: data.getLng(),
        latitude: data.getLat(),
        province: res.province,
        city: res.city,
        town: res.district,
        country: res.township,
        address: res.street + res.streetNumber
      };
    })
  }

  ngOnInit() {
  }

  // 添加管井操作
  addWellInfo(wellInfo) {
    console.log(wellInfo);
    if (!this.valueIsEmpty(wellInfo)) return;
    if(!this.IsWellNo){
      this.comService.showBox('管井编号已存在');
      return;
    }
    this.mapService.addWellInfo(wellInfo).subscribe(res => {
      if (res.status.code == 0) {
        this.comService.showBox('添加管井成功');
        this.dialogRef.close(true);
      } else {
        this.comService.showBox('添加管井失败');
      }
    })
  }
  // 验证值是否为空
  valueIsEmpty(data) {
    if (!data.wellNo || data.wellNo.trim() == "") {
      this.comService.showBox('管井编号不能为空');
      return false;
    }
    if (!data.wellAlias || data.wellAlias.trim() == "") {
      this.comService.showBox('管井名称不能为空');
      return false;
    }
    if (data.wellType == undefined) {
      this.comService.showBox('管井类型不能为空');
      return false;
    }
    return true;
  }

  //验证管井编号是否已经存在
  searchByWellNo(wellNo) {
    let wellNoVal = wellNo.trim();
    this.mapService.queryByWellNo(wellNoVal).subscribe(res => {
      if (res.status.code != 10001) {
        this.IsWellNo = true;
      }
    })
  }
}
