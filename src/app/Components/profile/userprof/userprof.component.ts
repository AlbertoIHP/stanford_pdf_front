import { Component, OnInit, Input } from '@angular/core';
import { ElementRef } from '@angular/core';
import { Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { EventHandler } from '../../../Services/EventHandler.service'
import { AuthenticationService } from '../../../Services/Authentication.service'


//Child components
import { ViewAnalyzedDetailComponent } from './view-analyzed-detail/view-analyzed-detail.component'

@Component({
  selector: 'app-userprof',
  templateUrl: './userprof.component.html',
  styleUrls: ['./userprof.component.css']
})
export class UserprofComponent implements OnInit
{
  @Input('currentUser') currentUser: any
  @Input('userToShow') userToShow: any
  public isMaxSelect = false;
  public firstFormGroup: FormGroup;
  public secondFormGroup: FormGroup;
  public base64_pdf_array: Array<String>;
  public files: Array<File>;
  public isUploadedFiles: boolean;
  public unsopported_files: Array<File>;
  public analyzed_response_docs: Array<any>;
  public showContent: any
  public is_analyzing_files: boolean;
  public steps: Array<boolean>;
  public showFinalScreen: boolean

  constructor( public events : EventHandler, private el: ElementRef, private _formBuilder: FormBuilder, public analyze_service: AuthenticationService, public dialog: MatDialog  )
  {
    this.base64_pdf_array = [];
    this.unsopported_files = [];
    this.analyzed_response_docs = [ "", "", [] ];
    this.isUploadedFiles = false;
    this.steps = []
    this.showFinalScreen = false
    this.is_analyzing_files = false
    this.showContent = false
  }

  invalid_files(fileList: Array<File>) {
    console.log("Archivos invalidos", fileList)
    this.unsopported_files = fileList
  }

  reset()
  {
    this.base64_pdf_array = [];
    this.unsopported_files = [];
    this.analyzed_response_docs = [ "", "", [] ];
    this.isUploadedFiles = false;
    this.steps = []
    this.showFinalScreen = false
    this.is_analyzing_files = false
  }


  ngOnInit() {
    this.firstFormGroup = this._formBuilder.group({
      firstCtrl: ['', Validators.required],
    });
    this.secondFormGroup = this._formBuilder.group({
      secondCtrl: ['', Validators.required],
    });
  }







    handle_file_dropped(targetInput: Array<File>){

      this.files = targetInput;

      this.files.length > 10 ? alert("Max of 10 files exceeded") : null;

      if (this.files) 
      {
        this.isUploadedFiles = true;
        for (var i = 0 ; i < this.files.length ; i++) 
        {
          this.steps.push(false);
          console.log("Uplaoded file number ",i,": ", this.files[i])
          const reader: FileReader = new FileReader();
          reader.onload =this._handleReaderLoaded.bind(this);
          reader.readAsBinaryString(this.files[i]);


      }
      console.log("Base64 PDF docs: ",this.base64_pdf_array)
    }


    }
  

  _handleReaderLoaded(readerEvt) {
     let binaryString = readerEvt.target.result;
      this.base64_pdf_array.push(btoa(binaryString))
      console.log("Base64 PDF: ",this.base64_pdf_array);
    }

  

 goAnalyzeDocs()
  {
    if( this.files.length < 1)
    {
      alert("You need to upload files first")
    }
    else
    {
      this.is_analyzing_files = true;
      for (let i = 0; i < this.base64_pdf_array.length; i++) 
      {        


          this.analyze_service.analyze_pdf(this.base64_pdf_array[i]).subscribe( (data) => {
            let final_json_res = JSON.parse(data._body)
            //console.log("Este es el array de respuesta de analisis: ",final_json_res)
            this.steps[i] = true
            this.analyzed_response_docs[0] = final_json_res.abbreviation_tags
            this.analyzed_response_docs[1] = final_json_res.description_tags
            this.analyzed_response_docs[2].push( { values_tags: final_json_res.values_tags, index: i } )
            this.check_ended_service()
          })       

       
      }
    }
  }

  check_ended_service()
  {
    let end = true
    let total = this.steps.length
    let count = 0
    for (var i = 0; i < total; ++i) 
    {
      if(this.steps[i])
      {
        count++
      }
    }

    if(count === total)
    {
      this.is_analyzing_files = false
      this.isUploadedFiles = false
      this.showFinalScreen = true
      console.log("Todo cargado: ",this.analyzed_response_docs)
    }

  }


  ngOnChanges()
  {
    console.log("Steps: ", this.steps)




    if( this.currentUser && this.userToShow )
    {

      this.showContent = true
    }
  }


  openViewDetail( shortcut: Array<any>, description: Array<any>, values: Array<any> )
  {

    let dialogRef = this.dialog.open( ViewAnalyzedDetailComponent, {
      //Los parámetros se asignan y se envían los datos necesarios
      width: '1000px',
      data:
      {
       shortcut: shortcut,
       description: description,
       values: values
      }
    });
  }




}
