import { OnDestroy, Injectable} from '@angular/core';
import { Observable, of, EMPTY, Subscription, Subject, pipe } from 'rxjs';
import { take, mergeMap, map } from 'rxjs/operators';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Router, Resolve, RouterState } from '@angular/router';
import { DropdownnomeidClass } from '../../util/_models';
import { DropdownService } from '../../util/_services';


@Injectable({
  providedIn: 'root'
})
export class CalendarioResolversService implements OnDestroy, Resolve<any> {
  resposta = new Subject<boolean>();
  resposta$ = this.resposta.asObservable();
  sub: Subscription[] = [];
  esperar = 0;

  constructor(
    private router: Router,
    private dd: DropdownService
  ) {}

  espera() {
      this.resposta.next(true);
  }

  carregaDados() {
    const ddNomeIdArray = new DropdownnomeidClass();
    if (!sessionStorage.getItem('dropdown-local')) {
      ddNomeIdArray.add('local', 'local', 'local_id', 'local_nome');
    }
    if (!sessionStorage.getItem('dropdown-prioridade')) {
      ddNomeIdArray.add('prioridade', 'prioridade', 'prioridade_id', 'prioridade_nome');
    }
    if (!sessionStorage.getItem('dropdown-calendario_status')) {
      ddNomeIdArray.add('calendario_status', 'calendario_status', 'calendario_status_id', 'calendario_status_nome');
    }
    if (!sessionStorage.getItem('dropdown-types')) {
      ddNomeIdArray.add('types', 'types', 'type_id', 'type_name');
    }
    if (!sessionStorage.getItem('dropdown-usuario')) {
      ddNomeIdArray.add('usuario', 'usuario', 'usuario_id', 'usuario_nome');
    }
    if (ddNomeIdArray.count() > 0) {
      this.sub.push(this.dd.postDropdownNomeIdArray(ddNomeIdArray.get())
        .pipe(take(1))
        .subscribe({
          next: (dados) => {
            if (dados['local']) {
              sessionStorage.setItem('dropdown-local', JSON.stringify(dados['local']));
            }
            if (dados['prioridade']) {
              sessionStorage.setItem('dropdown-prioridade', JSON.stringify(dados['prioridade']));
            }
            if (dados['calendario_status']) {
              dados['calendario_status'].push({label: 'NENHUM', value: 0});
              sessionStorage.setItem('dropdown-calendario_status', JSON.stringify(dados['calendario_status']));
            }
            if (dados['types']) {
              sessionStorage.setItem('dropdown-types', JSON.stringify(dados['types']));
            }
            if (dados['usuario']) {
              sessionStorage.setItem('dropdown-usuario', JSON.stringify(dados['usuario']));
            }
          },
          error: err => {
            console.log(err);
          },
          complete: () => {
            this.espera();
          }
        })
      );
    } else {
      setTimeout(() => {
        this.espera();
      }, 200);
    }
  }

  onDestroy(): void {
    this.sub.forEach(s => s.unsubscribe());
  }

  ngOnDestroy(): void {
    this.sub.forEach(s => s.unsubscribe());
  }

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<any> | Observable<never> {
    this.carregaDados();
    return this.resposta$.pipe(
      take(1),
      map(dados => {
        this.onDestroy();
        return {value: dados, index: 1};

      })
    );
  }
}
