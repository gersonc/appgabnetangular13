import { SelectItem } from "primeng/api";
import {ArquivoListagem} from "../../explorer/_models/arquivo-pasta.interface";
import {TotalI} from "../../shared-datatables/models/total-i";
import {HistI} from "../../hist/_models/hist-i";



export interface ProceOficioI {
  oficio_processo_id?: number;
  oficio_solicitacao_id?: number;
  oficio_id?: number;
  oficio_numero?: string;
  oficio_codigo?: string;
  oficio_convenio?: string;
  oficio_prioridade_nome?: string;
  oficio_data_emissao?: string;
  oficio_data_recebimento?: string;
  oficio_orgao_solicitado_nome?: string;
  oficio_data_protocolo?: string;
  oficio_protocolo_numero?: string;
  oficio_orgao_protocolante_nome?: string;
  oficio_protocolante_funcionario?: string;
  oficio_prazo?: string;
  oficio_tipo_andamento_nome?: string;
  oficio_tipo_recebimento_nome?: string;
  oficio_status?: string;
  oficio_valor_solicitado?: string;
  oficio_valor_recebido?: string;
  oficio_data_pagamento?: string;
  oficio_data_empenho?: string;
  oficio_descricao_acao?: string;
  oficio_descricao_acao_delta?: any;
  oficio_descricao_acao_texto?: string;
  oficio_arquivos?: ArquivoListagem[];
}





export const proceProcessoCamposTexto = [
  'processo_carta',
  'solicitacao_descricao',
  'solicitacao_aceita_recusada',
  'solicitacao_carta',
  'oficio_descricao_acao',
  'historico_andamento',
  'historico_solicitacao_andamento',
];
