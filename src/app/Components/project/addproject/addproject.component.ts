import { Component, Inject, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Project } from '../../../Models/Project.model'
import { ProjectService } from '../../../Services/Project.service'
import { EventHandler } from '../../../Services/EventHandler.service'



@Component({
  selector: 'app-addproject',
  templateUrl: './addproject.component.html',
  styleUrls: ['./addproject.component.css']
})
export class AddprojectComponent implements OnInit {

  public currentUser: any
  public newProject: any
  public isFormComplete: any

  //Image Uploading
  public acceptedMimeTypes = [
    'image/jpeg',
    'image/png' ]

  @ViewChild('fileInput') fileInput: ElementRef;
  public fileDataUri: string | ArrayBuffer = '';
  public errorMsg = '';


  public isSpanish

  constructor(
    public dialogRef: MatDialogRef<AddprojectComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public projectService: ProjectService,
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
    this.newProject = new Project()
    this.newProject.user_id = this.currentUser.id.toString()
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
        this.newProject.picture = this.fileDataUri
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
    if( this.newProject.name != '' && this.newProject.description != '' )
    {
      this.isFormComplete = true
    }
    else
    {
      this.isFormComplete = false
    }
  }


  registerProject()
  {
    delete this.newProject.id
    console.log( this.newProject )
    this.projectService.store( this.newProject ).subscribe( data => {
      console.log(data)
      this.events.madeChange()
      this.dialogRef.close()
    })
  }

  ngOnInit()
  {
  }

}
