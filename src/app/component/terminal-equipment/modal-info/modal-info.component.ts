import {Component, Inject} from '@angular/core';
import {MatDialogModule, MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
//表单验证
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {CommonService} from '../../../core/services/common.service'
import {ConfigDetailService} from '../../../core/services/config-detail.service'

@Component({
  selector: 'app-modal-info',
  templateUrl: './modal-info.component.html',
  styleUrls: ['./modal-info.component.scss']
})
export class ModalInfoComponent {
  IsEquipmentNo = false;

  constructor(//声明定义修改模态框组件
              public dialogRef: MatDialogRef<ModalInfoComponent>,
              public commonServ: CommonService,
              public configService: ConfigDetailService,
              //注入修改模态框显示时传递的数据，data 就是页面双向绑定的对象data
              @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  formGroup: FormGroup;

  /**
   * 表单验证函数
   **/
  ngOnInit() {
    // console.log('======================>', this.data);
    if (this.data.title == "编辑设备") {
      this.formGroup = new FormGroup({
        equipmentNo: new FormControl({value: this.data.equipmentNo, disabled: true}),
        //equipmentNo: new FormControl('', Validators.required),
        equipmentAlias: new FormControl('', Validators.required),
        equipmentType: new FormControl('', Validators.required),
        softwareVersion: new FormControl(),
        adminStatus: new FormControl(),
        operStatus: new FormControl(),
        alarmLevel: new FormControl(),
        remark: new FormControl()
      })
    } else {
      this.formGroup = new FormGroup({
        equipmentNo: new FormControl('', Validators.required),
        equipmentAlias: new FormControl('', Validators.required),
        equipmentType: new FormControl('', Validators.required),
        softwareVersion: new FormControl('', Validators.required),
        adminStatus: new FormControl(),
        operStatus: new FormControl(),
        alarmLevel: new FormControl(),
        remark: new FormControl()
      })
    }

  }

  //保存修改的设备信息
  update(data): void {
    if (this.formGroup.invalid) {
      this.commonServ.showBox("请检查数据");
      return
    }
    this.dialogRef.close(true);
  }

  //保存修改的设备信息
  save(data): void {
    if (this.formGroup.invalid) {
      this.commonServ.showBox("请检查数据");
      return
    }
    if (this.IsEquipmentNo !== true) {
      this.commonServ.showBox("设备编号已经存在!");
      return
    }
    this.dialogRef.close(true);
  }

  //判断增加的管设备编号是否重复
  findById(equipmentNo): void {
    // console.log("设备编号是===>uuu====>", equipmentNo);
    this.configService.findById(equipmentNo).subscribe((data) => {
      if (data.status.code == 10002) {
        console.log("10002")
      } else {
        console.log("!!!!!!!!!!!!!10002")
        this.IsEquipmentNo = true;
      }
    });
  }

}
