import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpClient } from '@angular/common/http';
import { Headers, Http } from '@angular/http';
import { environment } from '../../../environments/environment';
import { ModalInfoComponent } from '../../component/demo/modal-info/modal-info.component';
import { DetailsInfoComponent } from '../../component/demo/details-info/details-info.component';
import { MatDialog } from '@angular/material';
import 'rxjs/add/Observable/of';
import 'rxjs/add/operator/toPromise';
@Injectable()
export class DemoService {

  private TerminalInfoList = [{ position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H', status: 1, time: '1543324423123', other: 'heheh' },
  { position: 2, name: 'HeHeliumHeliumHeliumHeliumHeliumHeliumHeliumHeliumHeliumHeliumHeliumHeliumHeliumHeliumHeliumHeliumHeliumHeliumHeliumHeliumHeliumHeliumHeliumHeliumHeliumHeliumHeliumHeliumHeliumHeliumHeliumHeliumlium', weight: 4.0026, symbol: 'He', status: 1, other: 'heheh' },
  { position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li', status: 2, other: 'heheh' },
  { position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be', status: 1, other: 'heheh' },
  { position: 5, name: 'Boron', weight: 10.811, symbol: 'B', status: 2, other: 'heheh' },
  { position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C', status: 0, other: 'heheh' },
  { position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N', status: 1, other: 'heheh' },
  { position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O', status: 2, other: 'heheh' },
  { position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F', status: 4, other: 'heheh' },
  { position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne', status: 3, other: 'heheh' },
  { position: 11, name: 'Hydrogen', weight: 1.0079, symbol: 'H', status: 1, other: 'heheh' },
  { position: 12, name: 'Helium', weight: 4.0026, symbol: 'He', status: 1, other: 'heheh' },
  { position: 13, name: 'Lithium', weight: 6.941, symbol: 'Li', status: 1, other: 'heheh' },
  { position: 14, name: 'Beryllium', weight: 9.0122, symbol: 'Be', status: 1, other: 'heheh' },
  { position: 15, name: 'Boron', weight: 10.811, symbol: 'B', status: 1, other: 'heheh' },
  { position: 16, name: 'Carbon', weight: 12.0107, symbol: 'C', status: 1, other: 'heheh' },
  { position: 17, name: 'Nitrogen', weight: 14.0067, symbol: 'N', status: 1, other: 'heheh' },
  { position: 18, name: 'Oxygen', weight: 15.9994, symbol: 'O', status: 1, other: 'heheh' },
  { position: 19, name: 'Fluorine', weight: 18.9984, symbol: 'F', status: 1, other: 'heheh' },
  { position: 20, name: 'Neon', weight: 20.1797, symbol: 'Ne', status: 1, other: 'heheh' },
  { position: 21, name: 'HeHeliumHeliumHeliumHeliumHeliumHeliumHeliumHeliumHeliumHeliumHeliumHeliumHeliumHeliumHeliumHeliumHeliumHeliumHeliumHeliumHeliumHeliumHeliumHeliumHeliumHeliumHeliumHeliumHeliumHeliumHeliumHeliumlium', weight: 4.0026, symbol: 'He', status: 1, other: 'heheh' },
  { position: 22, name: 'Neon', weight: 20.1797, symbol: 'Ne', status: 1, other: 'heheh' },
  { position: 23, name: 'Hydrogen', weight: 1.0079, symbol: 'H', status: 1, other: 'heheh' },
  { position: 24, name: 'Helium', weight: 4.0026, symbol: 'He', status: 1, other: 'heheh' },
  { position: 25, name: 'Lithium', weight: 6.941, symbol: 'Li', status: 1, other: 'heheh' },
  { position: 26, name: 'Beryllium', weight: 9.0122, symbol: 'Be', status: 1, other: 'heheh' },
  { position: 27, name: 'Boron', weight: 10.811, symbol: 'B', status: 1, other: 'heheh' },
  { position: 28, name: 'Carbon', weight: 12.0107, symbol: 'C', status: 1, other: 'heheh' },
  { position: 29, name: 'Nitrogen', weight: 14.0067, symbol: 'N', status: 1, other: 'heheh' },
  { position: 30, name: 'Oxygen', weight: 15.9994, symbol: 'O', status: 1, other: 'heheh' },
  { position: 31, name: 'Fluorine', weight: 18.9984, symbol: 'F', status: 1, other: 'heheh' },
  { position: 32, name: 'Neon', weight: 20.1797, symbol: 'Ne', status: 1, other: 'heheh' },
  { position: 33, name: 'HeHeliumHeliumHeliumHeliumHeliumHeliumHeliumHeliumHeliumHeliumHeliumHeliumHeliumHeliumHeliumHeliumHeliumHeliumHeliumHeliumHeliumHeliumHeliumHeliumHeliumHeliumHeliumHeliumHeliumHeliumHeliumHeliumlium', weight: 4.0026, symbol: 'He', status: 1, other: 'heheh' },

  ]
  private address = [
    {
      province: '上海', city: ['浦东', '宝山', '徐汇', '松江', '青浦', '长宁', '闵行', '静安', '普陀', '嘉定', '崇明']
    },
    {
      province: '浙江', city: ['杭州', '宁波', '温州', '台州', '金华', '嘉兴', '衢州', '丽水', '舟山', '绍兴', '湖州']
    },
    {
      province: '江苏', city: ['南京', '无锡', '苏州', '徐州', '扬州', '镇江', '昆山', '泰州', '盐城', '南通', '连云港']
    },
    {
      province: '福建', city: ['福州', '厦门', '福鼎', '漳州', '泉州', '莆田', '三明', '宁德', '龙岩', '平潭']
    },
    {
      province: '台湾', city: ['台北', '台中', '台南', '高雄', '新北', '桃园', '基隆', '新竹', '嘉义']
    },
    {
      province: '西藏', city: ['拉萨', '日喀则', '昌都', '林芝', '山南', '那曲', '阿里地区']
    }
  ];
  private allAddress = [
    {
      province: '上海', city: [
        {
          city: '浦东',
          county: ['张江镇', '孙环镇', '三林']
        },
        {
          city: '宝山',
          county: ['一号路', '二号路', '叁号路']
        },
        {
          city: '徐汇',
          county: ['一号路', '二号路', '叁号路']
        }
      ]
    },
    {
      province: '浙江', city: [
        {
          city: '杭州',
          county: ['西湖', '西溪', '古荡']
        },
        {
          city: '温州',
          county: ['鹿城', '乐清', '平阳']
        },
        {
          city: '义乌',
          county: ['青田', '稠州北路', '稠州南路']
        }
      ]
    }
  ]
  private baseUrl = environment.apiBase
  constructor(
    private http: HttpClient,
    // private http: Http,
    public dialog: MatDialog,
  ) { }


  getList(): Observable<any> {
    return Observable.of(this.TerminalInfoList)
  }
  getAddress(): Observable<any> {
    return Observable.of(this.allAddress);
  }
  getProvince(): Observable<any> {
    let addressData = this.address;
    let len = addressData.length;
    let result = [];
    for (var i = 0; i < len; i++) {
      result.push(addressData[i].province);
    }
    return Observable.of(result)
  }
  getCityByPro(Pro): Observable<any> {
    let addressData = this.address;
    let len = addressData.length;
    let result = []
    for (var i = 0; i < len; i++) {
      if (addressData[i].province == Pro) {
        result = addressData[i].city;
      }
    }
    return Observable.of(result)
  }

  show(message): Observable<any> {
    console.log(message)
    const dialogRef = this.dialog.open(ModalInfoComponent, {
      disableClose: true,
      width: '800px',
      // height: '800px',
      data: message
    });
    return dialogRef.afterClosed();
  }
  getListDataById(id): Observable<any> {
    let data;
    for (var i = 0; i < this.TerminalInfoList.length; i++) {
      if (this.TerminalInfoList[i].position == id) {
        data = JSON.parse(JSON.stringify(this.TerminalInfoList[i]));
        return Observable.of(data);
      }
    }
  }
  updata(info): void {
    console.log(info);
    let headers = new Headers({ 'Content-Type': 'application/json' });
    this.http.post(this.baseUrl + '/alarm-info', info, { observe: 'response', responseType: 'json' })
      .subscribe((res) => {
        console.log(res);
      })
  }
  addInfo(info): void {
    console.log("新增后台数据:  ");
    console.log(info)
  }
  getListByPageInfo(pageInfo): Observable<any> {
    console.log(pageInfo)
    return this.http.post(this.baseUrl + '/alarm-info', pageInfo, { observe: 'response', responseType: 'json' })
  }
  //打开详情模态框
  showDetail(message): Observable<any> {
    console.log(message)
    const dialogRef = this.dialog.open(DetailsInfoComponent, {
      disableClose: false,
      width: '1100px',
      // height: '800px',
      data: message
    });
    return dialogRef.afterClosed();
  }
}
