import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {SysManageService} from '../../../../core/services/sys-manage.service';
import {CommonService} from '../../../../core/services/common.service';
import {FormControl, FormGroup} from '@angular/forms';

@Component({
  selector: 'app-sysdict-modal',
  templateUrl: './sysdict-modal.component.html',
  styleUrls: ['./sysdict-modal.component.scss']
})
export class SysdictModalComponent implements OnInit {
  editSysDictFormGroup: FormGroup
  public dictTypeList = [];
  public editDisabled = false;
  constructor(
    public dialogRef: MatDialogRef<SysdictModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public sysManageService: SysManageService,
    public commonServ: CommonService
  ) {

  }

  ngOnInit() {
    console.log(this.data.info);

    if (this.data.info != null){
      if (this.data.info.parentDictKey == "0") {
        this.dictTypeList = [{ dictKey: "0" , dictName : '无' }];
      }else {
        this.dictTypeList = this.data.typeInfo;
      }
      if(this.data.info.keyEditEnable == 0 ){
        // 0:不可编辑;1:可编辑
        this.editDisabled = true ;
      }
    }else {
      this.dictTypeList = [{ dictKey: "0" , dictName : '无' }];
    }
    console.log(this.data);
    console.log(this.dictTypeList);
    const typeValue = this.data.info ?  ((this.data.info.parentDictKey == "0" ) ? "0" : "1") : "0" ;
    this.editSysDictFormGroup = new FormGroup ({
      dictKey: new FormControl({value: (this.data.info ?  this.data.info.dictKey : ''), disabled: this.editDisabled }),
      parentDictKey: new FormControl(this.data.info ?  this.data.info.parentDictKey : "0"),
      type: new FormControl({value: typeValue, disabled: this.editDisabled }),
      dictName: new FormControl(this.data.info ?  this.data.info.dictName : ''),
      dictValue: new FormControl(this.data.info ?  this.data.info.dictValue : ''),
      sequence: new FormControl(this.data.info ?  this.data.info.sequence : 0),
      enable: new FormControl(this.data.info ?  this.data.info.enable  : 0),
      description: new FormControl(this.data.info ?  this.data.info.description  : '')
    });
    console.log(this.editSysDictFormGroup);
  }
  typeonchange() {
    console.log(this.editSysDictFormGroup.value);
    this.refreshDictList(this.editSysDictFormGroup.value);
  }

  refreshDictList(info) {
    if (info.type == "0") {
      this.dictTypeList = [{ dictKey: "0" , dictName : '无' }];
    }else {
      this.dictTypeList = this.data.typeInfo;
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
    this.editSysDictFormGroup.value['id'] = this.data.info.id;
    this.editSysDictFormGroup.value['dictKey'] = this.data.info.dictKey;
    console.log(this.editSysDictFormGroup.value);
    this.sysManageService.modifyDictInfoList(this.editSysDictFormGroup.value).subscribe( (response) => {
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
    console.log(this.editSysDictFormGroup.value);
    this.sysManageService.addDictInfoList(this.editSysDictFormGroup.value).subscribe((response) => {
      console.log(response);
      if (response.status.code ===  0 ) {
        this.commonServ.showBox('添加成功');
        this.dialogRef.close(true);
      }
    });
  }
  validate(){
    const groupValue = this.editSysDictFormGroup.value;
    console.log(groupValue);
    if (groupValue.dictKey == ''){
      this.commonServ.showBox('枚举编码不应为空');
      return false;
    }
    if (groupValue.dictName == ''){
      this.commonServ.showBox('枚举名称不应为空');
      return false;
    }
    if (groupValue.dictValue == ''){
      this.commonServ.showBox('枚举值不应为空');
      return false;
    }
    if (groupValue.sequence === ''){
      this.commonServ.showBox('枚举顺序不应为空');
      return false;
    }
    return true;
  }
}
