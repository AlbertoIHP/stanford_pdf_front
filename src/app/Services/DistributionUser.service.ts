import { Injectable } from '@angular/core'
import { Http, Headers, RequestOptions, Response } from '@angular/http'
import { Observable } from 'rxjs'
import 'rxjs/add/operator/map'
import { DistributionUser } from '../Models/DistributionUser.model'
import { AuthenticationService } from './Authentication.service'
import { base } from './base'

@Injectable()
export class DistributionUserService {

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

    return this.http.get( this.base+'distributionusers', a ).map( ( res: Response ) => res.json() );
  }


  store ( distributionuser: any )
  {
    var DistributionUserString = JSON.stringify( distributionuser )
    return this.http.post( this.base+'distributionuser', DistributionUserString, this.options).map( ( res: Response ) => res.json() )

  }


  show ( id ) : Observable< DistributionUser >
  {
    var b = new Headers( { 'Content-Type': 'application/json', 'Authorization': this.authService.token } )
    var a = new RequestOptions( { headers: b } )

    return this.http.get( this.base+'distributionusers/'+id, a ).map( ( res: Response ) => res.json() )
  }


  update ( distributionuser: any, id )
  {
    var b = new Headers( { 'Content-Type': 'application/json', 'Authorization': this.authService.token } )
    var a = new RequestOptions( { headers: b } )


    var distributionuserString = JSON.stringify( distributionuser )

    return this.http.put( this.base+'distributionusers/'+id, distributionuserString, a ).map( ( res: Response ) => res.json() )
  }


  delete ( id )
  {
    var b = new Headers( { 'Content-Type': 'application/json', 'Authorization': this.authService.token } )
    var a = new RequestOptions( { headers: b } )

    return this.http.delete( this.base+'distributionusers/'+id, a ).map( ( res: Response ) => res.json() )
  }



}
