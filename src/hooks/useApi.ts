import { useCallback, useState } from "react";
import { APICall } from "../api/app";
import { handleError, handleSuccess } from "../lib/errors";

export function useApi<F extends (...args: any) => any, R>(
  apiCall: APICall<F>,
  onSuccess?: () => void
): [
    call: (...args: Parameters<F>) => Promise<boolean>,
    isLoading: boolean,
    data: R | undefined,
    error: string
  ] {
  const [data, setData] = useState<R>();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const call = useCallback(
    async (...args: Parameters<F>) => {
      try {
        setIsLoading(true);
        const result: R = await apiCall.call(...args);
        setData(result);
        handleSuccess(apiCall.requestName);
        onSuccess?.();
        return true;
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        }
        handleError(error, apiCall.requestName);
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [apiCall, onSuccess]
  );

  return [call, isLoading, data, error];
}
