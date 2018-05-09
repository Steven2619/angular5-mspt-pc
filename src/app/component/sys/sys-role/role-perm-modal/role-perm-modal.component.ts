import {Component, ElementRef, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {SysManageService} from '../../../../core/services/sys-manage.service';
import {CommonService} from '../../../../core/services/common.service';
import 'ztree';
declare var $: any;

@Component({
  selector: 'app-role-perm-modal',
  templateUrl: './role-perm-modal.component.html',
  styleUrls: ['./role-perm-modal.component.scss']
})
export class RolePermModalComponent implements OnInit {
  mysetting = {
    check: {
      enable: true,
    },
    data: {
      simpleData: {
        enable: true,
        idKey: "id",
        pIdKey: "pid",
        rootPId: 0
      }
    }
  };

  constructor(
    public dialogRef: MatDialogRef<RolePermModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public sysManageService: SysManageService,
    public commonServ: CommonService,
    public el: ElementRef
  ) { }

  ngOnInit() {
    $.fn.zTree.init($("#treeDemo"), this.mysetting, this.data.info);
  }

  /**
   * 提交角色的权限树信息
   */
  onsubmit(){
    var zTree = $.fn.zTree.getZTreeObj("treeDemo");
    var nodes = zTree.getCheckedNodes(true);
    console.log(nodes);
    if (nodes.length <= 0) {
      this.commonServ.showBox('请至少选中一个节点');
      return;
    }else {
      const listInfo = [];
      nodes.forEach( (node) => {
        listInfo.push({rid: this.data.id, pid: node.id});
      })
      this.sysManageService.modifyRolePermission(listInfo).subscribe((response) => {
        console.log(response);
        if (response.status.code ===  0 ) {
          this.commonServ.showBox('更新角色权限信息成功');
          this.dialogRef.close(true);
        }
      });
    }
  }

}
