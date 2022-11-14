import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {GraficoComponent} from "./grafico.component";
import {GraficoGraficoComponent} from "./grafico-grafico/grafico-grafico.component";


const confRoutes: Routes = [
  {
    path: '',
    component: GraficoComponent,
    children: [
      {
        path: '',
        component: GraficoGraficoComponent,
      },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(confRoutes)],
  exports: [RouterModule]
})
export class GraficoRoutingModule {
}
