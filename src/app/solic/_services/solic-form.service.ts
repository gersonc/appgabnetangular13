import {Injectable} from '@angular/core';
import {SolicForm} from "../_models/solic-form";
import {SolicListarI} from "../_models/solic-listar-i";
import {SolicFormAnalisar, SolicFormAnalisarI} from "../_models/solic-form-analisar-i";
import {SolicFormI} from "../_models/solic-form-i";
import {SolicInformacao} from "../_models/solic-informacao";
import {SelectItem} from "primeng/api";
import {VersaoService} from "../../_services/versao.service";

@Injectable({
  providedIn: 'root'
})
export class SolicFormService {
  public solicitacao?: SolicFormI;
  public solA?: SolicFormAnalisarI;
  public solicListar?: SolicListarI;
  public acao?: string = null;
  // public solicitacaoVersao = 0;
  public ddSolicitacao_tipo_analize?: SelectItem[];
  public info: SolicInformacao[] = [
    {
      id: 0,
      situacao: 'EM ABERTO',
      status: 'EM ABERTO',
      texto: 'Informações sobre as ações que podem ser tomadas.',
      informacao: null,
      textoProcesso: null
    },
    {
      id: 1,
      situacao: 'EM ABERTO',
      status: 'EM ABERTO',
      texto: 'Aguardar análise.',
      informacao: 'A solicitação fica em aberto aguardando análise futura pelo responável.',
      textoProcesso: null
    },
    {
      id: 2,
      situacao: 'EM ABERTO',
      status: 'EM ABERTO',
      texto: 'Enviar solicitação por e-mail para o responsável pela análise.',
      informacao: 'A solicitação fica em aberto aguardando análise futura pelo responável.',
      textoProcesso: null
    },
    {
      id: 3,
      situacao: 'EM ANDAMENTO',
      status: 'EM ANDAMENTO',
      texto: 'Solicitação é aceita.',
      informacao: 'Esse tipo de solicitação não irá gerar um processo.',
      textoProcesso: 'SEM PROCESSO NEM OFÍCIOS.'
    },
    {
      id: 4,
      situacao: 'CONCLUIDO',
      status: 'DEFERIDO',
      texto: 'Concluida e deferida.',
      informacao: 'Essa solicitação é concluida imediatamente com o status de DEFERIDO sem gerar processo.',
      textoProcesso: 'SEM PROCESSO NEM OFÍCIOS.'
    },
    {
      id: 5,
      situacao: 'EM ANDAMENTO',
      status: 'EM ANDAMENTO',
      texto: 'Solicitação aceita.',
      informacao: 'Essa solicitação é aceita é criado um processo (pode-se anexar futuramente oficios),  e entra em situação e status de EM ANDAMENTO.',
      textoProcesso: 'CRIA UM PROCESSO.'
    },
    {
      id: 6,
      situacao: 'EM ANDAMENTO',
      status: 'EM ANDAMENTO',
      texto: 'Solicitação aceita.',
      informacao: 'Essa solicitação é aceita é criado um processo, entra em situação e status de EM ANDAMENTO e redireciona para inclusão de ofício.',
      textoProcesso: 'CRIA UM PROCESSO E INCLUI OFÍCIO'
    },
    {
      id: 7,
      situacao: 'CONCLUIDA',
      status: 'INDEFERIDO',
      texto: 'Solicitação recusada.',
      informacao: 'Essa solicitação é concluida imediatamente com o status de INDEFERIDO sem gerar processo.',
      textoProcesso: 'SEM PROCESSO NEM OFÍCIOS.'
    },
    {
      id: 8,
      situacao: 'SUSPENSO',
      status: 'SUSPENSO',
      texto: 'Solicitação suspensa.',
      informacao: 'A solicitação entra em situação e status de SUSPENSO',
      textoProcesso: 'SEM PROCESSO NEM OFÍCIOS.'
    },
    {
      id: 9,
      situacao: 'SUSPENSO',
      status: 'SUSPENSO',
      texto: 'Solicitação suspensa.',
      informacao: 'A solicitação e o processo entram em situação e status de SUSPENSO',
      textoProcesso: 'SOLICITAÇÃO E PROCESSO SUSPENSOS.'
    },
    {
      id: 10,
      situacao: 'EM ANDAMENTO',
      status: 'EM ANDAMENTO',
      texto: 'Solicitação aceita.',
      informacao: 'EM ANDAMENTO',
      textoProcesso: 'Se o processo estiver em andamento será redirecionado a ele.'
    },
    {
      id: 11,
      situacao: 'EM ABERTO',
      status: 'EM ABERTO',
      texto: 'Aguardar análise.',
      informacao: null,
      textoProcesso: null
    },
    {
      id: 12,
      situacao: 'CONCLUIDA',
      status: 'DEFERIDO',
      texto: 'Solicitação deferida.',
      informacao: null,
      textoProcesso: null
    },
    {
      id: 13,
      situacao: 'CONCLUIDA',
      status: 'INDEFERIDO',
      texto: 'Solicitação indeferida.',
      informacao: null,
      textoProcesso: null
    },
    {
      id: 14,
      situacao: 'EM ANDAMENTO',
      status: 'EM ANDAMENTO',
      texto: 'Solicitação aceita.',
      informacao: null,
      textoProcesso: null
    },
    {
      id: 15,
      situacao: 'SUSPENSO',
      status: 'SUSPENSO',
      texto: 'Solicitação suspensa.',
      informacao: null,
      textoProcesso: null
    },
    {
      id: 16,
      situacao: 'CONCLUIDO',
      status: 'DEFERIDO',
      texto: 'Concluida e deferida.',
      informacao: 'Essa solicitação é concluida imediatamente com o status de DEFERIDO.',
      textoProcesso: null
    },
    {
      id: 17,
      situacao: 'CONCLUIDO',
      status: 'INDEFERIDO',
      texto: 'Solicitação recusada.',
      informacao: 'Essa solicitação é concluida imediatamente com o status de INDEFERIDO.',
      textoProcesso: null
    },
    {
      id: 18,
      situacao: 'CONCLUIDO',
      status: 'DEFERIDO',
      texto: 'Solicitação e processo concluidos e deferidos.',
      informacao: 'Essa solicitação e seu processo são concluidos imediatamente com o status de DEFERIDO.',
      textoProcesso: null
    },
    {
      id: 19,
      situacao: 'CONCLUIDO',
      status: 'INDEFERIDO',
      texto: 'Solicitação e processo concluidos e indeferidos.',
      informacao: 'Essa solicitação e seu processo são concluidos imediatamente com o status de INDEFERIDO.',
      textoProcesso: null
    },
    {
      id: 20,
      situacao: 'EM ANDAMENTO',
      status: 'EM ANDAMENTO',
      texto: 'Reabrir solicitação.',
      informacao: 'A solicitação é reaberta com o status de EM ANDAMENTO',
      textoProcesso: null
    },
    {
      id: 21,
      situacao: 'EM ANDAMENTO',
      status: 'EM ANDAMENTO',
      texto: 'Reabrir solicitação e processo.',
      informacao: 'A solicitação e o processo são reaberts com o status de EM ANDAMENTO',
      textoProcesso: null
    }

  ];
  public informacao: SolicInformacao = this.info[0];


  constructor(
    private vs: VersaoService
  ) {
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
    r.solicitacao_tipo_analize = 0;
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
    r.solicitacao_tipo_analize = 0;
    this.solA = r;
    return r;
  }

  criaTipoAnalise(principal = false) {
    if (this.acao !== 'incluir') {
      this.info[0] = {
        id: 0,
        situacao: this.solicListar.solicitacao_situacao,
        status: this.solicListar.solicitacao_status_nome,
        texto: 'SEM ALTERAÇÃO',
        informacao: null,
        textoProcesso: null
      };
    }
    this.informacao = this.info[0];
    this.ddSolicitacao_tipo_analize = [];


    const dd: SelectItem[] = [
      {label: 'SEM ALTERAÇÃO', value: 0},
      {label: 'EM ABERTO - Aguardar análise', value: 1},
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
      {label: 'DEFERIR', value: 16},
      {label: 'INDEFERIR', value: 17},
      {label: 'DEFERIR - Deferir a solicitação e o processo.', value: 18},
      {label: 'INDEFERIR - Indeferir a solicitação e o processo.', value: 19},
      {label: 'REABRIR - Reabrir solicitação suspensa ou concluida.', value: 20},
      {label: 'REABRIR - Reabrir solicitação e processo suspensos ou concluidos.', value: 21},
      {label: 'SEM ALTERAÇÃO', value: 22},
    ];


    if (this.acao === 'analisar') {
      let processo = false;
      this.ddSolicitacao_tipo_analize.push(dd[0]);
      if (this.vs.solicitacaoVersao === 1) {
        if (
          this.solicListar.processo_id !== undefined &&
          this.solicListar.processo_id !== null &&
          this.solicListar.processo_id !== 0
        ) {
          processo = true;
        }

        if (!processo) {
          if (this.solicListar.solicitacao_status_id === 0) {
            this.ddSolicitacao_tipo_analize.push(dd[5], dd[6], dd[3], dd[4], dd[7], dd[8]);
          }
          if (this.solicListar.solicitacao_status_id === 1) {
            this.ddSolicitacao_tipo_analize.push(dd[16], dd[17], dd[8]);
          }
          if (
            this.solicListar.solicitacao_status_id === 2 ||
            this.solicListar.solicitacao_status_id === 3 ||
            this.solicListar.solicitacao_status_id === 4
          ) {
            this.ddSolicitacao_tipo_analize.push(dd[20]);
          }
        } else {
          if (this.solicListar.solicitacao_status_id === 1) {
            this.ddSolicitacao_tipo_analize.push(dd[18], dd[19], dd[9], dd[10]);
          }
          if (
            this.solicListar.solicitacao_status_id === 2 ||
            this.solicListar.solicitacao_status_id === 3 ||
            this.solicListar.solicitacao_status_id === 4
          ) {
            this.ddSolicitacao_tipo_analize.push(dd[21]);
          }
        }

      } else {
        if (this.solicListar.solicitacao_status_id === 0) {
          this.ddSolicitacao_tipo_analize.push(dd[14], dd[12], dd[13], dd[15]);
        }
        if (this.solicListar.solicitacao_status_id === 1) {
          this.ddSolicitacao_tipo_analize.push(dd[12], dd[13], dd[15]);
        }
        if (
          this.solicListar.solicitacao_status_id === 2 ||
          this.solicListar.solicitacao_status_id === 3 ||
          this.solicListar.solicitacao_status_id === 4
        ) {
          this.ddSolicitacao_tipo_analize.push(dd[20]);
        }

      }
    }


    if (this.acao === 'incluir') {
      if (this.vs.solicitacaoVersao === 1) {
        if (principal) {
          this.ddSolicitacao_tipo_analize = [ dd[1], dd[2], dd[5], dd[6], dd[3], dd[4], dd[7], dd[8] ];
        } else {
          this.ddSolicitacao_tipo_analize = [ dd[1], dd[2] ];
        }
      } else {
        if (principal) {
          this.ddSolicitacao_tipo_analize = [dd[11], dd[14], dd[12], dd[13], dd[15]];
        } else {
          this.ddSolicitacao_tipo_analize = [dd[11]];
        }
      }
    }

    if (this.acao === 'alterar') {
      let processo = false;
      this.ddSolicitacao_tipo_analize.push(dd[0]);
      if (this.vs.solicitacaoVersao === 1) {
        if (
          this.solicListar.processo_id !== undefined &&
          this.solicListar.processo_id !== null &&
          this.solicListar.processo_id !== 0
        ) {
          processo = true;
        }

        if (!processo) {
          if (principal) {
            if (this.solicListar.solicitacao_status_id === 0) {
              this.ddSolicitacao_tipo_analize.push(dd[5], dd[6], dd[3], dd[4], dd[7], dd[8]);
            }
            if (this.solicListar.solicitacao_status_id === 1) {
              this.ddSolicitacao_tipo_analize.push(dd[16], dd[17], dd[8]);
            }
            if (
              this.solicListar.solicitacao_status_id === 2 ||
              this.solicListar.solicitacao_status_id === 3 ||
              this.solicListar.solicitacao_status_id === 4
            ) {
              this.ddSolicitacao_tipo_analize.push(dd[20]);
            }
          }
          } else {
          if (principal) {
            if (this.solicListar.solicitacao_status_id === 1) {
              this.ddSolicitacao_tipo_analize.push(dd[18], dd[19], dd[9], dd[10]);
            }
            if (
              this.solicListar.solicitacao_status_id === 2 ||
              this.solicListar.solicitacao_status_id === 3 ||
              this.solicListar.solicitacao_status_id === 4
            ) {
              this.ddSolicitacao_tipo_analize.push(dd[21]);
            }
          }
        }

      } else {
        if (principal) {
          if (this.solicListar.solicitacao_status_id === 0) {
            this.ddSolicitacao_tipo_analize.push(dd[14], dd[12], dd[13], dd[15]);
          }
          if (this.solicListar.solicitacao_status_id === 1) {
            this.ddSolicitacao_tipo_analize.push( dd[14],dd[12], dd[13], dd[15]);
          }
          if (
            this.solicListar.solicitacao_status_id === 2 ||
            this.solicListar.solicitacao_status_id === 3 ||
            this.solicListar.solicitacao_status_id === 4
          ) {
            this.ddSolicitacao_tipo_analize.push(dd[20]);
          }
        }
      }
    }

    this.informacao = this.info[0];

  }

  onChangeAcao(ev: any) {
    if (ev.value !== undefined) {
      // this.informacao = this.info.findIndex(v => +v.id === ev.value);
      this.informacao = this.info[ev.value];
    } else {

      if (this.acao !== 'incluir') {
        this.info[0] = {
          id: 0,
          situacao: this.solicListar.solicitacao_situacao,
          status: this.solicListar.solicitacao_status_nome,
          texto: 'SEM ALTERAÇÃO',
          informacao: null,
          textoProcesso: null
        };
      }
      this.informacao = this.info[0];
    }

  }


}
