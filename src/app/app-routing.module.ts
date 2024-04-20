import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PageRoutingModule } from '../components/pages/page-routing.module';

const routes: Routes = [];

@NgModule({
  imports: [RouterModule.forRoot(routes), PageRoutingModule],
  exports: [RouterModule]
})
export class AppRoutingModule { }
