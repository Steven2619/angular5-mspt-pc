import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { Router, NavigationEnd } from '@angular/router';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  btnTip = false;
  first = true;
  username = {};
  constructor(
    private authServ: AuthService,
    private router: Router
  ) { }
  ngOnInit() {
    // console.log(sessionStorage.getItem('username'));
    // this.username = this.authServ.getUserinfo();
    if (this.router['url'] === '/') {
      this.first = true;
    } else {
      this.first = false;
    }
    this.router.events
      .filter(event => event instanceof NavigationEnd)
      .subscribe(e => {
        if (e['url'] === '/') {
          this.first = true;
        } else {
          this.first = false;
        }
      });
  }
  onSidenavClose() {
    this.btnTip = true;
  }
  onSidenavOpened() {
    this.btnTip = false;
  }
}
