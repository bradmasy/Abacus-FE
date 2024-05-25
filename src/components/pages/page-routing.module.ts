import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home/home.component';
import { RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AuthGuardService } from '../../services/auth-guard/auth-guard.service';

const routes = [
  {
    path: "",
    component: HomeComponent
  },
  {
    path:"dashboard",
    component:DashboardComponent,
    canActivate: [AuthGuardService],
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
