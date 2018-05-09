import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogModule, MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-show-model',
  templateUrl: './show-model.component.html',
  styleUrls: ['./show-model.component.scss']
})
export class ShowModelComponent implements OnInit {

    constructor(
          //声明定义修改模态框组件
          public dialogRef: MatDialogRef<ShowModelComponent>,
          //注入修改模态框显示时传递的数据，data 就是页面双向绑定的对象data
          @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
  }

}
