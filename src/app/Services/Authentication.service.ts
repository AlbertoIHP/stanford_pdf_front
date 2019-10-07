import { Injectable } from '@angular/core';
import { Http, Headers,RequestOptions, Response } from '@angular/http';
import { Observable } from 'rxjs';
import 'rxjs/Rx'
import { base } from './base'



@Injectable()
export class AuthenticationService {

  public token: string;
  public base = base.api
  public headers;
  public options;

  constructor(private http: Http)
  {
    var currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.token = currentUser && currentUser.token;
  }


  analyze_pdf( base_64: String ) : Observable<any>
  {
    this.headers = new Headers({'Content-Type': 'application/json'})
    this.options = new RequestOptions({ headers: this.headers })

    return this.http.post( this.base+'meet/tag_analyzer', JSON.stringify({ pdf_base_64: base_64 }), this.options ).map( (response) => {
      //console.log("Response analyze PDF: ",response)
      return response
    }).catch( e => {
      return Observable.of(false)
      //return this.capturaDeError(e)
    })    
  }


  //Metodo que se encarga de realizar el login a la API
  login(username: string, password: string): Observable<boolean>
  {

    //El tipo de contenido JSON
    var contentType = 'application/json'

    //En la cabecera se incluye el tipo de contenido JSON, y ademas el usuario y contrasena codificados
    this.headers = new Headers({ 'Content-Type' : contentType })

    //Creamos las opciones de HTTP mediante RequestOptions
    this.options = new RequestOptions({ headers: this.headers })


    var body = JSON.stringify( { username: username, password: password } )
    console.log("Cuerpo: ",body)

    //Hacemos la peticion a la API, le entregamos el token con la clave maestra de aplicacion y las opciones configuradas
    return this.http.post( this.base+'auth', body, this.options ).map( (response) => {
      console.log(response)
      return this.verificar(response, username)
    }).catch( e => {
      return Observable.of(false)
      //return this.capturaDeError(e)
    })
  }


  //Metodo de validacion de errores de la API (Codigos HTTP)
  capturaDeError(error)
  {
      if (error.status === 401)
      {
        return Observable.throw('Unauthorized');
      }
      else if( error.status === 403)
      {
        return Observable.of(false)
      }
  }



  //Metodo que verifica la respuesta de la API
  verificar(response, username)
  {
        if (response.ok)
        {
          let token = response.json() && response.json().token;
          this.token = token;

          localStorage.setItem('token', JSON.stringify({ token: token }));

          return true


        }
        else
        {
          return false;
        }
  }




  logout(): void
  {

    console.log("Borrando token del localstorage y del servicio");
    // clear token remove user from local storage to log user out
    this.token = null;

    localStorage.removeItem('token');

    localStorage.removeItem('currentUser');

  }




}
