import { Component, OnInit } from '@angular/core';
import { ProcessoBuscaService } from '../_services';
import { Subscription } from 'rxjs';
import { MenuInternoService } from "../../_services";

@Component({
  selector: 'app-processo-listar',
  templateUrl: './processo-listar.component.html',
  styleUrls: ['./processo-listar.component.css']
})
export class ProcessoListarComponent implements OnInit {
  // public altura = (window.innerHeight - 170) + 'px';
  public altura = (window.innerHeight - 126) + 'px';
  public mostraMenuInterno = false;
  sub: Subscription[] = [];


  constructor(
    public mi: MenuInternoService,
    private pbs: ProcessoBuscaService
  ) {  }

  ngOnInit() {
    this.sub.push(this.mi.mostraInternoMenu().subscribe(
      vf => {
        this.mostraMenuInterno = vf;
      })
    );
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
