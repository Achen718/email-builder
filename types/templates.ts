import { Timestamp } from 'firebase/firestore';

// Unlayer design structure
export interface EmailDesign {
  body: {
    rows: Array<{
      cells: Array<{
        content: Record<string, unknown>;
        values: Record<string, unknown>;
      }>;
      values: Record<string, unknown>;
    }>;
    values: {
      backgroundColor?: string;
      width?: number;
      padding?: string;
      [key: string]: unknown;
    };
  };
  counters: {
    u_row: number;
    u_column: number;
    u_content_text: number;
    u_content_image: number;
    [key: string]: number;
  };
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
  isSystem?: boolean;
  userId?: string;
}
