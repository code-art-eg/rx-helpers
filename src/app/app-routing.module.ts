import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { WithZoneExampleComponent } from './components/with-zone-example/with-zone-example.component';
import { WithoutZoneExampleComponent } from './components/without-zone-example/without-zone-example.component';
import { TakeUntilDestroyedExampleComponent } from './components/take-until-destroyed-example/take-until-destroyed-example.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'twz',
    pathMatch: 'full',
  },
  {
    path: 'twz',
    component: WithZoneExampleComponent
  },
  {
    path: 'nz',
    component: WithoutZoneExampleComponent
  },
  {
    path: 'tud',
    component: TakeUntilDestroyedExampleComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
