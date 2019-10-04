import { Injectable } from '@angular/core'
import { Http, Headers, RequestOptions, Response } from '@angular/http'
import { Observable } from 'rxjs'
import 'rxjs/add/operator/map'
import { Pupil } from '../Models/Pupil.model'
import { AuthenticationService } from './Authentication.service'
import { base } from './base'

@Injectable()
export class PupilService {

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

    return this.http.get( this.base+'pupils', a ).map( ( res: Response ) => res.json() );
  }


  store ( pupil: any )
  {
    var PupilString = JSON.stringify( pupil )
    return this.http.post( this.base+'pupil', PupilString, this.options).map( ( res: Response ) => res.json() )

  }


  show ( id ) : Observable< Pupil >
  {
    var b = new Headers( { 'Content-Type': 'application/json', 'Authorization': this.authService.token } )
    var a = new RequestOptions( { headers: b } )

    return this.http.get( this.base+'pupils/'+id, a ).map( ( res: Response ) => res.json() )
  }


  update ( pupil: any, id )
  {
    var b = new Headers( { 'Content-Type': 'application/json', 'Authorization': this.authService.token } )
    var a = new RequestOptions( { headers: b } )


    var pupilString = JSON.stringify( pupil )

    return this.http.put( this.base+'pupils/'+id, pupilString, a ).map( ( res: Response ) => res.json() )
  }


  delete ( id )
  {
    var b = new Headers( { 'Content-Type': 'application/json', 'Authorization': this.authService.token } )
    var a = new RequestOptions( { headers: b } )

    return this.http.delete( this.base+'pupils/'+id, a ).map( ( res: Response ) => res.json() )
  }



}
