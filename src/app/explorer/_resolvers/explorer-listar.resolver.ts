import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import {Observable, of, Subject, Subscription} from 'rxjs';
import {Caminho, PastaListagem} from "../_models/arquivo-pasta.interface";
import {ExplorerService} from "../_services/explorer.service";
import {take} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class ExplorerListarResolver implements Resolve<boolean> {

  private sub: Subscription[] = [];
  private resp = new Subject<boolean>();
  public resp$ = this.resp.asObservable();

  constructor(
    private exs: ExplorerService,
    private router: Router
  ) {}


  getPastaListagem() {
    delete this.exs.pastaListagem;
    this.sub.push(this.exs.gerListagem().pipe(take(1)).subscribe({
      next: (dados: PastaListagem) => {
        this.exs.pastaListagem = dados;
        delete this.exs.caminhoAtual;
        this.exs.caminhoAtual = [
          {
            arquivo_pasta_id: dados.arquivo_pasta_id,
            arquivo_pasta_nome: dados.arquivo_pasta_nome,
            arquivo_pasta_titulo: dados.arquivo_pasta_titulo
          }
        ];
      },
      error: (err) => {
        console.error(err);
        this.responde(false);
      },
      complete: () => {
        this.responde(true);
      }
    }));
  }

  responde(r: boolean) {
    this.onDestroy();
    this.resp.next(r);
    this.resp.complete();
  }

  onDestroy(){
    this.sub.forEach(s => {
      s.unsubscribe()
    });
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    this.getPastaListagem();
    return this.resp$;
  }
}
