/* ─────────────────────────────────────────────────────────────────────────
   useSupabaseQuery Hook
   Manages async data fetching with loading/error states and real-time updates
   ───────────────────────────────────────────────────────────────────────── */

import { useState, useEffect, useCallback, useRef } from 'react';

export function useSupabaseQuery(queryFn, dependencies = [], options = {}) {
  const [data, setData] = useState(options.initialData ?? []);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isMock, setIsMock] = useState(false);
  const abortControllerRef = useRef(null);

  const fetchData = useCallback(async () => {
    // Cancel previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();
    setLoading(true);
    setError(null);

    try {
      const result = await queryFn();

      if (abortControllerRef.current.signal.aborted) {
        return;
      }

      if (result.success) {
        setData(result.data);
        setIsMock(result.isMock || false);
      } else {
        setError(result.error || 'Unknown error');
        // Keep previous data on error if available
        if (!data) {
          setData(result.data);
        }
      }
    } catch (err) {
      if (!abortControllerRef.current.signal.aborted) {
        setError(err.message || 'Failed to fetch data');
      }
    } finally {
      if (!abortControllerRef.current.signal.aborted) {
        setLoading(false);
      }
    }
  }, [queryFn]);

  useEffect(() => {
    fetchData();

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, dependencies);

  const refetch = useCallback(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, isMock, refetch };
}

/* ── useSupabaseMutation Hook ────────────────────────────────────────── */
export function useSupabaseMutation(mutationFn, options = {}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const mutate = useCallback(async (...args) => {
    setLoading(true);
    setError(null);

    try {
      const result = await mutationFn(...args);

      if (result.success) {
        setData(result.data);
        if (options.onSuccess) {
          options.onSuccess(result.data);
        }
      } else {
        setError(result.error || 'Unknown error');
        if (options.onError) {
          options.onError(result.error);
        }
      }

      return result;
    } catch (err) {
      const errorMsg = err.message || 'Failed to execute mutation';
      setError(errorMsg);
      if (options.onError) {
        options.onError(errorMsg);
      }
      return { success: false, error: errorMsg, data: null };
    } finally {
      setLoading(false);
    }
  }, [mutationFn, options]);

  return { mutate, loading, error, data };
}

/* ── useSupabaseRealtime Hook ───────────────────────────────────────── */
export function useSupabaseRealtime(subscribeFn, onUpdate) {
  useEffect(() => {
    const unsubscribe = subscribeFn((payload) => {
      onUpdate(payload);
    });

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [subscribeFn, onUpdate]);
}
