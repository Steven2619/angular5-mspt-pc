import {Component, OnInit, Inject} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import {CommonService} from '../../../core/services/common.service';
import {ConfigDetailService} from '../../../core/services/config-detail.service';

@Component({
  selector: 'app-config-info',
  templateUrl: './config-info.component.html',
  styleUrls: ['./config-info.component.scss']
})
export class ConfigInfoComponent implements OnInit {

  constructor(// 声明定义修改模态框组件
              public dialogRef: MatDialogRef<ConfigInfoComponent>,
              public commonServ: CommonService,
              public configService: ConfigDetailService,
              // 注入修改模态框显示时传递的数据，data 就是页面双向绑定的对象data
              @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  ngOnInit() {
    // 获取字典表中所有的门限类型
  }

  Configuration(configType) {
    const length = this.data.infoList.length;
    for (let i = 0; i < length; i++) {
      if (this.data['infoList'][i]['configType'] === configType) {
        this.data['infoList'][i]['isConfig'] = false;
      }
    }
  }

  updata(configType, configValue) {
    console.log('提交的阈值是：', configValue);
    console.log('提交的类型是：', configType);
    // 角度阈值校验
    if (configType == 1 && !(configValue >= 10 && configValue <= 60)) {
      this.commonServ.showBox('请输入10-60的数字！');
      return;
    }
    // 电压阈值
    const u = /^\d+(\.\d+)?$/;
    console.log('电压验证:', u.test(configValue));
    if (configType == 2 && !(u.test(configValue))) {
      this.commonServ.showBox('请输入数字(可以是小数)!');
      return;
    }

    // 心跳周期校验
    if (configType == 3 && !(configValue >= 60 && configValue <= 604800)) {
      this.commonServ.showBox('请输入60-604800的数字！');
      return;
    }
    // IPV4地址
    const ipv4 = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/;
    const prot = /^([2-9]\d{3}|[1-5]\d{4}|6[0-4]\d{3}|65[0-4]\d{2}|655[0-2]\d{1}|6553[0-5])$/;
    if (configType == 4 && configValue != '' && configValue != null) {
      const s1 = configValue.split(',')[0];
      const s2 = configValue.split(',')[1];
      console.log('s1=', s1 + '>>', ipv4.test(s1));
      console.log('s2=', s2 + '>>', prot.test(s2));
      if (!ipv4.test(s1) || !prot.test(s2)) {
        this.commonServ.showBox('请输入合理的IP地址和端口号(形如：192.168.0.0,2000)，其中端口范围:2000-65535！');
        return;
      }
    }
// 等待时间
    if (configType == 7 && !(configValue >= 1 && configValue <= 50)) {
      this.commonServ.showBox('请输入1-50的数字！');
      return;
    }
// 网络状态
    if (configType == 8 && !(configValue >= 5 && configValue <= 120)) {
      this.commonServ.showBox('请输入5-120的数字！');
      return;
    }
// 运动窗口
    if (configType == 9 && !(configValue >= 5 && configValue <= 120)) {
      this.commonServ.showBox('请输入5-120的数字！');
      return;
    }


    const length = this.data.infoList.length;
    for (let i = 0; i < length; i++) {
      if (this.data['infoList'][i]['configType'] === configType) {
        // 此处updata
        this.data['infoList'][i]['isConfig'] = true;
        console.log(this.data.infoList[i]);
        this.configService.saveConfig(this.data.infoList[i]).subscribe((res) => {
          if (res.status['code'] === 0) {
            this.commonServ.showBox('终端配置成功！');
            this.data['infoList'][i]['id'] = res.result.id;
            this.data['infoList'][i]['configFlag'] = res.result.configFlag;
            this.data['infoList'][i]['createTime'] = res.result.createTime;
          } else {
            this.commonServ.showBox('修改失败！');
          }
        });
      }
    }
  }

}
