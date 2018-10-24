import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { WithZoneExampleComponent } from './components/with-zone-example/with-zone-example.component';
import { WithoutZoneExampleComponent } from './components/without-zone-example/without-zone-example.component';
import { TakeUntilDestroyedExampleComponent } from './components/take-until-destroyed-example/take-until-destroyed-example.component';

@NgModule({
  declarations: [
    AppComponent,
    WithZoneExampleComponent,
    WithoutZoneExampleComponent,
    TakeUntilDestroyedExampleComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
