import { Injectable } from '@angular/core';
import {UrlService} from "../../_services";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class FileManagerService {

  constructor(private url: UrlService, private http: HttpClient) { }

  getTodas(): Observable<any[]> {
    const url = this.url.filemanager + '/todas';
    return this.http.get<any[]>(url);
  }
}
