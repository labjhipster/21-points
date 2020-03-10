import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'blood-pressure',
        loadChildren: () => import('./blood-pressure/blood-pressure.module').then(m => m.TwentyOnePointsBloodPressureModule)
      },
      {
        path: 'points',
        loadChildren: () => import('./points/points.module').then(m => m.TwentyOnePointsPointsModule)
      },
      {
        path: 'preferences',
        loadChildren: () => import('./preferences/preferences.module').then(m => m.TwentyOnePointsPreferencesModule)
      },
      {
        path: 'weight',
        loadChildren: () => import('./weight/weight.module').then(m => m.TwentyOnePointsWeightModule)
      }
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ])
  ]
})
export class TwentyOnePointsEntityModule {}
