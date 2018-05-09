import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { SysManageService } from '../../../../core/services/sys-manage.service';
import { CommonService } from '../../../../core/services/common.service';
import { validateRex } from '../../../../models/validate-register';
@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.scss']
})
export class AddUserComponent implements OnInit {
  formGroup: FormGroup;
  // 表单验证不通过时显示的错误消息
  formErrors = {
    username: '',
    password: '',
    password_2: '',
    email: '',
  };
  // 为每一项表单验证添加说明文字
  validationMessage = {
    'username': {
      'minlength': '用户名长度最少为3个字符',
      'maxlength': '用户名长度最多为10个字符',
      'required': '请填写用户名',
      'notdown': '用户名不能以下划线开头',
      'only': '用户名只能包含数字、字母、下划线'
    },
    'password': {
      'required': '请填写密码',
      'notdown': '密码不能以下划线开头',
      'only': '密码必须包含数字和字母、长度要在8-16位之间'
    },
    'password_2': {
      'required': '请填写确认密码',
      'notdown': '密码不能以下划线开头',
      'only': '密码必须包含数字和字母、长度要在8-16位之间'
    },
    'email': {
      'required': '请填写邮件',
      'email': '请输入正确的邮件格式'
    }
  };
  constructor(
    public dialogRef: MatDialogRef<AddUserComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public sysManageService: SysManageService,
    public commonServ: CommonService
  ) {
    this.formGroup = new FormGroup({
      username: new FormControl('', [Validators.required, Validators.maxLength(10), Validators.minLength(3), validateRex('notdown', /^(?!_)/), validateRex('only', /^[1-9a-zA-Z_]+$/)]),
      password: new FormControl('', [Validators.required, validateRex('notdown', /^(?!_)/), validateRex('only', /^(?=.*[a-zA-Z])(?=.*\d)[^]{8,16}$/)]),
      password_2: new FormControl('', [Validators.required, validateRex('notdown', /^(?!_)/), validateRex('only', /^(?=.*[a-zA-Z])(?=.*\d)[^]{8,16}$/)]),
      email: new FormControl('', [Validators.required, Validators.email]),
      status: new FormControl(1),
    });
  }

  ngOnInit() {
  }
  addUserInfo() {
    console.log("表单验证确认性", this.formGroup.invalid);
    if (this.formGroup.invalid) {
      // this.commonServ.showBox("请检查数据");
      console.log(this.formErrors);
      for (const field in this.formErrors) {
        // 清空当前的错误消息
        this.formErrors[field] = '';
        // 获取当前表单的控件
        const control = this.formGroup.get(field);
        // 当前表单存在此空间控件 && 此控件没有被修改 && 此控件验证不通过
        if (control  && !control.valid) {
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
    this.sysManageService.addUserInfo(this.formGroup.value).subscribe((response) => {
      if (response.status.code === 0) {
        this.commonServ.showBox('添加成功');
        this.dialogRef.close(true);
      }
    });
  }

  validate() {
    if (this.formGroup.value.password != this.formGroup.value.password_2) {
      console.log(this.formGroup.value.password);
      console.log(this.formGroup.value.password_2);
      this.commonServ.showBox('新密码两次输入不一致');
      return false;
    }
    return true;
  }

}
