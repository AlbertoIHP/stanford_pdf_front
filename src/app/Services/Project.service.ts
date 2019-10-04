import { Injectable } from '@angular/core'
import { Http, Headers, RequestOptions, Response } from '@angular/http'
import { Observable } from 'rxjs'
import 'rxjs/add/operator/map'
import { Project } from '../Models/Project.model'
import { AuthenticationService } from './Authentication.service'
import { base } from './base'

@Injectable()
export class ProjectService {

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

    return this.http.get( this.base+'projects', a ).map( ( res: Response ) => res.json() );
  }


  store ( project: any )
  {
    var ProjectString = JSON.stringify( project )
    return this.http.post( this.base+'project', ProjectString, this.options).map( ( res: Response ) => res.json() )

  }


  show ( id ) : Observable< Project >
  {
    var b = new Headers( { 'Content-Type': 'application/json', 'Authorization': this.authService.token } )
    var a = new RequestOptions( { headers: b } )

    return this.http.get( this.base+'projects/'+id, a ).map( ( res: Response ) => res.json() )
  }


  update ( project: any, id )
  {
    var b = new Headers( { 'Content-Type': 'application/json', 'Authorization': this.authService.token } )
    var a = new RequestOptions( { headers: b } )


    var projectString = JSON.stringify( project )

    return this.http.put( this.base+'projects/'+id, projectString, a ).map( ( res: Response ) => res.json() )
  }


  delete ( id )
  {
    var b = new Headers( { 'Content-Type': 'application/json', 'Authorization': this.authService.token } )
    var a = new RequestOptions( { headers: b } )

    return this.http.delete( this.base+'projects/'+id, a ).map( ( res: Response ) => res.json() )
  }



}
