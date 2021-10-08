import { NgModule, Component, enableProdMode, ViewChild } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { DxDataGridModule } from 'devextreme-angular';

import * as AspNetData from "devextreme-aspnet-data-nojquery";
import {HttpClient} from '@angular/common/http';
import DataSource from "devextreme/data/data_source";
import { DxDataGridComponent } from "devextreme-angular";   

@Component({
  selector: 'app-analysis',
  templateUrl: './analysis.component.html',
  styleUrls: ['./analysis.component.css']
})

export class AnalysisComponent {
}