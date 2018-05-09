import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogModule, MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CommonService } from '../../../core/services/common.service'
import { LinkCityService } from '../../../core/services/link-city.service'

@Component({
  selector: 'app-modal-info',
  templateUrl: './modal-info.component.html',
  styleUrls: ['./modal-info.component.scss']
})
export class ModalInfoComponent implements OnInit {

  IswellNo = false;
  IswellNo1=false;
  formGroup: FormGroup;
  editWellNo:any;
  constructor(
    //声明定义修改模态框组件
    public dialogRef: MatDialogRef<ModalInfoComponent>,
    public linkCityService: LinkCityService,
    public commonServ: CommonService,
    //注入修改模态框显示时传递的数据，data 就是页面双向绑定的对象data
    @Inject(MAT_DIALOG_DATA) public data: any) {

    this.editWellNo = data.wellNo;
  }


  ngOnInit() {
    this.data['province'] = this.data.province;
    //省份
    this.linkCityService.getProvince().subscribe((data) => {
      this.data.proList = data;
    });
    //城市
    this.linkCityService.getCityByPro(this.data.province).subscribe((data) => {
      this.data.cityList = data;
    })
    //城镇
    this.linkCityService.getTownByCity(this.data.province, this.data.city).subscribe((data) => {
      this.data.townList = data;
    })
    //街道
    this.linkCityService.getCountryByTown(this.data.province, this.data.city, this.data.town).subscribe((data) => {
      this.data.countryList = data;
    })

    this.formGroup = new FormGroup({
      wellNo: new FormControl('', Validators.required),
      wellAlias: new FormControl('', Validators.required),
      wellType: new FormControl('', Validators.required),
      province: new FormControl(),
      city: new FormControl(),
      town: new FormControl(),
      country: new FormControl(),
      address: new FormControl(),
      remark: new FormControl()
    })

  }


  update(data): void {
    if (this.formGroup.invalid) {
      this.commonServ.showBox("请检查数据");
      return
    }
    this.dialogRef.close(true);
  }

  //保存
  save(data): void {
    if (this.formGroup.invalid) {
      this.commonServ.showBox("请检查数据");
      return
    }
    if (!this.IswellNo) {
      this.commonServ.showBox("管井编号已经存在!");
      return
    }
    this.dialogRef.close(true);
  }
  //判断增加的管井编号是否重复
  queryByWellNo(wellNo): void {
    // console.log("管井编号是===>uuu====>", wellNo);
    this.linkCityService.queryByWellNo(wellNo).subscribe((data) => {
      if (data.status.code != 10001) {
        this.IswellNo = true;
      }
    });
  }
    //判断修改的管井编号是否重复
  isExistByWellNo(wellNo,wellId): void {
    wellNo = wellNo.trim();
    if(this.editWellNo == wellNo) return;
    let wellInfo={'wellNo':wellNo,'wellId':wellId};
    this.linkCityService.isExistByWellNo(wellInfo).subscribe((data) => {
      if (data.status.code != 10001) {
        this.IswellNo1 = true;
      }
    });
  }


  changePro(pro) {
    this.linkCityService.getCityByPro(pro).subscribe((data) => {
      this.data.cityList = data;
      //将城镇和村的数据清空
      this.data.townList = [];
      this.data.countryList = [];

    })
  }
  changeCity(city) {
    let pro = this.data.province
    this.linkCityService.getTownByCity(pro, city).subscribe((data) => {
      this.data.townList = data;
      //城市变化的时候将村的数据清空
      this.data.countryList = [];
    })
  }

  changeTown(town) {
    let pro = this.data.province
    let cityName = this.data.city
    this.linkCityService.getCountryByTown(pro, cityName, town).subscribe((data) => {
      this.data.countryList = data;
      console.log(data)
    })
  }

}
