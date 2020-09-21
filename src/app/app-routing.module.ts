import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { HeaderComponent } from './components/header.component';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', loadChildren: () => import('./login/login.module').then(m => m.LoginModule) },
  {
    path: '',
    component: HeaderComponent,
    children: [
      { path: 'main', loadChildren: () => import('./main/main.module').then(m => m.MainModule) },
      { path: 'main/list', loadChildren: () => import('./list/list.module').then(m => m.ListModule) },
      { path: 'main/table', loadChildren: () => import('./table/table.module').then(m => m.TableModule) },
      { path: 'main/trial', loadChildren: () => import('./trial/trial.module').then(m => m.TrialModule) },
      { path: 'main/faceAuth', loadChildren: () => import('./faceAuth/faceAuth.module').then(m => m.FaceAuthModule) },
      { path: 'main/faceReg', loadChildren: () => import('./faceReg/faceReg.module').then(m => m.FaceRegModule) }
    ]
  },
  { path: '**', redirectTo: 'login' }
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { useHash: true, preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
