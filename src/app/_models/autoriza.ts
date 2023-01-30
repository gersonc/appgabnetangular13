export interface autorizaI {
  expires: number;
  expiresRef: number;
  token: string | null;
  refToken: string | null;
  teste: any;
  usuario_uuid: string | null;
  currentUser: any;
  logado: boolean;
}


export class Autoriza implements autorizaI {
  expires = 0;
  expiresRef = 0;
  token = null;
  refToken = null;
  teste = null;
  usuario_uuid = null
  currentUser = null;
  logado = false;
}
