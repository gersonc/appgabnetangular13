import { Injectable } from '@angular/core';
import {ProceListarI} from "../_model/proce-listar-i";
import {ProcFormAnalisarI, ProcFormAnalisar} from "../_model/proc-form-analisar-i";
import {SelectItem} from "primeng/api";

@Injectable({
  providedIn: 'root'
})
export class ProceFormService {

  processo: ProceListarI | null = null;
  procA: ProcFormAnalisar | null = null;
  public acao?: string | null  = null;
  public ddProcesso_tipo_analize?: SelectItem[];
  public tipo_analize = 0;
  public btnEnviar = true;

  constructor() { }

  resetProcessoFormAnalisar() {
    this.procA = new ProcFormAnalisar();
  }

  parseListagemAnalisarForm(p: any): ProcFormAnalisarI {
    console.log('ssss', p);
    this.resetProcessoFormAnalisar();
    this.processo = p;
    const r = new ProcFormAnalisar();
    r.processo_id = p.processo_id;
    r.processo_solicitacao_id = p.solicitacao_id;
    r.processo_status_id = p.processo_status_id;
    r.processo_cadastro_id = p.processo_cadastro_id;
    r.processo_tipo_analize = p.processo_status_id;
    this.procA = r;
    return r
  }
}
