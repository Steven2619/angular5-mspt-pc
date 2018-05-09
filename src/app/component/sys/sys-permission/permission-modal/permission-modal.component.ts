import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {SysManageService} from '../../../../core/services/sys-manage.service';
import {CommonService} from '../../../../core/services/common.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-permission-modal',
  templateUrl: './permission-modal.component.html',
  styleUrls: ['./permission-modal.component.scss']
})
export class PermissionModalComponent implements OnInit {
  editPermFormGroup: FormGroup
  public menuList = [];

  public type_disabled = false;
  public url_disabled = true;
  public permCode_disabled = false;
  public pid_disabled = true;

  constructor(
    public dialogRef: MatDialogRef<PermissionModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public sysManageService: SysManageService,
    public commonServ: CommonService
  ) {
    this.menuList = [{ id: 0 , name : '无' }];
  }

  ngOnInit() {
    //console.log(this.data.info);
    if (this.data.info != null){
      this.refreshMenuList(this.data.info);
    }
    this.setControlsDisabled();
    this.editPermFormGroup = new FormGroup({
      name: new FormControl(this.data.info ?  this.data.info.name : '', Validators.required),
      pid: new FormControl({value: (this.data.info ?  this.data.info.pid : 0), disabled: this.pid_disabled }),
      type: new FormControl({value: (this.data.info ?  this.data.info.type : 3), disabled: this.type_disabled }),
      sort: new FormControl(this.data.info ?  this.data.info.sort : '' , Validators.required),
      url: new FormControl({value: (this.data.info ?  this.data.info.url : '-'), disabled: this.url_disabled }, Validators.required),
      permCode: new FormControl({value: (this.data.info ?  this.data.info.permCode : ''), disabled: this.permCode_disabled }, Validators.required),
      status: new FormControl(this.data.info ?  this.data.info.status  : 1),
    });
  }

  setControlsDisabled(){
    if (this.data.info == null){
      this.pid_disabled = true;
      return;
    }
    if (this.data.info.type === 0){
      this.pid_disabled = true;
      this.type_disabled = true;
      this.url_disabled = true;
      this.permCode_disabled = true;
    }else if(this.data.info.type === 1){
      this.pid_disabled = false;
      this.type_disabled = true;
      this.url_disabled = false;
      this.permCode_disabled = true;
    }else if(this.data.info.type === 2 ){
      this.pid_disabled = false;
      this.type_disabled = false;
      this.url_disabled = true;
      this.permCode_disabled = false;
    }else if(this.data.info.type === 3 ){
      this.pid_disabled = true;
      this.type_disabled = false;
      this.url_disabled = true;
      this.permCode_disabled = false;
    }else if(this.data.info.type === 4 ){
      this.pid_disabled = true;
      this.type_disabled = false;
      this.url_disabled = false;
      this.permCode_disabled = false;
    }
  }

  typeonchange() {
      console.log(this.editPermFormGroup.value);
      this.refreshMenuList(this.editPermFormGroup.value);
      this.updateControlsDisabled();
  }
  refreshMenuList(info) {
    //console.log(info.type);
    if (info.type === 0 || info.type === 3 || info.type === 4) {
      this.menuList = [{ id: 0 , name : '无' }];
    }else if (info.type === 1) {
      this.menuList = this.data.menuInfo.contents;
    }else if (info.type === 2 ) {
      this.menuList = this.data.menuInfo.menus;
    }
    //console.log(this.menuList);
  }

  updateControlsDisabled(){
    const info = this.data.info;
    const groupValue = this.editPermFormGroup.value;
    const type = groupValue.type;
    const  url = this.editPermFormGroup.controls.url;
    const permCode = this.editPermFormGroup.controls.permCode;
    const pid = this.editPermFormGroup.controls.pid;
    groupValue.pid = 0;
    if (info != null){
      if (groupValue.type === info.type){
        groupValue.pid = info.pid;
      }
    }
    if (type === 0){
      url.reset({value: '-', disabled : true});
      permCode.reset({value: '-', disabled : true});
      pid.reset({value: groupValue.pid, disabled : true});
    }else if(type === 1){
      url.reset({value: groupValue.url, disabled : false});
      permCode.reset({value: '-', disabled : true});
      pid.reset({value: groupValue.pid, disabled : false});
    }else if(type === 2){
      url.reset({value: '-', disabled : true});
      permCode.reset({value: groupValue.permCode, disabled : false});
      pid.reset({value: groupValue.pid, disabled : false});
    }else if(type === 3 ){
      url.reset({value: '-', disabled : true});
      permCode.reset({value: groupValue.permCode, disabled : false});
      pid.reset({value: groupValue.pid, disabled : true});
    }else if(type === 4 ){
      url.reset({value: groupValue.url, disabled : false});
      permCode.reset({value: groupValue.permCode, disabled : false});
      pid.reset({value: groupValue.pid, disabled : true});
    }

  }



  onsubmit() {
    if (this.data.info) {
      this.editPermInfo();
    }else {
      this.addPermInfo();
    }
  }

  editPermInfo() {
    if (!this.validate()){
      return;
    }
    this.editPermFormGroup.value['id'] = this.data.info.id;
    if (this.data.info.type === 0 || this.data.info.type === 1){
      this.editPermFormGroup.value['type'] = this.data.info.type;
    }
    console.log(this.editPermFormGroup.value);
    this.sysManageService.modifyPermissionInfo(this.editPermFormGroup.value).subscribe( (response) => {
      console.log(response);
      if (response.status.code ===  0 ) {
        this.commonServ.showBox('修改成功');
        this.dialogRef.close(true);
      }
    });
  }

  addPermInfo() {
    if (!this.validate()){
      return;
    }
    //console.log(this.editPermFormGroup.value);
    if (this.editPermFormGroup.value.type === 0){
      this.editPermFormGroup.value.url = '-';
      this.editPermFormGroup.value.permCode = '-';
    }else if (this.editPermFormGroup.value.type === 1){
      this.editPermFormGroup.value.permCode = '-';
    }else if (this.editPermFormGroup.value.type === 4){
      this.editPermFormGroup.value['pid'] = 0;
    }else{
      this.editPermFormGroup.value.url = '-';
    }
    this.sysManageService.addPermissionInfo(this.editPermFormGroup.value).subscribe((response) => {
      console.log(response);
      if (response.status.code ===  0 ) {
        this.commonServ.showBox('添加成功');
        this.dialogRef.close(true);
      }
    });
  }

  validate(){
    const groupValue = this.editPermFormGroup.value;
    console.log(groupValue);
    if (groupValue.name == ''){
      this.commonServ.showBox('权限名不应为空');
      return false;
    }
    if (groupValue.type != 0 && groupValue.pid == 0){
      this.commonServ.showBox('上一级不应为空');
      return false;
    }
    if (groupValue.sort == ''){
      this.commonServ.showBox('排序不应为空');
      return false;
    }
    if ( (groupValue.type === 1 || groupValue.type === 4) && groupValue.url == ''){
      this.commonServ.showBox('权限URL不应为空');
      return false;
    }
    if ((groupValue.type === 2 || groupValue.type === 3 || groupValue.type === 4) && groupValue.permCode == ''){
      this.commonServ.showBox('权限编码不应为空');
      return false;
    }

    // SMALLINT 数据类型是一种精确数值数据类型，其精度在算术运算后不变。它需要 2 个字节存储。
    // 有符号的 SMALLINT 值的范围是 –2^15（2^15表示2的15次幂） 到2^15 – 1，即 –32768 到 32767。
    if (groupValue.sort < 0 || groupValue.sort > 32767){
      this.commonServ.showBox('排序值的范围 [0,32767] ');
      return false;
    }

    return true;
  }

}
