export interface SolicProcessoI {
  processo_id: number;
  processo_numero: string;
  processo_status: string;
  // processo_status: number
  // processo_status_nome: string; // 0 -> 'EM ANDAMENTO' / 1 - 'INDEFERIDO' / 2 - 'DEFERIDO' / 3 - 'SUSPENSO'
}
