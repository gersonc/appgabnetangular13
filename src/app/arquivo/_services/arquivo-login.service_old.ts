import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, Subscription } from 'rxjs';
import { UrlService } from '../../_services';
import { ArquivoPermissaoInterface} from '../_models';

import { take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ArquivoLoginService {


  private sub: Subscription[] = [];

  constructor(
    private url: UrlService,
    private http: HttpClient
  ) { }

  private getArquivoPermissoes(): Observable<ArquivoPermissaoInterface> {
    const url = this.url.arquivo + '/permissoes';
    return this.http.get<ArquivoPermissaoInterface>(url);
  }

  public verificaPermissoes() {
    if (!sessionStorage.getItem('arquivo-permissoes')) {
      this.sub.push(this.getArquivoPermissoes()
        .pipe(take(1))
        .subscribe({
          next: (dados) => {
            sessionStorage.setItem('arquivo-permissoes', JSON.stringify(dados));
          },
          error: err => {
            console.log(err);
          },
          complete: () => {
            this.unsub();
          }
        })
      );
    }
  }

  private unsub() {
    this.sub.forEach(s => s.unsubscribe());
  }

}
