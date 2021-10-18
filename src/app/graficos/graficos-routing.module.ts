import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GraficosComponent } from './graficos.component';
import { GraficosCadastroComponent } from './graficos-cadastro/graficos-cadastro.component';
import { GraficosSolicitacaoComponent } from './graficos-solicitacao/graficos-solicitacao.component';
import { GraficosOficioComponent } from './graficos-oficio/graficos-oficio.component';
import { GraficosProcessoComponent } from './graficos-processo/graficos-processo.component';
import { GraficosEmendaComponent } from './graficos-emenda/graficos-emenda.component';




const confRoutes: Routes = [
  {
    path: '',
    component: GraficosComponent,
  },
  {
    path: 'cadastro',
    component: GraficosCadastroComponent,
  },
  {
    path: 'solicitacao',
    component: GraficosSolicitacaoComponent,
  },
  {
    path: 'oficio',
    component: GraficosOficioComponent,
  },
  {
    path: 'processo',
    component: GraficosProcessoComponent,
  },
  {
    path: 'emenda',
    component: GraficosEmendaComponent,
  }

];

@NgModule({
  imports: [RouterModule.forChild(confRoutes)],
  exports: [RouterModule]
})

export class GraficosRoutingModule { }
