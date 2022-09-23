import {Injectable} from '@angular/core';
import {EMPTY, Observable, of, Subject, Subscription} from 'rxjs';
import {mergeMap, take} from 'rxjs/operators';
import {ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot} from '@angular/router';
import {CadastroDropdownMenuService} from "../_services/cadastro-dropdown-menu.service";

@Injectable({
  providedIn: 'root'
})
export class CadastroListarResolver implements Resolve<boolean> {
  private sub: Subscription[] = [];
  private resp = new Subject<boolean>();
  private resp$ = this.resp.asObservable();

  constructor(
    private router: Router,
    private dd: CadastroDropdownMenuService,
  ) {
  }

  populaDropdown() {
    this.dd.gravaDropDown();
    this.sub.push(this.dd.resp$
      .pipe(take(1))
      .subscribe((dados) => {
          this.gravaDropDown();
        }
      )
    );
  }


  gravaDropDown() {
    this.resp.next(true);
  }


  onDestroy(): void {
    this.sub.forEach(s => s.unsubscribe());
  }


  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
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
  }
}
