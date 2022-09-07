import { Component, OnInit } from '@angular/core';
import {TarefaI} from "../_models/tarefa-i";
import {ColunasI} from "../../_models/colunas-i";
import {TituloI} from "../../_models/titulo-i";

@Component({
  selector: 'app-tarefa-detalhe',
  templateUrl: './tarefa-detalhe.component.html',
  styleUrls: ['./tarefa-detalhe.component.css']
})
export class TarefaDetalheComponent implements OnInit {

  valores: TarefaI[] = [];
  campos: ColunasI[] = [];
  camposSituacao: ColunasI[] = [];
  camposAndamento: ColunasI[] = [];
  titulo: TituloI[] | null = null;

  cols: ColunasI[] = [];
  colSituacao: ColunasI[] = [];
  colAndamento: ColunasI[] = [];

  constructor() { }

  ngOnInit(): void {
    this.cols = [
      {field: 'tarefa_id', header: 'ID', sortable: 'true', width: '80px'},
      {field: 'tarefa_titulo', header: 'TITULO', sortable: 'true', width: '150px'},
      {field: 'tarefa_tarefa', header: 'TAREFA', sortable: 'true', width: '400px'},
      {field: 'tarefa_situacao_nome', header: 'SITUAÇÃO', sortable: 'true', width: '150px'},
      {field: 'tarefa_usuario_situacao', header: 'DEMANDADOS SITUAÇÃO', sortable: 'false', width: '250px'},
      {field: 'tarefa_data', header: 'PRAZO', sortable: 'true', width: '150px'},
      {field: 'tarefa_usuario_autor_nome', header: 'AUTOR', sortable: 'true', width: '150px'},
      {field: 'tarefa_datahora', header: 'DATA PEDIDO', sortable: 'true', width: '150px'},
      {field: 'tarefa_usuario_situacao_andamento', header: 'DEMANDADOS SITUAÇÃO ANDAMENTOS', sortable: 'false', width: '400px'},
    ];

    this.colSituacao = [
      {field: 'tu_usuario_nome', header: 'DEMANDADOS', sortable: 'true', width: '150px'},
      {field: 'tus_situacao_nome', header: 'SITUAÇÃO', sortable: 'true', width: '150px'},
    ];

    this.colAndamento = [
      {field: 'tu_usuario_nome', header: 'DEMANDADOS', sortable: 'true', width: '150px'},
      {field: 'tus_situacao_nome', header: 'SITUAÇÃO', sortable: 'true', width: '150px'},
      {field: 'th_data', header: 'PRAZO', sortable: 'true', width: '150px'},
      {field: 'th_historico', header: 'ANDAMENTOS', sortable: 'false', width: '400px'},
    ];



  }

}
