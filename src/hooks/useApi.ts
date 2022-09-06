import { useState, useCallback } from "react";
import { RequestNames, handleSuccess, handleError } from "../lib/errors";

export function useApi<F extends (...args: any) => any, R>(func: F, operationName: RequestNames, onSuccess?: () => void):
  [func: (...args: Parameters<F>) => Promise<void>, isLoading: boolean, data: R | undefined, error: string] {
  const [data, setData] = useState<R>();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const apiCall = useCallback(
    async (...args: Parameters<F>) => {
      try {
        setIsLoading(true);
        const result: R = await func(args);
        setData(result);
        handleSuccess(operationName);
        onSuccess?.();
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        }
        handleError(error, operationName);
      } finally {
        setIsLoading(false);
      }
    }, [func, onSuccess, operationName]
  )

  return [apiCall, isLoading, data, error];
}

