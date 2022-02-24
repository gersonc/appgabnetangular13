import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FileManagerComponent } from './file-manager.component';
// import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';

// import { MatToolbarModule } from '@angular/material/toolbar';
// import { FlexLayoutModule } from '@angular/flex-layout';
// import { MatIconModule } from '@angular/material/icon';
// import { MatGridListModule } from '@angular/material/grid-list';
// import { MatMenuModule } from '@angular/material/menu';
// import { MatDialogModule } from '@angular/material/dialog';
// import { MatInputModule } from '@angular/material/input';
// import { MatButtonModule } from '@angular/material/button';


import {HttpClientModule} from "@angular/common/http";
import {ButtonModule} from "primeng/button";
import {DialogModule} from "primeng/dialog";
import {InputTextModule} from "primeng/inputtext";
import {ScrollPanelModule} from "primeng/scrollpanel";
import {ToolbarModule} from "primeng/toolbar";
// import {ToolbarModule} from 'primeng-lts/toolbar';
import {RippleModule} from "primeng/ripple";
import {CardModule} from "primeng/card";
import {ContextMenuModule} from "primeng/contextmenu";
// import {PassagemRoutingModule} from "../passagem/passagem-routing.module";
import {FileManagerRoutingModules} from "./file-manager.routing.modules";



@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    // BrowserAnimationsModule,
    FormsModule,
    FileManagerRoutingModules,

    // MatToolbarModule,
    // FlexLayoutModule,
    // MatIconModule,
    // MatGridListModule,
    // MatMenuModule,
    // MatDialogModule,
    // MatInputModule,
    // MatButtonModule

    ScrollPanelModule,
    ButtonModule,
    DialogModule,
    ToolbarModule,
    InputTextModule,
    RippleModule,
    CardModule,
    ContextMenuModule,

  ],
  declarations: [
    FileManagerComponent,
  ],
  exports: [
    FileManagerComponent
  ]
})
export class FileManagerModule {}
