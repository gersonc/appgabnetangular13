import { Component, OnInit } from '@angular/core';
import {Subscription} from "rxjs";
import {MenuInternoService} from "../_services";
import {ArquivoService} from "../arquivo/_services";
import {TarefaDropdownService} from "./_services/tarefa-dropdown.service";
import {TarefaService} from "./_services/tarefa.service";

@Component({
  selector: 'app-tarefa',
  templateUrl: './tarefa.component.html',
  styleUrls: ['./tarefa.component.css']
})
export class TarefaComponent implements OnInit {
  public altura = (window.innerHeight) + 'px';
  public mostraMenuInterno = false;
  sub: Subscription[] = [];

  constructor(
    public mi: MenuInternoService,
    private as: ArquivoService,
    private tdd: TarefaDropdownService,
    public ts: TarefaService,
  ) { }

  ngOnInit(): void {
    this.ts.criaTabela();
    this.sub.push(this.mi.mostraInternoMenu().subscribe(
      vf => {
        this.mostraMenuInterno = vf;
      })
    );
    this.as.getPermissoes();
    if (!sessionStorage.getItem('conta-busca')) {
      this.mi.mudaMenuInterno(true);
    } else {
      if (this.ts.stateSN) {
        this.mi.mudaMenuInterno(false);
      } else {
        this.mi.mudaMenuInterno(true);
      }
    }
  }

  verificaDD() {
    this.tdd.dropDown();
  }

  onHide() {
    this.mi.mudaMenuInterno(false);
  }

  ngOnDestroy(): void {
    this.ts.onDestroy();
    this.sub.forEach(s => s.unsubscribe());
  }

}
