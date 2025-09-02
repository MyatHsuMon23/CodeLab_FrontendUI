// src/api/endpoints.ts

import { ref } from "process";

export const ApiEndpoints = {
  auth: {
    authToken: () => '/auth/token',
    // refreshToken: () => '/auth/refresh-token',
  },
  FTACheck: {
    getFTACheckList: () => '/fta-check',
    getAnalysisResult: (id: string | number) => `/fta-check/${id}/results`,
    postCreateFTACheck: () => '/fta-check',
    postUploadFiles: (id: string | number) => `/fta-check/${id}/files`,
    postFTAAnalyze: (id: string | number) => `/fta-check/${id}/analyze`,
  },
};
