import { Timestamp } from 'firebase/firestore';
import emailDesignMock from '@/mocks/designs/emailDesignMock.json';

export interface EmailDesign {
  body: {
    id: string;
    headers: [];
    footers: [];
    rows: Array<{
      id: string;
      columns: [];
      cells: number[];
      values: Record<string, unknown>;
    }>;
    values: Record<string, unknown>;
  };
  counters: Record<string, number>;
  schemaVersion: number;
  [key: string]: unknown;
}

export interface Template {
  id: string;
  name: string;
  description?: string;
  thumbnail?: string;
  displayMode: string;
  category?: string;
  createdAt: Timestamp | Date | string;
  updatedAt: Timestamp | Date | string;
  design: EmailDesign;
  isDefault?: boolean;
  userId?: string;
}
