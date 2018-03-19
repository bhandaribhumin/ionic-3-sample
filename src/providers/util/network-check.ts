import { Injectable } from '@angular/core';
import { Network } from '@ionic-native/network';
import {  Platform } from 'ionic-angular';
declare var navigator: any;
//declare var Connection: any;
@Injectable()
export class NetworkCheck {
    constructor(public netwrkCheck: Network,public platform: Platform) {
        this.platform.ready().then(() => {
        this.getConnectionStatus();
        });
    }

    getConnectionStatus() {
        var networkState = navigator.connection.type;
        console.log('networkState================', networkState);
        if (networkState == 'none') {
            return false;
        } else {
            return true;
        }
    }
    checkWifiConnection() {
        var networkState = navigator.connection.type;
        if (networkState == 'wifi') {
            return true;
        } else {
            return false;
        }
    }

}