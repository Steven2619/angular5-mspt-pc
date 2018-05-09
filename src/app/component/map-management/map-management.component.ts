import {Component, OnInit} from '@angular/core';
import {MapManageService} from "../../core/services/map-manage.service";
import {CommonService} from "../../core/services/common.service";
import {ModifyInfoComponent} from "./modify-info/modify-info.component";
import {AddWellComponent} from "./add-well/add-well.component";
import {CreateWorkOrderComponent} from "./create-work-order/create-work-order.component";
import {ConfigInfoComponent} from "./config-info/config-info.component";
import {Router} from "@angular/router";

@Component({
  selector: 'app-map-management',
  templateUrl: './map-management.component.html',
  styleUrls: ['./map-management.component.scss']
})
export class MapManagementComponent implements OnInit {

  gtMap: any;
  menuTitle = '地图搜索';
  positionPicker: any;
  isPosition: boolean = false;   // 是否开始修正管井位置
  markerLocation: any;             //修正管井marker
  normalData: any = [];                       //正常设备
  alarmData: any = [];                       // 告警设备
  maintData: any = [];                       // 维护设备
  unInstallData: any = [];                   // 未注册安装的管井
  noLocationWellData: any = [];              // 无坐标的管井
  DeviceData: any = [];                       // 所有安装管井的设备
  isFilterUnInstall: boolean = false;
  isFilterAlarm: boolean = false;
  isFilterMaint: boolean = false;
  isFilterNormal: boolean = false;
  normalNum: number = 0;
  alarmNum: number = 0;
  maintNum: number = 0;
  unInstallNum: number = 0;
  searchData: any = {
    city: '',
    wellNo: '',
    equipmentNo: '',
    address: ''
  };
  wellsMarker: Array<any> = [];
  cluster: any;                          //点聚合对象
  positionResult: any = {
    wellNo: null,
    longitude: null,
    latitude: null,
    province: null,
    city: null,
    town: null,
    country: null,
    address: null,
  };
  resultMapData: any = [];
  // 根据toke获取的权限信息
  public perInfo = {};
  // 权限变量
  public permissions = [];

  constructor(private mapService: MapManageService,
              public router: Router,
              private comService: CommonService) {


  }

  // 根据权限码判断是否有权限
  hasPermission(permissionCode): boolean {
    for (let i = 0; i < this.permissions.length; i++) {
      if (this.permissions[i] === permissionCode) {
        return true;
      }
    }
    return false;
  }

  ngOnInit() {
    this.loadMap();
    this.comService.getNavList().subscribe((data) => {
      // console.log(data);
      this.perInfo = data.result.sysMenus;
      this.permissions = data.result.userSysPermCodes;
      for (let k in this.perInfo) {
        const list = this.perInfo[k]['childData'];
        for (let i = 0; i < list.length; i++) {
          if (list[i]['href'] === this.router.url) {
            this.menuTitle = list[i]['title'];
          }
        }
      }
      this.addMapRightClickMenu();
      this.initWellsData();
    });
  }

  //加载地图
  loadMap() {
    try {
      this.gtMap = new AMap.Map('map-container', {
        resizeEnable: true,
        zoom: 11,
        // center: [116.397428, 39.90923]
      });
      this.gtMap.on('complete', () => {
        AMap.plugin(['AMap.ToolBar', 'AMap.Scale', 'AMap.OverView'], () => {
          this.gtMap.addControl(new AMap.ToolBar({
            position: 'RT'
          }));
          this.gtMap.addControl(new AMap.Scale());
        });
      });
      AMap.event.addListener(this.gtMap, 'zoomend', () => {
        this.gtMap.clearInfoWindow();
      });
    } catch (err) {
      console.log(err);
      this.comService.showBox("地图加载失败,请检查网络或稍后再试")
    }
  }

  // 添加地图的右键菜单
  addMapRightClickMenu(): void {
    // 创建右键菜单
    const contextMenu = new AMap.ContextMenu();
    let contextMenuPosition;

    // 右键添加管井
    let permCode = this.hasPermission('terminal-well:add');
    if (permCode) {
      contextMenu.addItem('在此添加管井', (e) => {
        if (this.isPosition) {
          this.comService.showBox('正在进行修正管井位置的操作');
          return;
        }
        this.mapService.showModel(AddWellComponent, contextMenuPosition).subscribe(isAdd => {
          if (isAdd) {
            this.gtMap.clearInfoWindow();
            this.searchMapData();
          }
        });
      }, 0);
    }
    if (this.hasPermission('operationwork-order:add')) {
      contextMenu.addItem('在此安装设备', (e) => {
        if (this.isPosition) {
          this.comService.showBox('正在进行修正管井位置的操作');
          return;
        }
        let params = {
          orderType: '1', //新装工单
          position: contextMenuPosition
        };
        this.mapService.showModel(CreateWorkOrderComponent, params).subscribe(isCreate => {
          if (isCreate) {
            this.gtMap.clearInfoWindow();
            this.searchMapData();
          }
        });
      }, 1);
    }

    // 地图绑定鼠标右击事件——弹出右键菜单
    this.gtMap.on('rightclick', (e) => {
      contextMenu.open(this.gtMap, e.lnglat);
      contextMenuPosition = e.lnglat;
    });
  }

  // 初始化地图管井分布
  initWellsData() {
    this.resultMapData = [];
    this.mapService.listMapInfos(this.searchData).subscribe(res => {
      if (res.status.code == 0) {
        console.log(res.result);
        this.resultMapData = res.result;
        this.getWellCategory();
        this.showClassifyDevice();
      }
    });
  }

  // 得到管井的类别
  getWellCategory() {
    this.DeviceData = [];
    this.normalData = [];
    this.alarmData = [];
    this.maintData = [];
    this.unInstallData = [];
    this.noLocationWellData = [];
    for (let i = 0, len = this.resultMapData.length; i < len; i++) {
      let well = this.resultMapData[i];
      //判断是否有坐标，如果有，则是已经安装的管井或者安装过的管井，如果没有，则是从未安装过的管井
      if (well.longitude != null && well.latitude != null) {
        this.DeviceData.push(well);
        //判断管井的安装状态值，如果2，则是已安装的管井，如果不等于2，则是有坐标还未安装的管井
        if (well.wellInstallStatus == '2') {
          if (well.adminStatus != null && well.operStatus != null) {
            let status = String(well.adminStatus) + String(well.operStatus);
            if (status == '11' || status == '21') {
              well.imgUrl = "alarm.png";
              this.alarmData.push(well);
            }
            if (status == '30' || status == '31') {
              well.imgUrl = "maint.png";
              this.maintData.push(well);
            }
            if (status == '10' || status == '20') {
              well.imgUrl = "normal.png";
              this.normalData.push(well);
            }
            well.status = status;
          } else {
            well.imgUrl = "uninstall.png";
            this.unInstallData.push(well)
          }
        } else {
          well.imgUrl = "uninstall.png";
          this.unInstallData.push(well)
        }
      } else {
        this.noLocationWellData.push(well);
      }
    }
    // console.log(this.DeviceData);
    // console.log(this.normalData);
    // console.log(this.alarmData);
    // console.log(this.maintData);
    // console.log(this.unInstallData);
    // console.log(this.wellsMarker);
    this.normalNum = this.normalData.length;
    this.alarmNum = this.alarmData.length;
    this.maintNum = this.maintData.length;
    this.unInstallNum = this.unInstallData.length;

  }

  // 创建一个Marker
  createMarker(wellObj) {
    let marker = new AMap.Marker({
      map: this.gtMap,
      position: [Number(wellObj.longitude), Number(wellObj.latitude)],
      offset: new AMap.Pixel(-10, -15),
      icon: new AMap.Icon({
        size: new AMap.Size(26, 26),  //图标大小
        image: 'assets/images/' + wellObj.imgUrl,
        imageOffset: new AMap.Pixel(0, 0)
      })
    });
    let infoWindow = this.addInfoWindow(wellObj);
    marker.on('click', () => {
      infoWindow.open(this.gtMap, marker.getPosition());
    });
    //添加marker的右键菜单
    this.addMarkerRightClickMenu(marker, wellObj);
    return marker;
  }

  //添加Marker点聚合
  addMarkerCluster() {
    let sts = [
      {
        url: "http://a.amap.com/jsapi_demos/static/images/blue.png",
        size: new AMap.Size(32, 32),
        offset: new AMap.Pixel(-16, -16),

      }, {
        url: "http://a.amap.com/jsapi_demos/static/images/green.png",
        size: new AMap.Size(32, 32),
        offset: new AMap.Pixel(-16, -16),
        textColor: '#CC0066'
      }, {
        url: "http://a.amap.com/jsapi_demos/static/images/orange.png",
        size: new AMap.Size(36, 36),
        offset: new AMap.Pixel(-18, -18)
      }, {
        url: "http://a.amap.com/jsapi_demos/static/images/red.png",
        size: new AMap.Size(48, 48),
        offset: new AMap.Pixel(-24, -24)
      }, {
        url: "http://a.amap.com/jsapi_demos/static/images/darkRed.png",
        size: new AMap.Size(48, 48),
        offset: new AMap.Pixel(-24, -24)
      }];
    AMap.plugin(["AMap.MarkerClusterer"], () => {
      this.cluster = new AMap.MarkerClusterer(this.gtMap, this.wellsMarker, {styles: sts, gridSize: 80});
      console.log(this.cluster);
    });
  }

  //添加自定义信息窗体
  addInfoWindow(wellObj) {
    wellObj = this.isNullToNoValue(wellObj);

    //实例化信息窗体
    let title = '管井设备信息', content, contentWell, contentEquipment, foot;
    contentWell = `<p>管井编号：${wellObj.wellNo}</p>
               <p>管井名称：${wellObj.wellAlias}</p>
               <p>管井类型：${wellObj.wellTypeName}</p>
               <p>管井状态：${wellObj.wellInstallStatusName}</p>`;
    contentEquipment = `<p ">设备编号：${wellObj.equipmentNo}</p>
               <p >设备名称：${wellObj.equipmentAlias}</p>
               <p >设备类型：${wellObj.equipmentTypeName}</p>
               <p >设备状态：${wellObj.adminStatusName}</p>`;
    foot = `<p>详细地址：${wellObj.address}</p>
               <p>描述：${wellObj.remark}</p>
              `;
    if (wellObj.equipmentNo != null && wellObj.equipmentNo != "") {
      content = contentWell + contentEquipment + foot;
    } else {
      content = contentWell + foot;
    }

    return new AMap.InfoWindow({
      isCustom: true,  //使用自定义窗体
      content: this.createInfoWindow(title, content, wellObj),
      offset: new AMap.Pixel(16, -24)
    });
  }

  //构建自定义信息窗体
  createInfoWindow(title, content, wellObj) {
    let wellPermCode = this.hasPermission('terminal-well:update');
    let equipmentPermCode = this.hasPermission('terminal-equipment:update');
    let info = document.createElement("div");
    info.className = "info";
    //可以通过下面的方式修改自定义窗体的宽高
    info.style.width = "280px";
    // 定义顶部标题
    let top = document.createElement("div");
    let titleD = document.createElement("div");
    let closeX = document.createElement("img");
    top.className = "info-top";
    titleD.innerHTML = title;
    closeX.src = "http://webapi.amap.com/images/close2.gif";
    closeX.onclick = () => {
      this.gtMap.clearInfoWindow();//关闭信息窗体
    };
    top.appendChild(titleD);
    top.appendChild(closeX);
    info.appendChild(top);

    // 定义中部内容
    let middle = document.createElement("div");
    middle.className = "info-middle";
    middle.style.backgroundColor = 'white';
    middle.style.maxHeight = "400px";
    middle.style.overflowY = "auto";
    middle.innerHTML = content;
    let btns = document.createElement("div");
    btns.className = "map-info";
    let btn1 = document.createElement("button");
    btn1.innerHTML = '删除';
    btn1.onclick = () => {
      if (this.isPosition) {
        this.comService.showBox('正在进行修正管井位置的操作');
        return;
      }
      this.mapService.showDelete(wellObj.wellNo).subscribe(isDelete => {
        if (isDelete) {
          this.mapService.deleteWell(wellObj.wellId).subscribe(res => {
            if (res.status.code == 0) {
              this.comService.showBox('删除成功');
              this.gtMap.clearInfoWindow();
              this.searchMapData();
            } else {
              this.comService.showBox('删除失败');
            }
          })
        }
      })
    };


    let btn2 = document.createElement("button");
    btn2.innerHTML = '修改';
    btn2.onclick = () => {
      if (this.isPosition) {
        this.comService.showBox('正在进行修正管井位置的操作');
        return;
      }
      wellObj.wellPermCode = wellPermCode;
      wellObj.equipmentPermCode = equipmentPermCode;
      this.mapService.showModel(ModifyInfoComponent, wellObj).subscribe(isEdit => {
        if (isEdit) {
          this.searchMapData();
          this.gtMap.clearInfoWindow();
        }
      });
    };
    if (wellObj.wellInstallStatus != 2 && this.hasPermission('terminal-well:delete')) {
      btns.appendChild(btn1);
    }

    if (wellPermCode || equipmentPermCode) {
      console.log('12--------------------------')
      btns.appendChild(btn2);
    }

    middle.appendChild(btns);
    info.appendChild(middle);

    // 定义底部内容
    let bottom = document.createElement("div");
    bottom.className = "info-bottom";
    bottom.style.position = 'relative';
    bottom.style.top = '0px';
    bottom.style.margin = '0 auto';
    let sharp = document.createElement("img");
    sharp.src = "http://webapi.amap.com/images/sharp.png";
    bottom.appendChild(sharp);
    info.appendChild(bottom);
    return info;
  }

  //添加marker的右键菜单
  addMarkerRightClickMenu(marker, wellObj) {
    let MarkerMenu = new AMap.ContextMenu();  //创建Marker的右键菜单
    //修正位置
    MarkerMenu.addItem("修正管井位置", () => {
      this.gtMap.clearInfoWindow();
      if (this.isPosition) {
        this.comService.showBox('正在进行修正管井位置的操作');
        return;
      }
      this.markerLocation = new AMap.Marker({
        map: this.gtMap,
        position: marker.getPosition(),
        offset: new AMap.Pixel(-28, -33),
        zIndex: 50,
        icon: new AMap.Icon({
          size: new AMap.Size(64, 64),  //图标大小
          image: 'assets/images/location.png',
          imageOffset: new AMap.Pixel(0, 0)
        })
      });

      this.dragMarker(marker.getPosition(), wellObj.wellNo);
    }, 0);
    //设备配置下发
    if (wellObj.equipmentNo != null && wellObj.equipmentNo.trim() != "") {
      if (this.hasPermission('equipment-config:query')) {
        MarkerMenu.addItem("设备配置下发", () => {
          if (this.isPosition) {
            this.comService.showBox('正在进行修正管井位置的操作');
            return;
          }
          this.setDeviceConfig(wellObj);

        }, 1);
      }
      if (this.hasPermission('equipment-config:update')) {
        MarkerMenu.addItem("设备校准角度", () => {
          if (this.isPosition) {
            this.comService.showBox('正在进行修正管井位置的操作');
            return;
          }
          if (wellObj.angleFlag == 0 || wellObj.angleFlag == 2) {
            this.comService.showCommonBox('校准角度').subscribe((isConfirm) => {
              if (isConfirm) {
                let equipmentConfigInfo = {
                  equipmentNo: wellObj.equipmentNo,
                  configType: 0
                };
                this.confirmUpdateConfig(equipmentConfigInfo);
              }
            });
          } else if (wellObj.angleFlag == 1) {
            this.comService.showBox('角度校准中')
          }

        }, 2);
        MarkerMenu.addItem("设备终端重启", () => {
          if (this.isPosition) {
            this.comService.showBox('正在进行修正管井位置的操作');
            return;
          }
          if (wellObj.resetFlag == 0 || wellObj.resetFlag == 2) {
            this.comService.showCommonBox('终端重启').subscribe((isConfirm) => {
              if (isConfirm) {
                let equipmentConfigInfo = {
                  equipmentNo: wellObj.equipmentNo,
                  configType: 5
                };
                this.confirmUpdateConfig(equipmentConfigInfo);
              }
            });
          } else if (wellObj.resetFlag == 1) {
            this.comService.showBox('终端重启中')
          }
        }, 3);
      }

    }
    //生成维修工单
    if (wellObj.imgUrl == 'alarm.png' && this.hasPermission('operationwork-order:saveAlarm')) {
      MarkerMenu.addItem("生成维修工单", () => {
        if (this.isPosition) {
          this.comService.showBox('正在进行修正管井位置的操作');
          return;
        }
        let params = {
          orderType: '2',
          equipmentNo: wellObj.equipmentNo
        };
        this.mapService.showModel(CreateWorkOrderComponent, params).subscribe(isCreate => {
          if (isCreate) {
            this.gtMap.clearInfoWindow();
          }
        });
      }, 4);
    }

    marker.on('rightclick', (e) => {
      MarkerMenu.open(this.gtMap, e.lnglat);
    });
  }

  //设备配置下发操作
  setDeviceConfig(wellObj) {
    // 获取设备配置信息
    this.mapService.findByEquipmentNo(wellObj.equipmentNo).subscribe(res => {
      if (res.status.code == 0) {
        let configObj = {
          title: '配置下发详情 设备编号：' + wellObj.equipmentNo,
          infoList: res.result
        };
        console.log(configObj);
        this.mapService.showModel(ConfigInfoComponent, configObj);
      }
    })
  }

  //查询事件
  searchMapData() {
    console.log(this.searchData);
    this.cluster.clearMarkers();
    this.gtMap.clearInfoWindow();
    this.initWellsData();
  }


  //拖拽Marker选定地址
  dragMarker(startPosition: any, wellNo: string) {
    AMapUI.loadUI(['misc/PositionPicker'], (PositionPicker) => {
      this.positionPicker = new PositionPicker({
        mode: 'dragMarker',  //设定为拖拽地图模式，可选值'dragMap','dragMarker'
        map: this.gtMap,    //依赖地图对象
        iconStyle: {//自定义外观
          url: 'assets/images/current.png',//图片地址
          size: [48, 48],  //要显示的点大小，将缩放图片
          ancher: [20, 46],//锚点的位置，即被size缩放之后，图片的什么位置作为选中的位置
        }
      });

      this.positionPicker.start(startPosition);

      this.positionPicker.on('success', (positionResult) => {
        console.log(positionResult);
        let addressObj = positionResult.regeocode.addressComponent;
        this.positionResult = {
          wellNo: wellNo,
          longitude: positionResult.position.getLng(),
          latitude: positionResult.position.getLat(),
          province: addressObj.province,
          city: addressObj.city,
          town: addressObj.district,
          country: addressObj.township,
          address: addressObj.street + addressObj.streetNumber
        };
      });
      this.isPosition = true;
      this.positionPicker.on('fail', (positionResult) => {
        console.log(`拖拽标点结果=${positionResult}`);
      })
    })
  }


  // 确认修改配置操作
  confirmUpdateConfig(equipmentConfigInfo) {
    this.mapService.updateEquipmentConfig(equipmentConfigInfo).subscribe((result) => {
      if (result.status.code == 0) {
        this.comService.showBox('配置成功！');
        this.searchMapData();
      } else {
        this.comService.showBox('配置失败！');
      }

    });
  }

  showClassifyDevice(statusParams?: string) {
    this.gtMap.clearInfoWindow();
    this.wellsMarker = [];
    let currentData;
    // console.log(statusParams);
    if (statusParams) {
      this.cluster.clearMarkers();
      currentData = this.statusGetData(statusParams);
    } else {
      currentData = this.DeviceData;
      this.isFilterAlarm = false;
      this.isFilterMaint = false;
      this.isFilterNormal = false;
      this.isFilterUnInstall = false;
    }
    console.log(currentData);
    for (let i = 0, len = currentData.length; i < len; i++) {
      let wellInfo = currentData[i];
      let wellMarker = this.createMarker(wellInfo);
      this.gtMap.setFitView();
      this.wellsMarker.push(wellMarker);
    }
    this.addMarkerCluster();   //marker添加聚合效果
  }

  // 根据设备状态获取地图展示当前数据
  private statusGetData(status) {
    let currentData;
    switch (status) {
      case "4":     // 告警设备
        currentData = !this.isFilterAlarm ? this.alarmData : this.DeviceData;
        this.isFilterAlarm = !this.isFilterAlarm;
        this.isFilterMaint = false;
        this.isFilterUnInstall = false;
        this.isFilterNormal = false;
        console.log(currentData);
        break;
      case "3":      //维护设备
        currentData = !this.isFilterMaint ? this.maintData : this.DeviceData;
        this.isFilterMaint = !this.isFilterMaint;
        this.isFilterAlarm = false;
        this.isFilterUnInstall = false;
        this.isFilterNormal = false;

        break;
      case "1":      //未安装管井
        currentData = !this.isFilterUnInstall ? this.unInstallData : this.DeviceData;
        this.isFilterUnInstall = !this.isFilterUnInstall;
        this.isFilterAlarm = false;
        this.isFilterMaint = false;
        this.isFilterNormal = false;
        break;
      case "2":      //正常设备
        currentData = !this.isFilterNormal ? this.normalData : this.DeviceData;
        this.isFilterNormal = !this.isFilterNormal;
        this.isFilterAlarm = false;
        this.isFilterMaint = false;
        this.isFilterUnInstall = false;
        break;
      default:      //所有设备
        currentData = this.DeviceData;
        this.isFilterUnInstall = false;
        this.isFilterAlarm = false;
        this.isFilterMaint = false;
        this.isFilterNormal = false;
    }
    return currentData;
  }

  // 确定校正的位置
  locationSubmit(siteInfo) {
    this.closeLocation();
    //修改管井位置
    this.mapService.editWellSite(siteInfo).subscribe(res => {
      if (res.status.code == 0) {
        this.comService.showBox('管井位置修正成功');
        this.searchMapData();
      } else {
        this.comService.showBox('管井位置修正失败');
      }
    })
  }

  // 取消位置校正
  closeLocation() {
    this.isPosition = false;
    this.positionPicker.stop();
    this.markerLocation.setMap(null);
  }

  //验证字段的值是否为null，如果是则将null替换成空字符串
  isNullToNoValue(wellObj) {
    let wellKey = Object.keys(wellObj);
    for (let i = 0, len = wellKey.length; i < len; i++) {
      if (wellObj[wellKey[i]] == null || wellObj[wellKey[i]] == undefined) {
        wellObj[wellKey[i]] = "";
      } else {
        switch (wellKey[i]) {
          case 'wellInstallStatus':
            wellObj.wellInstallStatusName = this.mapService.transformInstallStatus(wellObj.wellInstallStatus);
            break;
          case 'wellType':
            wellObj.wellTypeName = this.mapService.transformWellType(wellObj.wellType);
            break;
          case 'equipmentType':
            wellObj.equipmentTypeName = this.mapService.transformEquipmentType(wellObj.equipmentType);
            break;
          case 'adminStatus':
            wellObj.adminStatusName = this.mapService.transformAdminStatus(wellObj.adminStatus);
            break;
        }
      }
    }
    return wellObj;
  }
}
