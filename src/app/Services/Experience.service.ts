import { Injectable } from '@angular/core'
import { Http, Headers, RequestOptions, Response } from '@angular/http'
import { Observable } from 'rxjs'
import 'rxjs/add/operator/map'
import { Experience } from '../Models/Experience.model'
import { AuthenticationService } from './Authentication.service'
import { base } from './base'

@Injectable()
export class ExperienceService {

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

    return this.http.get( this.base+'experiences', a ).map( ( res: Response ) => res.json() );
  }


  store ( experience: any )
  {
    var ExperienceString = JSON.stringify( experience )
    return this.http.post( this.base+'experience', ExperienceString, this.options).map( ( res: Response ) => res.json() )

  }


  show ( id ) : Observable< Experience >
  {
    var b = new Headers( { 'Content-Type': 'application/json', 'Authorization': this.authService.token } )
    var a = new RequestOptions( { headers: b } )

    return this.http.get( this.base+'experiences/'+id, a ).map( ( res: Response ) => res.json() )
  }


  update ( experience: any, id )
  {
    var b = new Headers( { 'Content-Type': 'application/json', 'Authorization': this.authService.token } )
    var a = new RequestOptions( { headers: b } )


    var experienceString = JSON.stringify( experience )

    return this.http.put( this.base+'experiences/'+id, experienceString, a ).map( ( res: Response ) => res.json() )
  }


  delete ( id )
  {
    var b = new Headers( { 'Content-Type': 'application/json', 'Authorization': this.authService.token } )
    var a = new RequestOptions( { headers: b } )

    return this.http.delete( this.base+'experiences/'+id, a ).map( ( res: Response ) => res.json() )
  }



}
