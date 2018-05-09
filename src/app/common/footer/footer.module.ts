import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FooterRoutingModule } from './footer-routing.module';
import { FooterComponent } from './footer.component';

@NgModule({
  imports: [
    CommonModule,
    FooterRoutingModule
  ],
  declarations: [FooterComponent]
})
export class FooterModule { }
