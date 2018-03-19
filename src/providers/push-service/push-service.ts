import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Injectable } from '@angular/core';
import { Push, PushObject, PushOptions } from '@ionic-native/push';
import {  Platform} from 'ionic-angular';
import { LocalStorageProvider } from '../local-storage/local-storage';
/*
  Generated class for the PushServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class PushServiceProvider {

  constructor( private push: Push,
    public platform: Platform,
    public http: Http, public localStore: LocalStorageProvider) {
    console.log('Hello PushServiceProvider Provider');
  }


  pushTokenRegistration(){
    this.platform.ready().then(() => {
      const options: PushOptions = {
        android: {
          senderID: '747254343624'
        },
        ios: {
          alert: 'true',
          badge: true,
          sound: 'false'
        },
        windows: {}
      };
      const pushObject: PushObject = this.push.init(options);

    pushObject.on('registration').subscribe((registration: any) => {
      //do whatever you want with the registration ID
      console.log('registration', registration);
      this.localStore.setDeviceToken(registration);
    });
    pushObject.on('error').subscribe(error => alert('Error with connection ' + error));
  });
  }
  pushGetNotification() {
    return new Promise((resolve, reject) => {
      this.platform.ready().then(() => {
        const options: PushOptions = {
          android: {
            senderID: '747254343624'
          },
          ios: {
            alert: 'true',
            badge: true,
            sound: 'false'
          },
          windows: {}
        };
        const pushObject: PushObject = this.push.init(options);
        pushObject.on('notification').subscribe((notification: any) => {
          if (notification.additionalData.foreground) {
            resolve(notification);
          } else {
            reject('error');
            console.log('Push notification clicked');
          }
        },error => {
          reject(error);
        });
      });
    });
 
  }
}
