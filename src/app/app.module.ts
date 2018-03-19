import { SharedModule } from './shared.module';
import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler, Config } from 'ionic-angular';
import { MyApp } from './app.component';

import { MODULES, PROVIDERS } from './app.imports';
import { IonicStorageModule } from '@ionic/storage';
import { ModalScaleUpEnterTransition } from '../components/modalTrans/scale-up-enter.transition';
import { ModalScaleUpLeaveTransition } from '../components/modalTrans/scale-up-leave.transition';
import { LocalStorageProvider } from '../providers/local-storage/local-storage';
import { SqlLiteProvider } from '../providers/sql-lite/sql-lite';
import { CommonMethodProvider } from '../providers/common-method/common-method';
import { PushServiceProvider } from '../providers/push-service/push-service';

@NgModule({
  declarations: [
    // App Core
    MyApp,
  ],
  imports: [
    MODULES,
    IonicModule.forRoot(MyApp, {
      tabsHideOnSubPages: true,
      scrollAssist: true,
      autoFocusAssist: true
    }),
    IonicStorageModule.forRoot({
      name: '__rtiDB',
      driverOrder: ['indexeddb', 'sqlite', 'websql']
    }),
    SharedModule,
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
  ],
  providers: [PROVIDERS, { provide: ErrorHandler, useClass: IonicErrorHandler },
    LocalStorageProvider,
    SqlLiteProvider,
    CommonMethodProvider,
    PushServiceProvider]
})
export class AppModule {
  constructor(public config: Config) {
    this.setCustomTransitions();
  }

  private setCustomTransitions() {
    this.config.setTransition('modal-scale-up-leave', ModalScaleUpLeaveTransition);
    this.config.setTransition('modal-scale-up-enter', ModalScaleUpEnterTransition);
  }
}
