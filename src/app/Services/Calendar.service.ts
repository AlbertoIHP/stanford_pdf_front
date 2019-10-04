import { Injectable } from '@angular/core'
import { Http, Headers, RequestOptions, Response } from '@angular/http'
import { Observable } from 'rxjs'
import 'rxjs/add/operator/map'
import { Calendar } from '../Models/Calendar.model'
import { AuthenticationService } from './Authentication.service'
import { base } from './base'

@Injectable()
export class CalendarService {

  public base = base.api
  public options: RequestOptions
  public headers: Headers

  constructor ( private http: Http , public authService: AuthenticationService)
  {
    this.headers = new Headers( { 'Content-Type': 'application/json' } )
    this.options = new RequestOptions( { headers: this.headers } )
  }


  index (): Observable< any >
  {

    var b = new Headers( { 'Content-Type': 'application/json', 'Authorization': this.authService.token } )
    var a = new RequestOptions( { headers: b } )

    return this.http.get( this.base+'calendars', a ).map( ( res: Response ) => res.json() );
  }


  store ( calendar: any )
  {
    var CalendarString = JSON.stringify( calendar )
    return this.http.post( this.base+'calendar', CalendarString, this.options).map( ( res: Response ) => res.json() )

  }


  show ( id ) : Observable< Calendar >
  {
    var b = new Headers( { 'Content-Type': 'application/json', 'Authorization': this.authService.token } )
    var a = new RequestOptions( { headers: b } )

    return this.http.get( this.base+'calendars/'+id, a ).map( ( res: Response ) => res.json() )
  }


  update ( calendar: any, id )
  {
    var b = new Headers( { 'Content-Type': 'application/json', 'Authorization': this.authService.token } )
    var a = new RequestOptions( { headers: b } )


    var calendarString = JSON.stringify( calendar )

    return this.http.put( this.base+'calendars/'+id, calendarString, a ).map( ( res: Response ) => res.json() )
  }


  delete ( id )
  {
    var b = new Headers( { 'Content-Type': 'application/json', 'Authorization': this.authService.token } )
    var a = new RequestOptions( { headers: b } )

    return this.http.delete( this.base+'calendars/'+id, a ).map( ( res: Response ) => res.json() )
  }



}
