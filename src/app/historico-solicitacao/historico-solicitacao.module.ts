import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HistoricoSolicitacaoComponent } from './historico-solicitacao.component';
import { HistoricoSolicitacaoIncluirComponent } from './historico-solicitacao-incluir/historico-solicitacao-incluir.component';
import { HistoricoSolicitacaoAlterarComponent } from './historico-solicitacao-alterar/historico-solicitacao-alterar.component';
import { HistoricoSolicitacaoExcluirComponent } from './historico-solicitacao-excluir/historico-solicitacao-excluir.component';
import { HistoricoSolicitacaoFormComponent } from './historico-solicitacao-form/historico-solicitacao-form.component';
import { HistoricoSolicitacaoListarComponent } from './historico-solicitacao-listar/historico-solicitacao-listar.component';
import { HistoricoSolicitacaoDetalheComponent } from './historico-solicitacao-detalhe/historico-solicitacao-detalhe.component';



@NgModule({
  declarations: [
    HistoricoSolicitacaoComponent,
    HistoricoSolicitacaoIncluirComponent,
    HistoricoSolicitacaoAlterarComponent,
    HistoricoSolicitacaoExcluirComponent,
    HistoricoSolicitacaoFormComponent,
    HistoricoSolicitacaoListarComponent,
    HistoricoSolicitacaoDetalheComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    HistoricoSolicitacaoComponent
  ]
})
export class HistoricoSolicitacaoModule { }
