import { Component, OnInit, Input } from '@angular/core';

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





  public showContent: any = false
  public isSpanish

  constructor( public events : EventHandler )
  {
    this.isSpanish = false
    this.events.language.subscribe( isSpanish => {
      this.isSpanish = isSpanish
      console.log( this.isSpanish )
    })


  }

  ngOnInit()
  {
  }

  ngOnChanges()
  {
    if( this.currentUser && this.userToShow )
    {

      this.showContent = true
    }
  }


}
