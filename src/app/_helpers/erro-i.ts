
export interface ErroI {
  name?: any;                   // HttpErrorResponse
  headers?: any;                // {"normalizedNames": {},"lazyUpdate": null}
  message?: string;             // "Http failure response for http://slimgn08.dv/cadastro/listar: 417 Expectation Failed"
  error?: ErrorI | null;
  title?: string;
  type?: any;
  status?: number;              // 417
  detail?: string;
  erro?: string[];
  statusText?: string;          // "Expectation Failed"
  ok?:  boolean;                // false
  url?: string | null;          // "http://slimgn08.dv/cadastro/listar"
  defaultStatusText?: string;
}

export interface ErrorI {
  erro?: any;
  title?: string;               // "REQUISIÇÃO INVÁLIDA"
  type?: string;                // "417 Erro no formulario"
  status?: number;              // 417
  detail?: string;              // "Dados Inválidos.1"
  instance?: string;            // "/cadastro/listar/postsolicitacaolistar"
}

export interface ErrI {
  chave: string;
  valor: any;
}
