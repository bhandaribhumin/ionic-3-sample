
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
/*
  Generated class for the LocalStorageProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class LocalStorageProvider {

  constructor(public storage: Storage) {
    console.log('Hello LocalStorageProvider Provider');
  }
  //store the User Data
  public setUserDetails(userData) {
    console.log('localuserData', userData);
    this.storage.set('userAuthData', userData);
  }
  //get the stored User Data
  public getUserDetails() {
    return this.storage.get('userAuthData').then(data => {
      return data;
    });
  }
  //delete the User Data
  public removeUserDetails() {
    this.storage.remove('userAuthData').then(() => {
      console.log('userAuthData is removed');
    });
  }

  //clear the whole local storage
  public clearStorage() {
    this.storage.clear().then(() => {
      console.log('all keys are cleared');
    });
    
  }


  public setProfileData(profileData) {
    this.storage.set('profileData', profileData);
  }
  public getProfileData() {
    return this.storage.get('profileData').then(profileData => {
      return profileData;
    });
  }
  public clearProfileData() {
    this.storage.set('profileData', '');
  }
  public setFaqDetailsUpdated(isUpdated) {
    this.storage.set('detailsFaqUpdated', isUpdated);
  }
  public getFaqDetailsUpdated() {
    return this.storage.get('detailsFaqUpdated').then(isUpdated => {
      return isUpdated;
    });
  }
  public clearFaqDetailsUpdated() {
    this.storage.set('detailsFaqUpdated', '');
  }

  public setContactUsDetailsUpdated(isUpdated) {
    this.storage.set('detailsContactUsUpdated', isUpdated);
  }
  public getContactUsDetailsUpdated() {
    return this.storage.get('detailsContactUsUpdated').then(isUpdated => {
      return isUpdated;
    });
  }
  public clearContactUsDetailsUpdated() {
    this.storage.set('detailsContactUsUpdated', '');
  }
  public setMeetingDetailsUpdated(isUpdated) {
    this.storage.set('detailsMeetingUpdated', isUpdated);
  }
  public getMeetingDetailsUpdated() {
    return this.storage.get('detailsMeetingUpdated').then(isUpdated => {
      return isUpdated;
    });
  }
  public clearMeetingDetailsUpdated() {
    this.storage.set('detailsMeetingUpdated', '');
  }
  public storeInCached() {
    this.storage.set('inCached', true);
  }
  public getStoreInCached() {
    return this.storage.get('inCached').then(inCached => {
      return inCached;
    });
  }
  public clearStoreInCached() {
    this.storage.set('inCached', '');
  }

  public storeMeetingsInCached(status) {
    this.storage.set('inMeetingCached', status);
  }
  public getMeetingsStoreInCached() {
    return this.storage.get('inMeetingCached').then(inCached => {
      return inCached;
    });
  }
  public clearMeetingsStoreInCached() {
    this.storage.set('inMeetingCached', '');
  }

  public setMeetingDetailsdata(isUpdated) {
    this.storage.set('MeetingDetailsdata', isUpdated);
  }
  public getMeetingDetailsdata() {
    return this.storage.get('MeetingDetailsdata').then(MeetingDetailsdata => {
      return MeetingDetailsdata;
    });
  }
  public clearMeetingDetailsdata() {
    this.storage.set('MeetingDetailsdata', '');
  }




  public setTempMeetingID(meeting_id) {
    this.storage.set('meetingID', meeting_id);
  }
  public getTempMeetingID() {
    return this.storage.get('meetingID').then(meeting_id => {
      return meeting_id;
    });
  }
  public clearTempMeetingID() {
    this.storage.set('meetingID', '');
  }


  public setDeviceToken(token) {
    this.storage.set('DeviceToken', token);
  }
  public getDeviceToken() {
    return this.storage.get('DeviceToken').then(token => {
      return token;
    });
  }
  public clearDeviceToken() {
    this.storage.set('DeviceToken', '');
  }

  public setDeviceTokenToServer(isStore) {
    this.storage.set('DeviceTokenServer', isStore);
  }
  public getDeviceTokenToServer() {
    return this.storage.get('DeviceTokenServer').then(isStore => {
      return isStore;
    });
  }
  public clearDeviceTokenToServer() {
    this.storage.set('DeviceTokenServer', '');
  }

  public setFloorBuildingSelectData(data) {
    this.storage.set('setFloorBuildingSelectData', data);
  }
  public getFloorBuildingSelectData() {
    return this.storage.get('setFloorBuildingSelectData').then(data => {
      return data;
    });
  }
  public clearFloorBuildingSelectData() {
    this.storage.set('setFloorBuildingSelectData', '');
  }

  public setBadge(badgeCount) {
    console.log('set badgeCount',badgeCount);
    this.storage.set('badgeCount', badgeCount);
  }
  public getBadge() {
    return this.storage.get('badgeCount').then(badgeCount => {
      return badgeCount;
    });
  }
  public clearBadge() {
    this.storage.set('badgeCount', '');
  }

  public setConfigUrl(ConfigUrl) {
    console.log('set ConfigUrl',ConfigUrl);
    this.storage.set('ConfigUrl', ConfigUrl);
  }
  public getConfigUrl() {
    return this.storage.get('ConfigUrl').then(ConfigUrl => {
      return ConfigUrl;
    });
  }
  public clearConfigUrl() {
    this.storage.set('ConfigUrl', '');
  }

}
