import { Injectable } from '@angular/core';
import {SelectItem} from "primeng/api";

@Injectable({
  providedIn: 'root'
})
export class TarefaSituacaoService {

  ddTarefa_situacao_id: SelectItem[] = [];

  constructor() { }
}
