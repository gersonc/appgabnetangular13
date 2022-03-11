import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from "@angular/forms";


import { NewFolderDialogComponent } from './modals/new-folder-dialog/new-folder-dialog.component';
import { RenameDialogComponent } from './modals/rename-dialog/rename-dialog.component';
import { FileManagerComponent } from "./file-manager.component";
import { DynamicDialogModule } from "primeng/dynamicdialog";
import {MenuModule} from "primeng/menu";
import {MenubarModule} from "primeng/menubar";
import {InputTextModule} from "primeng/inputtext";




@NgModule({
  declarations: [
    FileManagerComponent,
    NewFolderDialogComponent,
    RenameDialogComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    DynamicDialogModule,
    MenuModule,
    MenubarModule,
    InputTextModule
  ],
  exports: [
    FileManagerComponent
  ],
  entryComponents: [
    RenameDialogComponent,
    NewFolderDialogComponent
  ]
})
export class FileManagerModule { }
