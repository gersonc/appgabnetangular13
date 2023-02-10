import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, Subscription } from 'rxjs';
import { UrlService } from '../../_services';
import { ArquivoPermissaoInterface} from '../_models';

import { take } from 'rxjs/operators';
import { HeaderService } from "../../_services/header.service";

@Injectable({
  providedIn: 'root'
})
export class ArquivoLoginService {


  public arquivoPermissao: ArquivoPermissaoInterface;
  private sub: Subscription[] = [];


  constructor(
    private url: UrlService,
    private http: HttpClient
  ) { }

  private getArquivoPermissoes(): Observable<ArquivoPermissaoInterface> {
    const url = this.url.arquivo + '/permissoes';
    return this.http.get<ArquivoPermissaoInterface>(url, HeaderService.tokenHeader);
  }

  // @ts-ignore
  public verificaPermissoes(): ArquivoPermissaoInterface {
    if (!sessionStorage.getItem('arquivo-permissoes')) {
      this.sub.push(this.getArquivoPermissoes().pipe(take(1)).subscribe({
        next: (dados) => {
          this.arquivoPermissao = dados;
          sessionStorage.setItem('arquivo-permissoes', JSON.stringify(dados));
        },
        error: err => {
          console.error(err);
        },
        complete: () => {
          this.unsub();
          return this.arquivoPermissao;
        }
      }));
    } else {
      this.arquivoPermissao = JSON.parse(sessionStorage.getItem('arquivo-permissoes'));
      return this.arquivoPermissao;
    }
  }

  private unsub() {
    this.sub.forEach(s => s.unsubscribe());
  }

}
