import { Injectable } from '@angular/core';
import {HttpHeaders} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class HeaderService {

  token: string | null = null;
  rtoken: string | null = null;
  cabeca: HttpHeaders | null = null;
  rcabeca: HttpHeaders | null = null;
  constructor() {
    this.token = localStorage.getItem('access_token');
    this.rtoken = localStorage.getItem('reflesh_token');
    //const httpOptions = { headers: new HttpHeaders({ 'Authorization' : 'Bearer ' + localStorage.getItem('access_token'),'Content-Type': 'application/json'})};
    if (this.token !== null) {
      this.cabeca = new HttpHeaders({
        'Authorization':  'Bearer ' + this.token,
        'Content-Type': 'application/json'
      });
    }
    if (this.rtoken !== null) {
      this.rcabeca = new HttpHeaders({
        'Authorization':  'Bearer ' + this.rtoken,
        'Content-Type': 'application/json'
      });
    }
  }

  public static get tokenHeader(): { headers: HttpHeaders } {
    // httpOptions = {headers: HeaderService.tokenHeader};
    const tk: HttpHeaders =  new HttpHeaders({
      'Authorization':  'Bearer ' + localStorage.getItem('access_token'),
      'Content-Type': 'application/json'
    });
    return {headers: tk};
  }

  public static get autTokenHeader(): { headers: HttpHeaders } {
    // httpOptions = {headers: HeaderService.tokenHeader};
    const tk: HttpHeaders =  new HttpHeaders({
      'Authorization':  'Bearer ' + localStorage.getItem('access_token')
    });
    return {headers: tk};
  }

  get headers(): HttpHeaders {
    if (this.cabeca === null) {
      return new HttpHeaders();
    } else {
      return this.cabeca;
    }
  }


}
