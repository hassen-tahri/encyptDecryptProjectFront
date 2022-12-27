import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { EncrDecrService } from './encr-decr.service';
import { User } from './user';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  url =  'http://localhost:9098/user'
  constructor(protected httpclient: HttpClient,
    private EncrDecr: EncrDecrService) { }

  async getById(id: Number) {
    let user = this.httpclient.get<User>(this.url + '/' + id).toPromise();
    (await user).mpd = this.EncrDecr.get(environment.key, (await user).mpd)
    return user
  }

  async getAll() {
    let users = this.httpclient.get<User[]>(this.url).toPromise();
    (await users).forEach(
      p => p.mpd = this.EncrDecr.get(environment.key, p.mpd)
    )
    return users
  }

  async addUser(user: User) {
    user.mpd = this.EncrDecr.set(environment.key, user.mpd)
    return this.httpclient.post(this.url, user).toPromise();
  }

  async editUser(user: User) {
    user.mpd = this.EncrDecr.set(environment.key, user.mpd)
    return this.httpclient.put(this.url + '/' + user.id, user).toPromise();
  }

  async deleteUser(id: number) {
    return this.httpclient.delete(this.url + '/' + id).toPromise();
  }

  async getByPseudo(pseudo: string) {
    let user = this.httpclient.get<User>(this.url + '/pseudo/' + pseudo).toPromise();
    if(await user != null)
    {    (await user).mpd = this.EncrDecr.get(environment.key, (await user).mpd)
      return user}
  }


  async getByPseudoNotEncrypt(pseudo: string) {
    return this.httpclient.get<User>(this.url + '/pseudo/' + pseudo).toPromise();
  }

  async getByIdNotEncrypt(id: Number) {
    return this.httpclient.get<User>(this.url + '/' + id).toPromise();
  }

  async getAllNotEncrypt() {
    return this.httpclient.get<User[]>(this.url).toPromise();
  }

  async addUserNotEncrypt(user: User) {
    return this.httpclient.post(this.url, user).toPromise();
  }

  async editUserEncrypt(user: User) {
    return this.httpclient.put(this.url + '/' + user.id, user).toPromise();
  }

}
