import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogModule, MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {SysManageService} from '../../../../core/services/sys-manage.service';
import {CommonService} from '../../../../core/services/common.service';

@Component({
  selector: 'app-user-modal-info',
  templateUrl: './user-modal-info.component.html',
  styleUrls: ['./user-modal-info.component.scss']
})

export class UserModalInfoComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<UserModalInfoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public sysManageService: SysManageService,
    public commonServ: CommonService
  ) {

  }

  ngOnInit() {

  }

  /**
   * 修改用户的角色信息
   * @param list
   */
  modifyUserRole(list): void {
      console.log(list);
      let userRoleList = [];
      list.forEach( (item) => {
        if ( item.checked ) {
          userRoleList.push({uid : item.uid , rid : item.rid });
        }
      });
      if( userRoleList.length === 0){
        userRoleList = [{uid : list[0].uid , rid : -1}];
      }
    console.log(userRoleList);
      this.sysManageService.modifyUserRole(userRoleList).subscribe( (response) => {
        console.log(response);
        if (response.status.code === 0 ) {
          this.commonServ.showBox('分配成功');
          this.dialogRef.close(true);
        }
      });
  }

}
