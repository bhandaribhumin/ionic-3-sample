import { Pipe, PipeTransform } from '@angular/core';

/**
 * Generated class for the DateTimeShortPipe pipe.
 *
 * See https://angular.io/api/core/Pipe for more info on Angular Pipes.
 */
@Pipe({
  name: 'dateTimeShort',
})
export class DateTimeShortPipe implements PipeTransform {
  /**
   * Takes a value and makes it lowercase.
   */
  transform(array: Array<any>, args: string): Array<any> {
    if (typeof args[0] === "undefined") {
        return array;
    }
    let direction = args[0][0];
    let column = args.replace('-','');
    array.sort((a: any, b: any) => {
        let left = Number(new Date(a[column]));
        let right = Number(new Date(b[column]));
        return (direction === "-") ? right - left : left - right;
    });
    return array;
}
}
