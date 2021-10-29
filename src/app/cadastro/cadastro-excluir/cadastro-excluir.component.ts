import {Component, OnInit, OnDestroy, ElementRef, ViewChild, NgZone} from '@angular/core';
import { take } from 'rxjs/operators';
import { MessageService } from 'primeng/api';

import { AuthenticationService, CarregadorService } from '../../_services';
import {
  CadastroDetalheCompletoInterface, CadastroInterface,
  CadastroOficioOrgaoProtocolanteInterface, CadastroOficioOrgaoProtocolanteNumInterface,
  CadastroOficioOrgaoSolicitadoInterface, CadastroOficioOrgaoSolicitadoNumInterface,
  CadastroOficioResponsavelInterface, CadastroOficioResponsavelNumInterface,
  CadastroProcessoInterface, CadastroProcessoNumInterface,
  CadastroSolicitacaoInterface, CadastroSolicitacaoNumInterface
} from '../_models';
import { CadastroService } from '../_services';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { ArquivoInterface, ArquivoNumInterface } from '../../arquivo/_models';


declare interface ColumnsInterface {
  header: string;
  dataKey: string;
}

@Component({
  selector: 'app-cadastro-excluir',
  templateUrl: './cadastro-excluir.component.html',
  styleUrls: ['./cadastro-excluir.component.css']
})

export class CadastroExcluirComponent implements OnInit, OnDestroy {

  // @ViewChild('tabcadastroexcluir', { static: true }) tabcadastroexcluir: ElementRef;
  public ht: any;
  private dados: CadastroDetalheCompletoInterface;
  public cadastro: CadastroInterface = null;
  public solicitacao: CadastroSolicitacaoInterface[] = null;
  public processo: CadastroProcessoInterface[] = null;
  public oficio_orgao_solicitado: CadastroOficioOrgaoSolicitadoInterface[] = null;
  public oficio_orgao_protocolante: CadastroOficioOrgaoProtocolanteInterface[] = null;
  public oficio_cadastro_responsavel: CadastroOficioResponsavelInterface[] = null;
  public erro: any[] = null;
  public solicitacao_num: CadastroSolicitacaoNumInterface[] = null;
  public processo_num: CadastroProcessoNumInterface[] = null;
  public oficio_orgao_solicitado_num: CadastroOficioOrgaoSolicitadoNumInterface[] = null;
  public oficio_orgao_protocolante_num: CadastroOficioOrgaoProtocolanteNumInterface[] = null;
  public oficio_cadastro_responsavel_num: CadastroOficioResponsavelNumInterface[] = null;
  public cadastro_titulo: any[];
  public solicitacao_titulo: any[];
  public processo_titulo: any[];
  public oficio_orgao_solicitado_titulo: any[];
  public oficio_orgao_protocolante_titulo: any[];
  public oficio_cadastro_responsavel_titulo: any[];
  public vinculos = false;
  private resp: any[] = [false, 0, ''];
  sub: Subscription[] = [];
  botaoEnviarVF = false;
  public arquivoBlockSubmit = true;
  public arquivo: ArquivoInterface[];
  public arquivo_num: ArquivoNumInterface[];


  constructor (
    private ngZone: NgZone,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    public cs: CadastroService,
    private cr: CarregadorService,
    private messageService: MessageService,
    private authenticationService: AuthenticationService
  ) {
  }

  ngOnInit () {
    this.sub.push(this.activatedRoute.data.subscribe({
      next: (data: {dados: CadastroDetalheCompletoInterface}) => {
        this.dados = data.dados;
        this.cadastro = this.dados.cadastro;
        this.cadastro_titulo = this.dados.cadastro_titulo;
        this.arquivo = this.dados.arquivo;
        this.arquivo_num = this.dados.arquivo_num;
        if (
          this.dados.solicitacao_num.length > 0 ||
          this.dados.processo_num.length > 0 ||
          this.dados.oficio_orgao_solicitado_num.length > 0 ||
          this.dados.oficio_orgao_protocolante_num.length > 0 ||
          this.dados.oficio_cadastro_responsavel_num.length > 0) {
          this.vinculos = true;

          if (this.dados.solicitacao_num) {
            if (this.dados.solicitacao_num.length > 0) {
              this.solicitacao_num = this.dados.solicitacao_num;
            }
          }
          if (this.dados.processo_num) {
            if (this.dados.processo_num.length > 0) {
              this.processo_num = this.dados.processo_num;
            }
          }
          if (this.dados.oficio_orgao_solicitado_num) {
            if (this.dados.oficio_orgao_solicitado_num.length > 0) {
              this.oficio_orgao_solicitado_num = this.dados.oficio_orgao_solicitado_num;
            }
          }
          if (this.dados.oficio_orgao_protocolante_num) {
            if (this.dados.oficio_orgao_protocolante_num.length > 0) {
              this.oficio_orgao_protocolante_num = this.dados.oficio_orgao_protocolante_num;
            }
          }
          if (this.dados.oficio_cadastro_responsavel_num) {
            if (this.dados.oficio_cadastro_responsavel_num.length > 0) {
              this.oficio_cadastro_responsavel_num = this.dados.oficio_cadastro_responsavel_num;
            }
          }
        }
        if (!this.vinculos) {
          if (this.dados.solicitacao) {
            if (this.dados.solicitacao.length > 0) {
              this.solicitacao = this.dados.solicitacao;
              this.solicitacao_titulo = this.dados.solicitacao_titulo;
            }
          }
          if (this.dados.processo) {
            if (this.dados.processo.length > 0) {
              this.processo = this.dados.processo;
              this.processo_titulo = this.dados.processo_titulo;
            }
          }
          if (this.dados.oficio_orgao_solicitado) {
            if (this.dados.oficio_orgao_solicitado.length > 0) {
              this.oficio_orgao_solicitado = this.dados.oficio_orgao_solicitado;
              this.oficio_orgao_solicitado_titulo = this.dados.oficio_orgao_solicitado_titulo;
            }
          }
          if (this.dados.oficio_orgao_protocolante) {
            if (this.dados.oficio_orgao_protocolante.length > 0) {
              this.oficio_orgao_protocolante = this.dados.oficio_orgao_protocolante;
              this.oficio_orgao_protocolante_titulo = this.dados.oficio_orgao_protocolante_titulo;
            }
          }
          if (this.dados.oficio_cadastro_responsavel) {
            if (this.dados.oficio_cadastro_responsavel.length > 0) {
              this.oficio_cadastro_responsavel = this.dados.oficio_cadastro_responsavel;
              this.oficio_cadastro_responsavel_titulo = this.dados.oficio_cadastro_responsavel_titulo;
            }
          }
        }
        if (this.dados.erro) {
          this.erro = this.dados.erro;
        }
        this.cr.escondeCarregador();
      }}));
  }

  excluirCadastro() {
    if (this.authenticationService.cadastro_apagar) {
      this.botaoEnviarVF = true;
      this.cr.mostraCarregador();
      this.sub.push(this.cs.excluirCadastro(this.cadastro.cadastro_id)
        .pipe(take(1))
        .subscribe( {
          next: (dados) => this.resp = dados,
          error: err => {
            this.cr.escondeCarregador();
            console.error('err');
            this.messageService.add({key: 'cadastroExcluirToast', severity: 'warn', summary: 'ERRO EXCLUI', detail: this.resp[2]});
          },
          complete: () => {
            this.cr.escondeCarregador();
            if (this.resp[0]) {
              this.messageService.add(
                {key: 'cadastroExcluirToast', severity: 'success', summary: 'EXCLUIR CADASTRO', detail: this.resp[2]});
            } else {
              this.messageService.add(
                {key: 'cadastroExcluirToast', severity: 'warn', summary: 'ATENÇÃO - EXCLUIR CADASTRO - ERRO', detail: this.resp[2]});
            }
          }
        }));
    }
  }

  onBlockSubmit(ev) {
    this.arquivoBlockSubmit = ev;
  }

  voltarListar() {
    this.ngZone.run(() => this.router.navigate(['/cadastro/listar/busca']));
    // this.router.navigate(['/cadastro/listar/busca']);
    // this.router.navigate(['/cadastro/listar']);
  }

  ngOnDestroy(): void {
    this.sub.forEach(s => s.unsubscribe());
  }

}
