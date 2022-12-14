import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { MetamaskAccountComponent } from './components/metamask-account/metamask-account.component';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, MatButtonModule, MetamaskAccountComponent],
  bootstrap: [AppComponent]
})
export class AppModule {}
