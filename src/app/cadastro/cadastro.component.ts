import { Component, OnInit, OnDestroy } from '@angular/core';
import { CadastroBuscaService } from './_services';
import { ArquivoService } from '../arquivo/_services';
import { Subscription } from 'rxjs';
import { MenuInternoService } from "../_services";
import {MenuDatatableService} from "../_services/menu-datatable.service";

@Component({
  selector: 'app-cadastro',
  templateUrl: './cadastro.component.html',
  styleUrls: ['./cadastro.component.css']
})
export class CadastroComponent implements OnInit, OnDestroy {
  public altura = (window.innerHeight) + 'px';
  public mostraMenuInterno = false;
  public smsSN = false;
  sub: Subscription[] = [];

  constructor(
    public mi: MenuInternoService,
    public cbs: CadastroBuscaService,
    private as: ArquivoService,
    public md: MenuDatatableService
  ) { }

  ngOnInit() {
    this.md.mdt = false;
    this.sub.push(this.mi.mostraInternoMenu().subscribe(
      vf => {
        this.mostraMenuInterno = vf;
      })
    );
    this.sub.push(this.cbs.getSmsSN().subscribe( vf => this.smsSN = vf));
    this.as.getPermissoes();
    this.cbs.criarCadastroBusca();
    this.mi.showMenuInterno();
    if (!sessionStorage.getItem('cadastro-busca')) {
      this.cbs.buscaStateSN = false;
      this.mi.mudaMenuInterno(true);
    } else {
      if (this.cbs.buscaStateSN) {
        this.mi.mudaMenuInterno(false);
      } else {
        this.mi.mudaMenuInterno(true);
      }
    }
  }

  ngOnDestroy(): void {
    this.sub.forEach(s => s.unsubscribe());
  }

}
