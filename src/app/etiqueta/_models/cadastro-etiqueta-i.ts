import {TotalI} from "../../shared-datatables/models/total-i";

export interface CadastroEtiquetaI {
  cadastro_id?: number;
  cadastro_tipo_tipo: number;
  cadastro_nome: string;
  cadastro_endereco: string;
  cadastro_endereco_numero: string | null;
  cadastro_endereco_complemento: string | null;
  cadastro_bairro: string | null;
  cadastro_municipio_nome: string;
  cadastro_cep: string;
  cadastro_estado_nome: string;
  cadastro_responsavel: string | null;
  cadastro_tratamento_nome: string | null;
  cadastro_cargo: string | null;
}

export interface CadastroEtiquetaListI {
  cadastros: CadastroEtiquetaI[];
  total: TotalI;
}
