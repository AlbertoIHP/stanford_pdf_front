import { Injectable } from '@angular/core'
import { Http, Headers, RequestOptions, Response } from '@angular/http'
import { Observable } from 'rxjs'
import 'rxjs/add/operator/map'
import { Distribution } from '../Models/Distribution.model'
import { AuthenticationService } from './Authentication.service'
import { base } from './base'

@Injectable()
export class DistributionService {

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

    return this.http.get( this.base+'distributions', a ).map( ( res: Response ) => res.json() );
  }


  store ( distribution: any )
  {
    var DistributionString = JSON.stringify( distribution )
    return this.http.post( this.base+'distribution', DistributionString, this.options).map( ( res: Response ) => res.json() )

  }


  show ( id ) : Observable< Distribution >
  {
    var b = new Headers( { 'Content-Type': 'application/json', 'Authorization': this.authService.token } )
    var a = new RequestOptions( { headers: b } )

    return this.http.get( this.base+'distributions/'+id, a ).map( ( res: Response ) => res.json() ).catch((err) => {

                // Do messaging and error handling here

                return Observable.throw(err)
            })
  }


  update ( distribution: any, id )
  {
    var b = new Headers( { 'Content-Type': 'application/json', 'Authorization': this.authService.token } )
    var a = new RequestOptions( { headers: b } )


    var distributionString = JSON.stringify( distribution )

    return this.http.put( this.base+'distributions/'+id, distributionString, a ).map( ( res: Response ) => res.json() )
  }


  delete ( id )
  {
    var b = new Headers( { 'Content-Type': 'application/json', 'Authorization': this.authService.token } )
    var a = new RequestOptions( { headers: b } )

    return this.http.delete( this.base+'distributions/'+id, a ).map( ( res: Response ) => res.json() )
  }



}
