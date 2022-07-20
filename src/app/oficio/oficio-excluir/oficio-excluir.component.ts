import {Component, OnDestroy, OnInit} from '@angular/core';
import {OficioService} from "../_services/oficio.service";
import {AuthenticationService, MenuInternoService} from "../../_services";
import {MsgService} from "../../_services/msg.service";
import {Router} from "@angular/router";
import {Stripslashes} from "../../shared/functions/stripslashes";
import {Subscription} from "rxjs";
import {take} from "rxjs/operators";

@Component({
  selector: 'app-oficio-excluir',
  templateUrl: './oficio-excluir.component.html',
  styleUrls: ['./oficio-excluir.component.css']
})
export class OficioExcluirComponent implements OnInit, OnDestroy {

  botaoEnviarVF = false;
  public arquivoBlockSubmit = true;
  oficio_id: number;
  acao = '';
  resp: any[];
  display = false;
  sub: Subscription[] = [];
  apagarAtivo = false;
  botoesInativos = false;
  botaoEnviarInativo = false;
  msg = 'Deseja excluir permanetemente este ofício';


  constructor(
    public mi: MenuInternoService,
    public aut: AuthenticationService,
    public os: OficioService,
    private ms: MsgService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    if (!this.aut.oficio_apagar && !this.aut.usuario_principal_sn && !this.aut.usuario_responsavel_sn) {
      this.botoesInativos = true;
      this.ms.add({
        key: 'toastprincipal',
        severity: 'warn',
        summary: 'ATENÇÃO - ERRO',
        detail: 'PERMISSÃO NEGADA'
      });
      this.voltar();
    } else {
      this.oficio_id = this.os.oficioApagar.oficio_id;
      if (this.os.oficioApagar.oficio_arquivos.length === 0) {
        this.msg += '?'
      } else {
        if (this.os.oficioApagar.oficio_arquivos.length === 1) {
          this.msg += ' e o arquivo anexado ele?'
        } else {
          this.msg += ' e os '+ this.os.oficioApagar.oficio_arquivos.length +' arquivos anexados ele?'
        }
      }

    }
  }

  stripslashes(str?: string): string | null {
    return Stripslashes(str)
  }


  ngOnDestroy(): void {
    this.sub.forEach(s => s.unsubscribe());
    this.os.oficioApagar = null;
  }

  voltarListar() {
    this.os.stateSN = false;
    this.router.navigate(['/oficio/listar/busca']);
  }

  voltar() {
    this.os.stateSN = false;
    sessionStorage.removeItem('oficio-busca');
    this.router.navigate(['/oficio/listar2']);
  }

  fecharDialog() {
    this.display = false;
    this.botaoEnviarInativo = false;
    this.botoesInativos = false;
  }

  showDialog() {
    this.botaoEnviarInativo = true;
    this.botoesInativos = true;
    this.display = true;
  }

  excluirOficio() {
      this.sub.push(this.os.deleteOficioId(this.oficio_id)
        .pipe(take(1))
        .subscribe({
          next: (dados) => {
            this.resp = dados;
          },
          error: (err) => {
            this.fecharDialog();
            this.ms.add({key: 'toastprincipal', severity: 'warn', summary: 'ERRO APAGAR', detail: this.resp[2]});
            console.error(err);
          },
          complete: () => {
            if (this.resp[0]) {
              sessionStorage.removeItem('oficio-menu-dropdown');
              const idx = this.os.oficios.findIndex(o => o.oficio_id === this.oficio_id);
              this.os.oficios.splice(idx, 1);
              if (sessionStorage.getItem('oficio-table')) {
                const tmp: any = JSON.parse(sessionStorage.getItem('oficio-table'));
                  if (tmp.expandedRowKeys !== undefined) {
                    delete tmp.expandedRowKeys;
                    sessionStorage.setItem('oficio-table', JSON.stringify(tmp));
                  }
                }
              if (this.os.selecionados !== undefined && this.os.selecionados !== null && this.os.selecionados.length > 0) {
                const dx = this.os.selecionados.findIndex(o => o.oficio_id === this.oficio_id);
                if(dx !== -1) {
                  this.os.selecionados.splice(dx,1);
                }
              }
              this.os.tabela.selectedColumns = undefined;
              this.os.tabela.totalRecords--;
              this.ms.add({
                key: 'toastprincipal',
                severity: 'success',
                summary: 'APAGAR OFÍCIO',
                detail: this.resp[2]
              });
              this.fecharDialog();
              this.voltarListar();
            } else {
              this.fecharDialog();
              console.error('ERRO - APAGAR ', this.resp[2]);
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

  onBlockSubmit(ev) {
    this.botaoEnviarInativo = ev;
  }

}
