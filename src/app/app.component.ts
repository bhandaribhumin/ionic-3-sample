import { commonLib } from '../common/common-lib';
import { AppState } from './app.global';
import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, MenuController, Events, AlertController, App, IonicApp } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Subject } from 'rxjs';
import { ModalController } from 'ionic-angular';
import { LocalStorageProvider } from '../providers/local-storage/local-storage';
import { SqlLiteProvider } from '../providers/sql-lite/sql-lite';
import { Network } from '@ionic-native/network';
import { ToastService } from '../providers/util/toast.service';
import { NetworkCheck } from '../providers/util/network-check';
import { ServiceData } from '../providers/service-data';
import { Push, PushObject, PushOptions } from '@ionic-native/push';
import { LocalNotifications } from "@ionic-native/local-notifications";
import { MSAdal, AuthenticationContext, AuthenticationResult } from '@ionic-native/ms-adal';
import { globalVariables } from  '../common/globalVariables';
import { commonMessages } from '../common/commonMessages';
import { apiUrls } from '../common/apiUrls';
import { CommonMethodProvider } from '../providers/common-method/common-method';

@Component({
  templateUrl: 'app.html'
})
/** Class representing a Base Class. */
export class MyApp {
  @ViewChild(Nav) nav: Nav;
  rootPage: any;
  activePage = new Subject();
  pages: Array<{ title: string, component: any, active: boolean, icon: string, methodsCall: string, tabIndex: number, tabPage: string, isBadge: boolean }>;
  public DataArray: Array<Object>;
  token: any;
  state: any;
  syncData: any = [];
  syncDataDeatils: any;
  insertId: any;
  profileDetails: any;
  profileDisplayName: string = '#name';
  profileEmail: string = '@email';
  badgeCount = 0;
  platformName: any;
  ClientId: any;
  RedirectUri: any;
  Resource: any;
  AuthorityUrl: any;
  isPasswordAuth: boolean = false;
  ClientSecret: any;
  Scope: any;
  authUrl: any;
  constructor(
    private push: Push,
    public modalCtrl: ModalController,
    public platform: Platform,
    public statusBar: StatusBar,
    public splashscreen: SplashScreen,
    public global: AppState,
    public app: App,
    public menuCtrl: MenuController,
    public localStore: LocalStorageProvider,
    private sqlStorage: SqlLiteProvider,
    private common: commonLib,
    private network: Network,
    public toastCtrl: ToastService,
    public networkcheck: NetworkCheck,
    public service: ServiceData,
    public events: Events,
    public alertCtrl: AlertController,
    private ionicApp: IonicApp,
    private localNotifications: LocalNotifications,
    private msADAL: MSAdal,
    public globalVar: globalVariables,
    public customMessage: commonMessages,
    public commonMethod:CommonMethodProvider
  ) {
    this.getAuthUrl();
   // console.log('getToken',this.commonMethod.getToken().then((data)=>{console.log('data grttoken',data);}));
    this.localStore.getBadge().then((badgeINIT) => {
      console.log('badgeINIT', badgeINIT);
      if (badgeINIT != null) {
        this.badgeCount = badgeINIT;
      } else {
        this.localStore.setBadge(0);
      }
    });
    this.events.subscribe('notification:DisplaybadgeCount', (DisplaybadgeCount) => {
      this.badgeCount = DisplaybadgeCount;
      console.log('app component in set badge', DisplaybadgeCount);
      this.localStore.setBadge(this.badgeCount);
    });
    this.initializeApp();
    this.localStore.storeMeetingsInCached(false);

    this.localStore.getUserDetails().then((userAuthData) => {
      console.log('initializeApp_userAuthData', userAuthData);
      if (userAuthData && userAuthData.user_token) {
        this.token = userAuthData.user_token;
        this.localStore.clearStoreInCached();
        this.rootPage = 'HomePage';
      } else {
        this.rootPage = 'LoginPage';
      }
    }, error => {
      console.log('rootepage in error');
      this.rootPage = 'LoginPage';
    });
    this.pages = [
      { title: 'Notifications', component: '', active: false, icon: 'notificationsicon', methodsCall: 'navigate', tabIndex: 0, tabPage: 'NotificationsPage', isBadge: true },
      { title: 'Home', component: '', active: false, icon: 'ios-home-outline', methodsCall: 'gotoHome', tabIndex: 0, tabPage: '', isBadge: false },
      { title: 'My Meetings', component: 'MyMeetingsPage', active: false, icon: 'meetingsicon-outline', methodsCall: '', tabIndex: 0, tabPage: '', isBadge: false },
      { title: 'Book a Meeting Room', component: 'AdvanceMeetingBookingPage', active: false, icon: 'meetingroomicon-outline', methodsCall: '', tabIndex: 0, tabPage: '', isBadge: false },
      { title: 'Instant Booking', component: 'QrScannerInstantbookPage', active: false, icon: 'instantbookingicon-outline', methodsCall: '', tabIndex: 0, tabPage: '', isBadge: false },
      { title: 'Points of Interest', component: 'PointOfInterestPage', active: false, icon: 'pointsofinteresticon-outline', methodsCall: '', tabIndex: 0, tabPage: '', isBadge: false },
      { title: 'Campus Map', component: 'CampusMapPage', active: false, icon: 'campusmapicon-outline', methodsCall: '', tabIndex: 0, tabPage: '', isBadge: false },
      { title: 'Search', component: '', active: false, icon: 'searchicon', methodsCall: 'search', tabIndex: 0, tabPage: '', isBadge: false },
      { title: 'Contact Us', component: 'ContactUsPage', active: false, icon: 'contactusicon', methodsCall: '', tabIndex: 0, tabPage: '', isBadge: false },
      { title: 'FAQs', component: 'FaqPage', active: false, icon: 'faqicon', methodsCall: '', tabIndex: 0, tabPage: '', isBadge: false },
      { title: 'Sign out', component: '', active: false, icon: 'sign-outicon', methodsCall: 'logout', tabIndex: 0, tabPage: '', isBadge: false }
    ];
    this.activePage.subscribe((selectedPage: any) => {
      this.pages.map(page => {
        page.active = page.title === selectedPage.title;
      });
    });
  }
  initializeApp() {
    this.platform.ready().then(() => {
      this.global.set('theme', '');
      setTimeout(() => {
        this.splashscreen.hide();
      }, 100);
      this.statusBar.backgroundColorByHexString('#0F3D75');
      // this.splashscreen.hide();
      this.menuCtrl.enable(false);
      this.network.onConnect().subscribe(data => {
        this.toastCtrl.create('You are now online');
      }, error => console.error('you are offline onDisconnect', error));

      this.network.onDisconnect().subscribe(data => {
        console.log(data)
        this.toastCtrl.create('You are now offline');
        this.offlineProfileGetData();
      }, error => console.error('you are offline onDisconnect', error));
      this.localNotifications.on('click', notificationHandler)
      this.registerBackButtonAction();
      this.pushsetup();
    });
    let notificationHandler = notification => {

      console.log('click notification data handler', notification);
      this.localStore.getBadge().then((badgeValue) => {
        console.log('badgeValue', badgeValue);
        this.badgeCount = badgeValue;
        this.badgeCount++;
        this.localStore.setBadge(this.badgeCount);
        this.events.publish('notification:DisplaybadgeCount', this.badgeCount);
      });
      var notificationData = {
        title : notification.title,
        message : notification.text,
        localNotificationObject:notification
      }
      this.showConfirmNotification(notificationData);
    }
    this.events.subscribe('profile:DisplayName', (DisplayName) => {
      console.log('subscribe DisplayName', DisplayName);
      this.profileDisplayName = DisplayName;
    });
    this.events.subscribe('profile:Email', (Email) => {
      console.log(' subscribe Email', Email);
      this.profileEmail = Email;
    });
  }
  showConfirmNotification(notification){
    let confirmAlert = this.alertCtrl.create({
      title: notification.title,
      message: notification.message,
      enableBackdropDismiss: false,
      buttons: [{
        text: this.customMessage.IGNORE_TEXT,
        role: 'Cancel',
        handler: () => {
          //this.events.publish('view:isPageRefresh', true);
          //this.localStore.storeMeetingsInCached(false);
        }
      }, {
        text: 'View',
        handler: () => {
          this.menuCtrl.close();
          this.localStore.storeMeetingsInCached(false);
          this.nav.push('NotificationsPage', { message: notification });
        }
      }]
    });
    confirmAlert.present();
  }
  pushsetup() {
    const options: PushOptions = {
      android: {
        senderID: this.globalVar.pushSenderID
      },
      ios: {
        alert: 'true',
        badge: true,
        sound: 'false'
      },
      windows: {}
    };
    const pushObject: PushObject = this.push.init(options);
    console.log('pushsetup');
    pushObject.on('notification').subscribe((notification: any) => {
      console.log('on notification', notification);
      if (notification.additionalData.foreground) {
        this.badgeCount++;
        this.localStore.setBadge(this.badgeCount);
        this.events.publish('notification:DisplaybadgeCount', this.badgeCount);
        this.showConfirmNotification(notification);
       } else {
        this.nav.push('NotificationsPage', { message: notification.message });
      }
    });
    pushObject.on('registration').subscribe((registration: any) => {
      console.log('registration',JSON.stringify(registration));
      this.localStore.setDeviceToken(registration);
    });
    pushObject.on('error').subscribe(error => console.log('Error with connection ' + error));
  }
  offlineProfileGetData() {
    this.localStore.getProfileData().then((profileDetails) => {
      if (profileDetails != null) {
        this.events.publish('profile:DisplayName', profileDetails.DisplayName);
        this.events.publish('profile:Email', profileDetails.Email);
      }
      console.log('offlineProfileGetData profileDetails', profileDetails);
    }, (error) => {
      console.log('offlineProfileGetData error', error);
    });
  }
  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    if (page.component != '') {
      var data = {

      }
      this.nav.setRoot(page.component, { 'param': data }, { animate: true, direction: 'forward' });
      this.activePage.next(page);
    } else {
      if (page.methodsCall) {
        switch (page.methodsCall) {
          case 'logout':
            this.logOut();
            break;
          case 'gotoHome':
            this.gotoHomePage();
            break;
          case 'navigate':
            this.navigate(page.tabPage, page.tabIndex);
            break;
          case 'comingEvents':
            this.comingEvents();
            break;
            case 'search':
            this.search();
            break;
          default:
        }
      }
    }
  }
  logOut() {
    console.log('Logout clicked');

    this.callDeRegisterDevicePushAPIService();
  }
  gotoHomePage() {
    this.menuCtrl.close();
    this.nav.setRoot('HomePage', {}, { animate: true, direction: 'back' });
  }
  comingEvents() {
    this.common.showComingEvents();
  }
  search()
  {
this.nav.push('SearchPage');
  }
  navigate(page, activeTab) {
    var data = {
      token: this.token
    };
    console.log('page', page);
    console.log('activeTab', activeTab);
    this.nav.push(page, { 'param': data, 'activeTab': activeTab });
  }
  callDeRegisterDevicePushAPIService() {
    this.localStore.getDeviceToken().then((DeviceToken) => {
      console.log('logout getDeviceTokenToServer', DeviceToken);
      if (DeviceToken != undefined) {
        this.localStore.getUserDetails().then(userAuthData => {
          console.log("getUserDetails", userAuthData);
          var token = userAuthData.user_token;
          console.log('token logout ', token);
          if (this.platform.is('ios')) {
            this.platformName = "ios"
          } else if (this.platform.is('android')) {
            this.platformName = "android"
          }
          var param = {
            "devicetoken": DeviceToken.registrationId,
            "devicetype": this.platformName
          }
          this.common.showLoading('Please wait...');
          this.service.requestPostAPI(param,
            apiUrls.deRegisterDevice,
            token).subscribe((response) => {
              this.localStore.clearStorage();
              this.common.hideLoading();
              console.log('DeRegisterDevice response=====', JSON.stringify(response));
              this.handleDegisterLogoutResp();
              if (!response) {
                this.commonAlertPopup(this.customMessage.DE_REGISTER_TEXT,false);
              } else {
                if (response.status) {
                  console.log('success DeRegisterDevice token');
                }
              }
            },
              error => {

                this.common.hideLoading();
                this.handleDegisterLogoutResp();

              });
        }).catch();
      } else {
        this.handleDegisterLogoutResp();
      }
    },
      error => {
        console.log('Device token error Not found');
        this.handleDegisterLogoutResp();

      })
  }
  /**

  **/
  registerBackButtonAction() {
    this.platform.registerBackButtonAction(() => {
      console.log('this.app', this.app);
      console.log('this.ionicApp', this.ionicApp);
      let nav = this.app.getActiveNavs()[0];
      let activeView = nav.getActive();
      console.log('activeView', activeView);
      let activePortal = this.ionicApp._loadingPortal.getActive() ||
        this.ionicApp._modalPortal.getActive() ||
        this.ionicApp._toastPortal.getActive() ||
        this.ionicApp._overlayPortal.getActive();
      if (activePortal) {
        activePortal.dismiss();
        activePortal.onDidDismiss(() => { });
      }
      console.log('activeView.name', activeView.name);
      if (activeView.name === "HomePage" || activeView.name === "LoginPage") {
        if (nav.canGoBack()) { //Can we go back?
          //this.nav.pop();
        } else {
          const alert = this.alertCtrl.create({
            title: this.customMessage.APP_TERMINATE_TITLE_TEXT,
            message: this.customMessage.APP_TERMINATE_MESSAGE_TEXT,
            buttons: [{
              text: 'Cancel',
              role: 'cancel',
              handler: () => {
                console.log('Application exit prevented!');
              }
            }, {
              text: this.customMessage.APP_CLOSE_BUTTON_TEXT,
              handler: () => {
                this.platform.exitApp(); // Close this application
              }
            }]
          });
          alert.present();
        }
      } else if (activeView.name === "MyMeetingsPage" || activeView.name === "AdvanceMeetingBookingPage" || activeView.name === "QrScannerInstantbookPage" || activeView.name === "PointOfInterestPage" || activeView.name === "CampusMapPage" || activeView.name === "SearchPage" ) {
        this.nav.setRoot('HomePage', {}, { animate: true, direction: 'back' });
      } else if(activeView.name === "FaqPage" || activeView.name === "ContactUsPage"){
        this.localStore.getUserDetails().then((userAuthData) => {
          console.log('initializeApp_userAuthData', userAuthData);
          if (userAuthData && userAuthData.user_token) {
            this.nav.setRoot('HomePage', {}, { animate: true, direction: 'back' });
          } else {
            this.nav.pop();
          }
        }, error => {
          console.log('Error in back');
          this.nav.pop();
        });
      }
      else {
        this.nav.pop();
      }
    });
  }
    /**
     * Create a getAuthUrl for getting oauthURL from server.
     * @param NULL.
     * @return NULL.
     */

  getAuthUrl() {
    this.common.showLoading('Loading please wait...');
    this.service.requestGetAPI(apiUrls.oAuthURL).subscribe((response) => {
      this.common.hideLoading();
      console.log('oauthurl response=======', JSON.stringify(response));
      if (!response) {
        //this.presentYourModal();
        console.log('Auth URL error===');
      } else {
        this.authUrl = response.oauthurl;
        this.ClientId = response.NativeClientId;
        this.RedirectUri = response.RedirectUri;
        this.Resource = response.Resource;
        this.AuthorityUrl = response.AuthorityUrl;
        this.ClientSecret = response.ClientSecret;
        this.Scope = response.Scope;
        this.localStore.setConfigUrl(response);
      }
    },
      error => {
        this.common.hideLoading();
        // this.common.showError(error);
      });
  }
  handleDegisterLogoutResp() {
    this.localStore.clearStorage();
    this.common.showLoading('Loading please wait...');
    var AUTHORITY_URL = this.AuthorityUrl;
    let authContext: AuthenticationContext = this.msADAL.createAuthenticationContext(AUTHORITY_URL);
    authContext.tokenCache.clear();
    this.service.logOutAzure('www.google.com').subscribe((response) => {
      this.common.hideLoading();
      if (response.status) {
        console.log('logout success');
      } else {
        console.log('logout failed');
      }
    });
    this.common.hideLoading();
    // alert('error while logout');
    this.localStore.setDeviceTokenToServer(false);
    this.sqlStorage.deleteTableNotificationOfflineData();
    this.localNotifications.cancelAll();
    this.localStore.setBadge(0);
    this.nav.setRoot('LoginPage', {}, { animate: true, direction: 'back' });
    this.getAuthUrl();
  }
  commonAlertPopup(message,flag){
    let commonAlert = this.modalCtrl.create(
      "CommonAlertPage",
      { alertMsg: message,successflag:flag}
    );
    commonAlert.present();
  }
}
