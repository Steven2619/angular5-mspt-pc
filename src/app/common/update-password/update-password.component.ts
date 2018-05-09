import { Component, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { SysManageService } from '../../core/services/sys-manage.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CommonService } from '../../core/services/common.service';
import { validateRex } from '../../models/validate-register';
@Component({
  selector: 'app-update-password',
  templateUrl: './update-password.component.html',
  styleUrls: ['./update-password.component.scss']
})
export class UpdatePasswordComponent implements OnInit {
  formGroup: FormGroup;
  // 表单验证不通过时显示的错误消息
  formErrors = {
    oldPassword: '',
    newPassword: '',
    password2: '',
  };
  // 为每一项表单验证添加说明文字
  validationMessage = {
    'oldPassword': {
      'required': '请填写原密码',
     /* 'notdown': '原密码不能以下划线开头',
      'only': '原密码必须包含数字和字母、长度要在8-16位之间'*/
    },
    'newPassword': {
      'required': '请填写新密码',
      'notdown': '新密码不能以下划线开头',
      'only': '新密码必须包含数字和字母、长度要在8-16位之间'
    },
    'password2': {
      'required': '请填写确认密码',
      'notdown': '确认密码不能以下划线开头',
      'only': '确认密码必须包含数字和字母、长度要在8-16位之间'
    },
  };
  info = null;
  constructor(
    public dialogRef: MatDialogRef<UpdatePasswordComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private sysManageService: SysManageService,
    private commonServ: CommonService,
    private router: Router,
  ) {
    this.sysManageService.getCurrentUserInfo().subscribe(response => {
      this.info = response.result;
    })
  }

  ngOnInit() {
      this.formGroup = new FormGroup({
        oldPassword: new FormControl('', [Validators.required]),
        newPassword: new FormControl('', [Validators.required, validateRex('notdown', /^(?!_)/), validateRex('only', /^(?=.*[a-zA-Z])(?=.*\d)[^]{8,16}$/)]),
        password2: new FormControl('', [Validators.required, validateRex('notdown', /^(?!_)/), validateRex('only', /^(?=.*[a-zA-Z])(?=.*\d)[^]{8,16}$/)]),
      });
  }
  updateUserPassword() {
      if (this.formGroup.invalid) {
        // this.commonServ.showBox("请检查数据");
        console.log(this.formErrors);
        for (const field in this.formErrors) {
          // 清空当前的错误消息
          this.formErrors[field] = '';
          // 获取当前表单的控件
          const control = this.formGroup.get(field);
          // 当前表单存在此空间控件 && 此控件没有被修改 && 此控件验证不通过
          if (control && !control.valid) {
            // 获取验证不通过的控件名，为了获取更详细的不通过信息
            const messages = this.validationMessage[field];
            // 遍历当前控件的错误对象，获取到验证不通过的属性
            for (const key in control.errors) {
              // 把所有验证不通过项的说明文字拼接成错误消息
              this.formErrors[field] += messages[key] + '\n';
              this.commonServ.showBox(this.formErrors[field]);
              return;
            }
          }
        }
        return;
      }
      if (!this.validate()) {
        return;
      }
      const updateInfo = {};
      updateInfo['id'] = this.info.id;
      updateInfo['oldPassword'] = this.formGroup.value.oldPassword;
      updateInfo['newPassword'] = this.formGroup.value.newPassword;
      updateInfo['salt'] = this.info.salt;
      updateInfo['oldSaltPassword'] = this.info.password;
      this.sysManageService.updateUserPassword(updateInfo).subscribe((response) => {
        // console.log(response);
        if (response.status.code === 0) {
          this.commonServ.showBox('修改成功').subscribe((data)=>{
              // sessionStorage.clear();
              // this.router.navigate(['login']);
                  this.dialogRef.close(true);

          });
        }
      });
  }
  validate() {
      if (this.formGroup.value.newPassword != this.formGroup.value.password2) {
        this.commonServ.showBox('新密码两次输入不一致');
        return false;
      }
      return true;
  }
}
