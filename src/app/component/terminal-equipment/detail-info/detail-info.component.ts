import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogModule, MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CommonService } from '../../../core/services/common.service'
import { EquipmentMessageService } from '../../../core/services/equipment-message.service'
@Component({
  selector: 'app-detail-info',
  templateUrl: './detail-info.component.html',
  styleUrls: ['./detail-info.component.scss']
})
export class DetailInfoComponent implements OnInit {
  public title = null;
  public page: Boolean = false;
  tableTitle=[]
  constructor(
    public dialogRef: MatDialogRef<DetailInfoComponent>,
    public commonServ: CommonService,
    public equipmentMessageServ: EquipmentMessageService,
    //注入修改模态框显示时传递的数据，data 就是页面双向绑定的对象data
    @Inject(MAT_DIALOG_DATA) public data: any

  ) { }

  ngOnInit() {
    this.page = true;
    this.title = this.data['title'];
    console.log("模态框接受的数据", this.data);
    console.log("详细数据",this.data.data)
    this.tableTitle=this.data.data[0]['tableMoel'];
  }
  /**
 * 分页函数
 * pno--页数
 * psize--每页显示记录数
 **/
  goPage(pno) {
    if (this.page) {
      if (this.data.totalPages == 0) {
        this.openDefaultDialog('暂无数据');
        return;
      }

      //event.preventDefault();
      if (pno >= this.data.totalPages) {
        // this.openDefaultDialog('已经是最后一页了');
        return;
      }

      if (pno < 0) {
        // this.openDefaultDialog('已经是第一页了');
        return;
      }
    }
    this.data.currentPage = pno;
    this.data.pageSize = 10;
    delete this.data.title;
    console.log("分页参数：", this.data);
    this.data.data = [];
    this.equipmentMessageServ.getMessageByEquipmentNo(this.data).subscribe((data) => {
      console.log("分页查询的结果是：", data);
      this.data.data = data.result.data;
      this.data.totalRows = data.result.totalRows;
      this.data.currentPage = data.result.currentPage;
      this.data.pageSize = data.result.pageSize;
      this.data.totalPages = data.result.totalPages;
      this.data.message = data.result.message;
      this.page = true;
      if (this.data.totalPages === 0) {
        this.openDefaultDialog('暂无数据');
      }
    });
  }
  //提示模态框
  openDefaultDialog(message): void {
    this.commonServ.showBox(message);
  }
}
