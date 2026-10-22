import { Injectable } from '@angular/core';
import {
  Auth,
  User,
  UserCredential,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { BehaviorSubject, filter, firstValueFrom } from 'rxjs';

import { AccountStatus, UserProfile, UserRole } from '../models/user-profile.model';
import { firebaseAuth, firestore } from './firebase';

interface RegisterInput {
  name: string;
  email: string;
  password: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly auth: Auth = firebaseAuth;
  private readonly profileSubject = new BehaviorSubject<UserProfile | null>(null);
  private readonly initializedSubject = new BehaviorSubject<boolean>(false);

  readonly profile$ = this.profileSubject.asObservable();
  readonly initialized$ = this.initializedSubject.asObservable();

  constructor() {
    onAuthStateChanged(this.auth, (user) => {
      void this.updateProfile(user);
    });
  }

  get currentUser(): User | null {
    return this.auth.currentUser;
  }

  get currentProfile(): UserProfile | null {
    return this.profileSubject.value;
  }

  async registerCustomer(input: RegisterInput): Promise<UserProfile> {
    const credential = await createUserWithEmailAndPassword(
      this.auth,
      input.email,
      input.password,
    );
    const profile = this.createProfile(credential.user, input.name);
    await setDoc(doc(firestore, 'users', credential.user.uid), profile);
    this.profileSubject.next(profile);
    return profile;
  }

  async login(email: string, password: string): Promise<UserProfile> {
    const credential = await signInWithEmailAndPassword(this.auth, email, password);
    const profile = await this.loadProfile(credential.user);

    if (!profile) {
      await signOut(this.auth);
      throw new Error('Your account profile could not be found.');
    }

    if (profile.status !== 'active') {
      await signOut(this.auth);
      throw new Error('This account is suspended. Contact an administrator.');
    }

    this.profileSubject.next(profile);
    return profile;
  }

  async logout(): Promise<void> {
    await signOut(this.auth);
    this.profileSubject.next(null);
  }

  async resetPassword(email: string): Promise<void> {
    await sendPasswordResetEmail(this.auth, email);
  }

  async waitForInitialization(): Promise<void> {
    if (this.initializedSubject.value) {
      return;
    }
    await firstValueFrom(this.initialized$.pipe(filter(Boolean)));
  }

  hasRole(roles: UserRole[]): boolean {
    const profile = this.currentProfile;
    return profile !== null && roles.includes(profile.role);
  }

  private async updateProfile(user: User | null): Promise<void> {
    try {
      const profile = user ? await this.loadProfile(user) : null;
      this.profileSubject.next(profile);
    } finally {
      this.initializedSubject.next(true);
    }
  }

  private async loadProfile(user: User): Promise<UserProfile | null> {
    const profileSnapshot = await getDoc(doc(firestore, 'users', user.uid));
    return profileSnapshot.exists() ? (profileSnapshot.data() as UserProfile) : null;
  }

  private createProfile(user: User, name: string): UserProfile {
    const timestamp = new Date().toISOString();
    return {
      uid: user.uid,
      name: name.trim(),
      email: user.email ?? '',
      role: 'customer',
      status: 'active',
      createdAt: timestamp,
      updatedAt: timestamp,
    };
  }
}
