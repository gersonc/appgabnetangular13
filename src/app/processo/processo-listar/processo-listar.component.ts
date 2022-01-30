import {Component, OnDestroy, OnInit} from '@angular/core';
import { ProcessoBuscaService } from '../_services';
import { Subscription } from 'rxjs';
import { MenuInternoService } from "../../_services";
import { ArquivoService } from "../../arquivo/_services";

@Component({
  selector: 'app-processo-listar',
  templateUrl: './processo-listar.component.html',
  styleUrls: ['./processo-listar.component.css']
})
export class ProcessoListarComponent implements OnInit, OnDestroy {
  public altura = (window.innerHeight) + 'px';
  public mostraMenuInterno = false;
  sub: Subscription[] = [];

  constructor(
    public mi: MenuInternoService,
    private pbs: ProcessoBuscaService,
    private as: ArquivoService
  ) {  }

  ngOnInit() {
    this.sub.push(this.mi.mostraInternoMenu().subscribe(
      vf => {
        this.mostraMenuInterno = vf;
      })
    );
    this.as.getPermissoes();
    this.pbs.criarProcessoBusca();
    if (!sessionStorage.getItem('processo-busca')) {
      this.pbs.buscaStateSN = false;
      this.mi.mudaMenuInterno(true);
    } else {
      if (this.pbs.buscaStateSN) {
        this.mi.mudaMenuInterno(false);
      } else {
        this.mi.mudaMenuInterno(true);
      }
    }
  }

  onHide() {
    this.mi.mudaMenuInterno(false);
  }

  ngOnDestroy(): void {
    this.sub.forEach(s => s.unsubscribe());
  }

}
