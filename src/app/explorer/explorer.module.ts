import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ExplorerRoutingModule} from "./explorer.routing.module";
import {ExplorerComponent} from "./explorer.component";
import {FileManagerModule} from "./file-manager/file-manager.module";
import {FileManagerService} from "./_services/file-manager.service";



@NgModule({
  declarations: [
    ExplorerComponent,
  ],
  imports: [
    CommonModule,
    ExplorerRoutingModule,
    FileManagerModule
  ],
  exports: [
    ExplorerComponent
  ],
  providers: [FileManagerService]
})
export class ExplorerModule { }
