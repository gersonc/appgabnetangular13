import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {MensagemResolver} from "./_resolvers/mensagem.resolver";
import {MensagemDatatableComponent} from "./mensagem-datatable/mensagem-datatable.component";

const routes: Routes = [

  {
    path: '',
    component: MensagemDatatableComponent,
    resolve: {
      dados: MensagemResolver
    }
  }
];



@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MensagemRoutingModule {}
