import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { CommonService } from '../../core/services/common.service';
import 'rxjs/add/operator/map';
@Component({
  selector: 'app-leftside',
  templateUrl: './leftside.component.html',
  styleUrls: ['./leftside.component.scss']
})
export class LeftSideComponent implements OnInit {

  constructor(
    private router: Router,
    private CommonServ: CommonService,
  ) { }

  navList: Array<any> = [];
  isLoaded: Boolean = false;
  selectedUrl: string | String = '';
  ngOnInit() {
    this.CommonServ.getNavList().subscribe((data) => {
      this.navList = data.result.sysMenus;
      // console.log("菜单",this.navList)
      this.isLoaded = true;
    });
    this.selectedUrl = this.router.url;
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.selectedUrl = event.urlAfterRedirects.split('?')[0];
      }
    });
  }

}
