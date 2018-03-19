import { Component } from '@angular/core';
import { AlertController, App, LoadingController, IonicPage, NavController, ModalController, MenuController, NavParams } from 'ionic-angular';
import { ServiceData } from '../../providers/service-data';
import { commonLib } from '../../common/common-lib';
import { Events } from 'ionic-angular';
import { Toast } from 'ionic-angular/components/toast/toast';
import { ToastService } from '../../providers/util/toast.service';
import { NetworkCheck } from '../../providers/util/network-check';
import { AlertService } from '../../providers/util/alert.service';
import { SqlLiteProvider } from '../../providers/sql-lite/sql-lite';
import { LocalStorageProvider } from '../../providers/local-storage/local-storage';
import { commonMessages } from '../../common/commonMessages';

declare var navigator: any;
declare var Connection: any;
@IonicPage()
@Component({
  selector: 'page-faq',
  templateUrl: 'faq.html',
})
export class FaqPage {
  categorys: any;
  isOpen: boolean = false;
  showLevel1 = null;
  showLevel2 = null;
  visable = false;
  pageTitle:string = "FAQ";
  pageHeadingText: string;
  testObj: any;
  public faqDataArray: Array<Object>;
  pageSubHeadingText: string;
  constructor(public modalCtrl: ModalController,
    public customMessage: commonMessages,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    public navCtr: NavController,
    public service: ServiceData,
    public common: commonLib,
    public menu: MenuController, public events: Events, public toastCtrl: ToastService,
    public networkcheck: NetworkCheck, public alrtService: AlertService, public sqlite: SqlLiteProvider,
    public localStore: LocalStorageProvider) {
    let network = this.networkcheck.getConnectionStatus();
    console.log('networkcheck=====================', network);
    if (network) {
      this.localStore.getContactUsDetailsUpdated().then((isUpdated)=>{
        console.log('contact getContactUsDetailsUpdated => ',isUpdated);
        if(!isUpdated){
          this.callAPIService();
        }else if(isUpdated == null || isUpdated == undefined){
          this.callAPIService();
         
        }else{
          this.offlineGetData();
        }
      });
    } else {
    
      this.toastCtrl.create(this.customMessage.TOAST_NETWORK_DISCONNECTED_TEXT);
      this.offlineGetData();
      //  this.alrtService.retryApiAlert('Network Error','Please try again later',' this.callAPIService();')
    }
  }

  toggleLevel1(idx, data) {
    console.log('clicked question');
    if (this.isLevel1Shown(idx)) {
      this.showLevel1 = null;
      this.isOpen = false;
      data.icon = 'ios-add-circle-outline';
    } else {
      this.showLevel1 = idx;
      this.isOpen = true;
      data.icon = 'ios-remove-circle-outline';
    }

  };

  toggleLevel2(idx, data) {
    console.log('clicked 2');
    if (this.isLevel2Shown(idx)) {
      this.showLevel1 = null;
      this.showLevel2 = null;
      data.icon = 'ios-add-circle-outline';
    } else {
      this.showLevel1 = idx;
      this.showLevel2 = idx;
      data.icon = 'ios-remove-circle-outline';
    }
  };
  isLevel1Shown(idx) {
    return this.showLevel1 === idx;
  };

  isLevel2Shown(idx) {
    return this.showLevel2 === idx;
  };
  ionViewDidLoad() {
  }

  navigate(page) {
    this.navCtr.push(page);
  }

  callAPIService() {
    this.common.showLoading('Loading please wait...');
    this.service.requestGetAPI('faq').subscribe((response) => {
      this.common.hideLoading();
      console.log('response=====', JSON.stringify(response));
      if (!response) {
        //this.presentYourModal();
      } else {
        this.sqlite.deleteFaqOfflineData();
        var data =
          {
            PageTitle: response.PageTitle,
            PageHeading: response.PageHeading,
            PageContent: response.PageContent
          }
        this.sqlite.deleteFaqQuestionOfflineData();
        this.sqlite.saveFaqToSqlite(data);
        for (var i = 0; i < response.FAQ.length; i++) {
          let obj = response.FAQ[i];
          this.sqlite.saveFaqQuestionToSqlite(response.FAQ[i]);
        }
       // this.localStore.setFaqDetailsUpdated(false);
        this.offlineGetData();
        console.log('response Updated', JSON.stringify(response));
        this.faqDataArray = response.FAQ;
        console.log('New Array', JSON.stringify(this.faqDataArray));

      }
    },
      error => {
        this.common.hideLoading();
        // this.common.showError(error);
      });
  }

  offlineGetData(){
    this.sqlite.getFaqOfflineData().then((result) => {
      console.log('Result page heading', result)
      this.pageTitle=result[0].PageTitle;
      this.pageHeadingText = result[0].PageHeading;
      this.pageSubHeadingText = result[0].PageContent;
    }, (error) => {
      this.common.hideLoading();
      console.log("ERROR: ", error);
    });

    this.sqlite.getFaqQuestionOfflineData().then((result) => {
      this.faqDataArray = <Array<Object>>result;
    }, (error) => {
      this.common.hideLoading();
      console.log("ERROR: ", error);
    });
  }
  ionViewDidEnter() {

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
