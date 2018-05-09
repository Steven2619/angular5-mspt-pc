import { Component, OnInit } from '@angular/core';
import { AuthService } from '../core/services/auth.service';
import { Router } from '@angular/router';
import { tokenBase } from '../../environments/environment';
import { CommonService } from '../core/services/common.service';
import { HttpService } from '../core/services/http.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  userInfo = {
    client_id: "iot_pc_client",
    client_secret: "iot_secret",
    grant_type: "password",
    scope: "read write",
    username: "",
    password: ""
  };

  isHide: Boolean = true;
  errorMessage: String = '';

  constructor(private authServ: AuthService,
    private comService: CommonService,
    private httpService: HttpService,
    private router: Router) {

  }

  ngOnInit() {

  }
  onLogin(): void {
    if (!this.userInfo.username.trim()) {
      this.errorMessage = '账号不能为空！';
    } else if (!this.userInfo.password.trim()) {
      this.errorMessage = '密码不能为空！';
    } else {
      // 连接服务器，验证用户输入的账号和密码
      // this.authServ.login(this.userInfo).subscribe((result) => {
      //   console.log(result);
      //   if (!result) {
      //     this.errorMessage = '账号或密码错误，请重新输入！';
      //   }else {
      //     this.router.navigate(['']);
      //   }
      // });

      this.httpService.postToken(tokenBase + '/author/accessToken', this.userInfo,
        res => {
          console.log(res);
          if(res.status.code != 0){
            this.errorMessage = '账号或密码错误，请重新输入！';
          }
          if (res.result["access_token"]) {
            this.comService.sessionWrite('username', this.userInfo.username);
            this.comService.sessionWrite('token', res.result["access_token"]);
            this.router.navigate(['']);
          }
        }, err => {
          this.errorMessage = '账号或密码错误，请重新输入！';
        });


    }
  }
  onFocus(): void {
    this.errorMessage = '';
  }

}
