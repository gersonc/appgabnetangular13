import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {MensagemComponent} from "./mensagem/mensagem.component";

const routes: Routes = [
  {
    path: '',
    component: MensagemComponent,
  }
];



@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MensagemRoutingModule {}
