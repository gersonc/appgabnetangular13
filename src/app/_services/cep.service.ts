import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { CepInterface } from '../_models';


@Injectable({
  providedIn: 'root' // just before your class
})
export class CepService {

  private cep$: Observable<CepInterface[]> | undefined;

  constructor(private http: HttpClient ) { }

  public getCep(cep: string) {
    const urlcep = 'viacep.com.br/ws/' + cep + '/json';

    this.cep$ = this.http.get<CepInterface[]>(urlcep);
    return this.cep$;
  }

}
