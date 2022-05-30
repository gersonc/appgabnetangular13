export interface SolicProcessoI {
  processo_id: number;
  processo_numero: string;
  processo_status_id: number;
  processo_status_nome: string;
  // processo_status_nome: number
  // processo_status_nome_nome: string; // 0 -> 'EM ANDAMENTO' / 1 - 'INDEFERIDO' / 2 - 'DEFERIDO' / 3 - 'SUSPENSO'
}
