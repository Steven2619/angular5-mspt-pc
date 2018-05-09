import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {SysManageService} from '../../../core/services/sys-manage.service';
import {CommonService} from '../../../core/services/common.service';
import {FormControl, FormGroup} from '@angular/forms';
import {SysdictModalComponent} from './sysdict-modal/sysdict-modal.component';
import {PageInfo,pageSize} from '../../../models/page-info';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-sys-dict',
  templateUrl: './sys-dict.component.html',
  styleUrls: ['./sys-dict.component.scss']
})
export class SysDictComponent implements OnInit {
  @ViewChild('tableBody') tableBody: ElementRef;
  public isSelectAll: Boolean = false;
  @ViewChild('checkAll') checkAllEl: ElementRef;
  sysDictFormGroup: FormGroup;
public menuTitle=null;
  public tableList = [];
  //根据toke获取的权限信息
  public perInfo = {};
  //权限变量
  public permissions = [];
  public typeList = [];
  public dictTypeList = [{dictKey : null , dictName : '不限'}];
  constructor(
    public sysManageService: SysManageService,
    public commonServ: CommonService,
    public router: Router,
  ) {
    this.sysDictFormGroup = new FormGroup({
      dictName : new FormControl(''),
      dictKey : new FormControl('-1'),
      enable : new FormControl('-1')
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
    this.querySysDictInfoList();
    this.refreshTypeInfo();
    this.commonServ.getNavList().subscribe((data) => {
      this.perInfo = data.result.sysMenus;
      this.permissions = data.result.userSysPermCodes;
      // console.log(this.perInfo)
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
  refreshTypeInfo(){
    // console.log('----refreshTypeInfo---');
    this.typeList = [];
    this.sysManageService.getAllDictTypeList().subscribe((response) => {
      // console.log(response);
      const result = response.result;
      result.forEach((info) => {
        this.typeList.push({dictKey : info.dictKey , dictName : info.dictName});
        this.dictTypeList.push({dictKey : info.dictKey , dictName : info.dictName});
      });
    } );
  }

  /**
   * 根据查询条件查询权限信息
   */
  querySysDictInfoList() {
    // console.log('----queryRoleInfoList---');
    if(!this.sysDictFormGroup.value.enable){
      this.sysDictFormGroup.value['enable'] = '-1';
    }
    if(!this.sysDictFormGroup.value.dictKey){
      this.sysDictFormGroup.value['dictKey'] = '-1';
    }
    // console.log(this.sysDictFormGroup.value);
    this.pageInfo.searchData = this.sysDictFormGroup.value;
    this.sysManageService.getSysDictInfoList(this.pageInfo).subscribe((response) => {
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
        // this.openDefaultDialog('已经是最后一页了');
        return;
      }

      if (pno <= 0) {
        // this.openDefaultDialog('已经是第一页了');
        return;
      }
    }
    this.pageInfo.currentPage = pno;
    this.pageInfo.searchData = this.sysDictFormGroup.value;
    // console.log(this.pageInfo);
    this.sysManageService.getSysDictInfoList(this.pageInfo).subscribe((response) => {
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

  editSysDictInfo(dictInfo){
    const data = {title : '编辑' , info : dictInfo , typeInfo : this.typeList};
    this.sysManageService.showModal( data , SysdictModalComponent).subscribe( (isConfirmed) => {
      // console.log(isConfirmed);
      if (isConfirmed) {
        this.querySysDictInfoList();
        this.refreshTypeInfo();
      }
    });
  }
  addSysDictInfo(dictInfo){
    const data = {title : '添加' , info : null , typeInfo : this.typeList};
    this.sysManageService.showModal( data , SysdictModalComponent).subscribe( (isConfirmed) => {
      // console.log(isConfirmed);
      if (isConfirmed) {
        this.querySysDictInfoList();
        this.refreshTypeInfo();
      }
    });
  }

  /**
   * 删除信息
   * @param rowInfo
   */
  deleteSysDictInfo(rowInfo) {
    // console.log('----deleteSysDictInfo---' + rowInfo.id);
    this.commonServ.showDelBox(rowInfo.dictName).subscribe((isSuccessed) => {
      // console.log(isSuccessed);
      if (isSuccessed) {
        this.sysManageService.deleteSysDictInfo(rowInfo.id).subscribe( (response) => {
          // console.log(response);
          if (response.status.code ===  0 ) {
            this.commonServ.showBox('删除成功');
            this.querySysDictInfoList();
            this.refreshTypeInfo();
          }
        });
      }
    });
  }

  // 批量删除事件
  batchDeleteSysDictInfo() {
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
    // console.log('--batchDeleteSysDictInfo---' + idStr);
    this.commonServ.showDelBox('选中数据').subscribe((isSuccessed) => {
      if (isSuccessed) {
        this.sysManageService.deleteSysDictInfo(idStr).subscribe( (response) => {
          // console.log(response);
          if (response.status.code ===  0 ) {
            this.commonServ.showBox('删除成功');
            this.querySysDictInfoList();
            this.refreshTypeInfo();
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
  //     this.permissions = data
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
