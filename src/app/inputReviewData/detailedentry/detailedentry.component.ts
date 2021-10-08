import { NgModule, Component, enableProdMode, ViewChild, Output, EventEmitter } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import {formatDate} from '@angular/common';
import { DxDataGridModule } from 'devextreme-angular';

import * as AspNetData from "devextreme-aspnet-data-nojquery";
import {HttpClient, HttpParams} from '@angular/common/http';
import DataSource from "devextreme/data/data_source";
import { DxDataGridComponent, DxPopupComponent,DxTabPanelModule,DxLoadIndicatorModule,DxTabsModule, DxButtonComponent,DxTextBoxModule,DxDateBoxModule } from "devextreme-angular";  
import CustomStore from 'devextreme/data/custom_store'; 
import notify from 'devextreme/ui/notify';
import {IndxConfigService} from '../IndxConfig.class';
import { QueryEngineService } from 'src/app/queryEngine.class';
import{ utility } from 'src/utilities';



@Component({
  selector: 'app-detailedentry',
  templateUrl: './detailedentry.component.html',
  styleUrls: ['./detailedentry.component.css']
})



export class DetailedEntryComponent{  
  indexData: any;  
  url: string;
  selectedModule: number;
  columns: Array<any>;  
  public tableName: string;
  exportFileName: string;
  indexMonth: number;
  costSplitLocked: boolean;
  editedCYData: any=[];
  singleIndexCY: any;
  singleIndexCol:any;
  editedNYData: any=[];
  singleIndexNY: any;
  public editPopup:boolean;
  public editPopupTitle:string="Edit Screen";
  updatedFeilds:Array<any>=[];
  sid:number;
  

  txtPurchasingBU:string="No Value";
  txtPurchasingCountry:string="No Value";
  txtPlant:string="No Value";
  txtPlantText:string="No Value";
  txtCombinedBasket:string="No Value";
  txtCombinedBasketText:string="No Value";
  txtMaterialNumber:string="No Value";
  txtMaterialNumberText:string="No Value";
  txtSupplier:string="No Value";
  txtSupplierText:string="No Value";
  txtSpendBaseline:string="No Value";

  txtRaws:string=null;
  txtPacks:string=null;
  txtLogistics:string=null;
  txtProcessing:string=null;
  txtPriceValidity:Date = null;

  totalRowSelected:any[];

  @ViewChild('dataGridIndx', { static: false }) dataGrid: DxDataGridComponent;
  @ViewChild('dataGridIndxCY', { static: false }) dataGridCY: DxDataGridComponent;
  @ViewChild('editScreen', { static: false }) editScreen: DxPopupComponent;
  @ViewChild('btnBatchUpdate', { static: false }) btnBatchUpdate: DxButtonComponent;
  @ViewChild('btnClearUpdate', { static: false }) btnClearUpdate: DxButtonComponent;
  //@ViewChild(AppComponent) appComp;
  
  
  constructor(private http : HttpClient, private indxConfigClass:IndxConfigService,
      private queryEngineClass:QueryEngineService, private Utility:utility) {
        //this.editClick = this.editClick.bind(this);
  }

  async getHeader(year:any){    
    let data:any = await this.indxConfigClass.getHeader(year);
    
    this.columns = [];
    this.columns = data;
    this.columns.push({
      caption:"Action",
      type: "buttons",
      fixed: true,
      fixedPosition: "left",
      buttons: [{
          name: "edit",            
          onClick: this.editClick.bind(this)
      }]});
    //alert("getHeader" + this.columns.length);
    this.tableName=data[0].dbTableName;
    
    //alert("tableName " + this.tableName);
  }
  ngOnInit(): void {
    //alert("from Utility: " + this.Utility.apiUrl);
    this.indexMonth = 8;
    this.costSplitLocked = false;
    let date:string;
    this.editPopup=false;
    date = formatDate(Date.now(),'yyyy-MM-dd HH:MM:ss','en-US');    
    this.exportFileName = "Index-" + date;
    
    //alert(this.exportFileName);
    this.getHeader('0'); 
    //alert("from detailed entry " + this.Utility.readSelectedModuled);   
    this.url= this.Utility.apiUrl + this.Utility.indexCntrl + "?moduleID="+this.Utility.readSelectedModuled+"&year=";    
    this.columns = [];   
    this.getIndexData(this.Utility.apiUrl + this.Utility.indexCntrl + "?moduleId="+this.Utility.readSelectedModuled+"&year=0");
    
  }

  changeYear(e) {  
    this.columns = [];
    this.getHeader(e.target.value);
    let apiURL:any;
    apiURL= this.url + e.target.value;
    this.columns = [];
    this.getIndexData(apiURL);
  }

  onBeforeSend(e){
    e.request.withCredentials = true;
  }

  async updateIndex(e) {  
        //alert(this.updatedFeilds);
        let dtArray = this.updatedFeilds; //Object.entries(e.newData); 
        let sids = [this.sid];
        let whereClause = this.queryEngineClass.ConstructWhereClause(sids);
        let updateClauses =this.queryEngineClass.ConstructUpdateClause(whereClause, this.columns,dtArray);
        //alert("all: " + updateClauses);
        for (var updateClause of updateClauses) {
            //alert("one: " + updateClause);
            let appendURL = "updateClause=" + encodeURIComponent(updateClause) 
                + "&tableName="+ encodeURIComponent(this.tableName) 
                + "&whereClause=" + encodeURIComponent(whereClause);      
                  //alert(this.Utility.apiUrl + this.Utility.indexCntrl + "/Update?" + appendURL);
            this.http.get(this.Utility.apiUrl + this.Utility.indexCntrl + "/Update?" + appendURL,{ withCredentials: true })
              .subscribe(Response => {     
                if(Response== true){e.cancel = true;}    
                else{notify("Failed to updated", "error", 5000);}    
              }); 
        }
      notify("Updated Successfully", "success", 5000)          
      //e.cancel = true;
      //window.location.reload();
  }

  getIndexData(url: any){
    
    this.indexData= [];
    this.http.get(url,{ withCredentials: true })
    .subscribe(Response => {         
      this.indexData=Response;
      //alert("getIndexData "+this.columns.length);
      
      this.dataGrid.columns=[];
      
      this.dataGrid.columns=this.columns;
      this.dataGrid.dataSource=this.indexData;    
      this.dataGrid.instance.refresh();         
         
    });
  }
  
  editClick(e) {
    //this.editPopup=true;
    
    //alert("correct" + e.row.key);
    this.editPopup=true;
    this.editPopupTitle = "Edit Screen for SID: " + e.row.key;    
    this.OnEditStart("single",e.row.key);
    
  }
  /*customizeColumns (columns) {
      columns.push({ // Pushes the "Address" band column into the "columns" array
        caption: "Action",
        fixed: true,
        fixedPosition: "left",
        type: "buttons",
        buttons: [{
            name: "edit",
            onClick: this.editClick.bind(this)
        }]
      });
      /*const addressFields = ["SID", "Responsible", "PurchasingBU"];
        for (let i = 0; i < columns.length - 1; i++) {
            if (addressFields.indexOf(columns[i].dataField) > -1) // If the column belongs to "Address",
                columns[i].ownerBand = 1; // assigns "Address" as the owner band column
        }
  }*/

  onCellPrepared(e: any) {
    if(this.costSplitLocked==false && (e.rowType == "data" && e.column.setLock == 1)){      
        e.cellElement.style.backgroundColor = "yellow";
    }
    if(e.rowType === "header") {
      e.cellElement.style.backgroundColor = "#e1000f";
      e.cellElement.style.color = "white";
      e.cellElement.style.fontWeight = "bold";
  }
    if (e.rowType == "data") { 
      if(e.column.dataField == "PriceValidity"){ 
        e.cellElement.style.backgroundColor = "yellow";
      }
      if((e.column.dataField).indexOf("Jan") !== -1){ 
        this.SetCellColor(e,1);
      }
      if((e.column.dataField).indexOf("Feb") !== -1){ 
        this.SetCellColor(e,2);
      }
      if((e.column.dataField).indexOf("Mar") !== -1){
        this.SetCellColor(e,3);
      }
      if((e.column.dataField).indexOf("Apr") !== -1){ 
        this.SetCellColor(e,4);
      }
      if((e.column.dataField).indexOf("May") !== -1){ 
        this.SetCellColor(e,5);
      }
      if((e.column.dataField).indexOf("Jun") !== -1){ 
        this.SetCellColor(e,6);
      }
      if((e.column.dataField).indexOf("Jul") !== -1){ 
        this.SetCellColor(e,7);
      }
      if((e.column.dataField).indexOf("Aug") !== -1){ 
        this.SetCellColor(e,8);
      }
      if((e.column.dataField).indexOf("Sep") !== -1){ 
        this.SetCellColor(e,9);
      }
      if((e.column.dataField).indexOf("Oct") !== -1){ 
        this.SetCellColor(e,10);
      }
      if((e.column.dataField).indexOf("Nov") !== -1){ 
        this.SetCellColor(e,11);
      }
      if((e.column.dataField).indexOf("Dec") !== -1){ 
        this.SetCellColor(e,12);
      } 
      if((e.column.dataField).indexOf("Calculated") !== -1){ 
        e.cellElement.style.backgroundColor = "orange";
      }  
    }
  }

  SetCellColor(e, month){
    let monthsLst = {'Jan':1, 'Feb':2, 'Mar':3, 'Apr':4, 'May':5, 'Jun':5,'Jul':6,'Aug':8,'Sep':9,'Oct':10,'Nov':11,'Dec':12};
    let priceMonth = (e.data.PriceValidity).substring(0, 3);  
    e.cellElement.style.backgroundColor = ((this.indexMonth) <= month) ? ("yellow") : "white";
    if(month > monthsLst[priceMonth]){
      e.cellElement.style.backgroundColor = "blue";  
    }    
  }

  OnEditStart(type,key){
    this.sid=key;
    this.singleIndexCY= [];   
    this.singleIndexNY = [];
    this.singleIndexCol = this.singleIndexHeader();
    this.http.get(this.Utility.apiUrl + this.Utility.indexCntrl + "/Master?moduleid=1&sids="+key,{ withCredentials: true })
    .subscribe(Response => { 
      this.txtPurchasingBU = Response[0].PurchasingBU;
      this.txtPurchasingCountry = Response[0].PurchasingCountry;
      this.txtPlant = Response[0].Plant;
      this.txtPlantText = Response[0].PlantText;
      this.txtCombinedBasket = Response[0].CombinedBasket;
      this.txtCombinedBasketText = Response[0].CombinedBasketText;
      this.txtMaterialNumber = Response[0].MaterialNumber;
      this.txtMaterialNumberText = Response[0].MaterialNumberText;
      this.txtSupplier = Response[0].Supplier;
      this.txtSupplierText = Response[0].SupplierText;
      this.txtSpendBaseline = Response[0].TotalSpend;
    });
    this.http.get(this.Utility.apiUrl + this.Utility.indexCntrl + "/CostSplit?moduleid=1&sids="+key,{ withCredentials: true })
    .subscribe(Response => { 
      this.txtRaws = Response[0].FactorRaws;
      this.txtPacks = Response[0].FactorPacks;
      this.txtLogistics = Response[0].FactorLogistics;
      this.txtProcessing = Response[0].FactorProcessing;
      this.txtPriceValidity = Response[0].Pricevalidity;
    });
    let indexURL = this.Utility.apiUrl + this.Utility.indexCntrl + "/SingleIndex?";
    if(type=="multiple"){
      indexURL= this.Utility.apiUrl + this.Utility.indexCntrl + "/MultipleIndex?";
    }
    this.http.get(indexURL+"sid="+key+"&moduleId=1&year=0",{ withCredentials: true })
    .subscribe(Response => {
      this.singleIndexCY = [];
      this.singleIndexCY=Response;
    });
    this.http.get(indexURL+"sid="+key+"&moduleId=1&year=1",{ withCredentials: true })
    .subscribe(Response => {         
      this.singleIndexNY = [];
      this.singleIndexNY=Response;
    });
  }

  onEditCYGrid(e) { 
   this.generateCYNYUpdatedFields(e);
  }

  onEditNYGrid(e) { 
    this.generateCYNYUpdatedFields(e);
  }

  generateCYNYUpdatedFields(e){
    let field:string = 'H_DBColName_' + Object.entries(e.newData)[0][0];
    let val:any;
    if(e.oldData.hasOwnProperty(field) && field.includes('Raws'))
    {
     val = e.oldData.H_DBColName_Raws; 
    }
    if(e.oldData.hasOwnProperty(field) && field.includes('Packs'))
    {
     val = e.oldData.H_DBColName_Packs; 
    }
    if(e.oldData.hasOwnProperty(field) && field.includes('Logistics'))
    {
     val = e.oldData.H_DBColName_Logistics; 
    }
    if(e.oldData.hasOwnProperty(field) && field.includes('Processing'))
    {
     val = e.oldData.H_DBColName_Processing; 
    }
    this.updatedFeilds.push({[val]:(Object.entries(e.newData)[0][1])});  
    //alert(this.updatedFeilds);
  }

  singleIndexHeader(){
    return [{"Id":1,"ColumnIndex":0,"ModuleId":1,"caption":"Month","dataField":"Month","dataType":"text","cssClass":null,"allowEditing":false,"allowSorting":false,"allowFiltering":false,"alignment":null,"visible":true,"format":null,"width":null},{"Id":2,"ColumnIndex":1,"ModuleId":1,"caption":"Raws","dataField":"Raws","dataType":"number","cssClass":null,"allowEditing":true,"allowSorting":false,"allowFiltering":false,"alignment":null,"visible":true,"format":null,"width":null},{"Id":3,"ColumnIndex":2,"ModuleId":1,"caption":"Packs","dataField":"Packs","dataType":"number","cssClass":null,"allowEditing":true,"allowSorting":false,"allowFiltering":false,"alignment":null,"visible":true,"format":null,"width":null},{"Id":4,"ColumnIndex":3,"ModuleId":1,"caption":"Logistics","dataField":"Logistics","dataType":"number","cssClass":null,"allowEditing":true,"allowSorting":false,"allowFiltering":false,"alignment":null,"visible":true,"format":null,"width":null},{"Id":5,"ColumnIndex":4,"ModuleId":1,"caption":"Processing","dataField":"Processing","dataType":"number","cssClass":null,"allowEditing":true,"allowSorting":false,"allowFiltering":false,"alignment":null,"visible":true,"format":null,"width":null},{"Id":6,"ColumnIndex":5,"ModuleId":1,"caption":"ForecastIndex","dataField":"ForecastIndex","dataType":"number","cssClass":null,"allowEditing":false,"allowSorting":false,"allowFiltering":false,"alignment":null,"visible":true,"format":null,"width":null},{"Id":7,"ColumnIndex":6,"ModuleId":1,"caption":"H_SID","dataField":"H_SID","dataType":"number","cssClass":null,"allowEditing":false,"allowSorting":false,"allowFiltering":false,"alignment":null,"visible":false,"format":null,"width":null},{"Id":8,"ColumnIndex":7,"ModuleId":1,"caption":"H_Year","dataField":"H_Year","dataType":"number","cssClass":null,"allowEditing":false,"allowSorting":false,"allowFiltering":false,"alignment":null,"visible":false,"format":null,"width":null},{"Id":9,"ColumnIndex":8,"ModuleId":1,"caption":"H_DBColName_Raws","dataField":"H_DBColName_Raws","dataType":"text","cssClass":null,"allowEditing":false,"allowSorting":false,"allowFiltering":false,"alignment":null,"visible":false,"format":null,"width":null},{"Id":10,"ColumnIndex":9,"ModuleId":1,"caption":"H_DBColName_Packs","dataField":"H_DBColName_Packs","dataType":"text","cssClass":null,"allowEditing":false,"allowSorting":false,"allowFiltering":false,"alignment":null,"visible":false,"format":null,"width":null},{"Id":11,"ColumnIndex":10,"ModuleId":1,"caption":"H_DBColName_Logistics","dataField":"H_DBColName_Logistics","dataType":"text","cssClass":null,"allowEditing":false,"allowSorting":false,"allowFiltering":false,"alignment":null,"visible":false,"format":null,"width":null},{"Id":12,"ColumnIndex":11,"ModuleId":1,"caption":"H_DBColName_Processing","dataField":"H_DBColName_Processing","dataType":"text","cssClass":null,"allowEditing":false,"allowSorting":false,"allowFiltering":false,"alignment":null,"visible":false,"format":null,"width":null}]
  }

  selectionChangedHandler(e){
    //alert("No. of Row Selected " + e.selectedRowKeys.length + "ids are " + e.selectedRowKeys);
    this.totalRowSelected = e.selectedRowKeys;
    if(e.selectedRowKeys.length > 1){
      this.btnBatchUpdate.disabled = false;
    }
    else{this.btnBatchUpdate.disabled = true;}
    if(e.selectedRowKeys.length > 0){
      this.btnClearUpdate.disabled = false;      
    }
    else{    
      this.btnClearUpdate.disabled = true;
    }
  }
  
  onClearSelection(){    
    this.dataGrid.instance.clearSelection();   
  }

  onBatchUpdate(){
    //alert("No. of Row Selected " + this.totalRowSelected);
    this.editPopupTitle = "Batch Update (for " + this.totalRowSelected.length + " Records)";
    this.editPopup=true;
    this.OnEditStart("multiple",this.totalRowSelected);
  }

  onRawsChanged(e){
    if(e.previousValue != null){
      if((e.previousValue != e.value) &&  e.value != null){        
        this.updatedFeilds.push({'Raws %':e.value})
      }
    }
  }

  onPacksChanged(e){
    if(e.previousValue != null){
      if((e.previousValue != e.value) &&  e.value != null){
        this.updatedFeilds.push({"Packs %":e.value})
      }
    }
  }

  onLogChanged(e){
    if(e.previousValue != null){
      if((e.previousValue != e.value) &&  e.value != null){
        this.updatedFeilds.push({"Logistics %":e.value})
      }
    }
  }

  onProcChanged(e){
    if(e.previousValue != null){
      if((e.previousValue != e.value) &&  e.value != null){
        this.updatedFeilds.push({"Processing %":e.value})
      }
    }
  }

  onPriValChanged(e){
    if(e.previousValue != null){
      if((e.previousValue != e.value) &&  e.value != null){
        this.updatedFeilds.push({"PriceValidity":e.value})
      }
    }
  }

  onBatchSave(e){
    this.updateIndex(e);
    this.dataGrid.instance.repaint();
    
  }

  onBatchClose(){
    this.editPopup=false;
    this.txtRaws=null;
    this.txtPacks=null;
    this.txtLogistics=null;
    this.txtProcessing=null;
    this.txtPriceValidity=null;
    this.dataGrid.instance.repaint();
    this.dataGrid.instance.refresh(true);    
  }

  onRefreshGrid(){
    let url:any=this.Utility.apiUrl + this.Utility.indexCntrl + "?moduleId="+this.Utility.readSelectedModuled+"&year=0";
    this.getIndexData(url);
  }
}
