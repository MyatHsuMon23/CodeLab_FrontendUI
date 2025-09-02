import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useClientApi } from '@api/resourceApi.js';
import { ftaCheckQueryKeys } from './queries.js';
import { ApiEndpoints } from '@api/endpoints.js';
import { FTAAnalyzeResponse, FTACreateRequest, FTACreateResponse, FTAUploadFilesResponse, UploadFileRequest } from '@type/fta.types.js';
import { useAlert } from '@provider/AlertProvider.js';
import { ApiError } from '@type/api.types.js';


export const useCreateFTACheck = () => {
  const queryClient = useQueryClient();
  const clientApi = useClientApi();
  const { showAlert } = useAlert();
  return useMutation<
    FTACreateResponse,
    ApiError,
    FTACreateRequest
  >({
    mutationFn: (payload: FTACreateRequest) =>
      clientApi.post(ApiEndpoints.FTACheck.postCreateFTACheck(), payload),
    onSuccess: (data: any) => {
  queryClient.invalidateQueries({ queryKey: ftaCheckQueryKeys.list() });
  showAlert({ type: 'success', message: data?.message || 'FTA Check created successfully' });
    },
    onError: (error: ApiError) => {
  showAlert({ type: 'error', message: error?.message || 'Error creating FTA Check' });
      // variables and context available for further handling if needed
    },
  });
};

export const useFileUpload = () => {
  const queryClient = useQueryClient();
  const clientApi = useClientApi();
  const { showAlert } = useAlert();
  return useMutation<
    FTAUploadFilesResponse,
    ApiError,
    UploadFileRequest
  >({
    mutationFn: async (params: UploadFileRequest) => {
      const { id, files, file_types, extract_immediately, processing_options } = params;
      const formData = new FormData();
      if (Array.isArray(files)) {
        files.forEach(f => formData.append('files[]', f)); // use 'files[]'
      } else if (files) {
        formData.append('files[]', files); // use 'files[]'
      }
      formData.append('file_types', Array.isArray(file_types) ? file_types.join(',') : file_types);
      // Append extract_immediately as boolean
      formData.append('extract_immediately', extract_immediately ? '1' : '0');
      // Append processing_options as array
      processing_options.forEach(opt => formData.append('processing_options[]', opt));
      return clientApi.post(
        ApiEndpoints.FTACheck.postUploadFiles(id),
        formData,
        { headers: { accept: 'application/json' } }
      );
    },
    onSuccess: (data) => {
  queryClient.invalidateQueries({ queryKey: ftaCheckQueryKeys.list() });
  showAlert({ type: 'success', message: data?.message || 'File uploaded successfully' });
    },
    onError: (error: ApiError) => {
  showAlert({ type: 'error', message: error?.message || 'Error uploading file' });
    },
  });
};

interface AnalyzeFTAVariables {
  packId: number
}
export const useAnalyzeFTACheck = () => {
  const queryClient = useQueryClient();
  const clientApi = useClientApi();
  const { showAlert } = useAlert();
  return useMutation<
    FTAAnalyzeResponse,
    ApiError,
    AnalyzeFTAVariables
  >({
    mutationFn: ({ packId }: AnalyzeFTAVariables) =>
      clientApi.post(ApiEndpoints.FTACheck.postFTAAnalyze(packId)),
    onSuccess: (data: any) => {
  queryClient.invalidateQueries({ queryKey: ftaCheckQueryKeys.list() });
  showAlert({ type: 'success', message: data?.message || 'FTA Check analyzed successfully' });
    },
    onError: (error: ApiError) => {
  showAlert({ type: 'error', message: error?.message || 'Error analyzing FTA Check' });
    },
  });
};