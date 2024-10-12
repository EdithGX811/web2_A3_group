import { Directive } from '@angular/core';
import { NG_VALIDATORS, AbstractControl, Validator, ValidationErrors } from '@angular/forms';

@Directive({
  selector: '[appNoNumbers]',
  standalone: true,  
  providers: [{ provide: NG_VALIDATORS, useExisting: NoNumbersDirective, multi: true }]
})
export class NoNumbersDirective implements Validator {
  validate(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (value && /^\d+$/.test(value)) {
      return { noNumbers: true };  // 自定义错误类型
    }
    return null;
  }
}
