import {IScope} from './iscope';
import {Irule} from './irule';

export class User {
  cadastro_campo1_nome?: string;
  cadastro_campo1_sn?: number;
  cadastro_campo2_nome?: string;
  cadastro_campo2_sn?: number;
  cadastro_campo3_nome?: string;
  cadastro_campo3_sn?: number;
  cadastro_campo4_nome?: string;
  cadastro_campo4_sn?: number;
  config_arquivo_ativo?: number;
  config_arquivo_cota?: number;
  config_cota_disponivel?: number;
  config_cota_utilizada?: number;
  dispositivo?: string;
  erro?: any[];
  expires?: number;
  futuro?: string;
  parlamentar_arquivo_ativo?: number;
  parlamentar_id?: number;
  parlamentar_nome?: string;
  parlamentar_sms_ativo?: number;
  parlamentar_versao?: number;
  rule?: any[];
  scope?: any[];
  token?: string;
  usuario_acesso?: string;
  usuario_regras?: string;
  usuario_email?: string;
  usuario_id?: number;
  usuario_local_id?: number;
  usuario_login?: string;
  usuario_nome?: string;
  usuario_principal_sn?: number;
  usuario_responsavel_sn?: number;
  usuario_senha?: string;
}

export class User2 {
  usuario_id?: number;
  parlamentar_id?: number;
  parlamentar_nome?: string;
  parlamentar_versao?: number;
  parlamentar_sms_ativo?: number;
  parlamentar_arquivo_ativo?: number;
  usuario_nome?: string;
  usuario_login?: string;
  usuario_email?: string;
  usuario_senha?: string;
  usuario_responsavel_sn?: number;
  usuario_principal_sn?: number;
  usuario_local_id?: number;
  rule?: any[];
  scope?: any[];
  token?: string;
  expires?: string;
  acesso?: string;
}


