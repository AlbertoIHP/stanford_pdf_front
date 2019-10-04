import { Component, } from '@angular/core';
import { EventHandler } from './Services/EventHandler.service'
import { Router } from '@angular/router'
import { AuthenticationService } from './Services/Authentication.service'
import {FormControl} from '@angular/forms';
import {Observable} from 'rxjs/Observable';
import {startWith} from 'rxjs/operators/startWith';
import {map} from 'rxjs/operators/map';
import { UserService } from './Services/User.service'
import { NotificationService } from './Services/Notification.service'
import { NotificationTypeService } from './Services/NotificationType.service'


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent
{

  public toSearch: any
  public isLogged : boolean
  public currentUser: any = { role: ''}
  public stateCtrl: FormControl;
  public filteredStates: Observable<any[]>;
  public states: any
  public notifications: any
  public isSpanish: boolean

  defineCatalog( data )
  {
        if( parseInt( this.currentUser.role ) === 1 )
        {
          this.states = data._embedded.users.filter( user => parseInt( user.role ) === 4 )
        }
        else if( parseInt( this.currentUser.role ) === 4 )
        {
          this.states = data._embedded.users.filter( user => parseInt( user.role ) === 1 )
        }
        else if( parseInt( this.currentUser.role ) === 3 )
        {
          this.states = data._embedded.users.filter( user => parseInt( user.role ) === 4 )
        }
  }

  constructor(
    public events : EventHandler,
    public router: Router,
    public auth: AuthenticationService,
    public userService: UserService,
    public notificationService: NotificationService,
    public notificationTypeService: NotificationTypeService )
  {


    this.isSpanish = this.events.isSpanish
    this.events.language.subscribe( isSpanish => {
      this.isSpanish = isSpanish
      console.log( this.isSpanish )
    })


    this.states = []
    this.notifications = []
    this.isLogged = false
    if( localStorage.getItem('currentUser') )
    {
      this.currentUser = JSON.parse(localStorage.getItem('currentUser'))
      this.toSearch = ''



      this.userService.index().subscribe( data => {
        this.defineCatalog( data )
      })

    }



    this.events.isSingIn.subscribe( data => {
      this.isLogged = true
      this.currentUser = JSON.parse(localStorage.getItem('currentUser'))
      
      this.userService.index().subscribe( data => {
        this.defineCatalog( data )
      })


    })

    this.events.isSingOut.subscribe( data => {
      this.isLogged = false
      this.states = []
    })

    //Autocomplete
    this.stateCtrl = new FormControl();
    this.filteredStates = this.stateCtrl.valueChanges
      .pipe(
        startWith(''),
        map(state => state ? this.filterStates(state) : this.states.slice())
      )
  }

  ngDoCheck(): void
  {
  }



  changeLanguage( val )
  {
    this.events.changeLanguage( val )
  }




  emitProfilePressed()
  {
    this.events.transmit( { userToShow: this.currentUser} )
  }

  navigateToFindUser()
  {
    localStorage.setItem('toSearch', JSON.stringify(this.toSearch))
    console.log(this.toSearch)
    this.router.navigate(['search'])
    this.events.transmit( { toSearch: this.toSearch, searchType: 'onlyuser' } )
    this.toSearch = ''
  }

  goToUserList(event:any)
  {
    event.keyCode == 13 ? this.navigateToFindUser() : null
  }

  goSearch( user )
  {
     localStorage.setItem('userToShow', JSON.stringify(user) )
     this.router.navigate(['profile'])
     this.events.transmit( { userToShow: user } )
     this.toSearch = ''
  }


  filterStates(username: string)
  {
    console.log(username)
    return this.states.filter(state =>
      state.username.toLowerCase().indexOf(username.toLowerCase()) === 0);
  }





  logout()
  {
    this.events.singOut()
    this.auth.logout()
    this.router.navigate(['login'])
  }



}
