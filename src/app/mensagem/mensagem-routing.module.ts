import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {MensagemComponent} from "./mensagem/mensagem.component";
import {MensagemDataviewComponent} from "./mensagem-dataview/mensagem-dataview.component";
import {MensagemResolver} from "./_resolvers/mensagem.resolver";

const routes: Routes = [
  {
    path: '',
    component: MensagemComponent,
    children: [
      {
        path: '',
        component: MensagemDataviewComponent,
        resolve: {
          dados: MensagemResolver
        }
      }
    ]
  }
];



@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MensagemRoutingModule {}
