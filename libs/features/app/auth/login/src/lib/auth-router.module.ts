import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';

import { LoginComponent }    from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';

import { AuthPageComponent } from './pages/auth/auth.page.component';

const AUTH_ROUTES: Route[] = [
  {
    path: '',
    component: AuthPageComponent,
    children: [
      { path: 'login', component: LoginComponent},
      { path: 'register', component: RegisterComponent},
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(AUTH_ROUTES)],
  exports: [RouterModule]
})
export class AuthRouterModule { }
