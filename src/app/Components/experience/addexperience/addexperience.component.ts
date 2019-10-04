import { Component, Inject, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Experience } from '../../../Models/Experience.model'
import { ExperienceService } from '../../../Services/Experience.service'
import { EventHandler } from '../../../Services/EventHandler.service'


@Component({
  selector: 'app-addexperience',
  templateUrl: './addexperience.component.html',
  styleUrls: ['./addexperience.component.css']
})
export class AddexperienceComponent implements OnInit {

  public currentUser: any
  public newExperience: any
  public isFormComplete: any

  //Image Uploading
  public acceptedMimeTypes = [
    'image/jpeg',
    'image/png' ]

  @ViewChild('fileInput') fileInput: ElementRef;
  public fileDataUri : string | ArrayBuffer = '';
  public errorMsg = '';

  public isSpanish


  constructor(
    public dialogRef: MatDialogRef<AddexperienceComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public experienceService: ExperienceService,
    public events: EventHandler
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
    this.newExperience = new Experience()
    this.newExperience.user_id = this.currentUser.id.toString()
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
        this.newExperience.picture = this.fileDataUri
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
    if( this.newExperience.name != '' && this.newExperience.description != '' )
    {
      this.isFormComplete = true
    }
    else
    {
      this.isFormComplete = false
    }
  }


  registerExperience()
  {
    delete this.newExperience.id
    console.log( this.newExperience )
    this.experienceService.store( this.newExperience ).subscribe( data => {
      console.log(data)
      this.events.madeChange()
      this.dialogRef.close()
    })
  }

  ngOnInit()
  {
  }

}
