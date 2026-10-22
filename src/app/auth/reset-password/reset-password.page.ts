import { Component, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.page.html',
  styleUrls: ['../auth.page.scss'],
  standalone: false,
})
export class ResetPasswordPage {
  private readonly formBuilder = inject(FormBuilder);
  private readonly authService = inject(AuthService);

  readonly form = this.formBuilder.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
  });
  errorMessage = '';
  successMessage = '';
  isSubmitting = false;

  async submit(): Promise<void> {
    this.errorMessage = '';
    this.successMessage = '';
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    try {
      await this.authService.resetPassword(this.form.getRawValue().email);
      this.successMessage = 'If an account exists for that email, a reset link has been sent.';
      this.form.reset();
    } catch {
      this.errorMessage = 'Unable to send a reset email. Please try again later.';
    } finally {
      this.isSubmitting = false;
    }
  }
}
