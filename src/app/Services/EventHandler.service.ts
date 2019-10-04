import { Injectable, EventEmitter } from '@angular/core';

@Injectable()
export class EventHandler
{
    public isSingIn: any
    public isSingOut: any
    public isSingUp: any
    public hasModified: any
    public transmition: any
    public language: any
    public isSpanish: boolean



    constructor() {
        this.isSingIn = new EventEmitter()
        this.isSingOut = new EventEmitter()
        this.isSingUp = new EventEmitter()
        this.hasModified = new EventEmitter()
        this.transmition = new EventEmitter()
        this.language = new EventEmitter()
        this.isSpanish = false
    }

    public transmit( data )
    {
      this.transmition.emit( data )
    }

    public changeLanguage( val )
    {
        this.isSpanish = val
        this.language.emit( this.isSpanish )
    }


    public singIn()
    {
      this.isSingIn.emit()
    }

    public singOut()
    {
      localStorage.clear()
      this.isSingOut.emit()
    }

    public singUp(newUser) {
      this.isSingUp.emit(newUser)
    }


    public madeChange()
    {
      this.hasModified.emit()
    }

}
