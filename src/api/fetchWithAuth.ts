import { setTokens, logout } from '@store/authReducer.js';
import { useNavigate } from 'react-router-dom';

export const fetchWithAuth = async (
    input: RequestInfo,
    init: RequestInit = {},
    dispatch: any,
    refreshTokenFlow: (refreshToken: string) => Promise<any>,
    accessToken: string,
    refreshToken: string
) => {
    const navigate = useNavigate();
    if (!accessToken) {
        throw new Error('No access token available');
    }
    // Attach access token to request
    const headers = new Headers(init.headers || {});
    if (accessToken) {
        headers.set('Authorization', `Bearer ${accessToken}`);
    }

    let response = await fetch(input, { ...init, headers });

    // If token expired, try to refresh
    if (response.status === 401 || response.status === 403) {
        if (refreshToken) {
            const refreshResult = await refreshTokenFlow(refreshToken);
            if (refreshResult?.success && refreshResult.data?.access_token) {
                var newAccessToken = refreshResult.data.access_token;
                dispatch(setTokens({
                    accessToken: refreshResult.data.access_token,
                    refreshToken: refreshResult.data.refresh_token,
                }));
                // Retry original request with new token
                headers.set('Authorization', `Bearer ${newAccessToken}`);
                response = await fetch(input, { ...init, headers });
            } else {
                dispatch(logout());
                navigate('/login');
            }
        } else {
            dispatch(logout());
        }
    }

    return response;
};
