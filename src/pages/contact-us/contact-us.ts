import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { ServiceData } from '../../providers/service-data';
import { commonLib } from '../../common/common-lib';
import { NetworkCheck } from '../../providers/util/network-check';
import { ToastService } from '../../providers/util/toast.service';
import { SqlLiteProvider } from '../../providers/sql-lite/sql-lite';
import { LocalStorageProvider } from '../../providers/local-storage/local-storage';
import { commonMessages } from '../../common/commonMessages';
@IonicPage()
@Component({
  selector: 'page-contact-us',
  templateUrl: 'contact-us.html',
})
export class ContactUsPage {
  contact_details;
  pageTitle;
  pageHeading;
  pageContent;
  email;
  contact_number;
  constructor(public navCtrl: NavController,
    public customMessage: commonMessages,
    public navParams: NavParams, public service: ServiceData, public modalCtrl: ModalController,
    public localStore: LocalStorageProvider, public sqlite: SqlLiteProvider, public common: commonLib, public navCtr: NavController, public toastCtrl: ToastService, public networkcheck: NetworkCheck) {

    let network = this.networkcheck.getConnectionStatus();
    console.log('networkcheck=====================', network);
    if (network) {
      this.localStore.getContactUsDetailsUpdated().then((isUpdated) => {
        console.log('contact getContactUsDetailsUpdated => ', isUpdated);
        if (!isUpdated) {
          this.callAPIService();
        } else if (isUpdated == null || isUpdated == undefined) {
          this.callAPIService();
        } else {
          this.offlineGetData();
        }
      });
    } else {
      this.offlineGetData();
      this.toastCtrl.create(this.customMessage.TOAST_NETWORK_DISCONNECTED_TEXT);
      //  this.alrtService.retryApiAlert('Network Error','Please try again later',' this.callAPIService();')
    }

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ContactUsPage');
  }
  navigate(page) {
    this.navCtrl.push(page);
  }



  callAPIService() {
    this.common.showLoading('Loading...');
    this.service.requestGetAPI('contactus').subscribe((response) => {
      this.common.hideLoading();
      console.log('response', response);
      if (!response) {
        this.commonAlertPopup(this.customMessage.SERVICE_API_ERROR_TEXT, false);
      } else {
        if (response.error) {
          response.errodetail.status = status
        } else {
          console.log('response', response.PageTitle);
          this.sqlite.deleteContactusOfflineData();
          var data =
            {
              ContactNo: response.ContactNo,
              EmailAddress: response.EmailAddress,
              PageContent: response.PageContent,
              PageHeading: response.PageHeading,
              PageTitle: response.PageTitle
            }
          // this.localStore.setContactUsDetailsUpdated(true);
          this.sqlite.saveContactusToSqlite(data);
          this.offlineGetData();
        }
      }
    },
      error => {
        this.common.hideLoading();
        this.commonAlertPopup(this.customMessage.SERVICE_API_ERROR_TEXT, false);
        // this.common.showError(error);
      });
  }
  offlineGetData() {
    this.sqlite.getContactusOfflineData().then((result) => {
      console.log('Result contact sql', result)
      if (result) {
        this.pageTitle = result[0].PageTitle;
        this.pageHeading = result[0].PageHeading;
        this.pageContent = result[0].PageContent;
        this.email = result[0].EmailAddress;
        this.contact_number = result[0].ContactNo;
      }

    }, (error) => {
      this.common.hideLoading();
      console.log("ERROR Contact sql: ", error);
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
