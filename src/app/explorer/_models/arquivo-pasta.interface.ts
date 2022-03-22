export interface ArquivoListagem {
  arquivo_id?: number;
  arquivo_nome_original?: string;
  arquivo_tamanho?: number;
  arquivo_data_hora?: string;
  arquivo_tipo?: string;
  arquivo_usuario?: string;
  arquivo_registro_id?: number;
  arquivo_modulo?: string;
  arquivo_nome_s3?: string;
  arquivo_url_s3?: string;
  arquivo_arquivo_pasta_id?: number;
  arquivo_arquivo_pasta_nome?: string;
}

export interface PastaListagem {
  arquivo_pasta_id?: number;
  arquivo_pasta_nome?: string;
  arquivo_pasta_titulo?: string;
  arquivo_listagem?: ArquivoListagem[];
  pastas?: PastaListagem[];
}

export interface Caminho {
  pasta_id?: number;
  pasta_nome?: string;
  pasta_titulo?: string;
}
