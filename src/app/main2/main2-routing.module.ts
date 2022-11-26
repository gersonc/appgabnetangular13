import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {Main2Component} from "./main2/main2.component";


const main2Routes: Routes = [
  {
    path: '',
    component: Main2Component
  }
];

@NgModule({
  imports: [RouterModule.forChild(main2Routes)],
  exports: [RouterModule]
})
export class Main2RoutingModule { }
