
export interface ErroI {
  name?: any;
  headers?: any;
  message?: string;
  error?: any | null;
  title?: string;
  type?: any;
  status?: number;
  detail?: string;
  erro?: string[];
  statusText?: string;
  ok?:  boolean;
  url?: string | null;
  defaultStatusText?: string;
}

export interface ErrI {
  chave: string;
  valor: any;
}
