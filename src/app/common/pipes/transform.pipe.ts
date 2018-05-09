import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'transform'
})
export class TransformPipe implements PipeTransform {

  transform(value: any, args?: any): any {

    let result,wellInstallStatus = {
      0: '未安装',
      1: '待安装',
      2: '已安装'
    };
    if (args == 'install') {
      result = wellInstallStatus[value];
    }
    return result;
  }

}
