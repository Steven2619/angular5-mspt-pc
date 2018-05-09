import { Injectable, HostListener } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map';
import { UserInfo } from '../../models/user-info';

@Injectable()
export class AuthService {
  private resultInfo: UserInfo;
  private userInfoSub: BehaviorSubject<UserInfo> = new BehaviorSubject(null);

  constructor(private http: HttpClient) {
  }

  login(userInfo: { username: String, password: String }): Observable<any> {
    console.log(userInfo)
    this.resultInfo = {
      userName: userInfo.username,
      // roleName: '管理员'
    };
    return Observable.of(this.resultInfo).map((item) => {
      this.userInfoSub.next(this.resultInfo);
      return item;
    });

  }

  getUserinfo(): Observable<UserInfo> {
    return this.userInfoSub;
  }
}
