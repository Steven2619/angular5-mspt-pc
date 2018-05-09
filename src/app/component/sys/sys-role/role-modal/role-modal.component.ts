import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {SysManageService} from '../../../../core/services/sys-manage.service';
import {CommonService} from '../../../../core/services/common.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-role-modal',
  templateUrl: './role-modal.component.html',
  styleUrls: ['./role-modal.component.scss']
})
export class RoleModalComponent implements OnInit {

  editRoleFormGroup: FormGroup
  constructor(
    public dialogRef: MatDialogRef<RoleModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public sysManageService: SysManageService,
    public commonServ: CommonService
  ) {
    this.editRoleFormGroup = new FormGroup({
      name: new FormControl(this.data.info ?  this.data.info.name : '' ,  Validators.required),
      // sort: new FormControl(this.data.info ?  this.data.info.sort : '' , Validators.required),
      description: new FormControl(this.data.info ?  this.data.info.description  : ''),
      status: new FormControl(this.data.info ?  this.data.info.status  : 1),
    });
  }

  ngOnInit() {
  }
  onsubmit() {
    if (this.data.info) {
      this.modifyRoleInfo();
    }else{
      this.addRoleInfo();
    }
  }

  modifyRoleInfo() {
    if (!this.validate()){
      return;
    }

    this.editRoleFormGroup.value['id'] = this.data.info.id;
    console.log(this.editRoleFormGroup.value);
    this.sysManageService.modifyRoleInfo(this.editRoleFormGroup.value).subscribe( (response) => {
      console.log(response);
      if (response.status.code ===  0 ) {
        this.commonServ.showBox('修改成功');
        this.dialogRef.close(true);
      }
    });
  }

  addRoleInfo() {
    if (!this.validate()){
      return;
    }

    console.log(this.editRoleFormGroup.value);
    this.sysManageService.addRoleInfo(this.editRoleFormGroup.value).subscribe((response) => {
      console.log(response);
      if (response.status.code ===  0 ) {
        this.commonServ.showBox('添加成功');
        this.dialogRef.close(true);
      }
    });
  }

  validate(){
    if (this.editRoleFormGroup.value.name == ''){
      this.commonServ.showBox('角色名不应为空');
      return false;
    }
    /*if (this.editRoleFormGroup.value.sort == ''){
      this.commonServ.showBox('排序不应为空');
      return false;
    }*/

    return true;
  }

}
