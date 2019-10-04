import { Injectable } from '@angular/core'
import { Http, Headers, RequestOptions, Response } from '@angular/http'
import { Observable } from 'rxjs'
import 'rxjs/add/operator/map'
import { User } from '../Models/User.model'
import { AuthenticationService } from './Authentication.service'
import { base } from './base'

@Injectable()
export class UserService {

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

    return this.http.get( this.base+'users', a ).map( ( res: Response ) => res.json() );
  }


  store ( user: User )
  {

    var userObject = { username: user.username, name: user.name, lastname: user.lastname, password: user.password, picture: user.picture, isActive: user.isActive, role: user.role, lastpasswordreset: user.lastpasswordreset, enabled: user.enabled, authorities: [ { id: user.authorities.id } ], description: user.description }
    console.log(userObject)
    var UserString = JSON.stringify( userObject )
    console.log(UserString)
    return this.http.post( this.base+'users', UserString, this.options).map( ( res: Response ) => res.json() )

  }


  show ( id ) : Observable< User >
  {
    var b = new Headers( { 'Content-Type': 'application/json', 'Authorization': this.authService.token } )
    var a = new RequestOptions( { headers: b } )

    return this.http.get( this.base+'users/'+id, a ).map( ( res: Response ) => res.json() )
  }


  update ( user: any, id )
  {
    var b = new Headers( { 'Content-Type': 'application/json', 'Authorization': this.authService.token } )
    var a = new RequestOptions( { headers: b } )


    var userString = JSON.stringify( user )

    return this.http.put( this.base+'users/'+id, userString, a ).map( ( res: Response ) => res.json() )
  }


  delete ( id )
  {
    var b = new Headers( { 'Content-Type': 'application/json', 'Authorization': this.authService.token } )
    var a = new RequestOptions( { headers: b } )

    return this.http.delete( this.base+'users/'+id, a ).map( ( res: Response ) => res.json() )
  }

  showMySelf()
  {
    var b = new Headers( { 'Content-Type': 'application/json', 'Authorization': this.authService.token } )
    var a = new RequestOptions( { headers: b } )

    return this.http.get( this.base+'user', a ).map( ( res: Response ) => res.json() )
  }



}
