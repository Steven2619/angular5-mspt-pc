import {Injectable} from '@angular/core';
import {HttpClient, HttpEvent, HttpHeaders, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import {TimeoutError} from 'rxjs/Rx';
import {ModalComponent} from '../../common/modal/modal.component';
import {MatDialog} from '@angular/material';
import { Router, NavigationEnd } from '@angular/router';
@Injectable()
export class HttpService {

  private headers: HttpHeaders;
  private headersFormData: HttpHeaders;
  REQUEST_TIMEOUT: number = 12000;           // 请求超时时间,单位为毫秒

  constructor(public httpClient: HttpClient,
              public dialog: MatDialog,
              private router: Router,
            ) {
    // console.log('Hello HttpService Provider');

    this.headers = new HttpHeaders({'Content-Type': 'application/json; charset=UTF-8'});
    this.headersFormData = new HttpHeaders({'Content-Type': 'application/x-www-form-urlencoded'});

  }

  /**
   * @description postFormData请求
   * @param {string} url
   * @param {any | any} body
   * @param {(data: any) => void} data
   * @param {(error: any) => void} error
   */
  public postToken(url?: string, body?: any | null, data?: (data: any) => void, error?: (error: any) => void): void {
    // console.log(`测试路径${url}`);
    this.httpClient.post(url, null, {
      headers: this.headersFormData,
      params: new HttpParams({fromObject: body})
    }).subscribe(data, error);
  }

  /**
   * @description get请求
   * @param {string} url
   * @param {(data: any) => void} data
   * @param {(error: any) => void} error
   * @return void
   */
  public getToken(url: string, data: (data: any) => void, error: (error: any) => void): void {
    this.httpClient.get(url, {headers: this.headers,}).subscribe(data, error);
  }

  // 核心请求request
  public request(method: string, url: string, options: any): Observable<HttpEvent<any>> {
    return Observable.create(observer => {
      this.httpClient.request(method, url, options).timeout(this.REQUEST_TIMEOUT)
        .subscribe(res => {
          // observer.next(res);
          let result = this.requestSuccess(url, options, res);
          result['success'] ? observer.next(result['data']) : observer.error(result['data']);
        }, err => {
          // 处理请求失败
          observer.error(this.requestFailed(url, options, err));
        });
    });
  }

  /**
   * @description get请求
   * @param {string} url
   * @param {{}} params
   */
  public get(url: string, params: any = null) {
    return this.request('GET', url, {
      headers: this.headers,
      params: new HttpParams({fromObject: params})
    });
  }

  /**
   * @description post请求
   * @param {string} url
   * @param {any | {}} body
   */
  public post(url: string, body: any = {}) {
    return this.request('POST', url, {
      body: body,
      headers: this.headers,
      // params: new HttpParams({fromObject: body})
    });
  }

  public postFormData(url: string, body: any = {}) {
    return this.request('POST', url, {
      body: body,
      headers: this.headersFormData,
      // params: new HttpParams({fromObject: body})
    });
  }


  /**
   * 处理请求成功事件
   */
  private requestSuccess(url: string, options: any, res: any) {

    if (res.status && res.status.code === 0) {
      // console.log('%c 请求成功 %c', 'color:green', '', 'url', url, 'options', options, 'res', res);
      return {success: true, data: res};
    } else {
      // console.log('%c 请求失败 %c', 'color:red', '', 'url', url, 'options', options, 'err', res);
      let msg = ('错误码 : ' + res.status.code + ' ;  错误信息 : ' +  res.status.message );
      if (res.status.code === 305) {
        msg = res.status.message;
      }else if (res.status.code === 308) {
        msg = '当前登录已失效，账号在其他地方被登录....';
      }else if (res.status.code === 307) {
        msg = '当前登录已过期...';
      }
      this.dialog.open(ModalComponent, {
        width: '400px',
        data: msg
      });
      if ( res.status.code === 308 || res.status.code === 307) {
        window.sessionStorage.clear();
        this.dialog.closeAll();
        this.dialog.open(ModalComponent, {
          width: '400px',
          data: msg
        });
        return this.router.navigate(['login']);
      }
      return {success: false, data: res};
    }
  }

  /**
   * 处理请求失败事件
   */
  private requestFailed(url: string, options: any, err: Response) {
    // console.log('---requestFailed---');
    if (err instanceof TimeoutError) {
        this.showBox('请求超时,请稍后再试!');
      // alert('请求超时,请稍后再试!');
      return;
    } else {
      // console.log(err);

      let msg = '请求发生异常';
      let status = err.status;
      if (status === 0) {
        msg = '请求失败，请求响应出错';
      } else if (status === 404) {
        msg = '请求失败，未找到请求地址';
      } else if (status === 500) {
        msg = '请求失败，服务器出错，请稍后再试';
      }
      this.showBox(msg);
      // alert(msg);
    }
    return err;
  }
  /**
   * 弹出提示框
   */
  showBox(message): void {
    const dialogRef = this.dialog.open(ModalComponent, {
      width: '400px',
      data: message
    });

    // dialogRef.afterClosed().subscribe(result => {
    //   console.log('The dialog was closed');
    // });
  }
}
