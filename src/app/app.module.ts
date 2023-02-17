import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { ArrayViewComponent } from './array-view/array-view.component';
import { MainViewComponent } from './main-view/main-view.component';
import { SortViewComponent } from './sort-view/sort-view.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';



@NgModule({
  declarations: [
    AppComponent,
    ArrayViewComponent,
    MainViewComponent,
    SortViewComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
