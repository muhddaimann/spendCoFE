import { useState, useEffect } from "react";

export function useDelayedLoader(
  isLoading: boolean,
  delay: number = 300
): boolean {
  const [showLoader, setShowLoader] = useState(false);

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout> | undefined;

    if (isLoading) {
      timeout = setTimeout(() => {
        setShowLoader(true);
      }, delay);
    } else {
      setShowLoader(false);
    }

    return () => {
      if (timeout) {
        clearTimeout(timeout);
      }
    };
  }, [isLoading, delay]);

  return showLoader;
}
