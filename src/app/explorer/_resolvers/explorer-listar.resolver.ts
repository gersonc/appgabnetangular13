import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import {Observable, of, Subject, Subscription} from 'rxjs';
import {PastaListagem} from "../_models/arquivo-pasta.interface";
import {ExplorerService} from "../_services/explorer.service";
import {take} from "rxjs/operators";
import { fontStyle } from 'html2canvas/dist/types/css/property-descriptors/font-style';

@Injectable({
  providedIn: 'root'
})
export class ExplorerListarResolver implements Resolve<boolean> {

  private sub: Subscription[] = [];
  private resp = new Subject<boolean>();
  public resp$ = this.resp.asObservable();

  constructor(
    private es: ExplorerService,
    private router: Router
  ) {}


  getPastaListagem() {
    this.es.pastaListagem = [];
    this.sub.push(this.es.gerListagem().pipe(take(1)).subscribe({
      next: (dados: PastaListagem[]) => {
        this.es.pastaListagem = dados;
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
