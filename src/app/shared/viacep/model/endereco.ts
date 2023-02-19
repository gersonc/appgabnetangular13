export interface Endereco {
  cep?: string;
  logradouro?: string;
  complemento?: string;
  bairro?: string;
  localidade?: string;
  uf?: string;
  unidade?: string;
  ibge?: string;
  gia?: string;
  erro?: boolean;
  erromsg?: string;
}

export interface EnderecoPesquisa {
  uf: string;
  logradouro: string;
  municipio: string;
}
