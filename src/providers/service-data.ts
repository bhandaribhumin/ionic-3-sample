import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/retry';
import 'rxjs/add/operator/timeout';
import 'rxjs/add/operator/delay';
import { globalVariables } from '../common/globalVariables';
import { commonLib } from '../common/common-lib';
import { LocalStorageProvider } from './local-storage/local-storage';
@Injectable()
export class ServiceData {
  data: any;
  items: any;
  foo = "sensible default";
  compaint: any;
  constructor(public common: commonLib, public http: Http, public global: globalVariables,    public localStore: LocalStorageProvider) {
    this.items = [];
  }
  filterItems(searchTerm) {
    return this.items.filter((item) => {
      return item.title.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1;
    });
  }
  public getMenus() {
    return this.http.get('assets/data/menus.json')
      .map((response: Response) => response.json());
  }
  public requestPostAPI(requestParams, postUrl,token = '') {
    console.log('POST Call =>');
    console.log('POSTrequestParams', requestParams);
    console.log('POSTrequestParams JSON.stringify', JSON.stringify(requestParams));
    return Observable.create(observer => {
      let access: any;
      var request = requestParams;
      if (token != '') {
        console.log('add token');
        this.global.headerData['x-access-token'] = token;
      }
      //this.global.headerData['x-access-token'] = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6Mn0.nQPF1wgEojroRgE0ggykN4O4MhBgLIsoE08ByEGWVac';
      let headers = new Headers(this.global.headerData);
      let options = new RequestOptions({ headers: headers });
      let url = this.global.serverURL + '/' + postUrl;
      console.log('POST url =>', url);
      console.log('POST options =>', options);
      this.http.post(url, request, options).timeout(25000)
        .map(res => {
          console.log('POST RESPONSE ==> ', res);
          console.log('POST RESPONSE headers =>', res.headers);
          var refresh_token = res.headers.get('refresh-token');
          console.log('POST refresh_token',refresh_token);

          if(refresh_token != null){
            this.localStore.getUserDetails().then((userAuthData) => {
              var storeObject = {
                user_credentials: {username:userAuthData.user_credentials.username,password:userAuthData.user_credentials.password},
                user_token:refresh_token,
              };
             // userAuthData.user_token = refresh_token
              console.log('new user_credentials',JSON.stringify(storeObject));
              this.localStore.setUserDetails(storeObject);
            });

          }
          // If request fails, throw an Error that will be caught
          if (res.status < 200 || res.status >= 300) {
            throw new Error('This request has failed ' + res.status);
          }
          // If everything went fine, return the response
          else {
            console.log('<== POST IN SUCCESS map ==> ');
            return res.json();
          }
        }).subscribe(data => {
          access = {
            status: true,
            data: data
          };
          console.log('<== POST IN SUCCESS subscribe ==> ');
          console.log("Custome Data observer success :+", access);
          observer.next(access);
          observer.complete();
        }, (err) => {
          access = {
            status: false,
            data: JSON.parse(err._body)
          };
          console.log('<== POST IN Error subscribe ==> ');
          console.log("Custome Data observer Error :+", access);
          console.log('timeout',err);
          // if(err.name != undefined){
          //   observer.next(false);
          // }else{
          //   observer.next(access);
          // }
          observer.next(access);
          observer.complete();
        });
    }).catch((error) => {
      console.log('In Observable Error => ', error);
    });

  }

  public requestGetAPI(getUrl,token = '') {
    console.log('Get Call =>');
    return Observable.create(observer => {
      let access: any;
      //let body = requestParams;
      // let headers = new Headers(this.global.headerData);
      let url = this.global.serverURL + '/' + getUrl;
      if (token != '') {
        this.global.headerData['x-access-token'] = token;
      }
      let headers = new Headers(this.global.headerData);
     
     // console.log('token', token);
      console.log('Headers get => ', headers);
      console.log('url =>', url);
      let options = new RequestOptions({ headers: headers });
      this.http.get(url, options).timeout(25000)
        .map(res => {
          console.log('GET RESPONSE  =>', res);
          console.log('GET RESPONSE headers => ', res.headers);
          var refresh_token = res.headers.get('refresh-token');
        //  console.log('Get refresh_token',refresh_token);
          if(refresh_token != null){
            this.localStore.getUserDetails().then((userAuthData) => {
              var storeObject = {
                user_credentials: {username:userAuthData.user_credentials.username,password:userAuthData.user_credentials.password},
                user_token:refresh_token,
              };
             // userAuthData.user_token = refresh_token
             // console.log('new get user_credentials',JSON.stringify(storeObject));
              this.localStore.setUserDetails(storeObject);
            });

          }
          // If request fails, throw an Error that will be caught
          if (res.status < 200 || res.status >= 300) {
            throw new Error('This request has failed ' + res.status);
          }
          // If everything went fine, return the response
          else {
            console.log('GET IN SUCCESS RESPONSE ==> ');
            return res.json();
          }
        }).subscribe(data => {
          access = data;
          console.log('<== GET IN Success subscribe ==> ');
          console.log("Custome Data observer subscribe :+", access);
          observer.next(access);
          observer.complete();
        }, (err) => {
          console.log('<== GET IN Error subscribe ==> ');
          console.log("Custome Data observer Error :+", err);
          console.log('timeout',err);
          observer.next(false);
          observer.complete();
        });
    }).catch((error) => {
      console.log('In Observable Error => ', error);
    });
  }
  public requestGetExternalAPI(requestParams, getUrl, token = '') {
    console.log('Get Call =>');
    return Observable.create(observer => {
      let access: any;
      let body = requestParams;
      // let headers = new Headers(this.global.headerData);
      let url = getUrl;
      if (token != '') {
        this.global.headerData['x-access-token'] = token;
      }
      let headers = new Headers(this.global.headerData);
      let options = new RequestOptions({ headers: headers });
      this.http.get(url, options).timeout(25000)
        .map(res => {
          console.log('GET External RESPONSE  =>', res);
          // If request fails, throw an Error that will be caught
          if (res.status < 200 || res.status >= 300) {
            throw new Error('This request has failed ' + res.status);
          }
          // If everything went fine, return the response
          else {
            return res.json();
          }
        }).subscribe(data => {
          access = data;
          observer.next(access);
          observer.complete();
        }, (err) => {
          observer.next(false);
          observer.complete();
        });
    }).catch((error) => {
      console.log('In Observable Error => ', error);
    });
  }
  getGoogleApiEncodeData(url){
    return Observable.create(observer => {
    let access: any;
    //  let options = new RequestOptions({ headers: headers });
      this.http.get(url).timeout(25000)
        .map(res => {
          console.log('GET RESPONSE  =>', res);
          console.log('GET RESPONSE headers => ', res.headers);
          var refresh_token = res.headers.get('refresh-token');
          console.log('Get refresh_token',refresh_token);

          // If request fails, throw an Error that will be caught
          if (res.status < 200 || res.status >= 300) {
            throw new Error('This request has failed ' + res.status);
          }
          // If everything went fine, return the response
          else {
            console.log('GET IN SUCCESS RESPONSE ==> ');
            return res.json();
          }
        }).subscribe(data => {
          access = data;
          console.log('<== GET IN Success subscribe ==> ');
          console.log("Custome Data observer Error :+", access);
          observer.next(access);
          observer.complete();
        }, (err) => {
          console.log('<== GET IN Error subscribe ==> ');
          console.log("Custome Data observer Error :+", err);
          observer.next(false);
          observer.complete();

        });

    }).catch((error) => {
      console.log('In Observable Error => ', error);
    });

  }
  getEncriptedToken(tokenObject) {
    // console.log('tokenObject JSON', JSON.stringify(tokenObject));
     return Observable.create(observer => {
       let access: any;
       let body = {authtoken:tokenObject};
       console.log('body', JSON.stringify(body));
       let url = this.global.serverURL + '/login/encrypttoken';
       this.http.post(url, body).timeout(25000)
         .map(res => {
           if (res.status < 200 || res.status >= 300) {
             throw new Error('This request has failed ' + res.status);
           }
           else {
             return res.json();
           }
         }).subscribe(data => {
           access = {
             status: true,
             data: data
           };
           observer.next(access);
           observer.complete();
         }, (err) => {
           access = {
             status: false,
             data: 'Error on token encription'
           };
           observer.next(access);
           observer.complete();
         });
     }).catch((error) => {
       console.log('In Observable ErrorgetEncriptedToken => ', error);
     });
 
   }
   logOutAzure(redirectURI) {
      return Observable.create(observer => {
        let access: any;
        let url = 'https://login.windows.net/common/oauth2/logout?post_logout_redirect_uri='+redirectURI;
        console.log('logout URL:'+url);
        this.http.get(url).timeout(25000)
          .map(res => {
            if (res.status < 200 || res.status >= 300) {
              throw new Error('This request has failed ' + res.status);
            }
            else {
              return res.json();
            }
          }).subscribe(data => {
            access = {
              status: true,
              data: data
            };
            observer.next(access);
            observer.complete();
          }, (err) => {
            access = {
              status: false,
              data: 'Error on  log out Azure'
            };
            observer.next(access);
            observer.complete();
          });
      }).catch((error) => {
        console.log('In Observable ErrorgetEncriptedToken => ', error);
      });
    }

}