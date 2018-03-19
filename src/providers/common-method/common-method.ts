import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Injectable } from '@angular/core';

/*
  Generated class for the CommonMethodProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class CommonMethodProvider {

  constructor(public http: Http) {
    console.log('Hello CommonMethodProvider Provider');
  }

}
