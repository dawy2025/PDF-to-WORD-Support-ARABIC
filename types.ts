export interface ConversionItem {
  id: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  date: string;
  status: 'success' | 'failed' | 'processing';
}

export enum DocLanguage {
  ARABIC = 'ar',
  ENGLISH = 'en',
  AUTO = 'auto'
}

export interface AppSettings {
  language: 'ar' | 'en';
  isRTL: boolean;
}

export type SupportedMimeType = 
  | 'application/pdf'
  | 'image/jpeg'
  | 'image/png'
  | 'text/plain'
  | 'application/rtf'
  | 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' // docx
  | 'application/vnd.openxmlformats-officedocument.presentationml.presentation' // pptx
  | 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'; // xlsx