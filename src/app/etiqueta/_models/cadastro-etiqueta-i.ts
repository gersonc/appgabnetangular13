import {TotalI} from "../../shared-datatables/models/total-i";

export interface CadastroEtiquetaI {
  cadastro_id?: number;
  cadastro_tipo_tipo: number;
  cadastro_nome: string;
  cadastro_endereco: string;
  cadastro_endereco_numero: string;
  cadastro_endereco_complemento: string;
  cadastro_bairro: string;
  cadastro_municipio_nome: string;
  cadastro_cep: string;
  cadastro_estado_nome: string;
  cadastro_responsavel: string;
  cadastro_tratamento_nome: string;
  cadastro_cargo: string;
}

export interface CadastroEtiquetaListI {
  cadastros: CadastroEtiquetaI[];
  total: TotalI;
}
