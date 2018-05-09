import {Injectable} from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs/Observable';
import {Router} from '@angular/router';
import {CommonService} from '../services/common.service';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private router: Router,
              private comService: CommonService) {

  }


  canActivate(next: ActivatedRouteSnapshot,
              state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    if (this.comService.sessionRead('token')) {
      return true;
    } else {
      this.router.navigate(['/login']);
      return false;
    }
  }
}
