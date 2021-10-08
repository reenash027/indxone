import {Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class  utility {
    production:boolean= false;
    //apiUrl:string = "http://dehensvbivm161.henkelgroup.net:987/api/";    
    //apiUrl:string = "https://indx-d01.azurewebsites.net/api/";
    apiUrl:string = "http://dehensvbivm161.henkelgroup.net:1020/api/";
    moduleCntrl:string = "Authorization/Module";
    indexCntrl:string = "Index";
    monthNames:any = [];
    betaVerCntrl:any = "Configuration/BetaVersion";
    readSelectedModuled: number;
    
    constructor() { 
        this.monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"];
    }

}
