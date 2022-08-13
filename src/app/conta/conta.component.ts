import { Component, OnInit } from '@angular/core';
import {ContaBuscaService, ContaService} from './_services';
import {MenuInternoService, MostraMenuService} from "../_services";
import {Subscription} from "rxjs";
import {ContaDropdownMenuService} from "./_services/conta-dropdown-menu.service";
import {ArquivoService} from "../arquivo/_services";

@Component({
  selector: 'app-conta',
  templateUrl: './conta.component.html',
  styleUrls: ['./conta.component.css']
})
export class ContaComponent implements OnInit {
  public altura = (window.innerHeight) + 'px';
  public mostraMenuInterno = false;
  sub: Subscription[] = [];

  constructor(
    public mi: MenuInternoService,
    private cdd: ContaDropdownMenuService,
    private ct: ContaService,
    private as: ArquivoService,
  ) { }

  ngOnInit() {
    this.ct.criaTabela();
    this.sub.push(this.mi.mostraInternoMenu().subscribe(
      vf => {
        this.mostraMenuInterno = vf;
      })
    );
    this.as.getPermissoes();
    if (!sessionStorage.getItem('solic-busca')) {
      this.mi.mudaMenuInterno(true);
    } else {
      if (this.ct.stateSN) {
        this.mi.mudaMenuInterno(false);
      } else {
        this.mi.mudaMenuInterno(true);
      }
    }
  }

  verificaDD() {
    if(!sessionStorage.getItem('dropdown-conta') || !sessionStorage.getItem('dropdown-local')) {
      this.cdd.getDropdownMenu();
    }
  }

  onHide() {
    this.mi.mudaMenuInterno(false);
  }
}
