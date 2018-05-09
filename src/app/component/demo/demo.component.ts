import {Component, OnInit, AfterViewInit, ElementRef, ViewChild, Inject} from '@angular/core';
import {MatTableDataSource, MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import {SelectionModel} from '@angular/cdk/collections';
import {DemoService} from '../../core/services/demo.service';
import {Observable} from 'rxjs/Observable';
import {PageInfo, pageSize} from '../../models/page-info';
import {CommonService} from '../../core/services/common.service';
import 'rxjs/add/operator/map';

import {FormControl, Validators} from '@angular/forms';

import {Router, NavigationEnd} from '@angular/router';

@Component({
  selector: 'app-demo',
  templateUrl: './demo.component.html',
  styleUrls: ['./demo.component.scss']
})
export class DemoComponent implements OnInit {
  tableList = [];
  tableInitList = [];
  address = {
    province: [],
    city: []
  };
  menuTitle = null;
  allAddress;
  // 根据toke获取的权限信息
  perInfo = {};
  pageSize = pageSize;
  // 权限变量
  permissions = [];
  // 搜索条件数据
  // searchInfo = {
  //   startDate: null,
  //   endDate: null,
  //   province: '',
  //   city: ''
  // };
  page: Boolean = false;
  /*
   总条数:totalRows
   总页数:totalPages
   当前页:currentPage
   提示信息:message
   每页显示的条数pageSize
   排序字段 sort {表头:布尔值}  true:降序.desc  false:升序.asc
   搜索条件 searchData
  */
  pageInfo = {
    totalRows: 0,
    totalPages: 0,
    currentPage: 0,
    message: '',
    pageSize: 10,
    data: {},
    sort: {
      position: null,
    },
    searchData: {
      startDate: null,
      endDate: null,
      province: '',
      city: '',
      position: {},
      datetime: null
    }
  };

  addModalInfo = {};
  addModal: Boolean = false;

  @ViewChild('tableBody') tableBody: ElementRef;
  isSelectAll: Boolean = false;
  @ViewChild('checkAll') checkAllEl: ElementRef;


  constructor(public commonServ: CommonService,
              private demoServ: DemoService,
              private router: Router,) {
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
    this.demoServ.getProvince().subscribe((data) => {
      this.address.province = data;
    });
    this.demoServ.getList().subscribe((data) => {
      this.tableList = data;
      this.tableInitList = data;
      this.goPage(1);
      this.page = true;
    });
    this.demoServ.getAddress().subscribe((data) => {
      this.allAddress = data;
    });

    // this.router.events.subscribe((event) => {
    //     // console.log(event);
    //     if (event instanceof NavigationEnd) {
    //     console.log(event.urlAfterRedirects)
    //          this.getPermissions(event.urlAfterRedirects);
    //     }
    // });

    // console.log(this.pageInfo)
  }

  changePro() {
    // console.log("触发了")
    const pro = this.pageInfo.searchData['province'];
    console.log(pro);
    this.demoServ.getCityByPro(pro).subscribe((data) => {
      this.address.city = data;
    });
  }

  // 提示模态框
  openDefaultDialog(message): void {
    this.commonServ.showBox(message);
  }

  /**
   * 分页函数
   * pno--页数
   **/
  goPage(pno) {
    if (this.page) {
      event.preventDefault();
      if (pno === (this.pageInfo.totalPages + 1)) {
        // this.openDefaultDialog('已经是最后一页了');
        return;
      }
      if (pno === 0) {
        // this.openDefaultDialog('已经是第一页了');
        return;
      }
    }
    const list = this.tableInitList;
    // 表格所有行数(所有记录数)
    this.pageInfo.totalRows = list.length;
    const len = list.length;
    // 每页显示行数
    const pageSize = this.pageSize;
    // 总共分几页
    if (len / pageSize > parseInt((len / pageSize).toString())) {
      this.pageInfo.totalPages = parseInt((len / pageSize).toString()) + 1;
    } else {
      this.pageInfo.totalPages = parseInt((len / pageSize).toString());
    }
    // 当前页数
    this.pageInfo.currentPage = pno;
    // 开始显示的行
    const startRow = (pno - 1) * pageSize;
    // 结束显示的行
    let endRow = pno * pageSize;
    endRow = (endRow > len) ? len : endRow;
    this.tableList = list.slice(startRow, endRow);
  }


  // 普通模态框
  showBox(message) {
    message = '普通提示';
    this.commonServ.showBox(message);
  }

  // 删除按钮事件 及模态框
  showDelBox(message): void {
    message = '测试删除传递数据';
    this.commonServ.showDelBox(message).subscribe((result) => {
      // 模态框 取消确认 处理事件
      // console.log(result);
      // console.log(message);


    });
  }

  // 搜索事件
  searchTablelist() {
    // for(let key in this.searchInfo){
    //     if( this.searchInfo[key]===null){
    //         let message="请填写"+key+"的数据"
    //         this.dialogServ.show(message);
    //         return;
    //     }
    // }
    // console.log(this.pageInfo.searchData['startDate'])
    if (this.pageInfo.searchData['startDate'] !== null) {
      // this.pageInfo.searchData['startDate'] = this.pageInfo.searchData['startDate'].getTime().toString()
    }

    // new Date(this.pageInfo.searchData['startDate']);
    // console.log(this.pageInfo.searchData['startDate'])
    console.log(this.pageInfo);
  }

  // 编辑按钮事件 及模态框
  editeInfo(id, event): void {
    event.stopPropagation();
    // console.log(id)
    let data;
    this.demoServ.getListDataById(id).subscribe((result) => {
      data = result;
    });
    data['title'] = '编辑';
    this.demoServ.show(data).subscribe((rel) => {
      // 模态框 取消确认 处理事件
      // console.log(rel);
      // console.log(data);
      delete data.title;
      if (rel === true) {
        const result = this.demoServ.updata(data);
        // console.log(result);
      }
    });
  }

  // 新增按钮事件 及模态框
  addInfo(): void {
    const message = {};
    message['title'] = '新增';
    this.demoServ.show(message).subscribe((result) => {
      // 模态框 取消确认 处理事件
      // console.log(result);
      // console.log(message);
    });
  }

  // 批量删除事件
  deleteSelectedInfo() {
    const checkboxes = this.tableBody.nativeElement.querySelectorAll('input[type="checkbox"]');
    const selectedList = [];
    checkboxes.forEach((item) => {
      if (item.checked) {
        selectedList.push(item.value);
      }
    });
    if (selectedList.length === 0) {
      this.commonServ.showBox('没有选择要删除的数据');
      return;
    }
    console.log(selectedList);
  }

  // 删除按钮事件 及模态框
  deleteInfo(message, event): void {
    event.stopPropagation();
    this.commonServ.showDelBox(message).subscribe((result) => {
      // 模态框 取消确认 处理事件
      // console.log(result);
      // console.log(message);


    });
  }

  // 添加模态框显示
  // addInfo(): void {
  //   this.addModal = true;
  // }
  // 添加模态框 确认按钮事件
  // onAddSubmit(): void {
  //   this.demoServ.addInfo(this.addModalInfo);
  //   this.addModal = false;
  //
  // }


  onCheckboxAllChanged() {
    const checkboxes = this.tableBody.nativeElement.querySelectorAll('input[type="checkbox"]');
    // console.log(checkboxes);
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
    console.log(event);
    console.log('单个选中');
    const checkboxes = this.tableBody.nativeElement.querySelectorAll('input[type="checkbox"]');
    let temp = true;
    checkboxes.forEach((item) => {
      if (!item.checked) {
        temp = false;
      }
    });
    // console.log(temp);
    if (temp) {
      this.isSelectAll = true;
    } else {
      this.isSelectAll = false;
    }
    const checkAllElem = this.checkAllEl.nativeElement;
    temp ? checkAllElem.checked = true : checkAllElem.checked = false;
    // console.log('checkbox item changed');
  }

  // 排序
  orderBy(orderByInfo) {
    if (this.pageInfo.sort[orderByInfo]) {
      this.pageInfo.sort[orderByInfo] === 'desc' ? this.pageInfo.sort[orderByInfo] = 'asc' : this.pageInfo.sort[orderByInfo] = 'desc';
    } else {
      this.pageInfo.sort = {position: null};
      this.pageInfo.sort[orderByInfo] = 'asc';
    }
    // 在这先写 调用服务发送请求排序
  }

  // 行事件
  rowEvent(position, event) {
    const checkboxes = this.tableBody.nativeElement.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach((item) => {
      if (parseInt(item.value) === position) {
        // console.log("判断成功")
        item.checked ? item.checked = false : item.checked = true;
        this.onCheckboxItemChanged(event);
        return;
      }
    });
    // console.log("行事件触发");
  }

  // 权限设置
  // getPermissions(preinfo, currentUrl) {
  //   this.commonServ.getPermissions(preinfo, currentUrl).subscribe((data) => {
  //     this.permissions = data;
  //     console.log(this.permissions)
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

  detailInfo() {
    // isConfig flase是可编辑
    const message = {};
    message['title'] = '配置详情';
    message['infoList'] = [
      {'id': 1, 'status': 1, 'Threshold': 30, 'thresholdType': 1, 'remarks': '不知道', 'isConfig': true},
      {'id': 2, 'status': 2, 'Threshold': 0, 'thresholdType': 2, 'remarks': '不知道', 'isConfig': true},
      {'id': 3, 'status': 3, 'Threshold': 10, 'thresholdType': 3, 'remarks': '知道', 'isConfig': true}
    ];
    this.demoServ.showDetail(message).subscribe((result) => {
      // 模态框 取消确认 处理事件
      // console.log(result);
      // console.log(message);
      console.log(result);
    });
  }


}
