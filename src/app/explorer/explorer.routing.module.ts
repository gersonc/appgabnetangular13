import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ExplorerComponent} from "./explorer.component";
import {AuthChildGuard} from "../_guards";
import {Rule, Scope} from "../_models";
import {PastaListagem} from "./_models/arquivo-pasta.interface";
import {ExplorerListarResolver} from "./_resolvers/explorer-listar.resolver";

const routes: Routes = [
  {
    path: '',
    component: ExplorerComponent,
    resolve: {
      dados: ExplorerListarResolver
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExplorerRoutingModule { }
