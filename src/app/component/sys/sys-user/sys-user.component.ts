import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {SysManageService} from '../../../core/services/sys-manage.service';
import {UserModalInfoComponent} from './user-modal-info/user-modal-info.component';
import {MatDialog} from '@angular/material';
import {CommonService} from '../../../core/services/common.service';
import {EditUserComponent} from './edit-user/edit-user.component';
import {AddUserComponent} from './add-user/add-user.component';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {PageInfo, pageSize } from '../../../models/page-info';
import { Router, NavigationEnd } from '@angular/router';
@Component({
  selector: 'app-sys-user',
  templateUrl: './sys-user.component.html',
  styleUrls: ['./sys-user.component.scss']
})
export class SysUserComponent implements OnInit {
  @ViewChild('tableBody') tableBody: ElementRef;
  public isSelectAll: Boolean = false;
  @ViewChild('checkAll') checkAllEl: ElementRef;
public menuTitle=null;
  public tableList = [];
  public roleInfoList = [];
  //根据toke获取的权限信息
  public perInfo = {};
  //权限变量
  public permissions = [];
  userformGroup: FormGroup;
  constructor(
    public sysManageService: SysManageService,
    public dialog: MatDialog,
    public commonServ: CommonService,
    public router:Router
  ) {
      this.userformGroup = new FormGroup({
        username: new FormControl(''),
        status: new FormControl('-1'),
      });
  }
  public page: Boolean = false;
  // 总条数:totalRows 总页数:totalPages  当前页:currentPage 提示信息:message 每月显示的条数pageSize 排序字段 sort
  pageInfo: PageInfo = {
    totalRows: 0,
    totalPages: 0,
    currentPage: 1,
    message: '',
    pageSize: pageSize,
    data: [],
    sort: {},
    searchData: {}
  };
  ngOnInit() {
    this.queryUserInfoList();
    this.queryAllRoleList();
    this.commonServ.getNavList().subscribe((data) => {
      this.perInfo = data.result.sysMenus;
      this.permissions = data.result.userSysPermCodes;
      // this.getPermissions(this.perInfo, this.router.url);
      for(let k in this.perInfo){
         let list= this.perInfo[k]['childData'];
         for(let i=0;i<list.length;i++){
             if(list[i]['href']===this.router.url){
                 this.menuTitle=list[i]['title'];
             }
         }
      }
    })
  }

  /**
   * 获取系统所有角色列表
   */
  queryAllRoleList() {
    this.sysManageService.getAllRole().subscribe( (response) => {
      // console.log('----queryAllRoleList---');
      // console.log(response);
      this.roleInfoList = response.result;
    });
  }

  /**
   * 根据查询条件获取系统所有用户列表
   */
  queryUserInfoList() {
    // console.log(this.userformGroup.value);
    if(!this.userformGroup.value.status){
      this.userformGroup.value['status'] = '-1';
    }
    this.pageInfo.searchData = this.userformGroup.value;
    this.sysManageService.getUserInfoList(this.pageInfo).subscribe((response) => {
      // console.log("分页查询的结果是：", response);
      this.tableList = response.result.data;
      this.pageInfo.totalRows = response.result.totalRows;
      this.pageInfo.currentPage = response.result.currentPage;
      this.pageInfo.pageSize = response.result.pageSize;
      this.pageInfo.totalPages = response.result.totalPages;
      this.pageInfo.message = response.result.message;
      this.pageInfo.sort = response.result.sort;
      this.page = true;
    });
  }
  /**
   * 分页函数
   * pno--页数
   **/
  goPage(pno) {
    if (this.page) {
      if (this.pageInfo.totalPages === 0) {
        this.openDefaultDialog('暂无数据');
        return;
      }
      // event.preventDefault();
      if (pno > this.pageInfo.totalPages) {
        //this.openDefaultDialog('已经是最后一页了');
        return;
      }

      if (pno <= 0) {
        //this.openDefaultDialog('已经是第一页了');
        return;
      }
    }
    this.pageInfo.currentPage = pno;
    this.pageInfo.searchData = this.userformGroup.value;
    // console.log(this.pageInfo);
    this.sysManageService.getUserInfoList(this.pageInfo).subscribe((response) => {
      // console.log("goPage 分页查询的结果是：", response);
      this.tableList = response.result.data;
      this.pageInfo.totalRows = response.result.totalRows;
      this.pageInfo.currentPage = response.result.currentPage;
      this.pageInfo.pageSize = response.result.pageSize;
      this.pageInfo.totalPages = response.result.totalPages;
      this.pageInfo.message = response.result.message;
      this.pageInfo.sort = response.result.sort;
      this.page = true;
      if (this.pageInfo.totalPages === 0) {
        this.openDefaultDialog('暂无数据');
      }
    });
  }
  // 提示模态框
  openDefaultDialog(message): void {
    this.commonServ.showBox(message);
  }


  /**
   * 根据用户id删除用户信息以及相应角色信息
   * id可以为多个id,  例如 1,2,3
   */
  deleteUserInfo(rowInfo) {
    // console.log('----deleteUserInfo---' + rowInfo.id);
    this.commonServ.showDelBox(rowInfo.username).subscribe((isSuccessed) => {
      // console.log(isSuccessed);
      if (isSuccessed) {
        this.sysManageService.deleteUserInfo(rowInfo.id).subscribe( (response) => {
          // console.log(response);
          if (response.status.code ===  0 ) {
            this.commonServ.showBox('删除成功');
            this.queryUserInfoList();
          }
        });
      }
    });
  }

  /**
   * 给用户分配角色信息
   * @param record
   */
  editUserRoleInfo(record) {
    // console.log(record);
    const data = {title: null, list: null, userRole: []};
    this.sysManageService.getUserRole(record).subscribe( response => {
      // console.log(response);
      data.title = '分配角色';
      // userRoleInfo 当前用户，uid rid 对应信息,
      data.userRole = response.result;
      // 重新组装模态框里的data数据
      // arr 如果当前用户拥有的角色，checked为true,通过双向绑定，模态框自动选中
      // 此后 dataTest.list里的数据就是实时的
      const arr = [];
      this.roleInfoList.forEach( (item) => {
        let ischecked = false;
        const uid = record.id;
        data.userRole.forEach((info) => {
          if (item.id  ===  info.rid) {
            ischecked = true;
          }
        });
        arr.push({name: item.name, uid : uid, rid : item.id , checked : ischecked});
      });
      data.list = arr;
      this.sysManageService.showModal(data, UserModalInfoComponent).subscribe( (rel) => {
        // console.log(rel);
        delete data.title;
       });

    });
  }


  // 批量删除事件
  batchDeleteUserInfo() {
    const checkboxes = this.tableBody.nativeElement.querySelectorAll('input[type="checkbox"]');
    const selectedList = [];
    checkboxes.forEach((item) => {
      if (item.checked) {
        selectedList.push(item.value);
      }
    });
    if (selectedList.length === 0) {
      this.commonServ.showBox("没有选择要删除的数据");
      return;
    }
    const idStr = selectedList.join(',');
    // console.log('--batchDeleteUserInfo---' + idStr);
    this.commonServ.showDelBox('选中数据').subscribe((isSuccessed) => {
      if (isSuccessed) {
        this.sysManageService.deleteUserInfo(idStr).subscribe( (response) => {
          // console.log(response);
          if (response.status.code ===  0 ) {
            this.commonServ.showBox('删除成功');
            this.queryUserInfoList();
          }
      });
    }
    });

  }

  /**
   * 编辑用户信息
   * @param info
   */
  editUserIndo(info) {
    const data = {title : '编辑' , info : info};
    this.sysManageService.showModal(data, EditUserComponent).subscribe( (isConfirmed) => {
      // console.log(isConfirmed);
      if (isConfirmed) {
        this.queryUserInfoList();
      }
      delete data.title;
    });
  }

  /**
   * 添加用户
   */
  addUserInfo() {
    this.sysManageService.showModal(null , AddUserComponent).subscribe( (isConfirmed) => {
      // console.log(isConfirmed);
      if (isConfirmed) {
        this.queryUserInfoList();
      }
    });
  }

  /**
   * 重置用户密码
   * 只有超级管理员才有权限
   */
  resetUserPassword(rowInfo){
    // console.log('----resetUserPassword---' + rowInfo);
    const info = {};
    this.commonServ.showCommonBox('重置用户密码 ').subscribe((isSuccessed) => {
      // console.log(isSuccessed);
      if (isSuccessed) {
        this.sysManageService.resetUserPassword(rowInfo).subscribe( (response) => {
          // console.log(response);
          if (response.status.code ===  0 ) {
            this.commonServ.showBox('重置成功为' + response.status.message);
          }
        });
      }
    });
  }


  onCheckboxAllChanged() {
    const checkboxes = this.tableBody.nativeElement.querySelectorAll('input[type="checkbox"]');
    if (this.isSelectAll) {
      checkboxes.forEach((item) => {
        item.checked = false;
      });
      this.isSelectAll = false;
    } else {
      checkboxes.forEach((item) => {
        item.checked = true;
      });
      this.isSelectAll = true;
    }
  }

  onCheckboxItemChanged(event) {
    event.stopPropagation();
    const checkboxes = this.tableBody.nativeElement.querySelectorAll('input[type="checkbox"]');
    let temp = true;
    checkboxes.forEach((item) => {
      if (!item.checked) {
        temp = false;
      }
    });
    if (temp) {
      this.isSelectAll = true;
    } else {
      this.isSelectAll = false;
    }
    const checkAllElem = this.checkAllEl.nativeElement;
    temp ? checkAllElem.checked = true : checkAllElem.checked = false;
  }
  //权限设置
  // getPermissions(preinfo, currentUrl) {
  //   this.commonServ.getPermissions(preinfo, currentUrl).subscribe((data) => {
  //     this.permissions = data;
  //     // console.log(this.permissions);
  //   })
  // }
  hasPermission(val): boolean {
    for (let i = 0; i < this.permissions.length; i++) {
        if(this.permissions[i]===val){
            return true;
        }
    }
    return false;
  }
}
