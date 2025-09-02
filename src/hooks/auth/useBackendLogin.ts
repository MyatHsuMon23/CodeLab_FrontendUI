import { ApiEndpoints } from '@api/endpoints.js';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { setTokens } from '@store/authReducer.js';
import type { TokenResponse } from '@type/auth.types.js';
import { useAlert } from '@provider/AlertProvider';

// Optional: simple camelCase converter for object keys
function toCamelCase(obj: any): any {
    if (Array.isArray(obj)) {
        return obj.map(v => toCamelCase(v));
    } else if (obj !== null && obj.constructor === Object) {
        return Object.keys(obj).reduce((result, key) => {
            const camelKey = key.replace(/_([a-z])/g, g => g[1].toUpperCase());
            result[camelKey] = toCamelCase(obj[key]);
            return result;
        }, {} as any);
    }
    return obj;
}

export const useBackendLogin = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const dispatch = useDispatch();
      const { showAlert } = useAlert();

    const loginToBackend = async (payload: { userName: string; password: string }) => {
        setIsLoading(true);
        setError(null);
        try {
            const authURL = import.meta.env.VITE_API_URL + ApiEndpoints.auth.authToken();
            const response = await fetch(authURL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload)
            });
            const result = (await response.json()) as TokenResponse;
            if (!response.ok) throw new Error(result.message || 'Backend login failed');
            // Only use redux for persistence
            if (
                result.success &&
                result.data.accessToken
            ) {
                dispatch(
                    setTokens({
                        accessToken: result.data.accessToken,
                        refreshToken: result.data.refreshToken,
                    })
                );
                const camelCasedData = toCamelCase(result.data);
                return { success: true, data: camelCasedData };
            }
            return result;
        } catch (err: any) {
            setError(err.message || 'Unknown error');
            showAlert({ type: 'error', message: err.message || 'Unknown error' });
            return { success: false, error: err.message || 'Unknown error' };
        } finally {
            setIsLoading(false);
        }
    };

    return { loginToBackend, isLoading, error };
};
