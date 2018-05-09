import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {cityInfo} from '../../models/city';
//导入访问后台基本路径
import {environment} from '../../../environments/environment';
//导入请求
import {HttpService} from './http.service';

@Injectable()
export class LinkCityService {
  private address = cityInfo;
  //访问后台的基本路径
  private baseUrl = environment.apiBase;

  constructor(private httpServ: HttpService) {
  }

  //判断增加的管井编号是否重复
  queryByWellNo(wellNo): Observable<any> {
    return this.httpServ.post(this.baseUrl + '/terminalWell/queryByWellNo', wellNo);
  }

  //判断修改的管井编号是否重复
  isExistByWellNo(terminalWellInfo): Observable<any> {
    return this.httpServ.post(this.baseUrl + '/terminalWell/isExistByWellNo', terminalWellInfo);
  }

  //获取省份
  getProvince(): Observable<any> {
    let addressData = this.address;
    let len = addressData.length;
    let result = [];
    for (var i = 0; i < len; i++) {
      result.push(addressData[i].name);
    }
    return Observable.of(result)
  }

  getCityByPro(pro): Observable<any> {
    let addressData = this.address;
    let len = addressData.length;
    let result = []
    for (var i = 0; i < len; i++) {
      if (addressData[i].name == pro) {
        addressData[i].childs.forEach((city) => {
            result.push(city.name);
          }
        )
      }
    }
    return Observable.of(result)
  }

  getTownByCity(pro, cityName): Observable<any> {
    let addressData = this.address;
    let len = addressData.length;
    let result = []
    for (var i = 0; i < len; i++) {
      if (addressData[i].name == pro) {
        addressData[i].childs.forEach((city) => {
            if (city.name == cityName) {
              city.childs.forEach((town) => {
                result.push(town.name)
              })
            }
          }
        )
      }
    }
    return Observable.of(result)
  }

  getCountryByTown(pro, cityName, townName): Observable<any> {
    let addressData = this.address;
    let len = addressData.length;
    let result = []
    console.log(pro, cityName, townName)
    for (var i = 0; i < len; i++) {
      if (addressData[i].name == pro) {
        addressData[i].childs.forEach((city) => {
            if (city.name == cityName) {
              city.childs.forEach((town) => {
                if (town.name == townName) {
                  town.childs.forEach((country) => {
                    result.push(country.name)
                  })
                }
              })
            }
          }
        )
      }
    }
    return Observable.of(result)
  }
}
