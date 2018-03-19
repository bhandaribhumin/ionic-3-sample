import { globalVariables } from './../../common/globalVariables';
// import { FormBuilder, FormControl, Validator } from '@angular/forms';
import { Component, ViewChild, OnInit } from '@angular/core';
import { AlertController, App, LoadingController, IonicPage, NavController, ModalController, MenuController, Platform } from 'ionic-angular';

import { FormGroup, FormBuilder, FormControl, FormArray, NgForm, Validators } from '@angular/forms';
import { ServiceData } from '../../providers/service-data';
import { commonLib } from '../../common/common-lib';
import { LocalStorageProvider } from '../../providers/local-storage/local-storage';
import { SqlLiteProvider } from '../../providers/sql-lite/sql-lite';
import { ToastService } from '../../providers/util/toast.service';
import { NetworkCheck } from '../../providers/util/network-check';
import { Push, PushObject, PushOptions } from '@ionic-native/push';
import { MSAdal, AuthenticationContext, AuthenticationResult } from '@ionic-native/ms-adal';
import { commonMessages } from '../../common/commonMessages';
declare var cordova: any;
declare var Microsoft: any;
@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  @ViewChild('requestLoginFrm')
  public myRequestLoginFrm: NgForm;
  user: { username: string, userpassword: string } = { username: '', userpassword: '' };
  isRequestPassswordSend: boolean = false;
  showPasswordText = false;
  issettPasssword = false;
  submitAttempt: boolean = false;
  isType = 'password';
  isiconEye = 'ai-icon-eye2';
  authUrl: string;
  authUrlEmail: string;
  platformName: any;
  ClientId: any;
  RedirectUri: any;
  Resource: any;
  AuthorityUrl: any;
  isPasswordAuth: boolean = false;
  ClientSecret: any;
  Scope: any;
  public backgroundImage = 'assets/img/background/loginBG.jpg';
  backgrounds = [
    'assets/img/background/background-7.jpg',
    'assets/img/background/background-2.jpg',
    'assets/img/background/background-3.jpg',
    'assets/img/background/background-4.jpg'
  ];
  constructor(
    private push: Push,
    public modalCtrl: ModalController,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    public app: App, public formBuilder: FormBuilder,
    public navCtr: NavController,
    public service: ServiceData,
    public common: commonLib,
    public localStore: LocalStorageProvider,
    public menu: MenuController,
    private sqlStorage: SqlLiteProvider,
    public networkcheck: NetworkCheck,
    public toastCtrl: ToastService, public platform: Platform, private msADAL: MSAdal,
    public globalVariables: globalVariables,
    public customMessage: commonMessages

  ) {
    this.isiconEye = 'ai-icon-eye2';
    let network = this.networkcheck.getConnectionStatus();
    if (network) {
      this.callAPIContactUsService();
      this.callAPIFAQsService();

    } else {
      this.toastCtrl.create(this.customMessage.TOAST_NETWORK_DISCONNECTED_TEXT);
    }
    console.log('IN LOGIN constructor');

  }
  managePassword() {
    if (this.isType == 'text') {
      this.isType = 'password';
      this.isiconEye = 'ai-icon-eye2';
    } else {
      this.isType = 'text';
      this.isiconEye = 'ai-icon-eye-off';
    }
  }
  public presentYourModal(response_message) {
    let commonAlert = this.modalCtrl.create(
      "CommonAlertPage",
      { alertMsg: response_message, successflag: false },
      {
        showBackdrop: false,
        enableBackdropDismiss: false,
        leaveAnimation: 'forward'
      });
    commonAlert.present();
  }
  submitRequestLoginFrm(requestLoginFrm: NgForm) {
    console.log('myRequestLoginFrm', this.myRequestLoginFrm);
    if (requestLoginFrm.form.status == 'VALID') {
      let network = this.networkcheck.getConnectionStatus();
      if (network) {

        this.callAPIService(requestLoginFrm);
      } else {
        this.toastCtrl.create(this.customMessage.TOAST_NETWORK_DISCONNECTED_TEXT);
      }
    } else {
      this.common.showError(this.customMessage.LOGIN_ENTER_CREDENTIAL_TEXT);
    }
  }

  callAPIService(requestLoginFrm) {
    var postData = requestLoginFrm.value;
    //window.btoa(this.user_Email)
    this.adalLogin(postData, postData.username);
  }

  pushsetup(token) {
    const options: PushOptions = {
      android: {
        senderID: this.globalVariables.pushSenderID
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
      console.log('registration home', registration);
      this.localStore.setDeviceToken(registration);
      this.callPushAPIService(token, registration);
    });
    pushObject.on('error').subscribe((error) => {
      console.log('Error with login push notification' + error)
      this.navCtr.setRoot('HomePage', { comeFromLogin: true }, { animate: true, direction: 'forward' });
    });
  }
  callAPIContactUsService() {
    this.service.requestGetAPI('contactus').subscribe((response) => {
      console.log('response', response);
      this.callAPIFAQsService();
      if (!response) {
        //   this.presentYourModal('Error on service API');
      } else {
        if (response.error) {
          response.errodetail.status = status
        } else {
          console.log('response', response.PageTitle);
          this.sqlStorage.deleteContactusOfflineData();
          var data =
            {
              ContactNo: response.ContactNo,
              EmailAddress: response.EmailAddress,
              PageContent: response.PageContent,
              PageHeading: response.PageHeading,
              PageTitle: response.PageTitle
            }
          // this.localStore.setContactUsDetailsUpdated(true);
          this.sqlStorage.saveContactusToSqlite(data);
        }
      }
    },
      error => {

        // this.presentYourModal('Error on service API');
        // this.common.showError(error);
      });
  }
  callAPIFAQsService() {
    this.service.requestGetAPI('faq').subscribe((response) => {
      if (!response) {
        //this.presentYourModal();
      } else {
        this.sqlStorage.deleteFaqOfflineData();
        var data =
          {
            PageTitle: response.PageTitle,
            PageHeading: response.PageHeading,
            PageContent: response.PageContent
          }
        this.sqlStorage.deleteFaqQuestionOfflineData();

        this.sqlStorage.saveFaqToSqlite(data);
        for (var i = 0; i < response.FAQ.length; i++) {
          let obj = response.FAQ[i];
          this.sqlStorage.saveFaqQuestionToSqlite(response.FAQ[i]);
        }
      }
    },
      error => {
      });
  }
  navigate(page) {
    this.navCtr.push(page);
  }
  ionViewWillEnter() {
    this.menu.enable(false);
  }

  callPushAPIService(token, DeviceToken) {
    if (this.platform.is('ios')) {
      this.platformName = "ios"
    } else if (this.platform.is('android')) {
      this.platformName = "android"
    }
    var param = {
      "devicetoken": DeviceToken.registrationId,
      "devicetype": this.platformName
    }
    this.service.requestPostAPI(param,
      "notification/RegisterDevice",
      token).subscribe((response) => {
        //  this.common.hideLoading();
        this.common.hideLoading();
        console.log('RegisterDevice response=====', JSON.stringify(response));
        if (!response) {
          this.localStore.setDeviceTokenToServer(false);
          //this.presentYourModal();
          this.navCtr.setRoot('HomePage', { comeFromLogin: true }, { animate: true, direction: 'forward' });
        } else {
          if (response.status) {
            this.localStore.setDeviceTokenToServer(true);
            console.log('notification token bind success');
            this.navCtr.setRoot('HomePage', { comeFromLogin: true }, { animate: true, direction: 'forward' });
          } else {

            this.localStore.setDeviceTokenToServer(false);
            this.navCtr.setRoot('HomePage', { comeFromLogin: true }, { animate: true, direction: 'forward' });
          }
        }
      },
        error => {
          this.common.hideLoading();
          // this.common.hideLoading();
          this.common.showError(error);
        });

  }
  escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }
  replaceAll(authUrl, term, replacement) {
    return authUrl.replace(new RegExp(this.escapeRegExp(term), 'g'), replacement);
  }
  doLogin(code) {
    this.localStore.getDeviceToken().then((DeviceToken) => {
      console.log('DeviceToken', DeviceToken);
      if (DeviceToken == undefined || DeviceToken == null) {
        console.log('pushsetup is init');
        if (this.platform.is("core") || this.platform.is("mobileweb")) {
          this.navCtr.setRoot('HomePage', { comeFromLogin: true }, { animate: true, direction: 'forward' });
        } else {
          console.log(' this.pushsetup');
          this.pushsetup(code);
        }
      } else {
        console.log(' this.callPushAPIService');
        this.callPushAPIService(code, DeviceToken);
      }
    })
    // });
    // this.service.requestPostAPI(postData, 'login/AccessToken').subscribe((response) => {
    // //  this.common.hideLoading();
    //   console.log('code token response=====', code);
    //   if (!response) {
    //     this.common.hideLoading();
    //     this.presentYourModal('Error on service API.');
    //   } else {
    //     if (!response.status) {
    //       if (response.data.errodetail.status == 401) {
    //        this.common.hideLoading();
    //         this.presentYourModal(response.data.error);
    //       }
    //     } else {



    //     }
    //   }
    // },
    //   error => {
    //     console.log('Token error===');
    //     this.common.hideLoading();
    //     // this.common.showError(error);
    //   });
  }
  //  adal login
  adalLogin(postData, userID) {
    // this.common.hideLoading();

    this.localStore.getConfigUrl().then((configUrl) => {
      console.log('DeviceToken', JSON.stringify(configUrl));
      var APP_ID = configUrl.NativeClientId,
        RESOURCE_URL = configUrl.ClientId,
        AUTHORITY_URL = configUrl.AuthorityUrl;

      var REDIRECT_URL;

      if (this.platform.is('ios')) {
        REDIRECT_URL = this.globalVariables.loginRedirectURLIOS;
      } else if (this.platform.is('android')) {
        REDIRECT_URL = this.globalVariables.loginRedirectURLAndroid;
      }

      // var  APP_ID = 'def36f10-4de8-46bb-9c6e-b0af40032e52',
      // REDIRECT_URL = "http://61.12.113.197:8084/api/login/azuretoken",
      // RESOURCE_URL = 'https://graph.microsoft.com/',
      // AUTHORITY_URL = 'https://login.microsoftonline.com/907f237b-938d-42f9-9d58-d9bc6e3cf87f/';
      Microsoft.ADAL.AuthenticationSettings.setUseBroker(true)
        .then(function () { console.log('setUseBroker is working'); });
      //  var authContext = new Microsoft.ADAL.AuthenticationContext(AUTHORITY_URL);
      let authContext: AuthenticationContext = this.msADAL.createAuthenticationContext(AUTHORITY_URL);
      console.log(encodeURI(this.ClientSecret));
      //  var extraParams = encodeURI('client_secret='+this.ClientSecret+'&scope='+this.Scope);
      // console.log('extraParams',extraParams);
      authContext.acquireTokenAsync(RESOURCE_URL, APP_ID, REDIRECT_URL, userID, '')
        .then((authResponse: AuthenticationResult) => {
          console.log('authResponse', authResponse);
          console.log('authResponse', JSON.stringify(authResponse));
          this.doEncriptURL(authResponse, postData);
        })
        .catch((e: any) => {
         // alert('Authentication failed ' + e)
          console.log('e+', e);
        });
    })
  }
  doEncriptURL(authResponse, postData) {
    // this.common.showLoading('Please wait...');
    this.common.showLoading('Loading...');
    console.log('on doEncriptURL');
    this.service.getEncriptedToken(authResponse).subscribe((response) => {
      //  this.common.hideLoading();
      console.log('oauthurl response=====', response);
      if (!response) {
        this.common.hideLoading();
        this.presentYourModal('Error');
        console.log('Auth URL error===');
      } else if (!response.status) {
        this.common.hideLoading();
        this.presentYourModal(response.data.Message);
      } else {
        //this.common.showLoading('Loading...');
        var storeObject = {
          user_credentials: postData,
          user_token: response.data.token,
        };
        this.localStore.setUserDetails(storeObject);
        this.doLogin(response.data.token);
      }
    },
      error => {
        this.common.hideLoading();
        this.presentYourModal(error);
      });
  }
  public commonAlertPopup(response_message, flag) {
    let commonAlert = this.modalCtrl.create(
      "CommonAlertPage",
      { alertMsg: response_message, successflag: flag },
      {
        showBackdrop: false,
        enableBackdropDismiss: false,
        leaveAnimation: "forward"
      }
    );
    commonAlert.present();
  }
}
