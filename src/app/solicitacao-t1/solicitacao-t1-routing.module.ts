import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SolicitacaoT1Component } from './solicitacao-t1.component';


const routes: Routes = [
  { path: '', component: SolicitacaoT1Component }
];



@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SolicitacaoT1RoutingModule { }
