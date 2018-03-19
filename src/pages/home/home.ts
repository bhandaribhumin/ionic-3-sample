import { Component ,ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController,AlertController,Events,Platform,Content  } from 'ionic-angular';
import { ServiceData } from '../../providers/service-data';
import { commonLib } from '../../common/common-lib';
import { LocalStorageProvider } from '../../providers/local-storage/local-storage';
import { SqlLiteProvider } from '../../providers/sql-lite/sql-lite';
import { ToastService } from '../../providers/util/toast.service';
import { NetworkCheck } from '../../providers/util/network-check';
import moment from 'moment';
import { Push, PushObject, PushOptions } from '@ionic-native/push';
import { LocalNotifications } from "@ionic-native/local-notifications";
import { commonMessages } from '../../common/commonMessages';
/**
 * Generated class for the HomePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {
  @ViewChild(Content) content: Content;
  token: any;
  updated_timestamp: any;
  public DataArray;
  homeDisplayName:any;
  current_timestamp: any = Math.round(new Date().getTime());
  user_Email:any;
  DisplaybadgeCount:any = 0;
  isAfterLogin:boolean = false;
  DeviceToken:any;
  cardHeight:any;
  //date = moment('2018-01-08T08:30:00.0000000').local();
  platformName:any = 'browser';
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private push: Push,
    public menuCtrl: MenuController,
    public service: ServiceData,
    public common: commonLib,
    public localStore: LocalStorageProvider,
    public menu: MenuController,
    private sqlStorage: SqlLiteProvider,
    public networkcheck: NetworkCheck,
    public toastCtrl: ToastService,
    public events:Events,
    public platform:Platform,
    public localNotifications:LocalNotifications,
    public alertCtrl:AlertController,
    public customMessage: commonMessages
  ) {

    console.log('this.navParams',this.navParams);
    this.isAfterLogin = this.navParams.get('comeFromLogin');
    console.log('this.isAfterLogin',this.isAfterLogin);

  }

  ionViewDidLoad() {

    let network = this.networkcheck.getConnectionStatus();
    console.log('networkcheck=====================', network);
    if (network) {
      this.localStore.getDeviceTokenToServer().then((isSetToken)=>{
        if(!isSetToken){
          this.localStore.getDeviceToken().then((DeviceToken)=>{
            console.log('home DeviceToken',DeviceToken);
            console.log('home DeviceToken is availabe');
            this.DeviceToken = DeviceToken;
            this.localStore.getUserDetails().then((userAuthData) => {
              if (userAuthData) {
                //this.localStore.setDeviceTokenToServer(false);
                this.token = userAuthData.user_token;
                 this.callPushAPIService(this.token,this.DeviceToken);
              }
            }, error => {
              console.log('get token for sync error');
            });

        })
        }
      });

      this.localStore.getUserDetails().then((userAuthData) => {
        console.log('get getUserDetails home page ', userAuthData);
        if (userAuthData) {
          this.token = userAuthData.user_token;
         // this.user_Email = userAuthData.user_credentials.username;
          //console.log('user Email',this.user_Email);
          this.localStore.getStoreInCached().then((inCached) => {
            console.log('get inCached', inCached);
            if (inCached == undefined || inCached == null || inCached == false) {
              this.localStore.storeInCached();
              this.callProfileAPIService(this.token);
            }else{
              this.offlineProfileGetData();
              console.log('get inCached in', inCached);
            }
          }, error => {
            console.log('get token for sync error');
          });
        }
      }, error => {
        console.log('get token for sync error');
      });
    } else {
      this.toastCtrl.create(this.customMessage.TOAST_NETWORK_DISCONNECTED_TEXT);
      this.offlineProfileGetData();
      //  this.alrtService.retryApiAlert('Network Error','Please try again later',' this.callAPIService();')
    }
  }

  ionViewWillEnter() {
    console.log('Header height',document.getElementById("homepageHeader").offsetHeight);
    let headerHeight=document.getElementById("homepageHeader").offsetHeight;
    console.log('obj height'+this.content.getContentDimensions());
    console.log('height',    this.content. getContentDimensions().contentHeight-this.content.getContentDimensions().contentTop);
    this.cardHeight=this.content.getContentDimensions().contentHeight-this.content.getContentDimensions().contentTop+headerHeight;
   // console.log(' this.cardHeight ---- ', this.cardHeight/5);
    this.cardHeight=this.cardHeight/5;
    console.log('this.cardHeight ---- ',this.cardHeight);

    this.events.subscribe('notification:DisplaybadgeCount', (DisplaybadgeCount) => {
      console.log('subscribe DisplaybadgeCount', DisplaybadgeCount);
      this.DisplaybadgeCount = DisplaybadgeCount;
    });
    this.localStore.getBadge().then((badgeCount)=>{
      console.log('badgeCount home page',badgeCount);
        this.DisplaybadgeCount = badgeCount;
    });

    this.menuCtrl.enable(true);
    this.menuCtrl.swipeEnable(true, 'mainMenu');
    var date = moment(new Date()).valueOf();
    var required = moment.utc(date).format('YYYY-MM-DDThh:mm:ss')
    console.log('date',date);
    console.log('required',required);
  }

  callProfileAPIService(token){
    console.log('callAPIService component profile  call');
     this.service.requestGetAPI('user/profile', token).subscribe((response) => {
      console.log('user/profile response=====', JSON.stringify(response));
      if (response) {
        this.localStore.setProfileData(response);
        this.events.publish('profile:DisplayName',response.DisplayName);
        this.events.publish('profile:Email',response.Email);
        this.homeDisplayName = response.DisplayName;
        this.callAPIService(this.token);
      } else {
        this.offlineProfileGetData();
        console.log('user/profile no response=====', JSON.stringify(response));
      }
    }, (error) => {
      this.offlineProfileGetData();
          console.log("ERROR sync data user/profile: ", error);
    });

  }
  offlineProfileGetData(){
    this.localStore.getProfileData().then((profileDetails)=>{
      this.events.publish('profile:DisplayName',profileDetails.DisplayName);
      this.events.publish('profile:Email',profileDetails.Email);
      this.homeDisplayName = profileDetails.DisplayName;
      console.log('profileDetails',profileDetails);
    }).catch();

  }


  callAPIService(token) {
   // this.common.showLoading('Loading please wait...');
    this.sqlStorage.getSyncOfflineData().then((result) => {
     // this.common.hideLoading();
      this.DataArray = result;
      console.log('data array of sync data', this.DataArray);
      if (this.DataArray.length == 0) {
        this.updated_timestamp = 0;
      } else {
        this.updated_timestamp = this.DataArray[0].updated_timestamp;
      }
      console.log('this.updated_timestamp', this.updated_timestamp);
      this.callSyncAPIService(token, this.updated_timestamp)
    }, (error) => {
     // this.common.hideLoading();
      console.log("ERROR sync data callAPIService: ", error);
    });


  }

  callSyncAPIService(token, timestamp) {
   // this.common.showLoading('Loading please wait...');
    console.log('sync time stamp',timestamp);
    this.service.requestGetAPI('sync/' + timestamp, token).subscribe((response) => {
    //  this.common.hideLoading();
      console.log('response sync=====', JSON.stringify(response));
      if (response) {
        if (response.FAQ) {
          console.log('faq update true');
          this.localStore.setFaqDetailsUpdated(true);
        } else {
          console.log('faq update false');
          this.localStore.setFaqDetailsUpdated(false);
        }
        if (response.ContactUs) {
          console.log('ContactUs update true');
          this.localStore.setContactUsDetailsUpdated(true);
        } else {
          console.log('ContactUs update false');
          this.localStore.setContactUsDetailsUpdated(false);
        }
        if (response.Meeting) {
          console.log('Meeting update true');
          this.localStore.setMeetingDetailsUpdated(true);
        } else {
          console.log('Meeting update false');
          this.localStore.setMeetingDetailsUpdated(false);
        }
        var syncDataDeatils = {
          ContactUs: response.ContactUs,
          FAQ: response.FAQ,
          Meeting: response.Meeting,
          updated_timestamp: Math.round(new Date().getTime()),
        };
        if (response.FAQ || response.ContactUs || response.Meeting) {
          this.sqlStorage.deleteTableSyncOfflineData();
          this.sqlStorage.saveSyncTableToSqlite(syncDataDeatils);
        }
      } else {
        console.log('no response=====', JSON.stringify(response));
      }
    }, (error) => {
   //   this.common.hideLoading();
      this.offlineProfileGetData();
      console.log("ERROR sync data callSyncAPIService: ", error);
    });
  }


  navigate(page) {
    var data = {
      token:this.token
    };
 if(page =='SearchPage'){
   this.navCtrl.push(page,{'param':data},{ animate: true, direction: 'forward' })
 }else{
  this.navCtrl.setRoot(page,{'param':data},{ animate: true, direction: 'forward' });
 }
  }
  search(){

    console.log('search');
  }
  comingEvents(){
    this.common.showComingEvents();
  }
  callPushAPIService(token,DeviceToken) {
    console.log('DeviceToken call push home page',DeviceToken);
    if (DeviceToken !== null) {
          if (this.platform.is('ios')) {
            this.platformName = "ios"
          }else if(this.platform.is('android')){
            this.platformName = "android"
          }
          var param ={
            "devicetoken":DeviceToken.registrationId,
            "devicetype":this.platformName
         }
          this.service.requestPostAPI(param,
            "notification/RegisterDevice",
            token).subscribe((response) => {

          //  this.common.hideLoading();
            console.log('RegisterDevice response=====', JSON.stringify(response));
            if (!response) {
              this.localStore.setDeviceTokenToServer(false);
              //this.presentYourModal();
            } else {
              if(response.status){
                this.localStore.setDeviceTokenToServer(true);
                console.log('home notification token bind success');
              }
            }
          },
            error => {
             // this.common.hideLoading();
              // this.common.showError(error);
            });
          }
  }
}
