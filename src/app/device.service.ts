import { Injectable } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { device } from './device/device';

@Injectable({
  providedIn: 'root'
})
export class DeviceService {

  private url = 'http://localhost:3000/devices';

  public pagination = [];
  


  constructor(private http: HttpClient) { }




  getOneDevice(id: number): Observable<any>{
    return this.http.get(this.url + '/' + id);
  }

  updateOneDevice(dev: device): Observable<any>{
    if(dev.hasOwnProperty('id')){
      return this.http.put(this.url + '/' + dev.id, dev);
    }
    else{
      return this.http.post(this.url + '/', dev);
    }
  }

  deleteOneDevice(id: number): Observable<any>{
    return this.http.delete(this.url + '/' + id);
  }


  getList(url: string = ''){
    if(url === '') { url = this.url + '/?_page=1&_limit=100'; }
    return this.http.get(url);
  }


  getPagination(url: string = ''){
    if(url === '') { url = this.url + '/?_page=1&_limit=100'; }
    return this.http.get<any>(url, {observe: 'response'})
  }




}
