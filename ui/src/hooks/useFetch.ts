import { useCallback, useState } from 'react';
import { ApiError } from '../types';
import { AxiosError } from 'axios';

type State<T> = {
  data: T | null;
  isLoading: boolean;
  error: ApiError | null;
};

type ExecuteRequestFn<T> = (requestFn: () => Promise<T>) => Promise<T>;

export const useFetch = <T>() => {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  const executeRequest = useCallback(async (requestFn: () => Promise<T>) => {
    setIsLoading(true);
    setData(null);
    setError(null);

    try {
      const response = await requestFn();
      setData(response);

      return response;
    } catch (err: unknown) {
      const axiosError = err as AxiosError<ApiError>;
      setError(axiosError.response?.data as ApiError);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return [
    {
      data,
      isLoading,
      error,
    },
    executeRequest,
  ] as [state: State<T>, executeRequestFn: ExecuteRequestFn<T>];
};
