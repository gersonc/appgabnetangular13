import { Injectable } from '@angular/core';
import {Subject, Subscription} from "rxjs";
import {DdService} from "../../_services/dd.service";
import {take} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class ContaDropdownMenuService {

  private dds: any[];
  private resp = new Subject<boolean>();
  public resp$ = this.resp.asObservable();
  private sub: Subscription[] = [];
  private inicio = false;

  constructor(
    private dd: DdService
  ) {
  }


  getDropdownMenu() {
    this.inicio = true;
    this.dds = [];
    // ****** tipo_recebimento_id *****
    if (!sessionStorage.getItem('dropdown-local')) {
      this.dds.push('dropdown-local');
    }
    // ****** ogu_id *****
    if (!sessionStorage.getItem('dropdown-conta')) {
      this.dds.push('dropdown-conta');
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
    if (!sessionStorage.getItem('dropdown-local') || !sessionStorage.getItem('dropdown-conta')) {
      if (!this.inicio) {
        this.getDropdownMenu();
      }
    } else {
      this.dds = undefined;
      this.sub.forEach(s => {
        s.unsubscribe()
      });
      this.inicio = false;
      this.resp.next(true);
      this.resp.complete();
    }
  }



}
