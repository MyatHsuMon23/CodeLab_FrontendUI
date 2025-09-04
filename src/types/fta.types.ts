// src/types/fta.types.ts
// Minimal FTA types to fix build issues

export interface FTACreateRequest {
  name: string;
  description?: string;
}

export interface FTACreateResponse {
  success: boolean;
  data: any;
  message?: string;
}

export interface FTAAnalyzeResponse {
  success: boolean;
  data: any;
  message?: string;
}

export interface FTAUploadFilesResponse {
  success: boolean;
  data: any;
  message?: string;
}

export interface UploadFileRequest {
  id: string;
  files: File[];
  file_types?: string[];
  extract_immediately?: boolean;
  processing_options?: any;
}

export interface FTACheckListResponse {
  success: boolean;
  data: FTACheckListResponseData[];
  message?: string;
}

export interface FTACheckListResponseData {
  id: string;
  name: string;
  description?: string;
  status: string;
  createdAt: string;
}

export interface FTACheckParams {
  [key: string]: any;
  page?: number;
  perPage?: number;
}