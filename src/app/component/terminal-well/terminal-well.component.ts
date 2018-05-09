import {Component, OnInit, AfterViewInit, ElementRef, ViewChild, Inject} from '@angular/core';
import {TerminalWellService} from '../../core/services/terminal-well.service';

// 分页查询
import {PageInfo, pageSize} from '../../models/page-info';
// 条件封装的对象
import {TerminalWell} from '../../models/terminal-well';
// import { cityInfo } from '../../models/city';
// 删除提示框
import {CommonService} from '../../core/services/common.service';
import {Observable} from 'rxjs/Observable';

import {Router, NavigationEnd} from '@angular/router';

@Component({
  selector: 'app-terminal-well',
  templateUrl: './terminal-well.component.html',
  styleUrls: ['./terminal-well.component.scss']
})
export class TerminalWellComponent implements OnInit {
  public tableList = [];
  public tableInitList = [];
  public menuTitle = null;
  public address = {
    province: [],
    city: []
  };
  // 根据toke获取的权限信息
  public perInfo = {};
  // 权限变量
  public permissions = [];
  // 查询条件的实体
  terminalWell: TerminalWell = {
    wellNo: null,
    wellAlias: null,
    wellType: null,
    wellStatus: null,
    installStatus: null
  };
  public terminalWellTypes = [];
  public page: Boolean = false;
  // 总条数:totalRows 总页数:totalPages  当前页:currentPage 提示信息:message 每月显示的条数pageSize 排序字段 sort
  pageInfo: PageInfo = {
    totalRows: 0,
    totalPages: 0,
    currentPage: 0,
    message: '',
    pageSize: pageSize,
    data: [],
    sort: {},
    searchData: this.terminalWell
  };
  // 声明全选，不选，反选用的变量
  // 定义有多选的table表的body
  @ViewChild('tableBody') tableBody: ElementRef;
  // 默认多选框时不选中的状态
  public isSelectAll: Boolean = false;
  // 定义多选框的ID： #checkAll
  @ViewChild('checkAll') checkAllEl: ElementRef;

  constructor(public  commonServ: CommonService,
              public  terminalWellService: TerminalWellService,
              public router: Router) {
  }

  ngOnInit() {
    this.commonServ.getNavList().subscribe((data) => {
      this.perInfo = data.result.sysMenus;
      this.permissions = data.result.userSysPermCodes;
      // this.getPermissions(this.perInfo, this.router.url);
      for (const k in this.perInfo) {
        const list = this.perInfo[k]['childData'];
        for (let i = 0; i < list.length; i++) {
          if (list[i]['href'] === this.router.url) {
            this.menuTitle = list[i]['title'];
          }
        }
      }
    });
    this.terminalWellService.getWellType().subscribe((data) => {
      this.terminalWellTypes = data.result;
    });
    this.terminalWellService.listTerminalWellInfos(this.pageInfo).subscribe((data) => {
      console.log('分页查询的结果是：', data);
      this.tableList = data.result.data;
      this.tableInitList = data.result.data;
      this.pageInfo.totalRows = data.result.totalRows;
      this.pageInfo.currentPage = data.result.currentPage;
      this.pageInfo.pageSize = data.result.pageSize;
      this.pageInfo.totalPages = data.result.totalPages;
      this.pageInfo.message = data.result.message;
      console.log(this.tableList);
      this.page = true;
    });
  }

  // 查询
  searchTablelist() {
    this.pageInfo = {
      totalRows: 0,
      totalPages: 0,
      currentPage: 0,
      message: '',
      pageSize: pageSize,
      data: [],
      sort: {},
      searchData: this.terminalWell
    };
    this.ngOnInit();
  }


  // 提示模态框
  openDefaultDialog(message): void {
    this.commonServ.showBox(message);
  }

// 全选
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

  // 复选框
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

  // 增加管井信息
  addInfo(): void {
    let data;
    data = {
      title: '新增管井',
      typeList: this.terminalWellTypes,
      proList: this.address.province
    };
    this.terminalWellService.show(data).subscribe((rel) => {
      // 提交时对象中删除标题
      if (rel == true) {
        delete data.title;
        this.terminalWellService.save(data).subscribe((result) => {
          console.log('要添加的管井信息是：', data);
          if (result.status.code == 0) {
            this.commonServ.showBox('添加成功！');
            this.ngOnInit();
            console.log('添加后的结果是：', result);
          } else {
            this.commonServ.showBox('添加失败！');
          }
        });
      }

    });
  }

  // 修改的模态框显示
  editeIndo(erminalEquipmentInfo, event): void {
    // 阻止冒泡事件
    event.stopPropagation();
    let data;
    // 通过设备号获取设备
    this.terminalWellService.getListDataById(erminalEquipmentInfo).subscribe((result) => {
      data = result.result;
      data['title'] = '编辑管井';
      data['typeList'] = this.terminalWellTypes;
      this.terminalWellService.show(data).subscribe((rel) => {
        delete data.title;
        if (rel == true) {
          data.wellNo = data.wellNo.trim();
          this.terminalWellService.update(data).subscribe((result) => {
            if (result.status.code == 0) {
              this.commonServ.showBox('修改成功！');
              this.ngOnInit();
              console.log('修改后的结果是：', result);
            } else {
              this.commonServ.showBox('修改失败！');
            }
          });
        }
      });
    });

  }

  // 批量删除
  deleteSelectedInfo(): void {
    const chooses = [];
    const checkboxes = this.tableBody.nativeElement.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach((item) => {
      if (item.checked) {
        console.log('item====>', item);
        chooses.push(item.defaultValue);
      }
    });
    if (chooses.length === 0) {
      this.commonServ.showBox('没有选择要删除的数据');
      return;
    }
    this.commonServ.showDelBox(chooses).subscribe((data) => {
      if (data == true) {
        this.terminalWellService.deleteBatch(chooses).subscribe((result) => {
          if (result.status.code == 0) {
            this.commonServ.showBox('批量删除成功！');
            this.ngOnInit();
          } else {
            this.commonServ.showBox('删除失败！');
          }
        });
      }
    });


  }

  // 删除
  deleteInfo(wellId, wellNo, event): void {
    event.stopPropagation();
    console.log('要删除的设备编号是', wellId);
    this.commonServ.showDelBox(wellNo).subscribe((data) => {
      if (data == true) {
        this.terminalWellService.delete(wellId).subscribe((result) => {
          if (result.status.code == 0) {
            this.commonServ.showBox('删除成功！');
            this.ngOnInit();
          } else {
            this.commonServ.showBox('删除失败！');
          }
        });
      }
    });
  }

  /**
   * 分页函数
   * pno--页数
   * psize--每页显示记录数
   **/
  goPage(pno) {
    if (this.page) {
      if (this.pageInfo.totalPages == 0) {
        this.openDefaultDialog('暂无数据');
        return;
      }
      if (pno >= this.pageInfo.totalPages) {
        // this.openDefaultDialog('已经是最后一页了');
        return;
      }

      if (pno < 0) {
        // this.openDefaultDialog('已经是第一页了');
        return;
      }
    }
    this.pageInfo.currentPage = pno;
    // this.pageInfo.pageSize = pageSize;
    this.terminalWellService.listTerminalWellInfos(this.pageInfo).subscribe((data) => {
      console.log('分页查询的结果是：', data);
      this.tableList = data.result.data;
      this.tableInitList = data.result.data;
      this.pageInfo.totalRows = data.result.totalRows;
      this.pageInfo.currentPage = data.result.currentPage;
      this.pageInfo.pageSize = data.result.pageSize;
      this.pageInfo.totalPages = data.result.totalPages;
      this.pageInfo.message = data.result.message;
      this.page = true;
      if (this.pageInfo.totalPages === 0) {
        this.openDefaultDialog('暂无数据');
      }
    });
  }

// 排序
  orderBy(orderByInfo) {

    if (this.pageInfo.sort[orderByInfo]) {
      this.pageInfo.sort[orderByInfo] === 'desc' ? this.pageInfo.sort[orderByInfo] = 'asc' : this.pageInfo.sort[orderByInfo] = 'desc';

    } else {
      this.pageInfo.sort = {};
      this.pageInfo.sort[orderByInfo] = 'asc';
    }
    this.terminalWellService.listTerminalWellInfos(this.pageInfo).subscribe((data) => {
      this.tableList = data.result.data;
      this.tableInitList = data.result.data;
      this.pageInfo.totalRows = data.result.totalRows;
      this.pageInfo.currentPage = data.result.currentPage;
      this.pageInfo.pageSize = data.result.pageSize;
      this.pageInfo.totalPages = data.result.totalPages;
      this.pageInfo.message = data.result.message;
      this.pageInfo.sort = data.result.sort;
      this.page = true;
      if (this.pageInfo.totalPages === 0) {
        this.openDefaultDialog('暂无数据');
      }

    });

  }

  // 权限设置
  // getPermissions(preinfo, currentUrl) {
  //   this.commonServ.getPermissions(preinfo, currentUrl).subscribe((data) => {
  //     this.permissions = data
  //   })
  // }
  hasPermission(val): boolean {
    for (let i = 0; i < this.permissions.length; i++) {
      if (this.permissions[i] === val) {
        return true;
      }
    }
    return false;
  }
}
