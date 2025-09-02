import type { ApiResponse } from '@type/api.types.js';

export type FTACreateRequest = {
  pack_name: string;
  pack_description: string;
  countries: string[];
};

export type FTACreateResponseData = {
  id: number;
  pack_name: string;
  pack_description: string;
  reference_number: string;
  pack_status: string;
  total_files: number;
  extracted_files: number;
  confidence_score: number;
  selected_countries: string[];
  created_at: string;
  updated_at: string;
  files: Array<{
    id: number;
    original_name: string;
    file_type: string;
    file_size: number;
    extraction_status: string;
    confidence_score: number;
    uploaded_at: string;
  }>;
  country_results: Array<{
    country_code: string;
    status: string;
    result: string;
    confidence_score: number;
    progress_percentage: number;
    updated_at: string;
  }>;
};

export type FTAUploadFilesResponseData = {
  pack: FTACreateResponseData;
  uploaded_files: Array<{
    original_name: string;
    file_size: number;
    file_type: string;
    upload_status: string;
  }>;
};

export type FTAAnalyzeResponseData = FTACreateResponseData;

export type FTACheckParams = {
  search?: string;
  status?: 'created' | 'processing' | 'completed' | 'failed' | 'cancelled';
  country?: string;
  date_from?: string; // format: YYYY-MM-DD
  date_to?: string;   // format: YYYY-MM-DD
  per_page?: number;
};

export type FTACheckListResponseData = {
  data: Array<{
    id: number;
    pack_name: string;
    reference_number: string;
    pack_status: string;
    total_files: number;
    country_count: number;
    overall_progress: number;
    created_at: string;
    updated_at: string;
  }>;
  meta: {
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
  };
};

export type UploadFileRequest = {
  id: number;
  files: File[];
  file_types?: string[];
  extract_immediately: boolean;
  processing_options?: string[]; // changed from Record<string, any> to string[]
};

// Add ApiResponse wrapper types for all response data types
export type FTACreateResponse = ApiResponse<FTACreateResponseData>;

export type FTAUploadFilesResponse = ApiResponse<FTAUploadFilesResponseData>;

export type FTAAnalyzeResponse = ApiResponse<FTAAnalyzeResponseData>;

export type FTACheckListResponse = ApiResponse<FTACheckListResponseData>;