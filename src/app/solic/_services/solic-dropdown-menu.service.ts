import { Injectable } from '@angular/core';
import { take } from 'rxjs/operators';
import {Subject, Subscription} from 'rxjs';
import {DdService} from "../../_services/dd.service";

@Injectable({
  providedIn: 'root'
})
export class SolicDropdownMenuService {

  private ddSolicitacao: any[];
  private resp = new Subject<boolean>();
  public resp$ = this.resp.asObservable();
  private sub: Subscription[] = [];
  inicio = true;

  constructor(
    private dd: DdService
  ) { }


  getDropdownMenu() {
      this.sub.push(this.dd.getDd('solic-menu-dropdown')
        .pipe(take(1))
        .subscribe((dados) => {
            this.ddSolicitacao = dados;
          },
          (err) => console.error(err),
          () => {
            this.gravaDropDown();
          }
        )
      );
  }

  gravaDropDown() {
    if (!sessionStorage.getItem('solic-menu-dropdown')) {
      if (!this.inicio) {
        sessionStorage.setItem('solic-menu-dropdown', JSON.stringify(this.ddSolicitacao));
        this.sub.forEach(s => {
          s.unsubscribe()
        });
        this.resp.next(true);
        this.resp.complete();
      }
      if (this.inicio) {
        this.inicio = false;
        this.getDropdownMenu();
      }
    } else {
      this.resp.next(false);
      this.resp.complete();
    }
  }




}
