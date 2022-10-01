export interface CadastroFormI {
  cadastro_id?: number;
  cadastro_tipo_id?: number;
  cadastro_tipo_tipo?: number;
  cadastro_tratamento_id?: number;
  cadastro_nome?: string;
  cadastro_apelido?: string;
  cadastro_sigla?: string;
  cadastro_responsavel?: string;
  cadastro_cargo?: string;
  cadastro_grupo_id?: number;
  cadastro_endereco?: string;
  cadastro_endereco_numero?: string;
  cadastro_endereco_complemento?: string;
  cadastro_bairro?: string;
  cadastro_municipio_id?: number;
  cadastro_cep?: string;
  cadastro_estado_id?: number;
  cadastro_telefone?: string;
  cadastro_telcom?: string;
  cadastro_telefone2?: string;
  cadastro_celular?: string;
  cadastro_celular2?: string;
  cadastro_fax?: string;
  cadastro_email?: string;
  cadastro_email2?: string;
  cadastro_rede_social?: string;
  cadastro_outras_midias?: string;
  cadastro_cpfcnpj?: string;
  cadastro_rg?: string;
  cadastro_estado_civil_id?: number;
  cadastro_data_nascimento?: string | Date;
  cadastro_conjuge?: string;
  cadastro_escolaridade_id?: number;
  cadastro_profissao?: string;
  cadastro_sexo?: string;
  cadastro_zona?: string;
  cadastro_jornal?: boolean;
  cadastro_mala?: boolean;
  cadastro_agenda?: boolean;
  cadastro_sigilo?: boolean;
  cadastro_campo1?: string;
  cadastro_campo2?: string;
  cadastro_campo3?: string;
  cadastro_campo4_id?: number;
  cadastro_observacao?: string;
  cadastro_observacao_delta?: string;
  cadastro_observacao_texto?: string;
  cadastro_regiao_id?: number;
}
