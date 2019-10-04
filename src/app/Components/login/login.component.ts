import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'
import { AuthenticationService } from '../../Services/Authentication.service'
import { EventHandler } from '../../Services/EventHandler.service'
import { UserService } from '../../Services/User.service'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']

})
export class LoginComponent implements OnInit {

  public user
  public isLogging
  public isSpanish

  constructor( 
    public router: Router, 
    public auth: AuthenticationService, 
    public events : EventHandler, 
    public userService: UserService )
  {
    this.user = { email: '', password: '' }
    this.isLogging = false


    this.isSpanish = this.events.isSpanish
    this.events.language.subscribe( isSpanish => {
      this.isSpanish = isSpanish
      console.log( this.isSpanish )
    })

    if( !localStorage.getItem('currentUser') )
    {
      this.auth.logout()
      this.events.singOut()
      this.router.navigate(['login'])
    }
    else
    {
      this.events.singIn()
      this.router.navigate([''])
    }

  }

  ngOnInit()
  {
  }

  logIn()
  {

    this.isLogging = true

    if( this.user.email != '' && this.user.password != '' )
    {
      this.auth.login( this.user.email, this.user.password ).subscribe( (data) => {
        console.log(data)
        if( data )
        {

          this.userService.showMySelf().subscribe( data => {
            localStorage.setItem('currentUser', JSON.stringify( data ) )
            console.log(data)

            if( parseInt(data.isActive) === 1 )
            {
              this.events.singIn()

              data.role === '2' ? this.router.navigate(['']) : this.router.navigate(['profile'])

            }
            else
            {
              this.isLogging = false
              this.events.singOut()
              alert("As you have register as a mentor or enterprise, you will have to wait until an administrator accept to you.")
            }


          })

        }
        else
        {
          this.router.navigate(['login'])
          this.isLogging = false
          alert("The user or password entered are not correct.")
        }
      })
    }
    else
    {
      alert("Fill the information please")
    }
  }


  goToRegisterPage()
  {
    this.router.navigate(['register'])
  }

}
