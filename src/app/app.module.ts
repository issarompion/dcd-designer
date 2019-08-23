import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {RouterModule} from '@angular/router';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

//Components
import {AppComponent} from './app.component';
import {HomeComponent} from './home/home.component';
import { NavbarComponent} from './navbar/navbar.component';
import {UserComponent} from './user/user.component';
import { MyThingsComponent } from './my-things/my-things.component'
import { TasksComponent } from './tasks/tasks.component'

//Http
import {HttpClientModule} from '@angular/common/http';
import {TransferHttpCacheModule} from '@nguniversal/common';

// MatUI
import {MatButtonModule} from '@angular/material/button';
import {MatSlideToggleModule} from '@angular/material/slide-toggle'
import {MatInputModule} from '@angular/material';
import {MatSelectModule} from '@angular/material/select';
import {MatCardModule} from '@angular/material/card';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatTableModule} from '@angular/material/table';
import {MatDialogModule} from '@angular/material/dialog';
import {MatExpansionModule} from '@angular/material/expansion';

//prime-ng
import {CalendarModule} from 'primeng/calendar';
import {ButtonModule} from 'primeng/button';
import {DialogModule} from 'primeng/dialog';

//Vertical timeline
import { VerticalTimelineModule } from 'angular-vertical-timeline';

//@datacentricdesign/ui-angular
import {UiAngularModule} from '@datacentricdesign/ui-angular';

//To DELETE
/*import {HttpClientService} from './http-client.service'*/


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    NavbarComponent,
    UserComponent,
    MyThingsComponent,
    TasksComponent
  ],
  imports: [
    BrowserModule.withServerTransition({appId: 'my-app'}),
    BrowserAnimationsModule,
    RouterModule.forRoot([
      {path : 'page/home', component : HomeComponent, pathMatch: 'full' },
      {path : 'page/user', component : UserComponent, pathMatch: 'full' },
      {path : 'page/things', component : MyThingsComponent, pathMatch:'full'},
      {path : 'page/tasks', component : TasksComponent, pathMatch:'full'},
      {path : '**',redirectTo: '/page/home',pathMatch: 'full'},
    ]),
    TransferHttpCacheModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    HttpClientModule,
    UiAngularModule,
    MatSlideToggleModule,
    CalendarModule,
    MatInputModule,
    MatSelectModule,
    MatCardModule,
    MatProgressBarModule,
    MatTableModule,
    MatDialogModule,
    ButtonModule,
    DialogModule,
    MatExpansionModule,
    VerticalTimelineModule

  ],
  providers: [
    //HttpClientService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }