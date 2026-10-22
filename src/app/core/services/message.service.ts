import { Injectable, inject } from '@angular/core';
import {
  onValue,
  push,
  ref,
  update,
  set,
  DataSnapshot,
} from 'firebase/database';
import { Observable } from 'rxjs';

import { OrderMessage } from '../models/message.model';
import { Order } from '../models/order.model';
import { AuthService } from './auth.service';
import { realtimeDatabase } from './firebase';

interface ConversationData {
  customerId: string;
  shopOwnerId: string;
  messages?: Record<string, Omit<OrderMessage, 'id'>>;
}

@Injectable({ providedIn: 'root' })
export class MessageService {
  private readonly authService = inject(AuthService);

  getMessages(order: Order): Observable<OrderMessage[]> {
    this.assertParticipant(order);
    return new Observable<OrderMessage[]>((subscriber) => {
      const conversationReference = ref(realtimeDatabase, `conversations/${order.id}/messages`);
      const unsubscribe = onValue(
        conversationReference,
        (snapshot) => subscriber.next(this.toMessages(snapshot)),
        (error) => subscriber.error(error),
      );
      return unsubscribe;
    });
  }

  getUnreadCount(order: Order): Observable<number> {
    this.assertParticipant(order);
    return new Observable<number>((subscriber) => {
      const conversationReference = ref(realtimeDatabase, `conversations/${order.id}`);
      const unsubscribe = onValue(
        conversationReference,
        (snapshot) => {
          const data = snapshot.val() as ConversationData & {
            readAt?: Record<string, number>;
          } | null;
          const readAt = data?.readAt?.[this.authService.currentProfile?.uid ?? ''] ?? 0;
          const messages = data?.messages ?? {};
          const unread = Object.values(messages)
            .filter((message) => message.senderId !== this.authService.currentProfile?.uid)
            .filter((message) => message.createdAt > readAt).length;
          subscriber.next(unread);
        },
        (error) => subscriber.error(error),
      );
      return unsubscribe;
    });
  }

  async sendMessage(order: Order, content: string): Promise<void> {
    const profile = this.assertParticipant(order);
    const trimmedContent = content.trim();
    if (!trimmedContent) {
      throw new Error('Message content cannot be empty.');
    }
    if (trimmedContent.length > 1000) {
      throw new Error('Messages must be 1,000 characters or fewer.');
    }

    const conversationReference = ref(realtimeDatabase, `conversations/${order.id}`);
    await update(conversationReference, {
      customerId: order.customerId,
      shopOwnerId: order.shopOwnerId,
    } satisfies ConversationData);

    const messageReference = push(ref(realtimeDatabase, `conversations/${order.id}/messages`));
    await set(messageReference, {
      senderId: profile.uid,
      senderName: profile.name,
      content: trimmedContent,
      createdAt: Date.now(),
    });
  }

  async markConversationRead(order: Order): Promise<void> {
    const profile = this.assertParticipant(order);
    await update(ref(realtimeDatabase, `conversations/${order.id}/readAt`), {
      [profile.uid]: Date.now(),
    });
  }

  private assertParticipant(order: Order) {
    const profile = this.authService.currentProfile;
    if (!profile || (profile.uid !== order.customerId && profile.uid !== order.shopOwnerId)) {
      throw new Error('You are not authorized to access this order conversation.');
    }
    return profile;
  }

  private toMessages(snapshot: DataSnapshot): OrderMessage[] {
    const data = snapshot.val() as Record<string, Omit<OrderMessage, 'id'>> | null;
    return data
      ? Object.entries(data)
        .map(([id, message]) => ({ id, ...message }))
        .sort((left, right) => left.createdAt - right.createdAt)
      : [];
  }
}
