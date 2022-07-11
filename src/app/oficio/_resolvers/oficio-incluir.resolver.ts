import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import {Observable, of, Subject, Subscription} from 'rxjs';
import {OficioIncluirForm} from "../_models/oficio-incluir-form";
import {DdOficioProcessoIdI} from "../_models/dd-oficio-processo-id-i";
import {OficioFormService} from "../_services/oficio-form.service";
import {OficioService} from "../_services/oficio.service";
import {DdService} from "../../_services/dd.service";
import {mergeMap, take} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class OficioIncluirResolver implements Resolve<boolean> {
  private oficioIncluir = new OficioIncluirForm();
  private oficioProcessoId: DdOficioProcessoIdI = {
    processo_id: 0
  };
  resp: Subject<boolean>;
  resp$: Observable<boolean>
  private sub: Subscription[] = [];
  dds: string[] = [];
  ct = 0;
  private contador = 0;

  constructor(
    private router: Router,
    private oficioService: OficioService,
    private dd: DdService,
    private ofs: OficioFormService
  ) { }

  espera(v: boolean) {
    this.resp.next(v);
    this.resp.complete();
  }

  getProcessoId(processo_id: number) {
    this.sub.push(this.oficioService.getDdProcessoId(processo_id)
      .pipe(take(1))
      .subscribe({
        next: (dados) => {
          this.oficioProcessoId = dados
        },
        error: (erro) => {
          console.log(erro);
        },
        complete: () => {
          this.espera(true);
        }
      }));
  }

  carregaDropDown(): boolean {

    this.dds = [];
    this.resp = new Subject<boolean>();
    this.resp$ = this.resp.asObservable();

    if (!sessionStorage.getItem('dropdown-prioridade')) {
      this.dds.push('dropdown-prioridade');
    }
    // ****** solicitacao_assunto_id *****
    if (!sessionStorage.getItem('dropdown-andamento')) {
      this.dds.push('dropdown-andamento');
    }

    // ****** solicitacao_tipo_recebimento_id *****
    if (!sessionStorage.getItem('dropdown-tipo_recebimento')) {
      this.dds.push('dropdown-tipo_recebimento');
    }

    // ****** solicitacao_local_id *****
    if (this.ofs.oficioProcessoId === null) {
      if (this.ofs.processo_id > 0) {
        sessionStorage.removeItem('dropdown-oficio_processo_dd');
        this.dds.push('dropdown-oficio_processo_dd');
      } else {
        if (!sessionStorage.getItem('dropdown-oficio_processo_dd')) {
          this.dds.push('dropdown-oficio_processo_dd');
        }
      }
    }

    if (this.dds.length > 0) {
      this.sub.push(this.dd.getDd(this.dds)
        .pipe(take(1))
        .subscribe({
          next: (dados) => {
            this.dds.forEach(nome => {
              sessionStorage.setItem(nome, JSON.stringify(dados[nome]));
            });
          },
          error: (err) => {
            console.error(err);
          },
          complete: () => {
            this.espera(true);
          }
        })
      );
      return true;
    } else {
      return false
    }
  }

  onDestroy(): void {
    this.contador = 0;
    this.sub.forEach(s => s.unsubscribe());
  }


  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    if (this.carregaDropDown()) {
      return this.resp$.pipe(
        take(1),
        mergeMap(dados => {
          this.onDestroy();
          return of(dados);
        })
      );
    } else {
      this.onDestroy();
      return of(true);
    }
  }
}
