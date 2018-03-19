
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'range'
})
export class RangePipe implements PipeTransform {

  transform(teamVal: any, teamFil?: any): any {
        console.log('teamFil', teamFil);
        return teamFil
         ? teamVal.filter(person => (person.level >= teamFil.lower && person.level <= teamFil.upper)) 
         : teamVal;
    }
  //   transform(teamVal: any, teamFil?: any): any {
  //     console.log('teamFil', teamFil);
  //     return teamFil
  //      ? teamVal.filter((person) => 
  //       {
          
  //         if(person.level >= teamFil.lower && person.level <= teamFil.upper){
            
  //         }
  //       }) 
  //      : teamVal;
  // }

}
