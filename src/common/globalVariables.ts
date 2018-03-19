import { Injectable } from '@angular/core';
@Injectable()
export class globalVariables {

  public serverURL: any = "http://sadsdadasd:8084/api";
  public headerData = { 'Content-Type': 'application/json' };
  public centerCoordinates0={lat:35.904094,lng: -78.865595}
  public centerCoordinates1={lat:19.063061,lng: 72.998905}
  public centerCoordinates2={lat:12.975938,lng: 77.711493}
  public isLocation = '2';//0=rti 1=mum 2=bng
  public campusToUserDistance=1000;  // in meters
  public userDestinationArrivalDistance=30;   //in meters
  public colorCodePolyline = '#09345c';
  public colorCodePolylinePath = '#0063F9';
  public localNotificationHitBeforeTime = 15;
  public pushSenderID = '231231231123';
  public loginRedirectURLAndroid = 'http://xxxxxxxxx:8084/api/login/azuretoken';
  public loginRedirectURLIOS = 'http://xxxxxxxx:8084/api/login/azuretoken';

  constructor() { }
}