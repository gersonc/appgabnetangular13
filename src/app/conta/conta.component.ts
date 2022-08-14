import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from "rxjs";
import {ContaDropdownMenuService} from "./_services/conta-dropdown-menu.service";
import {ArquivoService} from "../arquivo/_services";
import {ContaService} from "./_services/conta.service";
import {MenuInternoService} from "../_services";

@Component({
  selector: 'app-conta',
  templateUrl: './conta.component.html',
  styleUrls: ['./conta.component.css']
})
export class ContaComponent implements OnInit, OnDestroy {
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
    if (!sessionStorage.getItem('contaa-busca')) {
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

  ngOnDestroy(): void {
    this.ct.onDestroy();
    this.sub.forEach(s => s.unsubscribe());
  }
}
