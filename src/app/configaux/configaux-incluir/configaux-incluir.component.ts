import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { MessageService, SelectItem } from 'primeng/api';
import { UrlService } from '../../_services';
import { AuthenticationService, IncluirAuxService } from '../../_services';
import { take } from 'rxjs/operators';
import {MsgService} from "../../_services/msg.service";

@Component({
  selector: 'app-configaux-incluir',
  templateUrl: './configaux-incluir.component.html',
  styleUrls: ['./configaux-incluir.component.css']
})
export class ConfigauxIncluirComponent implements OnInit, OnChanges, OnDestroy {
  @Input() desabilitado: boolean;
  @Input() titulo: string;
  @Input() tituloCampo: string;
  @Input() campoNome: string;
  @Input() tamanho: number;
  @Input() tamanhomax: number;
  @Input() dropdown: string;
  @Input() arrai: SelectItem[];
  @Output() onNovoRegistroAux = new EventEmitter<any>();
  @Output() onBlockSubmit = new EventEmitter<boolean>();

  public _desabilitado = true;
  public _titulo = '';
  public _tituloCampo = '';
  public _tamanho = 50;
  private _tamanhomax = 50;
  private _dropdown: string;
  private _arrai: SelectItem[];
  private _campoNome = '';
  public visivel = false;
  public valor: string = null;
  public ativaBtn = false;
  public mostraSpinner = false;
  public novoId: number;
  private novoRegistro: SelectItem;
  private resp: any[];

  constructor(
    private ms: MsgService,
    private url: UrlService,
    public aut: AuthenticationService,
    private auxService: IncluirAuxService
  ) { }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.desabilitado) {
      this._desabilitado = changes.desabilitado.currentValue;
    }
    if (changes.titulo) {
      this._titulo = changes.titulo.currentValue;
    }
    if (changes.tituloCampo) {
      this._tituloCampo = changes.tituloCampo.currentValue;
    }
    if (changes.campoNome) {
      this._campoNome = changes.campoNome.currentValue;
    }
    if (changes.tamanho) {
      this._tamanho = changes.tamanho.currentValue;
    }
    if (changes.tamanhomax) {
      this._tamanhomax = changes.tamanhomax.currentValue;
    }
    if (changes.dropdown) {
      this._dropdown = changes.dropdown.currentValue;
    }
    if (changes.arrai) {
      this._arrai = changes.arrai.currentValue;
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
        this.mostraSpinner = true;
        this.auxService.incluir(this.campo().tabela, this.campo().campo_nome, this.valor, this._tamanho)
          .pipe(take(1))
          .subscribe({
              next: (dados) => {
                this.resp = dados;
              },
              error: err => {
                console.error('FE-incluirMunicipio-ERRO-->', err);
                this.mostraSpinner = false;
              },
              complete: () => {
                if (this.resp[0]) {
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
                  this._arrai.push(this.novoRegistro);
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
                this.mostraSpinner = false;
              }
            }
          );
      }
    }
  }

  achaValor(): boolean {
    this.valor = this.valor.toUpperCase();
    let resp: boolean;
    resp = this._arrai.some( x => {
      return x.label === this.valor;
    });
    return !resp;
  }

  campo(): any {
    const drop = this._dropdown;
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
    sessionStorage.setItem(nome, JSON.stringify(this._arrai));
    const res = {
      valorId: this.novoRegistro.value,
      valorNome: this.novoRegistro.label,
      dropdown: this._arrai,
      campo: this._campoNome
    };
    this.onNovoRegistroAux.emit(res);
  }

  cancelar() {
    this._titulo = '';
    this._tituloCampo = '';
    this._tamanho = 50;
    this._tamanhomax = 50;
    this._dropdown = null;
    this._arrai = null;
    // this._formControl = null;
    this.visivel = false;
    this.valor = null;
    this.ativaBtn = false;
    this.mostraSpinner = false;
    this.novoId = null;
    this.novoRegistro = null;
    this.resp = null;
  }

  blockSubmit(ev: boolean) {
    this.onBlockSubmit.emit(ev);
  }

  ngOnDestroy(): void {
  }

}
