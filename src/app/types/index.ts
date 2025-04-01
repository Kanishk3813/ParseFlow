// src/app/types/index.ts
export interface Conversion {
  id?: string;
  userId: string;
  fileName: string;
  xmlContent: string;
  createdAt: Date;
  pageCount?: number;
}

