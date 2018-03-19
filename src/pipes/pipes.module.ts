import { NgModule } from '@angular/core';
import { TitleCasePipe } from './title-case/title-case';
import { DateTimeShortPipe } from './date-time-short/date-time-short';
@NgModule({
	declarations: [TitleCasePipe,
    DateTimeShortPipe],
	imports: [],
	exports: [TitleCasePipe,
    DateTimeShortPipe]
})
export class PipesModule {}
