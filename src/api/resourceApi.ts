import { ApiError, type QueryParams } from '@type/api.types.js'
import { fetchWithAuth } from './fetchWithAuth.js';
import { useDispatch } from 'react-redux';
import { useRefreshToken } from '@hook/auth/useRefreshToken.js';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
    import type { RootState } from '@store/reduxStore.js';

interface RequestOptions extends Omit<RequestInit, 'body'> {
  body?: unknown
  params?: QueryParams
}

function buildQueryString(params?: QueryParams): string {
  if (!params) return ''
  const searchParams = new URLSearchParams(params as Record<string, string>)
  return `?${searchParams.toString()}`
}

function useBaseFetch() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { refreshTokenFlow } = useRefreshToken();
  const { accessToken, refreshToken } = useSelector((state: RootState) => state.auth.user) || {};
  return async function baseFetch<T>(
    endpoint: string,
    options: RequestOptions = {}
  ): Promise<T> {
    const domainEndpoint = import.meta.env.VITE_API_URL;
    const normalizedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    const requestUrl = `${domainEndpoint}${normalizedEndpoint}${buildQueryString(options.params)}`;

    const headers = new Headers(options.headers || {});
    if (!(options.body instanceof FormData)) {
      headers.set('Content-Type', 'application/json');
    }
    headers.set('Accept', 'application/json');

    let requestBody = options.body;
    if (
      requestBody &&
      !(requestBody instanceof FormData) &&
      headers.get('Content-Type')?.includes('application/json')
    ) {
      requestBody = JSON.stringify(requestBody);
    }
    const response = await fetchWithAuth(
      requestUrl,
      {
        ...options,
        headers,
        body: requestBody as BodyInit,
      },
      dispatch,
      refreshTokenFlow,
      accessToken,
      refreshToken,
      navigate
    );

    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
      } catch (_e) {
        errorData = { message: response.statusText };
      }

      const errorMessage =
        (errorData as { message?: string })?.message ||
        `API request failed: ${response.status}`;

      const error = new ApiError(
        errorMessage,
        response.status,
        errorData as Record<string, unknown>
      );
      throw error;
    }

    if (
      response.status === 204 ||
      response.headers.get('content-length') === '0'
    ) {
      return undefined as T;
    }

    const responseData = await response.json();
    return responseData as T;
  };
}

export function useClientApi() {
  const baseFetch = useBaseFetch();
  return {
    get: <T>(
      endpoint: string,
      params?: QueryParams,
      options?: Omit<RequestOptions, 'params' | 'body' | 'method'>
    ) => {
      return baseFetch<T>(endpoint, { ...options, method: 'GET', params });
    },
    post: <T>(
      endpoint: string,
      body?: unknown,
      options?: Omit<RequestOptions, 'body' | 'method'>
    ) => baseFetch<T>(endpoint, { ...options, method: 'POST', body }),
    put: <T>(
      endpoint: string,
      body?: unknown,
      options?: Omit<RequestOptions, 'body' | 'method'>
    ) => baseFetch<T>(endpoint, { ...options, method: 'PUT', body }),
    patch: <T>(
      endpoint: string,
      body?: unknown,
      options?: Omit<RequestOptions, 'body' | 'method'>
    ) => baseFetch<T>(endpoint, { ...options, method: 'PATCH', body }),
    delete: <T>(
      endpoint: string,
      params?: QueryParams,
      options?: Omit<RequestOptions, 'params' | 'body' | 'method'>
    ) => baseFetch<T>(endpoint, { ...options, method: 'DELETE', params }),
  };
}