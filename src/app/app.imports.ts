// Global state (used for theming)
import { AppState } from './app.global';
// Providers
import { ToastService } from '../providers/util/toast.service';
import { AlertService } from '../providers/util/alert.service';
import { NetworkCheck } from '../providers/util/network-check';
import { globalVariables } from '../common/globalVariables';
import { commonLib } from '../common/common-lib';
import { apiUrls } from '../common/apiUrls';
import { commonMessages } from '../common/commonMessages';
import { ServiceData } from '../providers/service-data';
import { LocalStorageProvider } from '../providers/local-storage/local-storage';
import {PushServiceProvider} from '../providers/push-service/push-service';
// Ionic native providers
import { SQLite } from '@ionic-native/sqlite';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Network } from '@ionic-native/network';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { Geolocation } from '@ionic-native/geolocation';
import { GoogleMaps} from '@ionic-native/google-maps';
import { Push } from '@ionic-native/push';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { MSAdal, AuthenticationContext, AuthenticationResult } from '@ionic-native/ms-adal';
// Directives
import { SlidingDrawer } from '../components/sliding-drawer/sliding-drawer';
import { Autosize } from '../components/autosize/autosize';

// Components
import { Timer } from '../components/countdown-timer/timer';
import { TimerProgress } from '../components/timer-progress/timer-progress';
import { ExpandableHeader } from '../components/expandable-header/expandable-header';
import { FlashCardComponent } from '../components/flash-card/flash-card';
import { AccordionListComponent } from '../components/accordion-list/accordion-list';
import { TimelineComponent } from '../components/timeline/timeline';
import { TimelineItemComponent } from '../components/timeline/timeline';
import { TimelineTimeComponent } from '../components/timeline/timeline';
import { ShowErrorsComponent } from '../components/show-errors/show-errors';


// Pipes
import { MomentPipe } from '../pipes/moment.pipe';
import { TemperaturePipe } from '../pipes/temperature.pipe';
import { OrderByPipe } from '../pipes/orderby.pipe';
import { ShortenStringPipe } from '../pipes/shorten.pipe';
import { CapitalizePipe } from '../pipes/capitalize.pipe';
import { TitleCasePipe } from '../pipes/title-case/title-case';
import { DateTimeShortPipe } from '../pipes/date-time-short/date-time-short';
// Modules

import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {FormsModule} from '@angular/forms';
import { SqlLiteProvider } from '../providers/sql-lite/sql-lite';

export const MODULES = [
  BrowserModule,
  HttpModule,
  BrowserAnimationsModule,
  FormsModule
];
export const PIPES = [
  TemperaturePipe,DateTimeShortPipe, MomentPipe, OrderByPipe, CapitalizePipe, ShortenStringPipe,TitleCasePipe
];

export const PROVIDERS = [
  AlertService,
  ToastService,
  AppState,
  globalVariables,
  commonLib,
  commonMessages,
  ServiceData,
  apiUrls,
  StatusBar,
  SplashScreen,
  LocalStorageProvider,
  PushServiceProvider,
  SqlLiteProvider,
  SQLite,  Network,
  NetworkCheck,
  BarcodeScanner,
  Geolocation,
  GoogleMaps,
  Push,
  LocalNotifications,MSAdal
];

export const COMPONENTS = [
  FlashCardComponent,
  TimerProgress,
  Timer,
  ExpandableHeader,
  Autosize,
  AccordionListComponent,
  TimelineComponent,
  TimelineItemComponent,
  TimelineTimeComponent,
  ShowErrorsComponent
];

export const DIRECTIVES = [
  SlidingDrawer,
  Timer,
  Autosize,
];
