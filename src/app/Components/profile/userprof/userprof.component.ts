import { Component, OnInit, Input } from '@angular/core';
import { ElementRef } from '@angular/core';

import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { EventHandler } from '../../../Services/EventHandler.service'
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
  public analyzed_response_docs;
  public showContent: any = false
  public is_analyzing_files: boolean = false;
  public steps: Array<boolean> = [];

  constructor( public events : EventHandler, private el: ElementRef, private _formBuilder: FormBuilder  )
  {
    this.base64_pdf_array = [];
    this.unsopported_files = [];
    this.isUploadedFiles = false;
  }

  invalid_files(fileList: Array<File>) {
    console.log("Archivos invalidos", fileList)
    this.unsopported_files = fileList
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
      for (var i = 0; i < this.files.length; i++) 
      {        
          console.log("Aca se debe hacer el fetch al servidor para el doc en base 64: ",this.files[i])
        this.steps[i] = true

       
      }
    }
  }


  ngOnChanges()
  {
    if( this.currentUser && this.userToShow )
    {

      this.showContent = true
    }
  }





}
