import { useState } from 'react';

interface FetchOptions<B> {
  method: string;
  headers?: HeadersInit;
  body?: B;
}

export const useFetch = <T, B = undefined>() => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<T | null>(null);

  const fetchData = async (url: string, options: FetchOptions<B>) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(url, {
        method: options.method,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        body: options.body ? JSON.stringify(options.body) : undefined,
      });

      if (!response.ok) {
        throw new Error('Request failed');
      }

      const result: T = await response.json();
      setData(result);
    } catch (error) {
      setError((error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return { fetchData, loading, error, data };
};
