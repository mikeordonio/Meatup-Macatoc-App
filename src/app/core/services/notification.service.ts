import { Injectable, inject } from '@angular/core';
import {
  addDoc,
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
  where,
} from 'firebase/firestore';
import { Observable } from 'rxjs';

import { AppNotification, NotificationType } from '../models/notification.model';
import { AuthService } from './auth.service';
import { firestore } from './firebase';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private readonly authService = inject(AuthService);

  getNotifications(): Observable<AppNotification[]> {
    const profile = this.authService.currentProfile;
    if (!profile) {
      return new Observable<AppNotification[]>((subscriber) => subscriber.next([]));
    }

    return new Observable<AppNotification[]>((subscriber) => {
      const notificationsQuery = query(
        collection(firestore, 'notifications'),
        where('recipientId', '==', profile.uid),
        orderBy('createdAt', 'desc'),
      );
      return onSnapshot(
        notificationsQuery,
        (snapshot) => subscriber.next(snapshot.docs.map((item) => ({
          id: item.id,
          ...item.data(),
        }) as AppNotification)),
        (error) => subscriber.error(error),
      );
    });
  }

  async create(input: {
    recipientId: string;
    type: NotificationType;
    title: string;
    message: string;
    orderId?: string;
    shopId?: string;
    productId?: string;
  }): Promise<void> {
    const sender = this.authService.currentProfile;
    if (!sender || sender.uid === input.recipientId) {
      throw new Error('A valid notification recipient is required.');
    }
    await addDoc(collection(firestore, 'notifications'), {
      ...input,
      senderId: sender.uid,
      createdAt: new Date().toISOString(),
    });
  }

  async markRead(notificationId: string): Promise<void> {
    const profile = this.authService.currentProfile;
    if (!profile) {
      throw new Error('You must be signed in to update notifications.');
    }
    await updateDoc(doc(firestore, 'notifications', notificationId), {
      readAt: new Date().toISOString(),
    });
  }
}
