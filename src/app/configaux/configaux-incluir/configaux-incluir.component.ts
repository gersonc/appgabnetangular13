import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { SelectItem } from 'primeng/api';
import { UrlService } from '../../_services';
import { AuthenticationService, IncluirAuxService } from '../../_services';
import { take } from 'rxjs/operators';
import {MsgService} from "../../_services/msg.service";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-configaux-incluir',
  templateUrl: './configaux-incluir.component.html',
  styleUrls: ['./configaux-incluir.component.css']
})
export class ConfigauxIncluirComponent implements OnInit, OnChanges, OnDestroy {
  @Input() desabilitado: boolean;
  @Input() novoValor?: string | null;
  @Input() titulo: string;
  @Input() tituloCampo: string;
  @Input() campoNome: string;
  @Input() tamanho: number;
  @Input() tamanhomax: number;
  @Input() dropdown: string;
  @Input() arrai: SelectItem[];
  @Output() arraiChange = new EventEmitter<SelectItem[]>();
  @Output() novoValorChange = new EventEmitter<any>();
  @Output() onNovoRegistroAux = new EventEmitter<any>();
  @Output() onBlockSubmit = new EventEmitter<boolean>();

  public visivel = false;
  public valor: string = null;
  public ativaBtn = false;
  public novoId: number;
  private novoRegistro: SelectItem;
  private resp: any[];
  sub: Subscription[] = [];

  constructor(
    private ms: MsgService,
    private url: UrlService,
    public aut: AuthenticationService,
    private auxService: IncluirAuxService
  ) { }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.novoValor) {
      if (this.novoValor !== undefined && this.novoValor !== null && this.novoValor.length > 0) {
        this.valor = this.novoValor.toUpperCase();
        this.mostraForm()
      }
    }
  }

  mostraForm() {
    this.visivel = !this.visivel;
    this.blockSubmit(this.visivel);
  }

  onHide() {
    this.valor = null;
    this.visivel = false;
    this.blockSubmit(false);
  }

  mostraBtn() {
    this.ativaBtn = this.valor && this.valor.length > 2;
  }

  incluir() {
    this.ativaBtn = false;
    if (this.valor && this.valor.length > 2) {
      if (this.achaValor()) {
        this.sub.push(this.auxService.incluir(this.campo().tabela, this.campo().campo_nome, this.valor, this.tamanho)
          .pipe(take(1))
          .subscribe({
              next: (dados) => {
                this.resp = dados;
              },
              error: err => {
                this.cancelar();
              },
              complete: () => {
                if (this.resp[0]) {
                  const arraitmp: SelectItem[] = this.arrai;
                  this.novoRegistro = {
                    label: this.valor,
                    value: +this.resp[1]
                  };
                  this.ms.add(
                    {
                      key: 'toastprincipal',
                      severity: 'success',
                      summary: 'INCLUIR',
                      detail: this.resp[2]
                    });
                  // this._arrai.push(this.novoRegistro);
                  this.gravaSession();
                  this.valor = null;
                } else {
                  this.ms.add(
                    {
                      key: 'toastprincipal',
                      severity: 'warn',
                      summary: 'ATENÇÃO',
                      detail: this.resp[2]
                    });
                }
              }
            }
          )
        );
      } else {
        this.cancelar();
      }
    } else {
      this.cancelar();
    }
  }

  achaValor(): boolean {
    this.valor = this.valor.toUpperCase();
    let resp: boolean;
    resp = this.arrai.some( x => {
      return x.label === this.valor;
    });
    return !resp;
  }

  campo(): any {
    const drop = this.dropdown;
    const dd = [
      {
        nome: 'ddProposicao_tipo_id',
        tabela: 'tipo_proposicao',
        campo_id: 'tipo_proposicao_id',
        campo_nome: 'tipo_proposicao_nome',
        parametros: null
      },
      {
        nome: 'ddProposicao_area_interesse_id',
        tabela: 'area_interesse',
        campo_id: 'area_interesse_id',
        campo_nome: 'area_interesse_nome',
        parametros: null
      },
      {
        nome: 'ddProposicao_origem_id',
        tabela: 'origem_proposicao',
        campo_id: 'origem_proposicao_id',
        campo_nome: 'origem_proposicao_nome',
        parametros: null
      },
      {
        nome: 'ddProposicao_emenda_tipo_id',
        tabela: 'proposicao_emenda_tipo',
        campo_id: 'emenda_proposicao_id',
        campo_nome: 'emenda_proposicao_nome',
        parametros: null
      },
      {
        nome: 'ddProposicao_situacao_id',
        tabela: 'situacao_proposicao',
        campo_id: 'situacao_proposicao_id',
        campo_nome: 'situacao_proposicao_nome',
        parametros: null
      },
      {
        nome: 'ddProposicao_orgao_id',
        tabela: 'orgao_proposicao',
        campo_id: 'orgao_proposicao_id',
        campo_nome: 'orgao_proposicao_nome',
        parametros: null
      },
      {
        nome: 'ddEmenda_assunto_id',
        tabela: 'assunto',
        campo_id: 'assunto_id',
        campo_nome: 'assunto_nome',
        parametros: null
      },
      {
        nome: 'ddMunicipioId',
        tabela: 'municipio',
        campo_id: 'municipio_id',
        campo_nome: 'municipio_nome',
        parametros: null
      },
      {
        nome: 'ddTratamentoId',
        tabela: 'tratamento',
        campo_id: 'tratamento_id',
        campo_nome: 'tratamento_nome',
        parametros: null
      },
      {
        nome: 'ddRegiaoId',
        tabela: 'regiao',
        campo_id: 'regiao_id',
        campo_nome: 'regiao_nome',
        parametros: null
      },
      {
        nome: 'ddGrupoId',
        tabela: 'grupo',
        campo_id: 'grupo_id',
        campo_nome: 'grupo_nome',
        parametros: null
      },
      {
        nome: 'ddEstadoId',
        tabela: 'estado',
        campo_id: 'estado_id',
        campo_nome: 'estado_nome',
        parametros: null
      },
      {
        nome: 'ddEscolaridadeId',
        tabela: 'escolaridade',
        campo_id: 'escolaridade_id',
        campo_nome: 'escolaridade_nome',
        parametros: null
      },
      {
        nome: 'ddEstadoCivilId',
        tabela: 'estado_civil',
        campo_id: 'estado_civil_id',
        campo_nome: 'estado_civil_nome',
        parametros: null
      }





    ];

      return dd.find(function (x) {
        return x.nome.toString() === drop;
      });

  }

  gravaSession() {
    const nome = 'dropdown-' + this.campo().tabela;
    if (sessionStorage.getItem(nome)) {
      sessionStorage.removeItem(nome);
    }
    const arr: SelectItem[] =  this.arrai;
    arr.push(this.novoRegistro);
    arr.sort(this.compare);
    sessionStorage.setItem(nome, JSON.stringify(arr));
    const res = {
      valorId: this.novoRegistro.value,
      valorNome: this.novoRegistro.label,
      dropdown: arr,
      campo: this.campoNome
    };
    this.arraiChange.emit(arr);
    this.onNovoRegistroAux.emit(res);
    this.cancelar();
  }

  compare(a, b) {
    // Use toUpperCase() to ignore character casing
    const regA = a.label.toUpperCase();
    const regB = b.label.toUpperCase();

    let comparison = 0;
    if (regA > regB) {
      comparison = 1;
    } else if (regA < regB) {
      comparison = -1;
    }
    return comparison;
  }

  cancelar() {
    this.valor = null;
    this.ativaBtn = false;
    this.novoId = null;
    this.novoRegistro = null;
    this.resp = null;
    this.visivel = false;
    if (this.novoValor !== undefined && this.novoValor !== null && this.novoValor.length > 0) {
      this.novoValor = null;
      this.novoValorChange.emit(null);
    }
    this.blockSubmit(false);
  }

  cancela() {
    this.valor = null;
    this.visivel = false;
    this.blockSubmit(false);
  }

  blockSubmit(ev: boolean) {
    this.onBlockSubmit.emit(ev);
  }

  ngOnDestroy(): void {
    this.sub.forEach(s => {
      s.unsubscribe()
    });
  }

}
