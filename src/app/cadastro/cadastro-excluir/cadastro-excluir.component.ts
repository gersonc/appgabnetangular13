import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {CadastroI, CadastroVinculosI} from "../_models/cadastro-i";
import {AuthenticationService} from "../../_services";
import {Stripslashes} from "../../shared/functions/stripslashes";
import {CadastroService} from "../_services/cadastro.service";
import {MsgService} from "../../_services/msg.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-cadastro-excluir',
  templateUrl: './cadastro-excluir.component.html',
  styleUrls: ['./cadastro-excluir.component.css']
})
export class CadastroExcluirComponent implements OnInit {

  idx = -1;

  botaoEnviarVF = false;
  constructor(
    public aut: AuthenticationService,
    public cs: CadastroService,
    private ms: MsgService,
    private router: Router
  ) { }

  ngOnInit(): void {
    // this.cadastro = this.cs.cadastroApagar;
    this.idx = this.cs.idx;
    // console.log('cadastro', this.cadastro);
  }



  stripslashes(str?: string): string | null {
    return Stripslashes(str)
  }

  rowColor(vl1: number): string | null {
    return (typeof vl1 === 'undefined' || vl1 === null || vl1 === 0) ? 'status-0' : 'status-' + vl1;
  }

  rowColor2(vl1: number): string | null {
    switch (vl1) {
      case 0:
        return 'status-1';
      case 1:
        return 'status-3';
      case 2:
        return 'status-2';
      default:
        return 'status-1';
    }
  }

  permArquivo(): boolean {
    return (this.cs.cadastroApagar.cadastro_arquivos.length === 0) ? true : (this.aut.usuario_principal_sn || this.aut.usuario_responsavel_sn || this.aut.arquivos_apagar);
  }

  excluir(){

  }

  voltarListar() {
    if (sessionStorage.getItem('cadastro-busca')) {
      this.router.navigate(['/cadastro/listar/busca']);
    } else {
      this.router.navigate(['/cadastro/listar']);
    }
  }

  voltar() {
    this.cs.cadastroApagar = null;
    this.cs.stateSN = false;
    sessionStorage.removeItem('cadastro-busca');
    this.router.navigate(['/cadastro/listar']);
  }


}
