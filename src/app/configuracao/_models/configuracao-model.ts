export interface ConfiguracaoRegistroI {
  campo_id?: number | null;
  campo_nome?: string | null;
}

export interface ConfiguracaoModelInterface {
  tabela?: string;
  campo_id?: string;
  campo_nome?: string;
  titulo?: string;
  texto?: string;
}

export class ConfiguracaoModel implements ConfiguracaoModelInterface {
  tabela = null;
  campo_id = null;
  campo_nome = null;
  titulo = null;
  texto = null;
}

export interface Configuracao2ModelInterface {
  tabela?: string;
  campo_id?: string;
  campo_id2?: string;
  campo_nome?: string;
  campo_txt1?: string;
  campo_txt2?: string;
  titulo?: string;
  texto?: string;
}

export class Configuracao2Model implements Configuracao2ModelInterface {
  tabela = null;
  campo_id = null;
  campo_id2 = null;
  campo_nome = null;
  campo_txt1 = null;
  campo_txt2 = null;
  titulo = null;
  texto = null;
}

export interface ConfiguracaoMenuIntensInterface {
  label: string;
  code: string;
}

export interface ConfiguracaoComponenteInterface {
  tabela?: string;
  campo_id?: string;
  campo_nome?: string;
  campo_txt1?: string;
  titulo?: string;
  labelTxt1?: string;
  texto?: string;
}

export class ConfiguracaoComponente implements ConfiguracaoComponenteInterface {
  tabela = null;
  campo_id = null;
  campo_nome = null;
  campo_txt1 = null;
  titulo = null;
  labelTxt1 = null;
  texto = null;
}
