import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { setTokens, logout } from '@store/authReducer.js';
import type { TokenRefreshResponse } from '@type/auth.types.js';
import { ApiEndpoints } from '@api/endpoints.js';

export const useRefreshToken = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const dispatch = useDispatch();

  const refreshTokenFlow = async (refreshToken: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const apiUrl = import.meta.env.VITE_CUSTOMSIX_API_URL + ApiEndpoints.auth.refreshToken();
      const refreshResponse = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        Accept: 'application/json',
        },
        body: JSON.stringify({ refresh_token: refreshToken }),
      });

        if (!refreshResponse.ok) {
          const errorBody = await refreshResponse.text();
          // Dispatch logout if status is 401 or 403
          if (refreshResponse.status === 401 || refreshResponse.status === 403) {
            dispatch(logout());
          }
          setError(`Failed to refresh token. Status: ${refreshResponse.status}. Error: ${errorBody}`);
          return null;
        }

      const result = (await refreshResponse.json()) as TokenRefreshResponse;
      if (result.success && result.data?.access_token && result.data?.refresh_token) {
        dispatch(
          setTokens({
            accessToken: result.data.access_token,
            refreshToken: result.data.refresh_token,
          })
        );
        return { success: true, data: result.data };
      }
      return result;
    } catch (err: any) {
      setError(err.message || 'Unknown error');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return { refreshTokenFlow, isLoading, error };
};
