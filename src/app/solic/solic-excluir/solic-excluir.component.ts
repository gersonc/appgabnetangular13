import { Component, OnInit } from '@angular/core';
import {AuthenticationService} from "../../_services";
import {SolicService} from "../_services/solic.service";
import {VersaoService} from "../../_services/versao.service";
import {SolicListarI} from "../_models/solic-listar-i";
import {Router} from "@angular/router";

@Component({
  selector: 'app-solic-excluir',
  templateUrl: './solic-excluir.component.html',
  styleUrls: ['./solic-excluir.component.css']
})
export class SolicExcluirComponent implements OnInit {

  sol: SolicListarI;
  botaoEnviarVF = false;
  public arquivoBlockSubmit = true;
  private arquivoSN = true;
  apagarSN = false;


  constructor(
    public aut: AuthenticationService,
    public ss: SolicService,
    public vs: VersaoService,
    private router: Router
  ) {
    this.sol = this.ss.solicitacaoApagar;
  }

  ngOnInit(): void {
  }

  excluirSolicitacao() {

  }

  voltarListar() {
    if (sessionStorage.getItem('solicitacao-busca')) {
      this.router.navigate(['/solic/listar/busca']);
    } else {
      // this.mi.showMenuInterno();
      this.router.navigate(['/solic/listar']);
    }
  }

}
