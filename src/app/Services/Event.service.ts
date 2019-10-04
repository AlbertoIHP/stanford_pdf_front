import { Injectable } from '@angular/core'
import { Http, Headers, RequestOptions, Response } from '@angular/http'
import { Observable } from 'rxjs'
import 'rxjs/add/operator/map'
import { Event } from '../Models/Event.model'
import { AuthenticationService } from './Authentication.service'
import { base } from './base'

@Injectable()
export class EventService {

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

    return this.http.get( this.base+'events', a ).map( ( res: Response ) => res.json() );
  }


  store ( event: any )
  {
    var EventString = JSON.stringify( event )
    return this.http.post( this.base+'event', EventString, this.options).map( ( res: Response ) => res.json() )

  }


  show ( id ) : Observable< Event >
  {
    var b = new Headers( { 'Content-Type': 'application/json', 'Authorization': this.authService.token } )
    var a = new RequestOptions( { headers: b } )

    return this.http.get( this.base+'events/'+id, a ).map( ( res: Response ) => res.json() )
  }


  update ( event: any, id )
  {
    var b = new Headers( { 'Content-Type': 'application/json', 'Authorization': this.authService.token } )
    var a = new RequestOptions( { headers: b } )


    var eventString = JSON.stringify( event )

    return this.http.put( this.base+'events/'+id, eventString, a ).map( ( res: Response ) => res.json() )
  }


  delete ( id )
  {
    var b = new Headers( { 'Content-Type': 'application/json', 'Authorization': this.authService.token } )
    var a = new RequestOptions( { headers: b } )

    return this.http.delete( this.base+'events/'+id, a ).map( ( res: Response ) => res.json() )
  }



}
