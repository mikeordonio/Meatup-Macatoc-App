import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { AuthService } from '../../core/services/auth.service';
import { UserRole } from '../../core/models/user-profile.model';

interface FeaturePageData {
  title: string;
  description: string;
  icon: string;
  roles: UserRole[];
}

@Component({
  selector: 'app-role-feature',
  templateUrl: './role-feature.page.html',
  styleUrls: ['./role-feature.page.scss'],
  standalone: false,
})
export class RoleFeaturePage {
  private readonly route = inject(ActivatedRoute);
  private readonly authService = inject(AuthService);

  readonly profile$ = this.authService.profile$;
  readonly page: FeaturePageData = this.route.snapshot.data as FeaturePageData;
}
