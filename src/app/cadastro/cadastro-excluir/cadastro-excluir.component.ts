import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {CadastroI, CadastroVinculosI} from "../_models/cadastro-i";
import {AuthenticationService} from "../../_services";
import {Stripslashes} from "../../shared/functions/stripslashes";
import {CadastroService} from "../_services/cadastro.service";
import {MsgService} from "../../_services/msg.service";
import {Router} from "@angular/router";
import {take} from "rxjs/operators";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-cadastro-excluir',
  templateUrl: './cadastro-excluir.component.html',
  styleUrls: ['./cadastro-excluir.component.css']
})
export class CadastroExcluirComponent implements OnInit {
  @Input() cadVin?: CadastroVinculosI | null = null;
  @Input() permissaoVinculos: Boolean = false;
  @Output() hideApagar = new EventEmitter<boolean>();
  idx = -1;
  sub: Subscription[] = [];
  botaoEnviarVF = false;
  resp: any[] = [];

  constructor(
    public aut: AuthenticationService,
    public cs: CadastroService,
    private ms: MsgService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.idx = this.cs.idx;
    console.log('cadVin', this.cadVin);
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
    if(this.permArquivo()) {
      this.botaoEnviarVF = true;
      this.sub.push(this.cs.excluirCadastro(this.cs.cadastroApagar.cadastro_id)
        .pipe(take(1))
        .subscribe({
          next: (dados) => {
            this.resp = dados;
          },
          error: (err) => {
            this.ms.add({key: 'toastprincipal', severity: 'warn', summary: 'ERRO APAGAR', detail: this.resp[2]});
            console.error(err);
          },
          complete: () => {
            if (this.resp[0]) {
              let a = 0;
              let ct: any = {};
              if (sessionStorage.getItem('cadastro-table')) {
                ct = JSON.parse(sessionStorage.getItem('cadastro-table'));
              }

              if (this.cs.expandidoSN) {
                if (this.cs.expandido.cadastro_id === this.cs.cadastroApagar.cadastro_id) {
                  this.cs.expandidoSN = false;
                  delete this.cs.expandido;
                  this.cs.expandido = undefined;
                  if (ct.expandedRowKeys !== undefined) {
                    delete ct.expandedRowKeys;
                    a++;
                  }
                }
              }

              if (ct.selection !== undefined && Array.isArray(ct.selection) && ct.selection.length > 0) {
                const i: number = ct.selection.findIndex(c => +c.cadastro_id === this.cs.cadastroApagar.cadastro_id);
                if (i !== -1) {
                  ct.selection.splice(i, 1);
                  a++;
                }
              }

              if (a > 0) {
                sessionStorage.removeItem('cadastro-table');
                sessionStorage.setItem('cadastro-table', JSON.stringify(ct));
              }

              this.cs.cadastros.splice(this.cs.idx, 1);
              this.cs.cadastroApagar = null;
              this.ms.add({
                key: 'toastprincipal',
                severity: 'success',
                summary: 'CADASTRO APAGADO',
                detail: this.resp[2]
              });


              this.voltar();
            } else {
              console.error('ERRO - EXCLUIR ', this.resp[2]);
              this.ms.add({
                key: 'toastprincipal',
                severity: 'warn',
                summary: 'ATENÇÃO - ERRO',
                detail: this.resp[2]
              });
            }
          }
        })
      );
    }
  }

  voltarListar() {
    this.cs.cadastroVinculos = null;
    if (sessionStorage.getItem('cadastro-busca')) {
      this.router.navigate(['/cadastro/listar/busca']);
    } else {
      this.router.navigate(['/cadastro/listar']);
    }
  }

  voltar() {
    this.cs.cadastroVinculos = null;
    this.cs.cadastroApagar = null;
    this.cs.stateSN = false;
    sessionStorage.removeItem('cadastro-busca');
    this.router.navigate(['/cadastro/listar']);
  }


}
