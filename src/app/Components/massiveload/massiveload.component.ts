import { Component, OnInit } from '@angular/core';
import { EventHandler } from '../../Services/EventHandler.service'
import { AuthenticationService } from '../../Services/Authentication.service'
import { UserService } from '../../Services/User.service'
import { User } from '../../Models/User.model'
import { CompanyUser } from '../../Models/CompanyUser.model'
import { CompanyUserService } from '../../Services/CompanyUser.service'
import { Router } from '@angular/router'
import * as XLSX from 'ts-xlsx';

@Component({
  selector: 'app-massiveload',
  templateUrl: './massiveload.component.html',
  styleUrls: ['./massiveload.component.css']
})
export class MassiveloadComponent implements OnInit {

  //EXCEL
  arrayBuffer:any;
  file:File;
  public usersToAdd: any
  public goUpload = true
  public ready = true
  public secondStep = true
  public registeredUsers = []
  public isSpanish

  incomingfile(event)
  {
    this.file= event.target.files[0];
    this.upload()
  }

   upload()
   {
        let fileReader = new FileReader();
          fileReader.onload = (e) => {
              this.arrayBuffer = fileReader.result;
              var data = new Uint8Array(this.arrayBuffer);
              var arr = new Array();
              for(var i = 0; i != data.length; ++i) arr[i] = String.fromCharCode(data[i]);
              var bstr = arr.join("");
              var workbook = XLSX.read(bstr, {type:"binary"});
              var first_sheet_name = workbook.SheetNames[0];
              var worksheet = workbook.Sheets[first_sheet_name];
              this.usersToAdd = XLSX.utils.sheet_to_json(worksheet,{raw:true});
              console.log(" LOGGGGGGGGGGGGGGGGGGGGgg ")
              console.log( this.usersToAdd )

              this.goUpload = false
          }

          fileReader.readAsArrayBuffer(this.file);
  }







  public currentUser: any

  constructor(
    public userService: UserService,
    public auth: AuthenticationService,
    public events : EventHandler,
    public router: Router,
    public companyUserService: CompanyUserService 
    )
  {


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
      this.currentUser = JSON.parse( localStorage.getItem('currentUser') )
      this.events.singIn()
    }
  }


  register( )
  {
    console.log("AQUI HAY QUE REGISTRAR")


    for ( let newUser of this.usersToAdd )
    {
      let user = new User()
      for(var propt in newUser)
      {
        if( propt === 'Password')
        {
          user.password = newUser[propt]
        }
        else if( propt === 'username (email)' )
        {
          user.username = newUser[propt]
        }
        else if ( propt === 'Fisrt Name' )
        {
          user.name = newUser[propt]
        }
        else if ( propt === 'Last Name' )
        {
          user.lastname = newUser[propt]
        }
        // else if ( propt === 'Picture (Link)' )
        // {
        //   user.picture = newUser[propt]
        // }
        else if ( propt === 'Role(User – Enterprise – Mentor)' )
        {
          if( newUser[propt] === 'Mentor' || newUser[propt] === 'mentor')
          {
            user.role = '4'
            user.isActive = '0'
          }
          else if( newUser[propt] === 'Enterprise' || newUser[propt] === 'enterprise')
          {
            user.role = '3'
            user.isActive = '0'
          }
          else if( newUser[propt] === 'User' || newUser[propt] === 'user')
          {
            user.role = '1'
            user.isActive = '1'
          }
          else
          {
            alert( "You did not fill correct the Role field, if you dont correct it we are not going to be able to add this user: "+newUser[propt])
          }
        }
        else if ( propt === 'Description' )
        {
          user.description = newUser[propt]
        }
      }

      if( user.role != '' && user.username != '' && user.lastname != '' && user.name != '' )
      {
        user.authorities.id = parseInt(user.role)
        this.userService.store( user ).subscribe( data => {

          let user_id1 = data._links.self.href.split('/')[ ( data._links.self.href.split('/').length - 1 ) ]
          

          if( this.currentUser.role === '3' )
          {
            let newCompanyUser = new CompanyUser()
            newCompanyUser.user_id = this.currentUser.id.toString()
            newCompanyUser.user_id1 = user_id1
            newCompanyUser.isowner = '0'

            this.companyUserService.store( newCompanyUser ).subscribe( data => {
              console.log(newCompanyUser)
            })
          }
          

          this.registeredUsers.push(data)


          if( this.registeredUsers.length === this.usersToAdd.length )
          {
            this.ready = false
          }



        })
      }
      else
      {
        alert("The uploaded file is not correctly filled, please correct it")
      }




    }




  }


  unlockUpload()
  {
    this.secondStep = false
  }

  ngOnInit()
  {
  }

}

