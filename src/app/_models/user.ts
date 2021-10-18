import {IScope} from './iscope';
import {Irule} from './irule';

export class User {
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
}
