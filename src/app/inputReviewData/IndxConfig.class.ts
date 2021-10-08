import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})

export class IndxConfigService {
  emptVar:any = 'testVar';
  headerData: any;
  columns: Array<any>;

  constructor(private http : HttpClient) { }
  
  myGlobalAddFunction(){
    return "Fuction 1";
  }
  mySecondFunc(){
    return "Fuction 2";
  }

  getHeader(year){
    /*this.headerData=[]; 
    //alert('http://dehensvbivm161.henkelgroup.net:1020/api/index/header?moduleID=1&year='+ year);
    this.http.get('http://dehensvbivm161.henkelgroup.net:1020/api/index/header?moduleID=1&year='+ year)
    .subscribe(Response => { 
      this.headerData=[]; 
      this.headerData=Response;  
    });
    return this.headerData;*/

    return this.http.get('http://dehensvbivm161.henkelgroup.net:1020/api/index/header?moduleID=1&year='+ year,{ withCredentials: true }).toPromise();
  }  
}