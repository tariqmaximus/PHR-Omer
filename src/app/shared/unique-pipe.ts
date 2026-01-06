import { Pipe, PipeTransform } from '@angular/core';
import * as _ from 'lodash'; 

@Pipe({
    name: 'unique',
    pure: false,
    standalone: true
})

export class UniquePipe implements PipeTransform {
    transform(value: any,uniquebycolumn: any): any{
      
        if(value!== undefined && value!== null){
            return _.uniqBy(value, uniquebycolumn);
        }
        return value;
    }
}