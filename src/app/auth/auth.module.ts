import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular/lazy';

import { AuthRoutingModule } from './auth-routing.module';
import { LoginPage } from './login/login.page';
import { RegisterPage } from './register/register.page';
import { ResetPasswordPage } from './reset-password/reset-password.page';

@NgModule({
  declarations: [LoginPage, RegisterPage, ResetPasswordPage],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, IonicModule, AuthRoutingModule],
})
export class AuthModule {}
