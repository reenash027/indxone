import { NgModule, Component, enableProdMode, ViewChild } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { DxDataGridModule } from 'devextreme-angular';

import * as AspNetData from "devextreme-aspnet-data-nojquery";
import {HttpClient} from '@angular/common/http';
import DataSource from "devextreme/data/data_source";
import { DxDataGridComponent } from "devextreme-angular";   

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.css']
})

export class InputReviewComponent {
   
}