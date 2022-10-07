import { Injectable } from '@angular/core';
import {UrlService} from "../../_services";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class DetalheService {

  constructor(
    private url: UrlService,
    private http: HttpClient,
  ) { }
}
