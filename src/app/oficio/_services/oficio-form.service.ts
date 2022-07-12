import { Injectable } from '@angular/core';

import {DdOficioProcessoIdI} from "../_models/dd-oficio-processo-id-i";
import {OficioListarI} from "../_models/oficio-listar-i";
import {OficioFormulario, OficioFormularioInterface} from "../_models/oficio-formulario";


@Injectable({
  providedIn: 'root'
})
export class OficioFormService {

  ofiListar: OficioListarI | null = null;
  oficio: OficioFormularioInterface | null = null;
  solicitacao_id = 0;
  processo_id = 0;
  url = '';
  oficioProcessoId?: DdOficioProcessoIdI | null = null;
  public acao?: string | null  = null;
  public btnEnviar = true;
  public analiseCpoOficioNome: any = {ativo: false, tipo: null, cpoTitulo: null};


  constructor( ) { }

  criaOficio() {
    this.oficio = new OficioFormulario();
  }

  resetOficio() {
    delete this.oficio;
    this.oficio = new OficioFormulario();
  }

  parceDdOficioProcessoId(sol: any) {
    this.oficioProcessoId = {
      processo_id: this.processo_id,
      solicitacao_id: this.solicitacao_id,
      processo_numero: (sol.processo_numero !== undefined) ? sol.processo_numero : null,
      solicitacao_cadastro_nome: sol.solicitacao_cadastro_nome,
      solicitacao_data: sol.solicitacao_data,
      solicitacao_assunto_nome: sol.solicitacao_assunto_nome,
      solicitacao_orgao: (sol.solicitacao_orgao !== undefined) ? sol.solicitacao_orgao : null,
      solicitacao_area_interesse_nome: sol.solicitacao_area_interesse_nome,
      solicitacao_descricao: (sol.solicitacao_descricao !== undefined) ? sol.solicitacao_descricao : null,
      solicitacao_descricao_texto: (sol.solicitacao_descricao_texto !== undefined) ? sol.solicitacao_descricao_texto : null,
      solicitacao_descricao_delta: (sol.solicitacao_descricao_delta !== undefined) ? sol.solicitacao_descricao_delta : null,
      cadastro_bairro: (sol.cadastro_bairro !== undefined) ? sol.cadastro_bairro : null,
      cadastro_municipio_nome: sol.solicitacao_cadastro_nome,
      oficio_codigo: (sol.oficio_codigo !== undefined) ? sol.oficio_codigo : null
    }
  }

  parceOficioFormulario(o: OficioListarI): OficioFormularioInterface {
    this.oficio = new OficioFormulario();
    this.ofiListar = o;
    this.resetOficio();
    const r = new OficioFormulario();
    r.oficio_codigo = o.oficio_codigo;
    r.oficio_convenio = o.oficio_convenio;
    r.oficio_data_emissao = o.oficio_data_emissao;
    r.oficio_data_empenho = o.oficio_data_empenho;
    r.oficio_data_pagamento = o.oficio_data_pagamento;
    r.oficio_data_protocolo = o.oficio_data_protocolo;
    r.oficio_data_recebimento = o.oficio_data_recebimento;
    r.oficio_descricao_acao = o.oficio_descricao_acao;
    r.oficio_descricao_acao_texto = o.oficio_descricao_acao_texto;
    r.oficio_descricao_acao_delta = o.oficio_descricao_acao_delta;
    r.oficio_id = o.oficio_id;
    r.oficio_numero = o.oficio_numero;
    r.oficio_orgao_protocolante_nome = o.oficio_orgao_protocolante_nome;
    r.oficio_orgao_solicitado_nome = o.oficio_orgao_solicitado_nome;
    r.oficio_prazo = o.oficio_prazo;
    r.oficio_prioridade_id = o.oficio_prioridade_id;
    r.oficio_processo_id = o.oficio_processo_id;
    r.oficio_processo_numero = o.oficio_processo_numero;
    r.oficio_protocolante_funcionario = o.oficio_protocolante_funcionario;
    r.oficio_protocolo_numero = o.oficio_protocolo_numero;
    r.oficio_solicitacao_id = o.oficio_solicitacao_id;
    r.oficio_status_id = o.oficio_status_id;
    r.oficio_status = o.oficio_status_id;
    r.oficio_tipo_andamento_id = o.oficio_tipo_andamento_id;
    r.oficio_tipo_recebimento_id = o.oficio_tipo_recebimento_id;
    r.oficio_valor_recebido = o.oficio_valor_recebido;
    r.oficio_valor_solicitado = o.oficio_valor_solicitado;
    r.historico_andamento = null;
    r.historico_andamento_texto = null;
    r.historico_andamento_delta = null;
    this.oficio = r;
    return r;
  }
}
