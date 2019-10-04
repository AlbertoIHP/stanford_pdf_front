import { Component, Inject, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Distribution } from '../../../Models/Distribution.model'
import { DistributionUser } from '../../../Models/DistributionUser.model'
import { DistributionService } from '../../../Services/Distribution.service'
import { DistributionUserService } from '../../../Services/DistributionUser.service'
import { UserService } from '../../../Services/User.service'
import { EventHandler } from '../../../Services/EventHandler.service'
import { CompanyUserService } from '../../../Services/CompanyUser.service'

@Component({
  selector: 'app-editdistribution',
  templateUrl: './editdistribution.component.html',
  styleUrls: ['./editdistribution.component.css']
})
export class EditdistributionComponent implements OnInit {

  public currentUser: any
  public newDis: any
  public isFormComplete: any
  public newDisUser: any
  public usersList: any
  public choosedUsers: any
  public userToAdd: any
  public usersToAdd: any
  public usersToDelete: any

  //Image Uploading
  public acceptedMimeTypes = [
    'image/jpeg',
    'image/png' ]

  @ViewChild('fileInput') fileInput: ElementRef;
  public fileDataUri : string | ArrayBuffer= '';
  public errorMsg = '';

  public isSpanish

  constructor(
    public dialogRef: MatDialogRef<EditdistributionComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public distributionService: DistributionService,
    public distributionUserService: DistributionUserService,
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
    this.newDisUser = []
    this.newDis = data.distribution
    this.choosedUsers = []
    this.usersToAdd = []
    this.usersToDelete = []
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


      this.filterUsers()


    })
  }



  loadGeneralUsers()
  {
    this.userService.index().subscribe( data => {

      data = data._embedded.users.filter( user => user.username != this.currentUser.username )
      this.usersList = data
      this.filterUsers()
    })   
  }


  filterUsers()
  {
      this.distributionUserService.index().subscribe( data => {
        data = data._embedded.distributionusers

        let disId = this.newDis._links.self.href.split('/')[ ( this.newDis._links.self.href.split('/').length - 1 ) ]
        data = data.filter( dis => dis.distribution_id === disId && dis.isowner === '0' )

        for( let user of data )
        {

          this.userService.show( user.user_id ).subscribe( data => {
            let aux = this.usersList.filter( us => us.username === data.username )

            if( aux.length >= 1 )
            {
              for( let i = 0 ; i < this.usersList.length ; i ++ )
              {
                if( this.usersList[i].username === data.username )
                {
                  this.usersList.splice( i, 1 )
                }
                else
                {
                  this.usersList[i].alreadyExist = false
                }

              }
            }

            this.choosedUsers.push( data )

          })


        }

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
        this.newDis.picture = this.fileDataUri
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
    if( this.newDis.name != '' && this.newDis.description != '' )
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

    if( this.userToAdd.username != 'Select an user to add' )
    {

      if( this.userToAdd.alreadyExist )
      {
        this.choosedUsers.push( this.userToAdd )
      }
      else
      {
        this.usersToAdd.push( this.userToAdd )

      }


      for( let i = 0 ; i < this.usersList.length ; i ++ )
      {
        if( this.usersList[i].username === this.userToAdd.username )
        {
          this.usersList.splice( i, 1 )
          break
        }
      }

      for( let i = 0 ; i < this.usersToDelete.length ; i ++ )
      {
        if( this.usersToDelete[i].username === this.userToAdd.username )
        {
          this.usersToDelete.splice( i, 1 )
          break
        }
      }


      this.userToAdd = { username: 'Select an user to add' }
      console.log( this.usersToAdd )
      console.log( this.usersToDelete )
      console.log( this.choosedUsers )


    }
  }




  deleteUser( user )
  {
    let aux = this.choosedUsers.filter( us => us.username === user.username )

    let aux2 = this.usersToAdd.filter( us => us.username === user.username )

    if( aux.length >= 1 )
    {
      for( let i = 0 ; i < this.choosedUsers.length ; i ++ )
      {
        if( this.choosedUsers[i].username === user.username )
        {
          this.choosedUsers.splice( i, 1 )
          user.alreadyExist = true
          this.usersList.push( user )
          this.usersToDelete.push ( user )
          break
        }
      }
    }
    else if( aux2.length >= 1 )
    {
      for( let i = 0 ; i < this.usersToAdd.length ; i ++ )
      {
        if( this.usersToAdd[i].username === user.username )
        {
          this.usersToAdd.splice( i, 1 )
          this.usersList.push( user )
          user.alreadyExist = false
          break
        }
      }
    }

      console.log( this.usersToAdd )
      console.log( this.usersToDelete )
      console.log( this.choosedUsers )



  }

  changeUserSelected( user )
  {
    console.log(user)
    this.userToAdd = user
  }


  edit()
  {
    let disId = this.newDis._links.self.href.split('/')[ ( this.newDis._links.self.href.split('/').length - 1 ) ]

    this.distributionService.update( this.newDis, disId ).subscribe( data => {


      for( let us of this.usersToAdd )
      {
        let usId = us._links.self.href.split('/')[ ( us._links.self.href.split('/').length - 1 ) ]


        let newRelation = new DistributionUser()
        newRelation.distribution_id = disId
        newRelation.user_id = usId
        console.log( newRelation )
        delete newRelation.id
        this.distributionUserService.store( newRelation ).subscribe( data => {
            console.log( data )
        })
      }


      for( let us of this.usersToDelete )
      {
        let usId = us._links.self.href.split('/')[ ( us._links.self.href.split('/').length - 1 ) ]

        console.log(usId)

        this.distributionUserService.index().subscribe( data => {

          data = data._embedded.distributionusers

          data = data.filter( a => a.user_id === usId && a.distribution_id === disId )

          if( data.length >= 1 )
          {
            let relation = data[0]
            let relationId = relation._links.self.href.split('/')[ ( relation._links.self.href.split('/').length - 1 ) ]

            this.distributionUserService.delete( relationId ).subscribe( data => {
              console.log( data )
            })
          }

        })

      }


      this.dialogRef.close()
      this.events.madeChange()



    })


  }

  ngOnInit()
  {
  }

}
