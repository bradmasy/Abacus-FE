import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home/home.component';
import { RouterModule } from '@angular/router';

const routes = [
  {
    path: "",
    component: HomeComponent
  }
]

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})


export class PageRoutingModule { }
