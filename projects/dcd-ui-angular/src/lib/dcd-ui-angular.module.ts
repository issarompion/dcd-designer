import {NgModule} from '@angular/core';
/*import {FormsModule} from '@angular/forms';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';

// Ng2 charts
import { ChartsModule } from 'ng2-charts';

//PrimeNG
import {DialogModule} from 'primeng/dialog';
import {CalendarModule} from 'primeng/calendar';
import {SliderModule} from 'primeng/slider';
import {CheckboxModule} from 'primeng/checkbox';
import {InputTextModule} from 'primeng/inputtext';*/

import { DcdUiAngularComponent } from './dcd-ui-angular.component';
//import { DoubleAxisChartComponent } from './double-axis-chart/double-axis-chart.component';
//import { LineChartComponent } from './line-chart/line-chart.component';
//import { RadarChartComponent } from './radar-chart/radar-chart.component';
//import { NavbarComponent } from './navbar/navbar.component';
import { UserComponent } from './user/user.component';




@NgModule({
  declarations: [
    DcdUiAngularComponent,
    //RadarChartComponent,
    //NavbarComponent,
    UserComponent
  ],
  imports: [
    //FormsModule,
    //ChartsModule,
    //SliderModule,
    //CommonModule
    //BrowserAnimationsModule,
    //BrowserModule
  ],
  exports: [
    DcdUiAngularComponent,
    //RadarChartComponent,
    //NavbarComponent,
    UserComponent,
    
  ]
})
export class DcdUiAngularModule { }
