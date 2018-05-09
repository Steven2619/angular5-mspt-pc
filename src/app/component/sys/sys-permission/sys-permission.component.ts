import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {PageInfo,pageSize} from '../../../models/page-info';
import {SysManageService} from '../../../core/services/sys-manage.service';
import {FormControl, FormGroup} from '@angular/forms';
import {CommonService} from '../../../core/services/common.service';
import {PermissionModalComponent} from './permission-modal/permission-modal.component';
import { Router, NavigationEnd } from '@angular/router';
@Component({
  selector: 'app-sys-permission',
  templateUrl: './sys-permission.component.html',
  styleUrls: ['./sys-permission.component.scss']
})
export class SysPermissionComponent implements OnInit {
  @ViewChild('tableBody') tableBody: ElementRef;
  public isSelectAll: Boolean = false;
  @ViewChild('checkAll') checkAllEl: ElementRef;
  permFormGroup: FormGroup;
public menuTitle=null;
  public tableList = [];
  //根据toke获取的权限信息
  public perInfo = {};
  //权限变量
  public permissions = [];
  public menuListInfo = {contents : [] , menus : []};
  constructor(
    public sysManageService: SysManageService,
    public commonServ: CommonService,
    public router:Router
  ) {
    this.permFormGroup = new FormGroup({
      name : new FormControl(''),
      status : new FormControl('-1')
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
    this.queryPermissInfoList();
    this.refreshMenusInfo();
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
    });
  }

  /**
   * 根据查询条件查询权限信息
   */
  queryPermissInfoList() {
    // console.log('----queryPermissInfoList---');
     // console.log(this.permFormGroup.value);
     if(!this.permFormGroup.value.status){
       this.permFormGroup.value['status'] = '-1';
     }
    this.pageInfo.searchData = this.permFormGroup.value;
      this.sysManageService.getPermInfoList(this.pageInfo).subscribe((response) => {
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

  refreshMenusInfo(){
    // console.log('----refreshMenusInfo---');
    this.menuListInfo = {contents : [] , menus : []};
    this.sysManageService.getAllPermInfoList().subscribe((response) => {
      // console.log(response);
      const result = response.result;
      result.forEach((info) => {
        if (info.type === 0) {
          this.menuListInfo.contents.push({id : info.id , name : info.name});
        }else if(info.type === 1) {
          this.menuListInfo.menus.push({id : info.id , name : info.name});
        }
      });
    });

  }

  editPermissionInfo(permInfo){
    const data = {title : '编辑' , info : permInfo , menuInfo : this.menuListInfo};
    this.sysManageService.showModal( data , PermissionModalComponent).subscribe( (isConfirmed) => {
      // console.log(isConfirmed);
      if (isConfirmed) {
        this.queryPermissInfoList();
        this.refreshMenusInfo();
      }
      });
  }
  addPermissionInfo(permInfo){
    const data = {title : '添加' , info : null , menuInfo : this.menuListInfo};
    this.sysManageService.showModal( data , PermissionModalComponent).subscribe( (isConfirmed) => {
      // console.log(isConfirmed);
      if (isConfirmed) {
        this.queryPermissInfoList();
        this.refreshMenusInfo();
      }
    });
  }

  /**
   * 删除权限信息
   * @param rowInfo
   */
  deletePermissionInfo(rowInfo) {
    // console.log('----deleteUserInfo---' + rowInfo.id);
    this.commonServ.showDelBox(rowInfo.name).subscribe((isSuccessed) => {
      // console.log(isSuccessed);
      if (isSuccessed) {
        this.sysManageService.deletePermissionInfo(rowInfo.id).subscribe( (response) => {
          // console.log(response);
          if (response.status.code ===  0 ) {
            this.commonServ.showBox('删除成功');
            this.queryPermissInfoList();
            this.refreshMenusInfo();
          }
        });
      }
    });
  }

  // 批量删除事件
  batchDeletePermissInfo() {
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
    let idStr = selectedList.join(',');
    // console.log('--batchDeleteRoleInfo---' + idStr);
    this.commonServ.showDelBox('选中数据').subscribe((isSuccessed) => {
      if (isSuccessed) {
        this.sysManageService.batchDeletePermissionInfo(idStr).subscribe( (response) => {
          // console.log(response);
          if (response.status.code ===  0 ) {
            this.commonServ.showBox('删除成功');
            this.queryPermissInfoList();
            this.refreshMenusInfo();
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
  //     // console.log(this.permissions)
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
        // this.openDefaultDialog('已经是最后一页了');
        return;
      }

      if (pno <= 0) {
        // this.openDefaultDialog('已经是第一页了');
        return;
      }
    }
    this.pageInfo.currentPage = pno;
    this.pageInfo.searchData = this.permFormGroup.value;
    // console.log(this.pageInfo);
    this.sysManageService.getPermInfoList(this.pageInfo).subscribe((response) => {
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

}
