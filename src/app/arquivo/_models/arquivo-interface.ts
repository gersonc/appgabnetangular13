import {HttpEventType} from '@angular/common/http';


export interface FileUploadInterface {
  arquivo_id?: number;
  arquivo_data_hora?: string;
  arquivo_modulo?: string;
  arquivo_registro_id?: number;
  arquivo_usuario?: string;
  arquivo_nome_original?: string;
  arquivo_nome_antigo?: string;
  arquivo_nome_s3?: string;
  arquivo_tamanho?: number;
  arquivo_tipo?: string;
  arquivo_url_s3?: string;
  arquivo_ativo?: number;
  arquivo_obs?: string;
  arquivo_num?: number;
  arquivo_arquivo_pasta_id?: number;
  arquivo_arquivo_pasta_nome?: string;
}

export interface ArquivoInterface {
  arquivo_id?: number;
  arquivo_data_hora?: string;
  arquivo_modulo?: string;
  arquivo_registro_id?: number;
  arquivo_usuario?: string;
  arquivo_nome_original?: string;
  arquivo_nome_antigo?: string;
  arquivo_nome_s3?: string;
  arquivo_tamanho?: number;
  arquivo_tipo?: string;
  arquivo_url_s3?: string;
  arquivo_ativo?: number;
  arquivo_obs?: string;
  arquivo_num?: number;
  arquivo_arquivo_pasta_id?: number;
  arquivo_arquivo_pasta_nome?: string;
}

export interface ArquivoNumInterface {
  num?: number;
}


// **************************

export interface FileUploadPreInterface {
  arquivo: FileUploadInterface;
  formS3?: FormS3Interface;
  preurl?: string;
}

export interface FileGetUrl {
  'name': string;
  'size': number;
  'type': string;
}

export interface FormS3Interface {
  'acl': string;
  'key': string;
  'X-Amz-Credential': string;
  'X-Amz-Algorithm': string;
  'X-Amz-Date': string;
  'Policy': string;
  'X-Amz-Signature': string;
}

export interface UploadState {
  status: 'ready' | 'uploading' | 'done' | 'success' | 'error' | 'cancelled';
  file: File;
  source?: string;
  progress: {
    timeRemaining: number | null;
    speed: number | null;
    percentCompleted: number | null;
    speedHuman: string | null;
  };
  response: any;
  error: any;
}

export interface UploadInterface {
  originalEvent: HttpEventType.Response;
  files: File[];
}
/*

export interface Arq extends Blob {
  readonly lastModified: number;
  readonly name: string;
  objectURL?: string;
}

export class File {
  File: Arq;
  constructor (
    fileBits: BlobPart[],
    fileName: string,
    options?: FilePropertyBag) {}
}
*/



export type PresignedUploaderAction = 'cancel';
export type PresignedUploaderActions = 'cancel';

