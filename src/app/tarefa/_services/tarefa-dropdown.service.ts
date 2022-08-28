import { Injectable } from '@angular/core';
import {Subject, Subscription} from "rxjs";
import {DdService} from "../../_services/dd.service";
import {take} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class TarefaDropdownService {
  // private dds: any[];
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
    if (!sessionStorage.getItem('dropdown-tarefa_demandados')) {
      dds.push('dropdown-tarefa_demandados');
    }

    if (!sessionStorage.getItem('dropdown-tarefa_autor')) {
      dds.push('dropdown-tarefa_autor');
    }


    if (dds.length > 0) {
      this.sub.push(this.dd.getDd(dds)
        .pipe(take(1))
        .subscribe((dados) => {
            dds.forEach(nome => {
              sessionStorage.setItem(nome, JSON.stringify(dados[nome]));
            });
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
    }
  }

  gravaDropDown() {
    if (!this.inicio) {
      this.getDropdownMenu();
    }
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
    if (!sessionStorage.getItem('dropdown-tarefa_demandados') || !sessionStorage.getItem('dropdown-tarefa_autor')) {
      this.gravaDropDown();
    }
  }



}
