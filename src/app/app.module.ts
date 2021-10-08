import { NgModule, Query } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppRoutingModule, routingComponents } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { DxDataGridModule,DxPopupModule, DxButtonModule,DxTextBoxModule,DxTabPanelModule,DxLoadIndicatorModule,DxTabsModule,DxDateBoxModule} from 'devextreme-angular';
import { DetailedEntryComponent } from './inputReviewData/detailedentry/detailedentry.component';
import { InputReviewComponent } from './inputReviewData/input.component';
import { AnalysisComponent } from './analysis/analysis.component';



@NgModule({
  declarations: [
    AppComponent,routingComponents
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    DxButtonModule,
    DxPopupModule,
    DxDataGridModule,
    DxTextBoxModule,
    DxTabPanelModule,
    DxTabsModule,
    DxDateBoxModule,
    DxLoadIndicatorModule,
    HttpClientModule
  ],
  providers: [],
  exports:[DetailedEntryComponent,InputReviewComponent,AppComponent, AnalysisComponent ],
  bootstrap: [AppComponent,routingComponents]
})
export class AppModule { }
platformBrowserDynamic().bootstrapModule(AppModule);
