import {RouterModule, Routes} from "@angular/router";
import {NgModule} from "@angular/core";
import {DetalheComponent} from "./detalhe.component";


const detalheroutes: Routes = [
  {
    path: '',
    component: DetalheComponent
  }
];


@NgModule({
  imports: [RouterModule.forChild(detalheroutes)],
  exports: [RouterModule]
})

export class DetalheRoutingModule {

}
