export interface TokenResponse {
  success: boolean;
  message: string;
  data: {
     token: string;
     refreshToken: string;
    username: string;
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
