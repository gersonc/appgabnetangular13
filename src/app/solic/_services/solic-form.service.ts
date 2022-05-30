import {Injectable} from '@angular/core';
import {SolicForm} from "../_models/solic-form";
import {SolicListarI} from "../_models/solic-listar-i";
import {SolicFormAnalisar, SolicFormAnalisarI} from "../_models/solic-form-analisar-i";
import {SolicHistoricoSolicitacao} from "../_models/solic-historico-solicitacao";
import {SolicHistoricoProcesso} from "../_models/solic-historico-processo";
import {ArquivoListagem} from "../../explorer/_models/arquivo-pasta.interface";
import {SolicFormI} from "../_models/solic-form-i";
import {SolicInformacao} from "../_models/solic-informacao";
import {SelectItem} from "primeng/api";

@Injectable({
  providedIn: 'root'
})
export class SolicFormService {
  public solicitacao?: SolicFormI;
  public solA?: SolicFormAnalisarI;
  public solicListar?: SolicListarI;
  public acao?: string = null;
  public solicitacaoVersao = 0;
  public ddSolicitacao_tipo_analize?: SelectItem[];
  public info: SolicInformacao[] = [
    {id: 0, posicao: 'EM ABERTO', status: null,  texto:'Informações sobre as ações que podem ser tomadas.', situacao: null, textoProcesso: null},
    {id: 1, posicao: 'EM ABERTO', status: 'EM ABERTO', texto:'Aguardar análise.', situacao: null, textoProcesso: null},
    {id: 2, posicao: 'EM ABERTO', status: 'EM ABERTO', texto:'Enviar para análise por e-mail para o responsável pela análise.', situacao: null, textoProcesso: null},
    {id: 3, posicao: 'EM ANDAMENTO', status: 'EM ANDAMENTO', texto:'Solicitação aceita.', situacao: 'SEM PROCESSO', textoProcesso: 'Solicitação sem criação de processo.'},
    {id: 4, posicao: 'RESOLVIDA', status: 'DEFERIDO', texto: 'Concluida imediatamente.', situacao: 'SEM PROCESSO', textoProcesso: 'Solicitação sem criação de processo.'},
    {id: 5, posicao: 'ACEITA', status: 'ACEITA', texto:'Solicitação aceita.', situacao: 'EM ANDAMENTO', textoProcesso: 'Cria processo.'},
    {id: 6, posicao: 'ACEITA', status: 'ACEITA', texto:'Solicitação aceita.', situacao: 'EM ANDAMENTO', textoProcesso: 'Cria processo e inclui ofício'},
    {id: 7, posicao: 'INDEFERIDO', status: 'INDEFERIDO', texto:'Solicitação recusada.', situacao: 'SEM PROCESSO', textoProcesso: 'Solicitação sem processo.'},
    {id: 8, posicao: 'SUSPENSO', status: 'SUSPENSO', texto:'Solicitação suspensa.', situacao: 'SEM PROCESSO', textoProcesso: 'Solicitação sem processo.'},
    {id: 9, posicao: 'SUSPENSO', status: 'SUSPENSO', texto:'Solicitação suspensa.', situacao: 'SUSPENSO', textoProcesso: 'O processo é colocado em situação SUSPENSO.'},
    {id: 10, posicao: 'ACEITA', status: 'ACEITA', texto:'Solicitação aceita.', situacao: 'EM ANDAMENTO', textoProcesso: 'Se o processo estiver em andamento será redirecionado a ele.'},
    {id: 11, posicao: 'EM ABERTO', status: 'EM ABERTO', texto:'Aguardar análise.', situacao: null, textoProcesso: null},
    {id: 12, posicao: 'DEFERIDO', status: 'DEFERIDO', texto:'Solicitação deferida.', situacao: null, textoProcesso: null},
    {id: 13, posicao: 'INDEFERIDO', status: 'INDEFERIDO', texto:'Solicitação indeferida.', situacao: null, textoProcesso: null},
    {id: 14, posicao: 'EM ANDAMENTO', status: 'EM ANDAMENTO', texto:'Solicitação aceita.', situacao: null, textoProcesso: null},
    {id: 15, posicao: 'SUSPENSO', status: 'SUSPENSO', texto:'Solicitação suspensa.', situacao: null, textoProcesso: null},
    {id: 16, posicao: 'CONCLUIDA', status: 'DEFERIDO', texto:'Solicitação deferida.', situacao: 'SEM PROCESSO', textoProcesso: 'Solicitação sem processo.'},
    {id: 17, posicao: 'CONCLUIDA', status: 'INDEFERIDO', texto:'Solicitação indeferida.', situacao: 'SEM PROCESSO', textoProcesso: 'Solicitação sem processo.'},
  ];
  public informacao: SolicInformacao = this.info[0];



  constructor() {
  }

  resetSolicitacao() {
    this.solicitacao = new SolicForm();
  }

  resetSolicitacaoAnalise() {
    this.solA = new SolicFormAnalisar();
  }

  criarAnalisar() {
    if (this.solA === undefined) {
      this.solA = new SolicFormAnalisar();
    }
  }

  parseListagemForm(s: SolicListarI): SolicForm {
    this.solicitacao = new SolicForm();
    this.solicListar = s;
    this.resetSolicitacao();
    const r = new SolicForm();
    r.solicitacao_id = s.solicitacao_id;
    r.solicitacao_cadastro_tipo_id = s.solicitacao_cadastro_tipo_id;
    r.solicitacao_cadastro_id = s.solicitacao_cadastro_id;
    r.solicitacao_data = s.solicitacao_data;
    r.solicitacao_assunto_id = s.solicitacao_assunto_id;
    r.solicitacao_indicacao_sn = s.solicitacao_indicacao_sn2;
    r.solicitacao_indicacao_nome = s.solicitacao_indicacao_nome;
    r.solicitacao_orgao = s.solicitacao_orgao;
    r.solicitacao_atendente_cadastro_id = s.solicitacao_atendente_cadastro_id;
    r.solicitacao_data_atendimento = s.solicitacao_data_atendimento;
    r.solicitacao_cadastrante_cadastro_id = s.solicitacao_cadastrante_cadastro_id;
    r.solicitacao_local_id = s.solicitacao_local_id;
    r.solicitacao_tipo_recebimento_id = s.solicitacao_tipo_recebimento_id;
    r.solicitacao_numero_oficio = s.solicitacao_numero_oficio;
    r.solicitacao_area_interesse_id = s.solicitacao_area_interesse_id;
    r.solicitacao_descricao = s.solicitacao_descricao;
    r.solicitacao_descricao_delta = s.solicitacao_descricao_delta;
    r.solicitacao_descricao_texto = s.solicitacao_descricao_texto;
    r.solicitacao_reponsavel_analize_id = s.solicitacao_reponsavel_analize_id;
    r.solicitacao_aceita_sn = s.solicitacao_aceita_sn;
    r.solicitacao_aceita_recusada = s.solicitacao_aceita_recusada;
    r.solicitacao_aceita_recusada_delta = s.solicitacao_aceita_recusada_delta;
    r.solicitacao_aceita_recusada_texto = s.solicitacao_aceita_recusada_texto;
    r.solicitacao_carta = s.solicitacao_carta;
    r.solicitacao_carta_delta = s.solicitacao_carta_delta;
    r.solicitacao_carta_texto = s.solicitacao_carta_texto;
    this.solicitacao = r;
    return r;
  }

  parseListagemAnalisarForm(s: SolicListarI): SolicFormAnalisar {
    // this.criaTipoAnalise(s);
    this.resetSolicitacaoAnalise();
    this.solicListar = s;
    const r = new SolicFormAnalisar();
    r.solicitacao_id = s.solicitacao_id;
    r.solicitacao_cadastro_id = s.solicitacao_cadastro_id;
    r.solicitacao_aceita_recusada = s.solicitacao_aceita_recusada;
    r.solicitacao_aceita_recusada_delta = s.solicitacao_aceita_recusada_delta;
    r.solicitacao_aceita_recusada_texto = s.solicitacao_aceita_recusada_texto;
    r.solicitacao_carta = s.solicitacao_carta;
    r.solicitacao_carta_delta = s.solicitacao_carta_delta;
    r.solicitacao_carta_texto = s.solicitacao_carta_texto;
    this.solA = r;
    return r;
  }

  criaTipoAnalise(principal = false) {
    this.ddSolicitacao_tipo_analize = [];


    const dd: SelectItem[] = [
      {label: 'EM ABERTO', value: 0},
      {label: 'EM ABERTO - Enviar para análise', value: 1},
      {label: 'EM ABERTO - Solicitar análise por e-mail', value: 2},
      {label: 'EM ANDAMENTO - Aceitar solicitação sem processo', value: 3},
      {label: 'DEFERIDO - Solicitação resolvida', value: 4},
      {label: 'ACEITA - Abrir processo', value: 5},
      {label: 'ACEITA - Abrir processo e incluir dados', value: 6},
      {label: 'INDEFERIDO - Recusar solicitação', value: 7},
      {label: 'SUSPENSO - Suspender solicitação', value: 8},
      {label: 'SUSPENSO - Suspender solicitação e processo', value: 9},
      {label: ' -- / -- - Analisar processo em andamento', value: 10},
      {label: 'EM ABERTO', value: 11},
      {label: 'DEFERIDO', value: 12},
      {label: 'INDEFERIDO', value: 13},
      {label: 'EM ANDAMENTO', value: 14},
      {label: 'SUSPENSO', value: 15},


      /*{label: 'Analisar processo', value: 12},
      {label: 'Deferido', value: 13},
      {label: 'Indeferido', value: 14},
      {label: 'Suspenso', value: 15},
      {label: 'Suspenso', value: 16},*/
    ];


    if (this.acao === 'analisar') {
      if (this.solicitacaoVersao === 1) {
        if (principal) {
          this.ddSolicitacao_tipo_analize = [
            dd[0],
            dd[3],
            dd[4],
            dd[5],
            dd[6],
            dd[7],
            dd[8]
          ];
          if (
            this.solicListar.processo_id !== undefined &&
            this.solicListar.processo_id !== null &&
            this.solicListar.processo_id !== 0
          ) {
            if (this.solicListar.processo_status_nome_id === 0) {
              this.ddSolicitacao_tipo_analize.push(dd[9]);
              // this.info.push(info[9]);
            }
            if (this.solicListar.processo_status_nome_id === 0 || this.solicListar.processo_status_nome_id === 3) {
              this.ddSolicitacao_tipo_analize.push(dd[10]);
              // this.info.push(info[10]);
            }
          }
        }
      } else {
        this.ddSolicitacao_tipo_analize = [
          dd[0],
          dd[11],
          dd[12],
          dd[13],
          dd[14],
          dd[15]
        ];
      }
    }
  }

  onChangeAcao(ev: any) {
    if (ev.value !== undefined) {
      // this.informacao = this.info.findIndex(v => +v.id === ev.value);
      this.informacao = this.info[ev.value];
    } else {
      this.informacao = this.info[0];;
    }

  }



}
