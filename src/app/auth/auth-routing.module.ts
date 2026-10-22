import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { guestGuard } from '../core/guards/auth.guard';
import { LoginPage } from './login/login.page';
import { RegisterPage } from './register/register.page';
import { ResetPasswordPage } from './reset-password/reset-password.page';

const routes: Routes = [
  {
    path: '',
    children: [
      { path: 'login', component: LoginPage, canActivate: [guestGuard] },
      { path: 'register', component: RegisterPage, canActivate: [guestGuard] },
      { path: 'reset-password', component: ResetPasswordPage, canActivate: [guestGuard] },
      { path: '', redirectTo: 'login', pathMatch: 'full' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthRoutingModule {}
