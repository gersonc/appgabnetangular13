import { NgModule, ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthChildGuard } from '../_guards';
import { Rule, Scope } from '../_models';
import { CalendarioComponent } from './calendario.component';
import { CalendarioResolversService } from './_resolvers/calendario-resolvers.service';

const calendarioRoutes: Routes = [
  {
    path: '',
    component: CalendarioComponent,
    canActivate: [AuthChildGuard],
    data: {
      rules: Rule.agenda,
      scopes: Scope.agenda_visualizar
    },
    resolve: {
      dados: CalendarioResolversService
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(calendarioRoutes)],
  exports: [RouterModule]
})
export class CalendarioRoutingModule {
}
