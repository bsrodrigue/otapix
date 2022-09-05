import { useState, useCallback } from "react";
import { RequestNames, handleSuccess, handleError } from "../lib/errors";

export function useApi(func: (...args: any) => any, operationName: RequestNames, onSuccess?: () => void) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<any>();
  const [data, setData] = useState<any>();

  const apiCall = useCallback(
    async (args: Parameters<typeof func>) => {
      try {
        setIsLoading(true);
        const result: ReturnType<typeof func> = await func(args);
        setData(result);
        handleSuccess(operationName);
        onSuccess?.();
      } catch (error) {
        setError(error);
        handleError(error, operationName);
      } finally {
        setIsLoading(false);
      }
    }, [func, onSuccess, operationName]
  )

  return [apiCall, isLoading, data, error];
}

