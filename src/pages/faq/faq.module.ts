import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FaqPage } from './faq';
import { SharedModule } from '../../app/shared.module';
@NgModule({
  declarations: [
    FaqPage,
  ],
  imports: [SharedModule,
    IonicPageModule.forChild(FaqPage),
  ],
  exports:[
    FaqPage
  ]
})
export class FaqPageModule {}
