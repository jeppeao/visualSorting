import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { ArrayViewComponent } from './array-view/array-view.component';
import { MainViewComponent } from './main-view/main-view.component';
import { SortViewComponent } from './sort-view/sort-view.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button'
import { MatIconModule } from '@angular/material/icon'
import { MatTooltipModule } from '@angular/material/tooltip'; 
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { SortHostDirective } from './sort-host.directive';
import { SortService } from './sort.service';
import { ClassService } from './class.service';
import { SorterService } from './sorter.service';

@NgModule({
  declarations: [
    AppComponent,
    ArrayViewComponent,
    MainViewComponent,
    SortViewComponent,
    SortHostDirective
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatFormFieldModule,
    MatSelectModule,
    MatToolbarModule,
    MatMenuModule,
  ],
  providers: [
    SortService,
    ClassService,
    SorterService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
