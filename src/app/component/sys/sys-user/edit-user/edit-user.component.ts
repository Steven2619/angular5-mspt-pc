import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {SysManageService} from '../../../../core/services/sys-manage.service';
import {CommonService} from '../../../../core/services/common.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.scss']
})
export class EditUserComponent implements OnInit {
  formGroup: FormGroup;
  constructor(
    public dialogRef: MatDialogRef<EditUserComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public sysManageService: SysManageService,
    public commonServ: CommonService
  ) { }

  ngOnInit() {
    this.formGroup = new FormGroup({
      username: new FormControl(this.data.info.username, Validators.required),
      email: new FormControl(this.data.info.email, [Validators.required, Validators.email]),
      status: new FormControl(this.data.info.status),
    });
  }

  modifyUserInfo(info) {
    if (!this.validate()){
      return;
    }

    this.formGroup.value['id'] = info.id;
    console.log(this.formGroup.value);
    console.log(info);
    this.sysManageService.modifyUserInfo(this.formGroup.value).subscribe( (response) => {
      console.log(response);
      if (response.status.code === 0) {
        this.commonServ.showBox('修改成功');
        this.dialogRef.close(true);
      }
    });
  }

  validate(){
    let isValidated = true;
    if (this.formGroup.value.username == ''){
      this.commonServ.showBox('用户名不应为空');
      return false;
    }
    return isValidated;
  }

}
