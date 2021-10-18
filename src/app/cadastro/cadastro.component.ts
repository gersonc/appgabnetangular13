import { Component, OnInit, OnDestroy } from '@angular/core';
import { MostraMenuService } from '../util/_services';
import { CadastroBuscaService } from './_services';
import { ArquivoService } from '../arquivo/_services';
import { CarregadorService } from '../_services';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-cadastro',
  templateUrl: './cadastro.component.html',
  styleUrls: ['./cadastro.component.css']
})
export class CadastroComponent implements OnInit, OnDestroy {
  public altura = (window.innerHeight) + 'px';
  mostra = false;
  sub: Subscription[] = [];

  constructor(
    public mm: MostraMenuService,
    public cbs: CadastroBuscaService,
    private as: ArquivoService,
  ) { }

  ngOnInit() {
    this.mm.showMenu();
    this.sub.push(this.mm.mostraMenu().subscribe( vf => this.mostra = vf));
    this.as.getPermissoes();
    this.cbs.criarCadastroBusca();
    if (!sessionStorage.getItem('cadastro-busca')) {
      this.cbs.buscaStateSN = false;
      this.mm.mudaMenu(true);
    } else {
      if (this.cbs.buscaStateSN) {
        this.mm.mudaMenu(false);
      } else {
        this.mm.mudaMenu(true);
      }
    }
  }

  ngOnDestroy(): void {
    this.sub.forEach(s => s.unsubscribe());
  }

}
