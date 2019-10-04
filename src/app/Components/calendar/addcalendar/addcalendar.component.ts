import { Component, Inject, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Calendar } from '../../../Models/Calendar.model'
import { CalendarUser } from '../../../Models/CalendarUser.model'
import { CalendarService } from '../../../Services/Calendar.service'
import { CalendarUserService } from '../../../Services/CalendarUser.service'
import { UserService } from '../../../Services/User.service'
import { EventHandler } from '../../../Services/EventHandler.service'
import { CompanyUserService } from '../../../Services/CompanyUser.service'


@Component({
  selector: 'app-addcalendar',
  templateUrl: './addcalendar.component.html',
  styleUrls: ['./addcalendar.component.css']
})
export class AddcalendarComponent implements OnInit {

  public currentUser: any
  public newCal: any
  public isFormComplete: any
  public newCalUser: any
  public usersList: any
  public choosedUsers: any
  public userToAdd: any

  //Image Uploading
  public acceptedMimeTypes = [
    'image/jpeg',
    'image/png' ]

  @ViewChild('fileInput') fileInput: ElementRef;
  public fileDataUri : string | ArrayBuffer= '';
  public errorMsg = '';

  public isSpanish


  constructor(
    public dialogRef: MatDialogRef<AddcalendarComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public calendarService: CalendarService,
    public calendarUserService: CalendarUserService,
    public userService: UserService,
    public events: EventHandler,
    public companyUserService: CompanyUserService
    )
  {


    this.isSpanish = this.events.isSpanish
    this.events.language.subscribe( isSpanish => {
      this.isSpanish = isSpanish
      console.log( this.isSpanish )
    })


    console.log(data)
    this.isFormComplete = false
    this.currentUser = data.currentUser
    this.newCalUser = []
    this.newCal = new Calendar()
    this.choosedUsers = []
    this.userToAdd = { username: 'Select an user to add' }
    this.usersList = []



    this.currentUser.role === '3' ? this.loadEnterpriseUsers() : this.loadGeneralUsers()




  }


  loadEnterpriseUsers()
  {
    this.companyUserService.index().subscribe( data => {

      data = data._embedded.companyusers.filter( company => parseInt(company.user_id) === this.currentUser.id )


      for( let id of data )
      {
        this.userService.show( id.user_id1 ).subscribe( companyUs  => {
          this.usersList.push( companyUs )
        })
      }


    })
  }



  loadGeneralUsers()
  {
    this.userService.index().subscribe( data => {
      console.log(data)

      data = data._embedded.users.filter( user => user.username != this.currentUser.username )

      this.usersList = data
    })    
  }


  // Image Uploading
  previewFile()
  {
    const file = this.fileInput.nativeElement.files[0];
    if (file && this.validateFile(file))
    {

      const reader = new FileReader();
      reader.readAsDataURL(this.fileInput.nativeElement.files[0]);
      reader.onload = () => {

        this.fileDataUri = reader.result;
        this.newCal.picture = this.fileDataUri
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


  verifyInformation()
  {
    if( this.newCal.name != '' && this.newCal.description != '' && this.choosedUsers.length > 0 )
    {
      this.isFormComplete = true
    }
    else
    {
      this.isFormComplete = false
    }
  }

  addUserToList()
  {
    console.log( this.userToAdd )

    if( this.userToAdd.username != 'Select an user to add' )
    {
      this.choosedUsers.push( this.userToAdd )


      for( let i = 0 ; i < this.usersList.length ; i ++ )
      {
        console.log(this.userToAdd.username)
        if( this.usersList[i].username === this.userToAdd.username )
        {
          this.usersList.splice( i, 1 )
          break
        }
      }
      this.userToAdd = { username: 'Select an user to add' }
    }
  }




  deleteUser( user )
  {
    for( let i = 0 ; i < this.choosedUsers.length ; i ++ )
    {
      if( this.choosedUsers[i].username === user.username )
      {
        this.choosedUsers.splice( i, 1 )
        this.usersList.push( user )
        break
      }
    }
  }

  changeUserSelected( user )
  {
    this.userToAdd = user
  }


  register()
  {

    this.choosedUsers


    delete this.newCal.id

    this.calendarService.store( this.newCal ).subscribe( data => {

      let disId = data.id

      let ownerRelation = new CalendarUser()
      delete ownerRelation.id
      ownerRelation.user_id = this.currentUser.id.toString()
      ownerRelation.calendar_id = disId.toString()
      ownerRelation.isowner = '1'

      this.calendarUserService.store( ownerRelation ).subscribe( data => {
        for( let i = 0 ; i < this.choosedUsers.length ; i ++ )
        {
          let normalUserRelation = new CalendarUser()
          let userId = this.choosedUsers[i]._links.self.href.split('/')[ ( this.choosedUsers[i]._links.self.href.split('/').length - 1 ) ]
          delete normalUserRelation.id
          normalUserRelation.user_id = userId.toString()
          normalUserRelation.calendar_id = disId.toString()
          this.calendarUserService.store ( normalUserRelation ).subscribe( data => {
          })
        }

        this.events.madeChange()
        this.dialogRef.close()

      })

    })
  }

  ngOnInit()
  {
  }

}
