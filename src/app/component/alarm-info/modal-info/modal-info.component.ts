import { Component, OnInit,Inject } from '@angular/core';
import { MatDialogModule, MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import {FormControl, Validators} from '@angular/forms';
import { CommonService } from '../../../core/services/common.service'

@Component({
  selector: 'app-modal-info',
  templateUrl: './modal-info.component.html',
  styleUrls: ['./modal-info.component.scss']
})
export class ModalInfoComponent implements OnInit {

  constructor(
      //声明定义修改模态框组件
      public dialogRef: MatDialogRef<ModalInfoComponent>,
      //注入修改模态框显示时传递的数据，data 就是页面双向绑定的对象data
      @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
  }


  //保存修改的设备信息
  update(data): void {
    this.dialogRef.close(true);
  }
}
