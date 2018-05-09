import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'chinese'
})
export class ChinesePipe implements PipeTransform {

  transform(value: any, args?: any): any {
    console.log(args)
    let result, statusData = {
      '-1': '已删除',
      '0': '待执行',
      '1': '执行中',
      '2': '已回单',
      '3': '已归档'
    },typeData={
      '1': '新装',
      '2': '告警',
      '3': '维护'
    };
    if (!args) {
      result = statusData[value];
    } else {
      if (args == 'status') {
        result = statusData[value];
      }
      if (args == 'type') {
        result = typeData[value];
      }

    }

    return result;
  }

}
