import {Injectable, Injector} from '@angular/core';
import {HttpRequest, HttpHandler, HttpEvent, HttpInterceptor} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import {CommonService} from './common.service';


@Injectable()
export class InterceptorService implements HttpInterceptor {

  constructor(private injector: Injector) {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    let comService = this.injector.get(CommonService);
    let token = comService.sessionRead('token');
    //  We then need to make sure that we dont add the bearer to any requests to the token service.
    if (token !== null)
      // console.log(token);
      request = request.clone({
      setHeaders: {
        Authorization: `${token}`
      }
    });

    return next.handle(request);
  }

}
