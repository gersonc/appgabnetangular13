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
export class EmendaListarResolver implements Resolve<boolean> {
  private sub: Subscription[] = [];
  private resp = new Subject<boolean>();
  private resp$ = this.resp.asObservable();

  constructor(
    private router: Router,
    private dd: DdService,
  ) {  }


  populaDropdown() {
    if (!sessionStorage.getItem('emenda-menu-dropdown')) {
      this.sub.push(this.dd.getDd('emenda-menu-dropdown')
        .pipe(take(1))
        .subscribe((dados) => {
            sessionStorage.setItem('emenda-menu-dropdown', JSON.stringify(dados));
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
    if (!sessionStorage.getItem('emenda-menu-dropdown')) {
      // this.dropdown = true;
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
