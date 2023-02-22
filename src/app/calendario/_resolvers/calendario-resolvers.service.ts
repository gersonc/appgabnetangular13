import { OnDestroy, Injectable} from '@angular/core';
import { Observable, of, EMPTY, Subscription, Subject, pipe } from 'rxjs';
import { take, mergeMap, map } from 'rxjs/operators';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Router, Resolve, RouterState } from '@angular/router';
import { DdService } from "../../_services/dd.service";



@Injectable({
  providedIn: 'root'
})
export class CalendarioResolversService implements OnDestroy, Resolve<boolean> {
  private sub: Subscription[] = [];
  private resp = new Subject<boolean>();
  private resp$ = this.resp.asObservable();
  dds: string[] = [];

  constructor(
    private router: Router,
    private dd: DdService
  ) {}


  gravaDropDown() {
    this.resp.next(true);
    this.resp.complete();
  }


  carregaDados(): void {
    this.dds = [];
    this.resp = new Subject<boolean>();
    this.resp$ = this.resp.asObservable();
    if (!sessionStorage.getItem('dropdown-local')) {
      this.dds.push('dropdown-local');
    }
    if (!sessionStorage.getItem('dropdown-prioridade')) {
      this.dds.push('dropdown-prioridade');
    }
    if (!sessionStorage.getItem('dropdown-calendario_status')) {
      this.dds.push('dropdown-calendario_status');
    }
      if (!sessionStorage.getItem('dropdown-types')) {
        this.dds.push('dropdown-types');
      }
      if (!sessionStorage.getItem('dropdown-usuario')) {
        this.dds.push('dropdown-usuario');
      }

    if (this.dds.length > 0) {
      this.sub.push(this.dd.getDd(this.dds)
        .pipe(take(1))
        .subscribe({
            next: (dados) => {
              this.dds.forEach(nome => {
                sessionStorage.setItem(nome, JSON.stringify(dados[nome as keyof typeof dados]));
              });
            },
            error: (err) => {
              console.error(err)
            },
            complete: () => {
              this.gravaDropDown();
            }
          })
      );
    } else {
      this.gravaDropDown();
    }

  }

  onDestroy(): void {
    this.dds = [];
    this.sub.forEach(s => s.unsubscribe());
  }


  ngOnDestroy(): void {
    this.sub.forEach(s => s.unsubscribe());
  }

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> {
    if (!sessionStorage.getItem('dropdown-local') ||
      !sessionStorage.getItem('dropdown-prioridade') ||
      !sessionStorage.getItem('dropdown-calendario_status') ||
      !sessionStorage.getItem('dropdown-types') ||
      !sessionStorage.getItem('dropdown-usuario')) {
      this.carregaDados();
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
