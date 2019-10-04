import { Component, OnInit, ViewChild, ElementRef } from '@angular/core'
import { EventHandler } from '../../../Services/EventHandler.service'
import { AuthenticationService } from '../../../Services/Authentication.service'
import { UserService } from '../../../Services/User.service'
import { Router } from '@angular/router'

@Component({
  selector: 'app-editprofile',
  templateUrl: './editprofile.component.html',
  styleUrls: ['./editprofile.component.css']
})
export class EditprofileComponent implements OnInit {

  public currentUser: any
  public isSpanish

  constructor( public userService: UserService, public auth: AuthenticationService, public events : EventHandler, public router: Router )
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
      console.log(this.currentUser)
      this.events.singIn()
    }
  }
  public acceptedMimeTypes = [
    'image/jpeg',
    'image/png']

  @ViewChild('fileInput') fileInput: ElementRef;
  public fileDataUri : any= '';
  public errorMsg = '';



  previewFile() {
    const file = this.fileInput.nativeElement.files[0];
    if (file && this.validateFile(file)) {

      const reader = new FileReader();
      reader.readAsDataURL(this.fileInput.nativeElement.files[0]);
      reader.onload = () => {

        this.fileDataUri = reader.result;
        this.currentUser.picture = this.fileDataUri
        console.log(this.fileDataUri)
      }
    }
    else {
      this.errorMsg = 'File must be jpg or png and cannot be exceed 50 MB in size'
    }
  }


  updateUser()
  {
    let userId = this.currentUser.id
    delete this.currentUser.id
    this.userService.update( this.currentUser, userId  ).subscribe( data => {
      data.id = userId
      localStorage.removeItem('currentUser')
      localStorage.setItem('currentUser', JSON.stringify( data ) )
    })


  }

  uploadFile()
  {

    // get only the base64 file
    if (this.fileDataUri.length > 0) {
      const base64File = this.fileDataUri.split(',')[1];
      // TODO: send to server
      console.log(base64File);
    }

  }

  validateFile(file) {
    return this.acceptedMimeTypes.includes(file.type) && file.size < 500000000;
  }

  ngOnInit()
  {
  }

}
