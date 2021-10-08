import { NgModule, Component, enableProdMode, ViewChild, Input } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import {Router} from '@angular/router'; // import router from angular router
import {HttpClient} from '@angular/common/http';
import{ utility } from 'src/utilities';
import{DetailedEntryComponent} from './inputReviewData/detailedentry/detailedentry.component';


@Component({
  selector: 'app-root',
  templateUrl: './indexCMTG.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  moduleArray:any;
  selectedModule: number;
  currentDate: any;
  currMonth: any;
  currYear: any;  
  betaVersion:string = "";

 @ViewChild(DetailedEntryComponent) dataComp;

  

  constructor(private http : HttpClient, private route: Router,private Utility:utility) {
    
  }

  ngOnInit(): void {
    this.http.get(this.Utility.apiUrl + this.Utility.betaVerCntrl,{ withCredentials: true,responseType: 'text' })
    .subscribe(Response => { 
      this.betaVersion=Response;
    });

    
    const monthNames = ["January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];

    this.currentDate = new Date();
    this.currMonth = this.Utility.monthNames[new Date().getMonth()-1];
    this.currYear=new Date().getFullYear();

    this.http.get(this.Utility.apiUrl + this.Utility.moduleCntrl,{ withCredentials: true })
    .subscribe(Response => {         
      this.moduleArray=Response;
      this.selectedModule=Response[0].id;
      this.Utility.readSelectedModuled = this.selectedModule;
      //alert(this.Utility.readSelectedModuled);
      if(this.moduleArray.length == 1){
        let element: HTMLElement = document.getElementById('modSingle');    
        element.style.display="inline";
        let ele1: HTMLElement = document.getElementById('modMultiple');    
        ele1.style.display="none";
      }
      else{
        let ele1: HTMLElement = document.getElementById('modMultiple');    
        ele1.style.display="inline";
        let ele2: HTMLElement = document.getElementById('modSingle');    
        ele2.style.display="none";
      }
    });   
    
  }

  changeProject(e) {
    this.selectedModule = e.target.value;  
    this.Utility.readSelectedModuled=this.selectedModule;
    //this.dataComp.getIndexData(this.Utility.apiUrl + this.Utility.indexCntrl + "?moduleId="+this.Utility.readSelectedModuled+"&year=0");
    //alert(this.Utility.readSelectedModuled);
    //this.route.navigate(['/detailedentry']);
  }  
}

