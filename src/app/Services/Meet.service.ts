import { Injectable } from '@angular/core'
import { Http, Headers, RequestOptions, Response } from '@angular/http'
import { Observable } from 'rxjs'
import 'rxjs/add/operator/map'
import { Meet } from '../Models/Meet.model'
import { AuthenticationService } from './Authentication.service'
import { base } from './base'

@Injectable()
export class MeetService {

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

    return this.http.get( this.base+'meets', a ).map( ( res: Response ) => res.json() );
  }


  store ( meet: any )
  {
    var MeetString = JSON.stringify( meet )
    return this.http.post( this.base+'meet', MeetString, this.options).map( ( res: Response ) => res.json() )

  }


  show ( id ) : Observable< Meet >
  {
    var b = new Headers( { 'Content-Type': 'application/json', 'Authorization': this.authService.token } )
    var a = new RequestOptions( { headers: b } )

    return this.http.get( this.base+'meets/'+id, a ).map( ( res: Response ) => res.json() )
  }


  update ( meet: any, id )
  {
    var b = new Headers( { 'Content-Type': 'application/json', 'Authorization': this.authService.token } )
    var a = new RequestOptions( { headers: b } )


    var meetString = JSON.stringify( meet )

    return this.http.put( this.base+'meets/'+id, meetString, a ).map( ( res: Response ) => res.json() )
  }


  delete ( id )
  {
    var b = new Headers( { 'Content-Type': 'application/json', 'Authorization': this.authService.token } )
    var a = new RequestOptions( { headers: b } )

    return this.http.delete( this.base+'meets/'+id, a ).map( ( res: Response ) => res.json() )
  }



}
