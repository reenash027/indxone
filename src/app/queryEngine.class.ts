import {Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})

export class QueryEngineService {
  
  constructor(private http : HttpClient) { }

  Main(columndata:any,updateColumns:Array<any>,sIDs:any){
    let WhereClause:string;
    WhereClause=this.ConstructWhereClause(sIDs);

    let SubUpdateClause:any;
    SubUpdateClause = this.ConstructUpdateClause('',columndata,updateColumns);
    
    /*let UpdateClause:string = '';
    UpdateClause = 'UPDATE ' + tableName + ' SET ' + SubUpdateClause + WhereClause;
    alert(UpdateClause);*/
    
  }

  

  ConstructWhereClause(sIDs:any){
    let query:string = 'SID in (';
    sIDs.forEach((key) => {
          query += key + ",";        
    })
    query = query.slice(0, -1) + ")";
    return query;
  }

  ConstructUpdateClause(whereClause:any,columndata:any,updateColumns:Array<any>){
    let finalQuery:any=[];
    let subquery:string = '';
    //const vairable = [{key1: "value1"}, {key2: "value2"}]
    
      updateColumns.forEach(item =>{
        for (const [key, value] of Object.entries(item)){
          let dbDetails:any = this.ReadColumnData(key,columndata);
          subquery += dbDetails.dbColumnName + " = ";
          
          if((dbDetails.dbDataType).indexOf("CHAR") !== -1 || (dbDetails.dbDataType).indexOf("date") !== -1){
              subquery += "'" + value + "', ";
          }
          else{
              subquery += value + ", ";
          }
          //whereclause.length + subquery.length  + query.length
          //query += subquery;
          
          
          if((whereClause.length + subquery.length) >= 7000){
            subquery += subquery.slice(0, -2);
            subquery += subquery + ";";
            finalQuery.push(subquery);
            subquery = '';
          } 
          else{
            //alert(whereClause.length + subquery.length);
          }
      }
    })
    subquery = subquery.slice(0, -2);
    //alert(subquery);
    finalQuery.push(subquery);
    return finalQuery;
  }

  ReadColumnData(colFieldName:any,columndata:any){
    let item = columndata.find(i => i.dataField === colFieldName);
    return item;
  }
}