import { NgModule }             from '@angular/core'
import { RouterModule, Routes } from '@angular/router'


//Global components
import { LoginComponent } from '../Components/login/login.component'
import { RegisterComponent } from '../Components/register/register.component'
import { HomeComponent } from '../Components/home/home.component'
import { ProfileComponent } from '../Components/profile/profile.component'
import { MeetingComponent } from '../Components/meeting/meeting.component'
import { SearchComponent } from '../Components/search/search.component'
import { ExperienceComponent } from '../Components/experience/experience.component'
import { PupilComponent } from '../Components/pupil/pupil.component'
import { CalendarComponent } from '../Components/calendar/calendar.component'
import { DistributionComponent } from '../Components/distribution/distribution.component'
import { MassiveloadComponent } from '../Components/massiveload/massiveload.component'
import { PendingusersComponent } from '../Components/pendingusers/pendingusers.component'
import { WorkersComponent } from '../Components/workers/workers.component'
import { UsermaintainerComponent } from '../Components/usermaintainer/usermaintainer.component'



// User exclusive routes
import { MentorComponent } from '../Components/mentor/mentor.component'
import { ProjectComponent } from '../Components/project/project.component'
import { ChatComponent } from '../Components/chat/chat.component'


//Child components
import { EditprofileComponent } from '../Components/profile/editprofile/editprofile.component'
import { SeechatComponent } from '../Components/chat/seechat/seechat.component'
import { SeemeetingComponent } from '../Components/meeting/seemeeting/seemeeting.component'


const routes: Routes =
[
  { path: 'login',  component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'editprofile', component: EditprofileComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'mentors', component: MentorComponent },
  { path: 'projects', component: ProjectComponent },
  { path: 'chats', component: ChatComponent },
  { path: 'meetings', component: MeetingComponent },
  { path: 'search', component: SearchComponent },
  { path: 'experiences', component: ExperienceComponent },
  { path: 'pupils', component: PupilComponent },
  { path: 'calendars', component: CalendarComponent },
  { path: 'distribution', component: DistributionComponent },
  { path: 'massiveload', component: MassiveloadComponent },
  { path: 'seechat', component: SeechatComponent },
  { path: 'seemeeting', component: SeemeetingComponent },
  { path: 'pendings', component: PendingusersComponent },
  { path: 'usersmaintainer', component: UsermaintainerComponent },
  { path: 'workers', component: WorkersComponent },
  { path: '',  component: HomeComponent },
];

export const appRoutingProviders: any[] = [

];

export const routing = RouterModule.forRoot(routes);

