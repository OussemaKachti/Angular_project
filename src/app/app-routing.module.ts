import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotFoundComponent } from './layout/not-found/not-found.component';
import { LidtEventComponent } from './layout/list-event/list-event.component';
import { HomeComponent } from './layout/home/home.component';

const routes: Routes = [
  {path:'home' , component:HomeComponent},
  {path:'list' , component:LidtEventComponent,children:[
      {path:'test' , component:HomeComponent}
  ]},
  {path:'**' , component:NotFoundComponent}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
