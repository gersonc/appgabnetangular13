import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { UrlService } from '../_services';
import { User } from '../_models';

@Injectable({ providedIn: 'root' })

export class UserService {

  constructor(private url: UrlService, private http: HttpClient) {}

  getAll() {
    return this.http.get<User[]>(this.url + '/users');
  }

  getById(id: number) {
    return this.http.get<User>(this.url + '/users/' + id);
  }
}
