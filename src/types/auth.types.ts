export interface TokenResponse {
  success: boolean;
  message: string;
  data: {
     accessToken: string;
     refreshToken: string;
    tokenType: string;
    expiresAt: string;
  };
}

export interface TokenRefreshResponse {
  success: boolean;
  message: string;
  data: {
    access_token: string;
    refresh_token: string;
  };
}
