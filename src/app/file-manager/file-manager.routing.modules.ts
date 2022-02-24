import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthChildGuard } from '../_guards';
import { Rule, Scope } from '../_models';
import {FileManagerComponent} from "./file-manager.component";

const fileManagerRoutes: Routes = [
  {
    path: '',
    component: FileManagerComponent,
    canActivate: [AuthChildGuard],
    data: {
      rules: Rule.arquivos,
      scopes: Scope.arquivos_baixar
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(fileManagerRoutes)],
  exports: [RouterModule]
})

export class FileManagerRoutingModules { }
