import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { EventHandler } from '../../Services/EventHandler.service'
import { AuthenticationService } from '../../Services/Authentication.service'
import { Router } from '@angular/router'
import { User } from '../../Models/User.model'
import { CompanyUser } from '../../Models/CompanyUser.model'

import { UserService } from '../../Services/User.service'
import { CompanyUserService } from '../../Services/CompanyUser.service'

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  public newUser: User
  public currentUser: any
  public isRegistering: any





  public acceptedMimeTypes : any = [
    'image/jpeg',
    'image/png' ]

  @ViewChild('fileInput') fileInput: ElementRef;
  public fileDataUri : string | ArrayBuffer = '';
  public errorMsg = '';



  previewFile()
  {
    const file = this.fileInput.nativeElement.files[0];
    if (file && this.validateFile(file))
    {

      const reader = new FileReader();
      reader.readAsDataURL(this.fileInput.nativeElement.files[0]);
      reader.onload = () => {

        this.fileDataUri = reader.result;
        this.newUser.picture = this.fileDataUri
        console.log(this.fileDataUri)
      }
    }
    else
    {
      this.errorMsg = 'File must be jpg or png and cannot be exceed 50 MB in size'
    }
  }


  validateFile(file)
  {
    return this.acceptedMimeTypes.includes(file.type) && file.size < 500000000;
  }



  public isSpanish

  constructor(
    public companyUserService : CompanyUserService,
    public auth: AuthenticationService,
    public events : EventHandler,
    public router: Router,
    public userService: UserService )
  {



    this.isSpanish = this.events.isSpanish
    this.events.language.subscribe( isSpanish => {
      this.isSpanish = isSpanish
      console.log( this.isSpanish )
    })

    this.isRegistering = false
    this.newUser = new User()
    this.events.singOut()
  }


  ngOnInit()
  {
  }

  goToLoginPage()
  {
    this.router.navigate(['login'])
  }

  registerUser()
  {

    this.isRegistering = true

    if( this.newUser.name != '' && this.newUser.lastname != '' && this.newUser.username != '' && this.newUser.password != '' && this.newUser.role != '' && this.newUser.description != '' )
    {

      this.newUser.role === '4' || this.newUser.role === '3' ? this.newUser.isActive = '0' : this.newUser.isActive = '1'
      this.newUser.authorities.id = parseInt(this.newUser.role)
      this.userService.store( this.newUser ).subscribe( data => {




        this.auth.login( this.newUser.username, this.newUser.password ).subscribe( data => {

          if( this.newUser.isActive === '1')
          {
            this.userService.showMySelf().subscribe( data => {
              localStorage.setItem('currentUser', JSON.stringify( data ) )
              console.log(data)
              this.events.singIn()
              this.router.navigate([''])

            })
          }
          else
          {

            this.router.navigate(['login'])
            alert('As you have register as a mentor or enterprise, you will have to wait until an administrator accept to you.')
          }
        })

      })

    }
    else
    {
      alert("Please, fill the fields to proceed")
      this.isRegistering = false
    }
  }

}
