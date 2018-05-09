import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogModule, MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CommonService } from '../../../core/services/common.service'
import { EquipmentMessageService } from '../../../core/services/equipment-message.service'


@Component({
  selector: 'app-equipment-detail-info',
  templateUrl: './equipment-detail-info.component.html',
  styleUrls: ['./equipment-detail-info.component.scss']
})
export class EquipmentDetailInfoComponent implements OnInit {

  constructor(
    //声明定义修改模态框组件
    public dialogRef: MatDialogRef<EquipmentDetailInfoComponent>,
    public commonServ: CommonService,
    public equipmentMessageServ: EquipmentMessageService,
    //注入修改模态框显示时传递的数据，data 就是页面双向绑定的对象data
    @Inject(MAT_DIALOG_DATA) public data: any

  ) { }

  ngOnInit() {

  }

}
