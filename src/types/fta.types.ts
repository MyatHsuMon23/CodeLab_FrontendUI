// src/types/fta.types.ts

export interface FTACheckParams {
  page?: number;
  perPage?: number;
}

export interface FTACheckListResponseData {
  id: number;
  name: string;
  status: string;
  createdAt: string;
}

export interface FTACheckListResponse {
  success: boolean;
  data: FTACheckListResponseData[];
  message?: string;
}

export interface FTACreateRequest {
  name: string;
  description?: string;
}

export interface FTACreateResponse {
  success: boolean;
  data: {
    id: number;
    name: string;
  };
  message?: string;
}

export interface UploadFileRequest {
  files: File[];
}

export interface FTAUploadFilesResponse {
  success: boolean;
  data: {
    uploadedFiles: string[];
  };
  message?: string;
}

export interface FTAAnalyzeResponse {
  success: boolean;
  data: {
    analysisId: number;
    status: string;
  };
  message?: string;
}