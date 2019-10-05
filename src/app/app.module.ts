import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { CalendarModule } from 'angular-calendar';


//angular Modules

import { HttpClientModule } from '@angular/common/http'
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


//Custom components
import { AppComponent } from './app.component';
import { LoginComponent } from './Components/login/login.component';
import { HomeComponent } from './Components/home/home.component';
import { RegisterComponent } from './Components/register/register.component';
import { ProfileComponent } from './Components/profile/profile.component';
import { ExperienceComponent } from './Components/experience/experience.component';
import { MeetingComponent } from './Components/meeting/meeting.component';
import { ChatComponent } from './Components/chat/chat.component';
import { DistributionComponent } from './Components/distribution/distribution.component';
import { CalendarComponent } from './Components/calendar/calendar.component';
import { PupilComponent } from './Components/pupil/pupil.component';
import { ProjectComponent } from './Components/project/project.component';
import { MentorComponent } from './Components/mentor/mentor.component';
import { SearchComponent } from './Components/search/search.component';
import { MassiveloadComponent } from './Components/massiveload/massiveload.component';
import { ContactComponent } from './Components/search/contact/contact.component';
import { PendingusersComponent } from './Components/pendingusers/pendingusers.component';
import { UsermaintainerComponent } from './Components/usermaintainer/usermaintainer.component';

//Child components
import { EditprofileComponent } from './Components/profile/editprofile/editprofile.component';
import { UserprofComponent } from './Components/profile/userprof/userprof.component';
import { MentorprofComponent } from './Components/profile/mentorprof/mentorprof.component';
import { EnterpriseprofComponent } from './Components/profile/enterpriseprof/enterpriseprof.component';
import { EditexperienceComponent } from './Components/experience/editexperience/editexperience.component';
import { AddexperienceComponent } from './Components/experience/addexperience/addexperience.component';
import { SeeexperienceComponent } from './Components/experience/seeexperience/seeexperience.component';
import { AddmeetingComponent } from './Components/meeting/addmeeting/addmeeting.component';
import { EditmeetingComponent } from './Components/meeting/editmeeting/editmeeting.component';
import { SeemeetingComponent } from './Components/meeting/seemeeting/seemeeting.component';
import { AddchatComponent } from './Components/chat/addchat/addchat.component';
import { EditchatComponent } from './Components/chat/editchat/editchat.component';
import { SeechatComponent } from './Components/chat/seechat/seechat.component';
import { AdddistributionComponent } from './Components/distribution/adddistribution/adddistribution.component';
import { EditdistributionComponent } from './Components/distribution/editdistribution/editdistribution.component';
import { SeedistributionComponent } from './Components/distribution/seedistribution/seedistribution.component';
import { AddcalendarComponent } from './Components/calendar/addcalendar/addcalendar.component';
import { EditcalendarComponent } from './Components/calendar/editcalendar/editcalendar.component';
import { SeecalendarComponent } from './Components/calendar/seecalendar/seecalendar.component';
import { AddprojectComponent } from './Components/project/addproject/addproject.component';
import { EditprojectComponent } from './Components/project/editproject/editproject.component';
import { SeeprojectComponent } from './Components/project/seeproject/seeproject.component';
import { ViewmembersComponent } from './Components/distribution/viewmembers/viewmembers.component';
import { SendnewmailComponent } from './Components/distribution/sendnewmail/sendnewmail.component';
import { ViewcalmemComponent } from './Components/calendar/viewcalmem/viewcalmem.component';
import { CreateneweventComponent } from './Components/calendar/createnewevent/createnewevent.component';
import { WorkersComponent } from './Components/workers/workers.component';

//CSS Framework Modules
import {
  MatAutocompleteModule,
  MatButtonModule,
  MatButtonToggleModule,
  MatCardModule,
  MatCheckboxModule,
  MatChipsModule,
  MatDatepickerModule,
  MatDialogModule,
  MatExpansionModule,
  MatGridListModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatMenuModule,
  MatNativeDateModule,
  MatPaginatorModule,
  MatProgressBarModule,
  MatProgressSpinnerModule,
  MatRadioModule,
  MatRippleModule,
  MatSelectModule,
  MatSidenavModule,
  MatSliderModule,
  MatSlideToggleModule,
  MatSnackBarModule,
  MatSortModule,
  MatTableModule,
  MatTabsModule,
  MatToolbarModule,
  MatTooltipModule,
  MatStepperModule,
} from '@angular/material';
import {CdkTableModule} from '@angular/cdk/table';




//Routes
import { routing, appRoutingProviders } from './Routes/routes.module';


//Services
import { AuthenticationService } from './Services/Authentication.service'
import { CalendarService } from './Services/Calendar.service'
import { CalendarUserService } from './Services/CalendarUser.service'
import { ChatService } from './Services/Chat.service'
import { CompanyUserService } from './Services/CompanyUser.service'
import { DistributionService } from './Services/Distribution.service'
import { DistributionUserService } from './Services/DistributionUser.service'
import { EventService } from './Services/Event.service'
import { EventHandler } from './Services/EventHandler.service'
import { ExperienceService } from './Services/Experience.service'
import { MeetService } from './Services/Meet.service'
import { MessageService } from './Services/Message.service'
import { NotificationService } from './Services/Notification.service'
import { NotificationTypeService } from './Services/NotificationType.service'
import { ProjectService } from './Services/Project.service'
import { PupilService } from './Services/Pupil.service'
import { UserService } from './Services/User.service';
import { VideoService } from './Services/Video.service';


// Import Opentok library
import { OpentokService } from './Services/opentok.service';
import { SubscriberComponent } from './Components/subscriber/subscriber.component';
import { PublisherComponent } from './Components/publisher/publisher.component';
import { DragDropDirective } from './drag-drop.directive';




@NgModule({
  declarations:
  [
    AppComponent,
    LoginComponent,
    HomeComponent,
    RegisterComponent,
    ProfileComponent,
    ExperienceComponent,
    MeetingComponent,
    ChatComponent,
    DistributionComponent,
    CalendarComponent,
    PupilComponent,
    EditprofileComponent,
    EditexperienceComponent,
    AddexperienceComponent,
    SeeexperienceComponent,
    AddmeetingComponent,
    EditmeetingComponent,
    SeemeetingComponent,
    AddchatComponent,
    EditchatComponent,
    SeechatComponent,
    AdddistributionComponent,
    EditdistributionComponent,
    SeedistributionComponent,
    AddcalendarComponent,
    EditcalendarComponent,
    SeecalendarComponent,
    ProjectComponent,
    MentorComponent,
    AddprojectComponent,
    EditprojectComponent,
    SeeprojectComponent,
    SearchComponent,
    MassiveloadComponent,
    ContactComponent,
    PendingusersComponent,
    ViewmembersComponent,
    SendnewmailComponent,
    ViewcalmemComponent,
    CreateneweventComponent,
    WorkersComponent,
    SubscriberComponent,
    PublisherComponent,
    UserprofComponent,
    MentorprofComponent,
    EnterpriseprofComponent,
    UsermaintainerComponent,
    DragDropDirective
  ],
  entryComponents:
  [
    EditprofileComponent,
    EditexperienceComponent,
    AddexperienceComponent,
    SeeexperienceComponent,
    AddmeetingComponent,
    EditmeetingComponent,
    SeemeetingComponent,
    AddchatComponent,
    EditchatComponent,
    SeechatComponent,
    AdddistributionComponent,
    EditdistributionComponent,
    SeedistributionComponent,
    AddcalendarComponent,
    EditcalendarComponent,
    SeecalendarComponent,
    AddprojectComponent,
    EditprojectComponent,
    SeeprojectComponent,
    ContactComponent,
    ViewmembersComponent,
    SendnewmailComponent,
    ViewcalmemComponent,
    CreateneweventComponent
  ],
  imports: [
    BrowserAnimationsModule,
    ReactiveFormsModule,
    BrowserModule,
    FormsModule,
    HttpModule,
    routing,
    MatAutocompleteModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatCheckboxModule,
    MatChipsModule,
    MatDatepickerModule,
    MatDialogModule,
    MatExpansionModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatNativeDateModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatRippleModule,
    MatSelectModule,
    MatSidenavModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatSortModule,
    MatTableModule,
    MatTabsModule,
    MatToolbarModule,
    MatTooltipModule,
    MatStepperModule,
    CalendarModule.forRoot()
  ],
  providers:
  [
    appRoutingProviders,
    AuthenticationService,
    CalendarService,
    CalendarUserService,
    ChatService,
    CompanyUserService,
    DistributionService,
    DistributionUserService,
    EventService,
    EventHandler,
    ExperienceService,
    MeetService,
    MessageService,
    NotificationService,
    NotificationTypeService,
    ProjectService,
    PupilService,
    UserService,
    VideoService,
    OpentokService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
