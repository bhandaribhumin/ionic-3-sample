import { Injectable } from '@angular/core';
import { AlertController, LoadingController, Loading, ModalController, } from 'ionic-angular';

@Injectable()
export class commonLib {
  loading: Loading;
  constructor(
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    public modalCtrl: ModalController,
  ) { }

  public toggleDetails(data) {
    if (data.showDetails) {
      data.showDetails = false;
      data.icon = 'ios-arrow-forward';
    } else {
      data.showDetails = true;
      data.icon = 'ios-arrow-down';
    }
  }




  public showLoading(contentMsg) {
    // this.loading = this.loadingCtrl.create({
    //   content: contentMsg
    // });
   // this.loading.present();
    this.loading = this.loadingCtrl.create({
      content: `Please wait...`,
      duration:30000
    });

    // loading.onDidDismiss(() => {
    //   console.log('Dismissed loading');
    // });

    this.loading.present();


  }
  public hideLoading() {
    this.loading.dismiss()
  }


  showAlertmodal() {
    let confirm = this.alertCtrl.create({
      title: 'Use this lightsaber?',
      message: 'Do you agree to use this lightsaber to do good across the intergalactic galaxy?',
      buttons: [
        {
          text: 'Disagree',
          handler: () => {
            console.log('Disagree clicked');
          }
        },
        {
          text: 'Agree',
          handler: () => {
            console.log('Agree clicked');
          }
        }
      ]
    });
    confirm.present();
  }


  public showError(text) {
    let alert = this.alertCtrl.create({
      title: 'Fail',
      subTitle: text,
      buttons: ['OK'],
    });
    alert.present( );
  }
  public showErrorFullCust(title,text) {
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: text,
      buttons: ['OK'],
    });
    alert.present( );
  }
  public showSussess(text) {
    let alert = this.alertCtrl.create({
      title: 'Success',
      subTitle: text,
      buttons: ['OK']
    });
    alert.present( );
  }


  public showSuccessMsg(text) {
    let alert = this.alertCtrl.create({
      title: 'Success',
      subTitle: text,
      buttons: ['OK']
    });
    alert.present( );
  }

  public alertMsg(text) {
    let alert = this.alertCtrl.create({
      title: 'Alert',
      subTitle: text,
      buttons: ['OK'],
    });
    alert.present( );
  }
  public showComingEvents() {
    let alert = this.alertCtrl.create({
      title: 'Alert!',
      subTitle: "Functionality not implemented.",
      buttons: ['OK'],
    });
    alert.present( );
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