import {Component, OnInit, AfterViewInit, ElementRef, ViewChild, Inject} from '@angular/core';
import {MatTableDataSource, MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import {TerminalEquipmentService} from '../../core/services/terminal-equipment.service';
//分页查询
import {PageInfo, pageSize} from '../../models/page-info';
import {TerminalEquipment} from '../../models/terminal-equipment';
//删除提示框
import {CommonService} from '../../core/services/common.service';
import {Observable} from 'rxjs/Observable';
import {EquipmentMessageService} from '../../core/services/equipment-message.service';
import {Router, NavigationEnd} from '@angular/router';

@Component({
  selector: 'app-terminal-equipment',
  templateUrl: './terminal-equipment.component.html',
  styleUrls: ['./terminal-equipment.component.scss']
})
export class TerminalEquipmentComponent implements OnInit {
  public tableList = [];
  public tableInitList = [];
  public menuTitle = null;
  // 根据toke获取的权限信息
  public perInfo = {};
  // 权限变量
  public permissions = [];
  // 查询条件的实体
  terminalEquipment: TerminalEquipment = {
    equipmentNo: null,
    equipmentAlias: null,
    equipmentType: null,
    createTime: null,
    alarmLevel: null,
    equipmentNoOrName: null,
    adminStatus: null
  };
  // 设备类型集合
  public tequipmentTypeList = [];
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
    searchData: this.terminalEquipment
  };
  messageInfo = {
    totalRows: 0,
    totalPages: 0,
    currentPage: 0,
    message: '',
    pageSize: pageSize,
    data: [],
    sort: {},
    searchData: {
      equipmentNo: null
    }
  };
  // 声明全选，不选，反选用的变量
  // 定义有多选的table表的body
  @ViewChild('tableBody') tableBody: ElementRef;
  // 默认多选框时不选中的状态
  public isSelectAll: Boolean = false;
  // 定义多选框的ID： #checkAll
  @ViewChild('checkAll') checkAllEl: ElementRef;

  constructor(public terminalEquipmentService: TerminalEquipmentService,
              public commonServ: CommonService,
              public router: Router,
              public equipmentMessageServ: EquipmentMessageService) {
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
    // 获取设备类型
    this.terminalEquipmentService.getEquipmentType().subscribe((data) => {
      this.tequipmentTypeList = data.result;
    });
    // 分页查询
    this.terminalEquipmentService.getAllTerminalInfos(this.pageInfo).subscribe((data) => {
      console.log('分页查询的结果是：', data);
      this.tableList = data.result.data;
      this.tableInitList = data.result.data;
      this.pageInfo.totalRows = data.result.totalRows;
      this.pageInfo.currentPage = data.result.currentPage;
      this.pageInfo.pageSize = data.result.pageSize;
      this.pageInfo.totalPages = data.result.totalPages;
      this.pageInfo.message = data.result.message;
      this.pageInfo.sort = data.result.sort;
      console.log(this.tableList);
      this.page = true;
    });

  }

  // 查询
  searchTablelist() {
    if (this.pageInfo.searchData['createTime'] === Date) {
      this.pageInfo.searchData['createTime'] = this.pageInfo.searchData['createTime'].getTime().toString();
    }
    this.pageInfo = {
      totalRows: 0,
      totalPages: 0,
      currentPage: 0,
      message: '',
      pageSize: pageSize,
      data: [],
      sort: {},
      searchData: this.terminalEquipment
    };
    this.ngOnInit();
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

  // 批量删除
  deleteSelectedInfo(): void {
    const chooses = [];
    const checkboxes = this.tableBody.nativeElement.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach((item) => {
      if (item.checked) {
        chooses.push(item.defaultValue);
      }

    });
    if (chooses.length === 0) {
      this.commonServ.showBox('没有选择要删除的数据');
      return;
    }
    this.commonServ.showDelBox(chooses).subscribe((data) => {
      if (data == true) {
        this.terminalEquipmentService.deleteBatch(chooses).subscribe((result) => {
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
  deleteInfo(equipmentNo, event): void {
    event.stopPropagation();
    console.log('要删除的设备编号是', equipmentNo);
    this.commonServ.showDelBox(equipmentNo).subscribe((data) => {
      if (data == true) {
        this.terminalEquipmentService.delete(equipmentNo).subscribe((result) => {
          if (result.status.code == true) {
            this.commonServ.showBox('删除成功！');
            this.ngOnInit();
          } else {
            this.commonServ.showBox('删除失败！');
          }
        });
      }


    });
  }

  // 增加设备信息
  addInfo(): void {
    let data;
    data = {
      title: '新增设备',
      typeList: this.tequipmentTypeList
    };
    this.terminalEquipmentService.show(data).subscribe((rel) => {
      // 提交时对象中删除标题
      if (rel == true) {
        delete data.title;
        this.terminalEquipmentService.save(data).subscribe((result) => {
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
    this.terminalEquipmentService.getListDataById(erminalEquipmentInfo).subscribe((result) => {
      data = result.result;
      data['title'] = '编辑设备';
      data['typeList'] = this.tequipmentTypeList;
      data['equipmentType'] = result.result.equipmentType;
      this.terminalEquipmentService.show(data).subscribe((rel) => {
        delete data.title;
        if (rel == true) {
          this.terminalEquipmentService.update(data).subscribe((result) => {
            if (result.status.code == 0) {
              this.commonServ.showBox('修改成功！');
              this.ngOnInit();
              console.log('添加后的结果是：', result);
            } else {
              this.commonServ.showBox('修改失败！');
            }
          });
        }

      });
    });

  }

  // 查看配置信息
  configInfo(equipmentNo, event) {
    // 阻止冒泡事件
    event.stopPropagation();
    // isConfig flase是可编辑
    const message = {};
    message['infoList'] = [
      {'equipmentNo': equipmentNo, 'configFlag': 2, 'configValue': null, 'configType': 1, 'remark': '', 'isConfig': true, id: null},
      {'equipmentNo': equipmentNo, 'configFlag': 2, 'configValue': null, 'configType': 2, 'remark': '', 'isConfig': true, id: null},
      {'equipmentNo': equipmentNo, 'configFlag': 2, 'configValue': null, 'configType': 3, 'remark': '', 'isConfig': true, id: null}
      /*
      { 'equipmentNo': equipmentNo, 'configFlag': 2, 'configValue': null, 'configType': 4, 'remark': '', 'isConfig': true, id: null },
      { 'equipmentNo': equipmentNo, 'configFlag': 2, 'configValue': null, 'configType': 7, 'remark': '', 'isConfig': true, id: null },
      { 'equipmentNo': equipmentNo, 'configFlag': 2, 'configValue': null, 'configType': 9, 'remark': '', 'isConfig': true, id: null }
      */
    ];
    this.terminalEquipmentService.findByequipmentNo(equipmentNo).subscribe((result) => {
      if (result.result != null) {
        const size = result.result.length;
        for (let i = 0; i < size; i++) {
          const type = result.result[i].configType;
          const id = result.result[i].id;
          for (let j = 0; j < 3; j++) {
            if (message['infoList'][j].configType == type) {
              // result.result[i].isConfig = true;
              message['infoList'][j] = result.result[i];
            }
            if (message['infoList'][j].id == id) {
              result.result[i].isConfig = true;
            }
          }
        }
      }
    });
    message['title'] = '配置详情 设备编号：' + equipmentNo;
    this.terminalEquipmentService.showConfig(message).subscribe((result) => {

    });
  }


  // 查看终端详情
  equipmentDetail(equipmentNo, event) {
    // 阻止冒泡事件
    event.stopPropagation();
    let data;
    // 通过告警编号获取告警信息
    this.terminalEquipmentService.getListDataById(equipmentNo).subscribe((result) => {
      data = result.result;
      data['title'] = '设备信息详情';
      const equipmentMessageDate = data.equipmentMessageRecord;
      if (null != equipmentMessageDate) {
        data['time'] = equipmentMessageDate.time;
        const bodyModel = equipmentMessageDate.bodyModel;
        bodyModel.forEach((item) => {
          if (item.key === 'voltage') {
            data['voltage'] = item.value;
          }
          if (item.key === 'angle') {
            data['angle'] = item.value;
          }
        });
      }
      console.log(data);
      this.terminalEquipmentService.showEquipmentDetailModal(data).subscribe((rel) => {
        delete data.title;
        console.log(rel);
      });
    });
  }


  // 提示模态框
  openDefaultDialog(message): void {
    this.commonServ.showBox(message);
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

      // event.preventDefault();
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
    this.terminalEquipmentService.getAllTerminalInfos(this.pageInfo).subscribe((data) => {
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


  orderBy(orderByInfo) {

    if (this.pageInfo.sort[orderByInfo]) {
      this.pageInfo.sort[orderByInfo] === 'desc' ? this.pageInfo.sort[orderByInfo] = 'asc' : this.pageInfo.sort[orderByInfo] = 'desc';

    } else {
      this.pageInfo.sort = {};
      this.pageInfo.sort[orderByInfo] = 'asc';
    }
    console.log('排序===》', this.pageInfo.sort);
    this.terminalEquipmentService.getAllTerminalInfos(this.pageInfo).subscribe((data) => {
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

  // 修改配置操作
  confimUpateConfig(terminalEquipmentConfigInfo) {
    this.terminalEquipmentService.updateEquimentConfig(terminalEquipmentConfigInfo).subscribe((result) => {
      if (result.status.code == 0) {
        this.commonServ.showBox('配置成功！');
        this.ngOnInit();
        console.log('配置后的结果是：', result);
      } else {
        this.commonServ.showBox('配置失败！');
      }

    });
  }

  // 修改终端配置确认提示
  updateEquimentConfig(equipmentNo, configType) {
    const terminalEquipmentConfigInfo = {equipmentNo: equipmentNo, configType: configType};
    console.log('对象===>', terminalEquipmentConfigInfo);
    // 校准角度
    if (configType == 0) {
      this.terminalEquipmentService.showModel('确定要校准角度吗?').subscribe((data) => {
        if (data == true) {
          this.confimUpateConfig(terminalEquipmentConfigInfo);
        }
      });
    }
    if (configType == 5) {
      this.terminalEquipmentService.showModel('确定要重启吗?').subscribe((data) => {
        if (data == true) {
          this.confimUpateConfig(terminalEquipmentConfigInfo);
        }
      });
    }
    if (configType == 6) {
      // debugger;
      this.terminalEquipmentService.showModel('确定要获取版本吗?').subscribe((data) => {
        if (data == true) {
          this.confimUpateConfig(terminalEquipmentConfigInfo);
        }
      });
    }
  }


  hasPermission(val): boolean {
    for (let i = 0; i < this.permissions.length; i++) {
      if (this.permissions[i] === val) {
        return true;
      }
    }
    return false;
  }

  // 查看设备信息日志
  detailInfo(equipmentNo, event) {
    this.messageInfo = {
      totalRows: 0,
      totalPages: 0,
      currentPage: 0,
      message: '',
      pageSize: pageSize,
      data: [],
      sort: {},
      searchData: {
        equipmentNo: null
      }
    };
    console.log('设备ID', equipmentNo);
    console.log('messageInfo', this.messageInfo);
    this.messageInfo.searchData['equipmentNo'] = equipmentNo;

    this.equipmentMessageServ.getMessageByEquipmentNo(this.messageInfo).subscribe((data) => {
      console.log('根据设备ID获取到的日志:', data.result);
      this.messageInfo = data.result;
      if (this.messageInfo.totalPages === 0) {
        this.openDefaultDialog('暂无数据');
        return;
      }
      this.messageInfo['title'] = '终端消息 (' + equipmentNo + ')';
      this.terminalEquipmentService.showMessage(this.messageInfo);
    });
  }
}
