import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import {EMPTY, Observable, of, Subject, Subscription} from 'rxjs';
import {DdService} from "../../_services/dd.service";
import {mergeMap, take} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class TarefaListarResolver implements Resolve<boolean> {
  private sub: Subscription[] = [];
  private resp = new Subject<boolean>();
  private resp$ = this.resp.asObservable();
  dds: string[] = [];

  constructor(
    private router: Router,
    private dd: DdService,
  ) {  }

  populaDropdown() {
    this.dds = [];
    // ****** usuario *****
    if (!sessionStorage.getItem('dropdown-usuario')) {
      this.dds.push('dropdown-usuario');
    }
    // ****** tarefa_situacao *****
    if (!sessionStorage.getItem('dropdown-tarefa_situacao')) {
      this.dds.push('dropdown-tarefa_situacao');
    }

    if (!sessionStorage.getItem('dropdown-tarefa_demandados')) {
      this.dds.push('dropdown-tarefa_demandados');
    }

    if (!sessionStorage.getItem('dropdown-tarefa_autor')) {
      this.dds.push('dropdown-tarefa_autor');
    }

    if (this.dds.length > 0) {
      this.sub.push(this.dd.getDd(this.dds)
        .pipe(take(1))
        .subscribe((dados) => {
            this.dds.forEach(nome => {
              sessionStorage.setItem(nome, JSON.stringify(dados[nome]));
            });
          },
          (err) => console.error(err),
          () => {
            this.gravaDropDown();
          }
        )
      );
    } else {
      this.gravaDropDown();
    }
  }

  gravaDropDown() {
    this.resp.next(true);
  }

  onDestroy(): void {
    this.sub.forEach(s => s.unsubscribe());
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    if (!sessionStorage.getItem('dropdown-usuario') || !sessionStorage.getItem('dropdown-tarefa_situacao') || !sessionStorage.getItem('dropdown-tarefa_demandados') || !sessionStorage.getItem('dropdown-tarefa_autor')) {
      this.populaDropdown();
      return this.resp$.pipe(
        take(1),
        mergeMap(vf => {
          if (vf) {
            this.onDestroy();
            return of(vf);
          } else {
            this.onDestroy();
            return EMPTY;
          }
        })
      );
    } else {
      return of(true);
    }
  }
}
