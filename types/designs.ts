import { Timestamp } from 'firebase/firestore';
import { EmailDesign } from './templates';

export type EmailStatus = 'draft' | 'sent' | 'scheduled';

export interface EmailRecipientInfo {
  count: number;
  listId?: string;
}

export interface EmailStats {
  opens: number;
  clicks: number;
  unsubscribes?: number;
  bounces?: number;
}

export interface Design {
  id: string;
  name: string;
  description?: string;
  thumbnail?: string;
  templateId: string;
  userId: string;
  createdAt: Timestamp | Date | string;
  updatedAt: Timestamp | Date | string;
  design: EmailDesign;
  status: EmailStatus;
  sentAt?: Timestamp | Date | string;
  recipients?: EmailRecipientInfo;
  stats?: EmailStats;
}
