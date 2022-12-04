import {Component, OnDestroy, OnInit} from '@angular/core';
import {ErroService} from "../_services/erro.service";
import {MsgI} from "../../../_services/msg.service";
import {timer} from "rxjs";
import {take} from "rxjs/operators";

@Component({
  selector: 'app-erro',
  templateUrl: './erro.component.html',
  styleUrls: ['./erro.component.css']
})
export class ErroComponent implements OnInit, OnDestroy {

  display = true;
  constructor(
    public es: ErroService
  ) { }

  ngOnInit(): void {
    this.es.erro$.subscribe((d: boolean) => {
      if (d) {
        this.abrir();
      }
    })
    console.log('APP-ERRO INIT');
  }

  abrir() {
    console.log('APP-ERRO ABRIR');
    this.display = true;
  }

  fechar() {
    console.log('APP-ERRO FECHAR');
    this.es.clear();
    this.es.display = false;
  }

  ngOnDestroy() {
    console.log('APP-ERRO DESTROY');
    this.es.clear();
    this.es.display = false;
  }


}
