import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {GraficosComponent} from "./graficos/graficos.component";

const confRoutes: Routes = [
  {
    path: '',
    component: GraficosComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(confRoutes)],
  exports: [RouterModule]
})
export class GraficosRoutingModule {
}
