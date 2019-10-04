import { Injectable } from '@angular/core'
import { Http, Headers, RequestOptions, Response } from '@angular/http'
import { Observable } from 'rxjs'
import 'rxjs/add/operator/map'
import { CompanyUser } from '../Models/CompanyUser.model'
import { AuthenticationService } from './Authentication.service'
import { base } from './base'

@Injectable()
export class CompanyUserService {

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

    return this.http.get( this.base+'companyusers', a ).map( ( res: Response ) => res.json() );
  }


  store ( companyuser: any )
  {
    var CompanyUserString = JSON.stringify( companyuser )
    return this.http.post( this.base+'companyuser', CompanyUserString, this.options).map( ( res: Response ) => res.json() )

  }


  show ( id ) : Observable< CompanyUser >
  {
    var b = new Headers( { 'Content-Type': 'application/json', 'Authorization': this.authService.token } )
    var a = new RequestOptions( { headers: b } )

    return this.http.get( this.base+'companyusers/'+id, a ).map( ( res: Response ) => res.json() )
  }


  update ( companyuser: any, id )
  {
    var b = new Headers( { 'Content-Type': 'application/json', 'Authorization': this.authService.token } )
    var a = new RequestOptions( { headers: b } )


    var companyuserString = JSON.stringify( companyuser )

    return this.http.put( this.base+'companyusers/'+id, companyuserString, a ).map( ( res: Response ) => res.json() )
  }


  delete ( id )
  {
    var b = new Headers( { 'Content-Type': 'application/json', 'Authorization': this.authService.token } )
    var a = new RequestOptions( { headers: b } )

    return this.http.delete( this.base+'companyusers/'+id, a ).map( ( res: Response ) => res.json() )
  }



}
