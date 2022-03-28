import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SolicitacaoT2Component } from './solicitacao-t2.component';

const routes: Routes = [{ path: '', component: SolicitacaoT2Component }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SolicitacaoT2RoutingModule { }
