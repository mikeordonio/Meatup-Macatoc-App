import { Component, Input, OnDestroy, OnInit, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';

import { OrderMessage } from '../../core/models/message.model';
import { Order } from '../../core/models/order.model';
import { AuthService } from '../../core/services/auth.service';
import { MessageService } from '../../core/services/message.service';

@Component({
  selector: 'app-order-conversation',
  templateUrl: './order-conversation.component.html',
  styleUrls: ['./order-conversation.component.scss'],
  standalone: false,
})
export class OrderConversationComponent implements OnDestroy, OnInit {
  private readonly messageService = inject(MessageService);
  private readonly authService = inject(AuthService);
  private readonly formBuilder = inject(FormBuilder);
  private messagesSubscription?: Subscription;

  @Input({ required: true }) order!: Order;

  readonly form = this.formBuilder.nonNullable.group({
    content: ['', [Validators.required, Validators.maxLength(1000)]],
  });
  messages: OrderMessage[] = [];
  errorMessage = '';
  isSending = false;

  constructor() {
    this.messagesSubscription = undefined;
  }

  ngOnInit(): void {
    this.messagesSubscription = this.messageService.getMessages(this.order).subscribe({
      next: (messages) => {
        this.messages = messages;
        void this.messageService.markConversationRead(this.order);
      },
      error: () => {
        this.errorMessage = 'Unable to load this conversation.';
      },
    });
  }

  get currentUserId(): string | null {
    return this.authService.currentProfile?.uid ?? null;
  }

  async send(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.isSending = true;
    this.errorMessage = '';
    try {
      await this.messageService.sendMessage(this.order, this.form.getRawValue().content);
      this.form.reset();
    } catch (error) {
      this.errorMessage = error instanceof Error ? error.message : 'Unable to send message.';
    } finally {
      this.isSending = false;
    }
  }

  ngOnDestroy(): void {
    this.messagesSubscription?.unsubscribe();
  }
}
