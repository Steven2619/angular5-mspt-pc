import { Component, Inject } from '@angular/core';
import { MatDialogModule, MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CommonService } from '../../../core/services/common.service'


@Component({
  selector: 'app-modal-info',
  templateUrl: './modal-info.component.html',
  styleUrls: ['./modal-info.component.scss']
})
export class ModalInfoComponent {

  constructor(
    public dialogRef: MatDialogRef<ModalInfoComponent>,
    private commonServ: CommonService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }
  formGroup: FormGroup;

  /**
 * 表单验证函数
 **/
  ngOnInit() {
    this.formGroup = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      position: new FormControl(),
      name: new FormControl('', Validators.required),
      weight: new FormControl('', Validators.required),
      symbol: new FormControl(),
      status:new FormControl(),
      time:new FormControl(),
      date:new FormControl()
    })
  }
  // email = new FormControl('', [Validators.required, Validators.email]);


  // getErrorMessage(info) {
  //
  //   return this.formGroup.hasError('required') ? 'You must enter a value' :
  //      this.formGroup.hasError('email') ? 'Not a valid email' :
  //       '';
  // }

  onSubmit() {

    if (this.formGroup.invalid) {
        this.commonServ.showBox("请检查数据");
      return
    }
    console.log("点击了提交按钮");
    this.dialogRef.close(true);
  }
}
