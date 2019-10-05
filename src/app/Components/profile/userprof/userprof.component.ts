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
  isMaxSelect = false;
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  currentPage = 0;
  isEmptyDrop = true;
  pdfFile;
  pdfSrc;
  pdfBufferRender;
  localPDF;





  dropPDFOnChance(targetInput: Array<File>) {
    console.log(targetInput)
    if (targetInput.length !== 1) {
      throw new Error('Cannot use multiple files 觸發條跳視窗');
    }
  }

  invalid_files(fileList: Array<File>) {
    console.log("Archivos invalidos", fileList)
    this.isEmptyDrop = false;
  }


  ngOnInit() {
    this.firstFormGroup = this._formBuilder.group({
      firstCtrl: ['', Validators.required],
    });
    this.secondFormGroup = this._formBuilder.group({
      secondCtrl: ['', Validators.required],
    });
  }




  pdfOnload(event) {
    const pdfTatget: any = event.target;
    if (typeof FileReader !== 'undefined') {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.pdfSrc = e.target.result;
        this.localPDF = this.pdfSrc;
      };
      this.pdfBufferRender = pdfTatget.files[0];
      reader.readAsArrayBuffer(pdfTatget.files[0]);
    }
    this.isEmptyDrop = false;
  }



  consoleHeight(evt) {
    if (evt.panel.nativeElement.clientHeight >= 255) {
      this.isMaxSelect = true;
    } else {
      this.isMaxSelect = false;
    }
  }

  transform(value) {
    return (value >= 26 ? this.transform(((value / 26) >> 0) - 1) : '') + 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'[value % 26 >> 0];
  }




  public showContent: any = false
  public isSpanish

  constructor( public events : EventHandler, private el: ElementRef, private _formBuilder: FormBuilder  )
  {
    this.isSpanish = false
    this.events.language.subscribe( isSpanish => {
      this.isSpanish = isSpanish
      console.log( this.isSpanish )
    })


  }



  ngOnChanges()
  {
    if( this.currentUser && this.userToShow )
    {

      this.showContent = true
    }
  }





}
