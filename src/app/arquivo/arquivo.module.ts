import { NgModule } from '@angular/core';
import { ArquivoComponent } from './arquivo/arquivo.component';
import { ArquivoViewComponent } from './arquivo-view/arquivo-view.component';
import { BlockUIModule } from 'primeng/blockui';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { MessageModule } from 'primeng/message';
import { MessagesModule } from 'primeng/messages';
import { PanelModule } from 'primeng/panel';
import { ProgressBarModule } from 'primeng/progressbar';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { RippleModule } from 'primeng/ripple';
import { ToastModule } from 'primeng/toast';
import { FileUploadModule } from 'primeng/fileupload';
import { UploadArquivoComponent } from './upload-arquivo/upload-arquivo.component';
import { TooltipModule } from 'primeng/tooltip';


@NgModule({
  declarations: [
    ArquivoComponent,
    ArquivoViewComponent,
    UploadArquivoComponent,
  ],
  exports: [
    ArquivoComponent
  ],
    imports: [
        BlockUIModule,
        ButtonModule,
        CommonModule,
        DialogModule,
        MessageModule,
        MessagesModule,
        PanelModule,
        ProgressBarModule,
        ProgressSpinnerModule,
        RippleModule,
        ToastModule,
        FileUploadModule,
        TooltipModule
    ]
})
export class ArquivoModule { }
