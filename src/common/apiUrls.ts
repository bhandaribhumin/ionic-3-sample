import { Injectable } from '@angular/core';
import { AlertController, LoadingController, Loading } from 'ionic-angular';

@Injectable()
export class apiUrls {
 public static deRegisterDevice: any = "notification/DeRegisterDevice";
 public static oAuthURL: any = "login/oauthurl";
 constructor() { }
}