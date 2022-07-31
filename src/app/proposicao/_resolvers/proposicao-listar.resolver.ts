import { Injectable } from '@angular/core';
import { Observable, of, EMPTY, Subscription, Subject } from 'rxjs';
import { mergeMap, take } from 'rxjs/operators';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Router, Resolve } from '@angular/router';
import {DdService} from "../../_services/dd.service";



@Injectable({
  providedIn: 'root'
})
export class ProposicaoListarResolver implements Resolve<boolean> {
  private sub: Subscription[] = [];
  private resp = new Subject<boolean>();
  private resp$ = this.resp.asObservable();

  constructor(
    private router: Router,
    private dd: DdService,
  ) {  }


  populaDropdown() {
    if (!sessionStorage.getItem('proposicao-menu-dropdown')) {
      this.sub.push(this.dd.getDd('proposicao-menu-dropdown')
        .pipe(take(1))
        .subscribe((dados) => {
            sessionStorage.setItem('proposicao-menu-dropdown', JSON.stringify(dados));
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
    if (!sessionStorage.getItem('proposicao-menu-dropdown')) {
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
