import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from "rxjs";
import {MenuInternoService} from "../_services";
import {ArquivoService} from "../arquivo/_services";
import {TarefaService} from "./_services/tarefa.service";

@Component({
  selector: 'app-tarefa',
  templateUrl: './tarefa.component.html',
  styleUrls: ['./tarefa.component.css']
})
export class TarefaComponent implements OnInit, OnDestroy {
  public altura = (window.innerHeight) + 'px';
  public mostraMenuInterno = false;
  sub: Subscription[] = [];
  mostraMenu = true;

  constructor(
    public mi: MenuInternoService,
    private as: ArquivoService,
    public ts: TarefaService,
  ) { }

  ngOnInit(): void {
    this.sub.push(this.mi.mostraInternoMenu().subscribe(
      vf => {
        this.mostraMenuInterno = vf;
      })
    );
    this.as.getPermissoes();
    if (!sessionStorage.getItem('tarefa-busca')) {
      this.mi.mudaMenuInterno(true);
    } else {
      if (this.ts.stateSN) {
        this.mi.mudaMenuInterno(false);
      } else {
        this.mi.mudaMenuInterno(true);
      }
    }
  }

  onHide() {
    this.mi.mudaMenuInterno(false);
  }

  fecharForm(ev: boolean) {
    this.mostraMenu = false;
    this.ts.showForm = false;
    this.mostraMenu = true;
    if (ev) {
      this.mi.showMenuInterno();
    } else {
      this.mi.hideMenu();
    }
  }

  ngOnDestroy(): void {
    this.ts.onDestroy();
    this.sub.forEach(s => s.unsubscribe());
  }

}
