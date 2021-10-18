import { Injectable } from '@angular/core';
import {Municipio} from '../_models/municipio';
import {UrlService} from '../../util/_services';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {MunicipioIncluirInterface} from '../_models/municipio.interface';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MunicipioService {

  public municipio: Municipio;
  private mun_nome: string = null;
  private _municipio$: Observable<any>;

  constructor(
    private url: UrlService,
    private http: HttpClient
  ) { }

  incluir(nome: string) {

    if (nome === null || nome.length <= 1) {
      const erro = 'Erro -> cadastro -Incluir Municipio';
      const simpleObservable$ = new Observable<any[]>((observer) => {
          observer.next( ['false', '0', erro]);
          observer.complete();
        }
      );
      this._municipio$ = simpleObservable$;
      return this._municipio$;
    }
    this._municipio$ = this.http.post<any[]>(
      this.url.aux + '/incluir', nome,
      { headers: new HttpHeaders().set('Content-Type', 'application/json') }
    );
    return this._municipio$;
  }


}
