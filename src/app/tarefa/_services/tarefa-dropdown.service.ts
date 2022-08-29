import { Injectable } from '@angular/core';
import {Subject, Subscription} from "rxjs";
import {DdService} from "../../_services/dd.service";
import {take} from "rxjs/operators";
import {TarefaMenuDropdownI} from "../_models/tarefa-menu-dropdown-i";

@Injectable({
  providedIn: 'root'
})
export class TarefaDropdownService {
  tarefaMenuDD?: TarefaMenuDropdownI | null = null;
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
    let dds: any[] = [];

    if (!sessionStorage.getItem('tarefa_menu-dropdown')) {
      dds.push('tarefa_menu-dropdown');
    }

    if (dds.length > 0) {
      this.sub.push(this.dd.getDd(dds)
        .pipe(take(1))
        .subscribe((dados) => {
            dds.forEach(nome => {
              this.tarefaMenuDD = JSON.parse(dados[nome]);
              sessionStorage.setItem(nome, JSON.stringify(dados[nome]));
            });
          },
          (err) => {
            console.error(err);
            this.inicio = false;
          },
          () => {
            this.inicio = false;
            this.onDestroy();
            //this.gravaDropDown();
          }
        )
      );
    } else {
      this.tarefaMenuDD = JSON.parse(sessionStorage.getItem('tarefa_menu-dropdown'));
      this.inicio = false;
      // this.gravaDropDown();
    }

    /*if (dds.length > 0) {
      this.sub.push(this.dd.getDd(dds)
        .pipe(take(1))
        .subscribe((dados) => {
          this.tarefaMenuDD = JSON.parse(dados['tarefa_menu-dropdown']);
          sessionStorage.setItem('tarefa_menu-dropdown', JSON.stringify(dados['tarefa_menu-dropdown']));
          },
          (err) => {
            console.error(err);
            this.inicio = false;
          },
          () => {
            // this.gravaDropDown();
            this.inicio = false;
          }
        )
      );
    } else {
      // this.gravaDropDown();
      this.inicio = false;
    }*/
  }

  gravaDropDown() {
    if (!this.inicio) {
      this.getDropdownMenu();
    }
  }

  onDestroy(): void {
    this.sub.forEach(s => s.unsubscribe());
  }


  /*gravaDropDown() {
    if (!sessionStorage.getItem('dropdown-tarefa_demandados') || !sessionStorage.getItem('dropdown-tarefa_autor')) {
      if (!this.inicio) {
        this.getDropdownMenu();
      }
    } else {
      // this.dds = undefined;
      this.sub.forEach(s => {
        s.unsubscribe()
      });
      this.inicio = false;
      this.resp.next(true);
      this.resp.complete();
    }
  }*/

  dropDown() {
    if (this.tarefaMenuDD === null) {
      this.gravaDropDown();
    }
  }

  resetDropDown() {
    this.tarefaMenuDD = null;
    sessionStorage.removeItem(sessionStorage.getItem('dropdown-tarefa_demandados'));
    this.inicio = false;
    this.gravaDropDown();
  }



}
