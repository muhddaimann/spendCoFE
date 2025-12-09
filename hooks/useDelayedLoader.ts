import { useState, useEffect } from "react";

export function useDelayedLoader(
  isLoading: boolean,
  delay: number = 300
): boolean {
  const [showLoader, setShowLoader] = useState(false);

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    if (isLoading) {
      timeout = setTimeout(() => {
        setShowLoader(true);
      }, delay);
    } else {
      setShowLoader(false);
      // If isLoading becomes false, we should not show the loader
      // So we clear any pending timeout.
      clearTimeout(timeout);
    }

    return () => {
      clearTimeout(timeout);
    };
  }, [isLoading, delay]);

  return showLoader;
}
