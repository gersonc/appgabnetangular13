import { Component, OnInit, OnDestroy } from '@angular/core';
import {Subscription} from "rxjs";
import {MenuInternoService} from "../_services";
import {ArquivoService} from "../arquivo/_services";
import {CadastroService} from "./_services/cadastro.service";
import {CadastroDropdownMenuService} from "./_services/cadastro-dropdown-menu.service";

@Component({
  selector: 'app-cadastro',
  templateUrl: './cadastro.component.html',
  styleUrls: ['./cadastro.component.css']
})
export class CadastroComponent implements OnInit, OnDestroy {
  public altura = (window.innerHeight) + 'px';
  public mostraMenuInterno = false;
  sub: Subscription[] = [];

  constructor(
    public mi: MenuInternoService,
    public cs: CadastroService,
    private as: ArquivoService,
    private cdd: CadastroDropdownMenuService
  ) { }

  ngOnInit() {
    this.cs.criaTabela();
    this.sub.push(this.mi.mostraInternoMenu().subscribe(
      vf => {
        this.mostraMenuInterno = vf;
      })
    );
    this.as.getPermissoes();
    if (!sessionStorage.getItem('cadastro-busca')) {
      this.mi.mudaMenuInterno(true);
    } else {
      if (this.cs.stateSN) {
        this.mi.mudaMenuInterno(false);
      } else {
        this.mi.mudaMenuInterno(true);
      }
    }
  }

  verificaDD() {
    this.cdd.gravaDropDown();
  }

  onHide() {
    this.mi.mudaMenuInterno(false);
  }

  ngOnDestroy(): void {
    this.cs.onDestroy();
    this.sub.forEach(s => s.unsubscribe());
  }
}
