import { Injectable } from '@angular/core';

import { OficioFormulario, OficioFormularioInterface } from '../_models';
import {DdOficioProcessoId} from "../_models/oficio-i";

@Injectable({
  providedIn: 'root'
})
export class OficioFormService {

  oficio: OficioFormularioInterface;
  solicitacao_id = 0;
  processo_id = 0;
  url = '';
  oficioProcessoId?: DdOficioProcessoId | null = null;


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
      solicitacao_descricao_delta: (sol.solicitacao_descricao_delta !== undefined) ? sol.solicitacao_descricao_delta : null,
      cadastro_bairro: (sol.cadastro_bairro !== undefined) ? sol.cadastro_bairro : null,
      cadastro_municipio_nome: sol.solicitacao_cadastro_nome,
      oficio_codigo: (sol.oficio_codigo !== undefined) ? sol.oficio_codigo : null
    }
}
}
