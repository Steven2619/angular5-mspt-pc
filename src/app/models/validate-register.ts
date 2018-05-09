import { ValidatorFn, AbstractControl } from '@angular/forms';
export function validateRex(type: string, validateRex: RegExp): ValidatorFn {
return (control: AbstractControl): {[key: string]: any} => {
// 获取当前控件的内容
const str = control.value;
// 设置我们自定义的严重类型
const res = {};
res[type] = {str}
// 如果验证通过则返回 null 否则返回一个对象（包含我们自定义的属性）
return validateRex.test(str) ? null : res;
}
}
