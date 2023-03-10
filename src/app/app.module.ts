import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MapComponent } from './map/map.component';
import { Map2Component } from './map2/map2.component';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';

@NgModule({
  declarations: [AppComponent, MapComponent, Map2Component],
  imports: [BrowserModule, AppRoutingModule, LeafletModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
