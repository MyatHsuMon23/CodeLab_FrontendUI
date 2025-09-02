import { useEffect, useRef } from 'react';
import { useAlert } from '@provider/AlertProvider.js';

export function useQueryErrorHandler(
  isError: boolean,
  error: { message?: string; status?: number } | null,
  queryKey: unknown[],
  notificationIdPrefix: string = 'error'
) {
  const { showAlert } = useAlert();
  const previousErrorRef = useRef<typeof error>(null);

  useEffect(() => {
    if (isError && error && error !== previousErrorRef.current) {
      const errorMessage = error.message || 'An error occurred';
      // Optionally log error with queryKey for context
      // console.error(`Error in query [${queryKey.join(', ')}]:`, error);
      showAlert({type: 'error', message: errorMessage});
      previousErrorRef.current = error;
    } else if (!isError && previousErrorRef.current) {
      previousErrorRef.current = null;
    }
  }, [isError, error, showAlert, queryKey, notificationIdPrefix]);
}
