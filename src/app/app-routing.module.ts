import { NgModule } from '@angular/core';
import { RouterModule, Routes,Params } from '@angular/router';
import{InputReviewComponent} from './inputReviewData/input.component';
import {AnalysisComponent} from './analysis/analysis.component';
import {DetailedEntryComponent} from './inputReviewData/detailedentry/detailedentry.component';
import { DxoDetailsComponent } from 'devextreme-angular/ui/nested';

const routes: Routes = [
  {
    path: '', 
    children: [
      {
        path: '',
        redirectTo: '/indexCMTG',
        pathMatch: 'full'
      },
      {
        path: 'input',                
        component: InputReviewComponent,
        
        children:[
          {
          path: 'detailedentry', 
          //redirectTo: '/detailedentry',    //check this   
          component: DetailedEntryComponent,
          }
        ]
      },
      {
        path: 'analyse',
        component: AnalysisComponent,
      },     
    ]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
export const routingComponents = [InputReviewComponent,AnalysisComponent, DetailedEntryComponent ]
