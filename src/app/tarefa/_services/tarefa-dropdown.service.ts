import { Injectable } from '@angular/core';
import {Subject, Subscription} from "rxjs";
import {DdService} from "../../_services/dd.service";
import {take} from "rxjs/operators";
import {TarefaMenuDropdownI} from "../_models/tarefa-menu-dropdown-i";

@Injectable({
  providedIn: 'root'
})
export class TarefaDropdownService {
  tarefaMenuDD?: any[];
  private resp = new Subject<boolean>();
  public resp$ = this.resp.asObservable();
  private sub: Subscription[] = [];
  inicio = true;

  constructor(
    private dd: DdService
  ) { }


  getDropdownMenu() {
    this.sub.push(this.dd.getDd('tarefa_menu-dropdown')
      .pipe(take(1))
      .subscribe((dados) => {
          this.tarefaMenuDD = dados;
        },
        (err) => console.error(err),
        () => {
          this.gravaDropDown();
        }
      )
    );
  }

  gravaDropDown() {
    if (!sessionStorage.getItem('tarefa_menu-dropdown')) {
      if (!this.inicio) {
        sessionStorage.setItem('tarefa_menu-dropdown', JSON.stringify(this.tarefaMenuDD));
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
